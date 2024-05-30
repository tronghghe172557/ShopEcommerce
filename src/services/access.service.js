const { token } = require("morgan");
const { createTokenPair } = require("../auth/authUtis");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const keyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email exists
      const holderShop = await shopModel.findOne({ email }).lean(); // lean() => query nhanh
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
      }

      // step2: hash password
      const passwordHash = await bcrypt.hash(password, 10); // băm với độ khó bằng 10

      // step3: save in DB
      const newShop = await shopModel.create({
        name,
        email,
        // passwordHash, // new password after HASH => lỗi vì ko tìm đúng tên TRƯỜNG (PATH)
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      // new shopModel({ name, email, password: password, roles: [RoleShop.SHOP],})

      // 
      if(newShop) {
        // step4: Create privateKey, publicKey

        // 1 chuỗi dài 64 bit => của thằng nodejs
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        console.log({privateKey, publicKey}) // save collection KeyStore

        //  step5: save publicKeyString in DB = publicKey + useId
        const keyStore = await keyTokenService.createToken({
          userId: newShop._id,
          publicKey: publicKey,
          privateKey: privateKey,
        })

        // return error
        if(!keyStore) {
          return {
            code: "xxx",
            message: 'publicKeyString error'
          }
        } 

        // created token pair => chưa hiểu lắm
        // dùng JWT tạo và xác thực thông báo
        const tokens = await createTokenPair(  {userId: newShop._id, email}, publicKey, privateKey )
        console.log(`Created token success `, tokens)

        return {
          code: 201, // tạo hoàn tất
          metadata: {
            shop: getInfoData({files: ['id', 'name', 'email'], object: newShop}),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null,
      }
      
    } catch (error) {
      console.error(error)
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
