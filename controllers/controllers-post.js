const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const multer = require("multer");
const { randomBytes } = require("node:crypto");
const path = require("path");

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".")[1];
    const newName = randomBytes(64).toString("hex");
    const newFullName = `${newName}.${extension}`;

    file.newName = newFullName;
    req.uploadedFile = file;

    cb(null, newFullName);
  },
});
const upload = multer({ storage: storage });

const lengthErrEmail = "must have 30 characters at max.";
const lengthErrPassword = "must be between 8 and 16 characters.";
const validateUser = [
  body("email").isLength({ max: 30 }).withMessage(`E-mail ${lengthErrEmail}`),
  body("password")
    .isAlphanumeric()
    .withMessage("Password must contain only letters and numbers.")
    .isLength({ min: 8, max: 16 })
    .withMessage(`Password ${lengthErrPassword}`),
];

module.exports.addUser = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    const { email, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        nextTick(err);
        return res.status(400).render("sign-up", { errors: [err] });
      }

      await prisma.user.create({
        data: { email, password: hashedPassword },
      });
    });
    res.redirect("/");
  }),
];

module.exports.logIn = [
  validateUser,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("log-in", { errors: errors.array() });
    }

    next();
  }),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
];

module.exports.uploadFile = [
  asyncHandler(async (req, res, next) => {
    if (!req.user?.id) {
      return res.status(401).redirect("/");
    }

    next();
  }),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const rootPath = path
      .join(__dirname, req.file.path)
      .replace("/controllers", "");
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        url: rootPath,
        size: `${Math.round(req.file.size / 1024)} kB`,
        folderId: req.body.folderId,
      },
    });

    res.redirect("/");
  }),
];

const lengthErrFolderName = "must be between 1 and 30 characters.";
const validateFolderName = body("newFolderName")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage(`File name ${lengthErrFolderName}`)
  .isAlphanumeric()
  .withMessage("Folder name must contain only numbers and letters.");
module.exports.createFolder = [
  validateFolderName,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).render("/", { errors: errors.array() });
    }

    await prisma.folder.create({
      data: {
        name: req.body.newFolderName,
        parentFolderId: req.body.folderId,
      },
    });
    res.redirect(`/?folderId=${req.body.folderId}`);
  }),
];
