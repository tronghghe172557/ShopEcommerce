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

// init routes
app.get("/", (req, res) => {
  const strCompress = "Hello Trong";

  return res.status(200).json({
    message: `Wellcome Trong`,
    metadata: strCompress.repeat(10000),
  });
});

// Handling error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
