const express = require('express')
const accessController = require('../../controller/access.controller')
const {asyncHandler} = require('../../auth/handError.middleware')

const router = express.Router()

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

router.post('/shop/login', asyncHandler(accessController.login))

module.exports = router