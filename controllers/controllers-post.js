const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const lengthErrEmail = "must have 30 characters at max.";
const lengthErrPassword = "must be between 8 and 16 characters.";
const validateNewUser = [
  body("email").isLength({ max: 30 }).withMessage(`E-mail ${lengthErrEmail}`),
  body("password")
    .isAlphanumeric()
    .withMessage("Password must contain only letters and numbers.")
    .isLength({ min: 8, max: 16 })
    .withMessage(`Password ${lengthErrPassword}`),
];

module.exports.addUser = [
  validateNewUser,
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
