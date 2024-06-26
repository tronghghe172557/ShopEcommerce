// nhiệm vụ: Lưu lại userId, publicKey, refreshToken mà người ta đã sử dụng

const { Schema, model, Collection, mongoose } = require("mongoose"); // Erase if already required
const { collection } = require("./shop.model");
const { type } = require("os");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      // chưa hiểu cái này để làm gì lắm
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      require: true,
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
