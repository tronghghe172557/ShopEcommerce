const express = require('express')
const accessController = require('../../controller/access.controller')
const {asyncHandler} = require('../../auth/handError.middleware')
const { authenticationV2 } = require('../../auth/authUtis')

const router = express.Router()

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
// login
router.post('/shop/login', asyncHandler(accessController.login))

// authentication //
router.use(authenticationV2);
////////////////
router.post('/shop/logout', asyncHandler(accessController.logout))

router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router