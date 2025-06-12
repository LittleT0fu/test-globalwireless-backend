require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const helmet = require("helmet");
const limiter = require("./config/rateLimit");
var usersRouter = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

var app = express();

//security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);

//prisma
const prisma = require("./libs/prisma");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/users", usersRouter);

// error handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
