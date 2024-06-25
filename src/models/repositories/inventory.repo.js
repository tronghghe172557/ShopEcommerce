const { inventory } = require("../inventory.model");
const { Types } = require('mongoose')

const insertInventory = async ({
    productId, shopId, stock, location = 'Unknown'
}) => {
    const newInventory = await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location,
    })
    
    return newInventory;
}

module.exports = {
    insertInventory
}