require("dotenv").config();
const express = require("express");
const path = require("path");
const routes = require("./routes/routes");
const { PrismaClient } = require("@prisma/client");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("passport");

// General setup
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
app.use(
  expressSession({
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

// Passport authentication
require("./config/passport");
app.use(passport.session());

// Routes
app.use("/", routes);

// Server
app.listen(PORT, () => console.log(`server initialized on port: ${PORT}`));
