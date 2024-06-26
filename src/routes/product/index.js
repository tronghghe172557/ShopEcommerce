
const express = require('express')
const productController = require('../../controller/product.controller')
const {asyncHandler} = require('../../auth/handError.middleware')
const { authenticationV2 } = require('../../auth/authUtis')

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchShop))

router.get('/', asyncHandler(productController.findAllProducts))

router.get('/:product_id', asyncHandler(productController.findProduct))

// authentication //
router.use(authenticationV2);
////////////////
router.post('', asyncHandler(productController.createProduct))

router.patch('/:productId', asyncHandler(productController.updateProduct))

router.post('/published/:id', asyncHandler(productController.publishProductByShop))

router.post('/unpublished/:id', asyncHandler(productController.unPublishProductByShop))


// QUERY //
/**
 * @desc Get all Draft for shop
 * @param { string } product_shop
 * @param { Number } limit
 * @param { Number } skip
 * @return { JSON }
 */
router.get('/drafts/all', asyncHandler(productController.getAllDraftShop))

router.get('/published/all', asyncHandler(productController.getAllPublishShop))

module.exports = router