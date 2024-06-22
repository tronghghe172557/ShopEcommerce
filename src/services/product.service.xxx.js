
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftForShop, publishProductByShop, findAllPublishForShop } = require('../models/repositories/product.repo')
// define Factory class to create product
class ProductFactory {
    /* 
        type: "",
        payload
    */
   // đối tượng tĩnh để lưu trữ mối liên hệ giữa sản phẩm + lớp sản phẩm
   static productRegistry = {} // key - class // đăng ký cho mỗi cặp value + class ( new product )

   // đăng ký 1 sản phẩm mới
   static registerProductType( type, classRef ) {
    ProductFactory.productRegistry[type] = classRef
   }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass)  throw new BadRequestError(`Invalid Product Types: ${type}`) 

        return new productClass( payload ).createProduct();
    }

    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    // END PUT //

    // query //
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }

        return await findAllPublishForShop({ query, limit, skip })
    }
}

// define base product class
class Product {

    // trong contructor: dùng dấu ;
    constructor({
        product_name, product_thumb, product_description, product_price, 
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct( product_id ) {
        return await product.create({ ...this, _id: product_id })
    }

}

// Define sub-class for different product types Clothing
class Clothing extends Product {

    // @override
    async createProduct() {
        // create attribute first
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError('Create new Clothing error')

        // create product include newClothing
        const newProduct = await super.createProduct( newClothing._id ) // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error')

        // Nếu Tạo Clothing thành công => nhưng mà chưa chắc tạo Product thành công
        
        //

        return newProduct;
    }

}

// Define sub-class for different product types Electronics
class Electronic extends Product {

    // @override
    async createProduct() {
        // create attribute first
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new Electronics error')

        // create product include newElectronic
        const newProduct = await super.createProduct( newElectronic._id ) // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct;
    }

}

// Define sub-class for different product types Furniture
class Furniture extends Product {

    // @override
    async createProduct() {
        // create attribute first
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop // cả sản phẩm lớn + thông tin ngoài lề của sản phẩm phải cùng Shop_id
        })
        if(!newFurniture) throw new BadRequestError('Create new Electronics error')

        // create product include newElectronic
        const newProduct = await super.createProduct( newFurniture._id ) // super: dùng những thằng có sẵn của hàm cha
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct;
    }

}

// register product types
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)
// ProductFactory.registerProductType('Furniture', Furniture) // add thêm vào đây


// export nó như 1 class chứ ko được export như 1 đối tượng
// class => mới dùng được hàm tĩnh
module.exports = ProductFactory
