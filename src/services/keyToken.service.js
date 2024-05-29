// viết hàm để tạo token

const keytokenModel = require("../models/keytoken.model");

class keyTokenService {

    static createToken = async ({userId, publicKey, privateKey}) => {
        try {
            // save publicKeyString in DB
            const token = await keytokenModel.create({
                user: userId,
                publicKey: publicKey,
                privateKey: privateKey
            })

            return token ? token.publicKey : null
        } catch (error) {
            return error;
        }
    }
}

module.exports = keyTokenService