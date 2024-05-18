const app = require("./src/app");

const PORT = 3055
const server = app.listen(PORT, () => {
    console.log(`WSW eCommerce start with ${PORT}`)
})

// khi cmd + c => tắt server và in ra màn hình
process.on("SIGINT", () => {
    server.close( () => console.log(`Exit Server Express`))
    // app.notify.send(ping ...)
})