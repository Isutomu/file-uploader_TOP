const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");

const routes = Router();

routes.get("/", controllersGet.renderHomepage);
routes.get("/log-in", controllersGet.renderLogIn);
routes.get("/sign-up", controllersGet.renderSignUp);
routes.get("/folder/:folderId", controllersGet.renderFolder);
routes.get("/file/:fileId", controllersGet.renderFile);
routes.get("/download/:fileId", controllersGet.downloadFile);

routes.post("/", controllersPost.uploadFile);
routes.post("/log-in", controllersPost.logIn);
routes.post("/sign-up", controllersPost.addUser);
routes.post("/createFolder", controllersPost.createFolder);

module.exports = routes;
