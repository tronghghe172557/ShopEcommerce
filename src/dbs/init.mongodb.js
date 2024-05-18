// SINGLETON : phương thức gọi là 1 lần
"use strict";

const mongoose = require("mongoose");
const connectString = `mongodb://localhost:27017/shopDEV`;
const { countConnect } = require("../helpers/check.connect");

// khai báo class => KHÔNG ĐƯỢC HOSTING
class Database {
  // trong js chỉ có 1 hàm khởi tạo => constructor => được gọi khi khởi tạo
  constructor() {
    // tự động kết nối
    this.connect();
  }

  //  phương thức: kết nối với db mongodb
  connect(type = "mongoose") {
    // dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => console.log(`Connected Mongodb Success`, countConnect()))
      .catch((err) => console.log(`Error Connect`));
  }

  // Phương thức tĩnh getInstance được thể hiện dưới mẫu thiết kế SINGLETON
  // Trả về 1 class duy nhất => Trong bài: đảm bảo chỉ có 1 kết nối duy nhất vào DB
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
