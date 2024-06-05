const shopModel = require("../models/shop.model")

const findByEmail = async ({ email, select = {
    email: 1, password: 1, name: 1, status: 1, roles: 1, // những con số biểu thị cho 1: xuất hiện, 0 là ko lấy ra
}}) => {
    return await shopModel.findOne({ email }).select(select).lean()
}
module.exports = {
    findByEmail,
}