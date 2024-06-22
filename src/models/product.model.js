const { model, Schema } = require("mongoose");
const slugify = require('slugify')

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";           

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: { // quan jean cao cap
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: { // quan-jean-cao-cap
      type: String, 
    },
    // slug quan trong nay
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: {
      type: Schema.Types.Mixed, // có thể lưu trữ bất kì đối tượng, bất kì kiểu dữ liệu nào
      require: true,
    },

    // more
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      // 4.3336 => 4.3
      set: (val) => Math.round(val * 10) / 10
    },

    // variations // ex: iphone 14 + xanh + 128g
    product_variations: {
      type: Array, 
      default: [],
    },

    // 
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select : false,  // khi chúng t sử dụng hàm query các thứ thì ko lấy trường này ra 
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select : false,  // khi chúng t sử dụng hàm query các thứ thì ko lấy trường này ra 
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Document middleware: runs before .save() and .create() ....
productSchema.pre('save', function( next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
})

// define the product type

const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    brand: { type: String, require: true },
    model: String,
    color : String,
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    collection: "Furnitures",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicSchema),
  furniture: model("Furnitures", furnitureSchema),
};
