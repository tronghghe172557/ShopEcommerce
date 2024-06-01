const express = require('express')
const accessController = require('../../controller/access.controller')
const {asyncHandler} = require('../../auth/handError.middleware')

const router = express.Router()

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router