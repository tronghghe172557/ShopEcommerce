
const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {

    createProduct = async(req, res, next) => {
        console.log(req.body)

        new SuccessResponse({
            message: 'Create product success',
            metadata: await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId, // login success => in authUtis.js => user = decodeUser 
                        // { userId, email }
                }
            ),
        }).send(res)
    }

}

module.exports = new ProductController(); // trả về các method của obj đó