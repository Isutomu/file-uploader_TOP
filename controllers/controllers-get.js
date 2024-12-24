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

module.exports.renderFile = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    const file = await prisma.file.findFirst({
      where: { id: req.params.fileId },
    });
    return res.render("file-details", {
      fileName: file.name,
      fileDate: file.createdAt,
      fileSize: file.size,
      fileId: file.id,
    });
  }

  res.redirect("/log-in");
});

module.exports.downloadFile = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    return res.redirect("/log-in");
  }

  const file = await prisma.file.findFirst({
    where: { id: req.params.fileId },
    select: { url: true },
  });
  res.download(file.url);
});
