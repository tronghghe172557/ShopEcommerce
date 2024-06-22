const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// Check apiKey => phải đi qua đây thì mới được sử dụng API
router.use(apiKey)

// Check permission => check xem có đủ quyền hạn không
router.use(permission('0000')) 

// ở đâu phải router.use
router.use('/v1/api/product', require('./product/index')) // để thằng product chạy trước

router.use('/v1/api', require('./access/index'))

module.exports = router;
