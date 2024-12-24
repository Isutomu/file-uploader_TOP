const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");

const routes = Router();

routes.get("/", controllersGet.renderHomepage);
routes.get("/log-in", controllersGet.renderLogIn);
routes.get("/sign-up", controllersGet.renderSignUp);

routes.post("/", controllersPost.uploadFile);
routes.post("/log-in", controllersPost.logIn);
routes.post("/sign-up", controllersPost.addUser);

module.exports = routes;
