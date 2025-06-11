require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

// route
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const prisma = new PrismaClient(); // Instantiate PrismaClient
var app = express();

// CORS configuration
app.use(
    cors({
        origin: "*", // หรือระบุ domain ที่ต้องการ เช่น 'http://localhost:3000'
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/test", (req, res) => {
    res.json({
        message: "Hello World",
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
