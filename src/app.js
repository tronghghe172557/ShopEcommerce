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
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}))

// init db
require("./dbs/init.mongodb");

// init routes
app.use('/', require('./routes/index'))

// Handling error => xử lí lỗi khi vượt qua hết những router 
// chưa xử lí lỗi trong TỪNG router con
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).send({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  });
});

module.exports = app;
