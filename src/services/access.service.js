const { token } = require("morgan");
const { createTokenPair } = require("../auth/authUtis");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096, // default key
          publicKeyEncoding: {
            type: 'pkcs1',  
            format: 'pem', // xuất công khai ra định dạng pem để có thể convert thành string
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem', // xuất công khai ra định dạng pem để có thể convert thành string
          },
        })

        console.log({privateKey, publicKey}) // save collection KeyStore

        //  step5: save publicKeyString in DB = publicKey + useId
        const publicKeyString = await keyTokenService.createToken({
          userId: newShop._id,
          publicKey: publicKey,
        })

        // return error
        if(!publicKeyString) {
          return {
            code: "xxx",
            message: 'publicKeyString error'
          }
        }

        const publicKeyObject = crypto.createPublicKey( publicKeyString )

        console.log("Public key object :: ", publicKeyObject)

        // created token pair => chưa hiểu lắm
        const tokens = await createTokenPair( {userId: newShop._id, email}, publicKeyString, privateKey)
        console.log(`Created token success `, tokens)

        return {
          code: 201,
          metadata: {
            shop: getInfoData({files: ['id', 'name', 'email'], object: newShop}),
            tokens
          }
        }
        // const tokens = await
      }

      return {
        code: 200,
        metadata: null,
      }
      
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
