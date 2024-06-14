const { token } = require("morgan");
const { createTokenPair, verifyJWT } = require("../auth/authUtis");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const keyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require("./shop.service");
const keytokenModel = require("../models/keytoken.model");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {

  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user

    console.log(keyStore)

    if(keyStore.refreshTokenUsed.includes(refreshToken)) {
      // delete all token in DB
      const deleteKey = await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Refresh key is used, !!!! something wrong happened !!! please login')
    }

    if(keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered')
    }

    // check user
    const foundShop = await findByEmail({ email });
    if(!foundShop) throw new AuthFailureError('Shop not registered 2')

    // create new tokens
    const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

    // update token
    await keytokenModel.updateOne({ user: userId }, {
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken // token đã được sử dụng và add vào
      }
    })

    return {
      user,
      tokens
    }
  }

  /*
    check this token used?
  */
  static handlerRefreshToken = async ( refreshToken ) => {
    // check token is used ???
    const foundToken = await keyTokenService.findByRefreshTokenUsed( refreshToken )
    // if foundToken exist
    if(foundToken) {
      // decode xem m la thang nao ???
      const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey )
      // console.log({ userId, email })

      // delete all token in DB
      const deleteKey = await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Refresh key is used, !!!! something wrong happened !!! please login')
    }

    // foundToken is not used
    const holderKey = await keyTokenService.findByRefreshToken( refreshToken )
    console.log(holderKey)
    if(!holderKey) throw new AuthFailureError('Shop not registered')

    // verify token
    const { userId, email } = await verifyJWT( refreshToken, holderKey.privateKey )
    console.log('[2]----', { userId, email })

    // check user
    const foundShop = await findByEmail({ email });
    if(!foundShop) throw new AuthFailureError('Shop not registered 2')

    // create new tokens
    const tokens = await createTokenPair({userId, email}, holderKey.publicKey, holderKey.privateKey)

    // update token
    await holderKey.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken // token đã được sử dụng và add vào
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }


  static logout = async( keyStore ) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log(delKey)

    return delKey
  }


  /*
    1 - Check email in DB
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokes
    5 - get data return login
  */

  static login = async ({ email, password, refreshToken = null}) => {
    // step 1. 
    const foundShop = await findByEmail({ email })
    if(!foundShop) throw new BadRequestError('Shop not registered')

    // step 2.
    const match = bcrypt.compare(password, foundShop.password)
    if(!match) throw new AuthFailureError("Authorize error")

    // step 3. create privateKey, publickey
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // step 4. generate token
    const {_id: userId} = foundShop
    const tokens = await createTokenPair({userId, email}, publicKey, privateKey)
    // console.log(tokens) 

    // step 5. 
    await keyTokenService.createToken({
      userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey
    })

    return {
      shop: getInfoData({files: [`_id`, `name`, `email`], object: foundShop}),
      tokens
    }
  }


  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists
    const holderShop = await shopModel.findOne({ email }).lean(); // lean() => query nhanh
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered")
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

      //console.log({privateKey, publicKey}) // save collection KeyStore

      //  step5: save publicKeyString in DB = publicKey + useId
      const keyStore = await keyTokenService.createTokenSignup({
        userId: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey,
      })

      // return error
      if(!keyStore) {
        throw new BadRequestError('publicKeyString error')
      } 

      // created token pair => chưa hiểu lắm
      // dùng JWT tạo và xác thực thông báo
      const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey )
      //console.log(`Created token success `, tokens)

      return {
          shop: getInfoData({files: ['id', 'name', 'email'], object: newShop}),
          tokens
      }
    }

    return {
      code: 200,
      metadata: null,
    }
  };
}

module.exports = AccessService;
