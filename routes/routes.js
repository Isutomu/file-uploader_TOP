const { Router } = require("express");
const controllersGet = require("../controllers/controllers-get");
const controllersPost = require("../controllers/controllers-post");

const routes = Router();

routes.get("/", controllersGet.renderHomepage);
routes.get("/log-in", controllersGet.renderLogIn);
routes.get("/sign-up", controllersGet.renderSignUp);

// routes.post("/log-in", controllersPost.addUser);
routes.post("/sign-up", controllersPost.addUser);

module.exports = routes;
