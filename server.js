const app = require("./src/app");

const PORT = process.env.PORT || 3056;
const server = app.listen(PORT, () => {
  console.log(`WSW eCommerce start with http://localhost:${PORT}`);
});

// // khi cmd + c => tắt server và in ra màn hình
// process.on("SIGINT", () => {
//   server.close(() => console.log(`Exit Server Express`));
//   // app.notify.send(ping ...)
// });
