require('dotenv').config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();
// init middlewares
app.use(morgan("dev")); // lưu lại khi người dùng đăng nhập vào với status
app.use(helmet()); // ngăn chặn người dùng lấy được thông tin web dùng được công nghệ gì
app.use(compression()); // nén dữ liệu để tiết kiệm băng thông => lỗi ở đây :))

// init db
require("./dbs/init.mongodb");

// init routes
app.use('/', require('./routes/index'))

// Handling error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
