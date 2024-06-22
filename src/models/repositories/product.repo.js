
const { product, clothing, electronic, furniture } = require('../../models/product.model')
const { Types } = require('mongoose')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    const productQuery = await queryProduct({ query, limit, skip })

    return productQuery
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    const productQuery = await queryProduct({ query, limit, skip })

    return productQuery
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId( product_id )
    })

    if(!foundShop) return null;

    foundShop.isDraft = false
    foundShop.isPublished = true

    // cả 2 cách đều dùng được
    // const { modifiedCount } = await product.updateOne({ _id: new Types.ObjectId( product_id ) }, foundShop)
    const { modifiedCount } = await foundShop.updateOne( foundShop )

    return modifiedCount;
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find( query )
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop
}