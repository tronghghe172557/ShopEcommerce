// viết hàm để tạo token

const keyTokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose')

class keyTokenService {

    static createToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // save publicKeyString in DB
            // lv 0
            // const token = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })

            // lv xxx
            
            // filter: is an obj that defines the criterial( tiêu chuẩn) for finding document to update
            // user: userId => it means look for a document where user field matches the value of useId

            // `update` : is an obj defining the new values to set in document
            // {...}: are variables containing new values for respective( tuơng ứng) fields in the document

            // options: is an obj that specials additional parameters( chỉ định tham số bổ sung) for findAndUpdate operator
            // `upsert: true`:  means that if no document matches the filter, a new document should be created
            // `new: true`: means that the method should return modified document (bản ghi đã qua sửa đổi)
            // rather than the original


            const filter = { user: userId  }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = {upsert: true, new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            // findAndUpdate is a Mongoose method that 
            // finds the single document base on filter 
            // updates its with the `update` obj
            // and use `options` to determine the behavior of the operation

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error;
        }
    }

    static createTokenSignup = async ({userId, publicKey, privateKey}) => {
        try {
            // save publicKeyString in DB
            // lv 0
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKey,
                privateKey: privateKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    static findByUserId = async ( userId ) => {
        console.log(userId)
        const userIdObj = new Types.ObjectId(userId);
        const keyInDb = await keyTokenModel.findOne({ user: userIdObj }).lean();

        return keyInDb;
        // user: Types.ObjectId(userId): find document have field name is "user" 
        // and value have type 'Types.ObjectId(userId)'
        // bug here
    }

    static removeKeyById = async ( id ) => {
        // remove is deprecated (thay thế)
        // remove => deleteOne
        const removeKey =  await keyTokenModel.deleteOne( id )

        return removeKey
    }
}
 
module.exports = keyTokenService