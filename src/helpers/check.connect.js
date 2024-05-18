'use strict'

const mongoose = require('mongoose')
const countConnect = () => {
    // mongoose.connections: lấy ra mảng chứa tất cả connections vào DATABASE
    // ở đây là DATABASE ấy
    const numConnection = mongoose.connections.length
    console.log(`Number of connections::${numConnection}`)
}

module.exports = {
    countConnect
}