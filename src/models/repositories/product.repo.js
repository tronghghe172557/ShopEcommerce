
const { product, clothing, electronic, furniture } = require('../../models/product.model')
const { getSelectData, unGetSelectData } = require('../../utils/index')
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

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId( product_id )
    })

    if(!foundShop) return null;

    foundShop.isDraft = true
    foundShop.isPublished = false

    // cả 2 cách đều dùng được
    // const { modifiedCount } = await product.updateOne({ _id: new Types.ObjectId( product_id ) }, foundShop)
    const { modifiedCount } = await foundShop.updateOne( foundShop )

    return modifiedCount;
}

const searchProductsByUser = async ({ keySearch }) => {
    // const regexSearch = new RegExp( keySearch )

    const results = await product.find
    (
        {
            isDraft: false,
            $text: { $search : keySearch}
        },
        {score: { $meta: 'textScore' }}
    ).sort({score: { $meta: 'textScore' }})
    .lean()
   
    return results;
}

const updateProductId = async ({ product_id, bodyUpdate, model, isNew = true }) => {
    const dataAfterUpdate = model.findByIdAndUpdate( product_id, bodyUpdate, {
        new: isNew,
    })

    return dataAfterUpdate;
}

// Hàm chung
const queryProduct = async ({ query, limit, skip }) => {
    return await product.find( query )
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};

    const products = await product.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select( getSelectData(select) )
    .lean();

    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    const productId = await product.findById( product_id ).select( unGetSelectData(unSelect) )
    .lean();

    return productId
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductId
}