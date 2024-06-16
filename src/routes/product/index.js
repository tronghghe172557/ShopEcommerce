
const express = require('express')
const productController = require('../../controller/product.controller')
const {asyncHandler} = require('../../auth/handError.middleware')
const { authenticationV2 } = require('../../auth/authUtis')

const router = express.Router()

// authentication //
router.use(authenticationV2);
////////////////
router.post('', asyncHandler(productController.createProduct))

module.exports = router