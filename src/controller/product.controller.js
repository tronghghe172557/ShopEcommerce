
const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const { SuccessResponse } = require('../core/success.response')

class ProductController {

    createProduct = async(req, res, next) => {
        // console.log(req.body)

        // new SuccessResponse({
        //     message: 'Create product success',
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId, // login success => in authUtis.js => user = decodeUser 
        //                 // { userId, email }
        //         }
        //     ),
        // }).send(res)

        new SuccessResponse({
            message: 'Create product success',
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId, // login success => in authUtis.js => user = decodeUser 
                        // { userId, email }
                }
            ),
        }).send(res) 
    }

    // PUT //
    publishProductByShop = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'publishProductByShop success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res) 
    }

    unPublishProductByShop = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'unPublishProductByShop success',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res) 
    }
    // END PUT //

    // QUERY //
    getAllDraftShop = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res) 
    }

    getAllPublishShop = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list Publish success',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res) 
    }

    getListSearchShop = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list search success',
            metadata: await ProductServiceV2.searchProductsByUser(req.params),
        }).send(res) 
    }

    findAllProducts = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get findAllProducts success',
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res) 
    }

    findProduct = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get findProduct success',
            metadata: await ProductServiceV2.findProduct({ product_id: req.params.product_id  }),
        }).send(res) 
    }
    // END QUERY //

    // 
    updateProduct = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get updateProduct success',
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                { 
                ...req.body, 
                product_shop: req.user.userId
                }
        ),
        }).send(res) 
    }

}

module.exports = new ProductController(); // trả về các method của obj đó