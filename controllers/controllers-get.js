const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

module.exports.renderLogIn = asyncHandler(async (req, res) => {
  res.render("log-in");
});

module.exports.renderSignUp = asyncHandler(async (req, res) => {
  res.render("sign-up");
});

module.exports.renderHomepage = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    const folder = await prisma.folder.findFirst({
      where: { id: process.env.ROOT_FILE_ID },
      include: { files: true, childrenFolders: true },
    });
    return res.render("file-viewer", {
      folderName: folder.name,
      folderId: folder.id,
      files: folder.files,
      folders: folder.childrenFolders,
    });
  }

  res.redirect("/log-in");
});

module.exports.renderFolder = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    console.log(req.params.folderId);
    const folder = await prisma.folder.findFirst({
      where: { id: req.params.folderId },
      include: { files: true, childrenFolders: true },
    });
    return res.render("file-viewer", {
      folderName: folder.name,
      folderId: folder.id,
      files: folder.files,
      folders: folder.childrenFolders,
    });
  }

  res.redirect("/log-in");
});
