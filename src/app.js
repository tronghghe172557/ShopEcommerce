const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();
// init middlewares
app.use(morgan("dev")); // lưu lại khi người dùng đăng nhập vào với status
app.use(helmet()); // ngăn chặn người dùng lấy được thông tin web dùng được công nghệ gì
app.use(compression); // nén dữ liệu để tiết kiệm băng thông

// init db

// init routes

// handling error

module.exports = app;
