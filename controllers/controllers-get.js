const asyncHandler = require("express-async-handler");

module.exports.renderLogIn = asyncHandler(async (req, res) => {
  res.render("log-in");
});

module.exports.renderSignUp = asyncHandler(async (req, res) => {
  res.render("sign-up");
});

module.exports.renderHomepage = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    return res.render("file-viewer");
  }

  res.redirect("/log-in");
});
