require("dotenv").config();
const express = require("express");
const path = require("path");
const routes = require("./routes/routes");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", routes);

app.listen(PORT, () => console.log(`server initialized on port: ${PORT}`));
