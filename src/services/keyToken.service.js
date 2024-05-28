// viết hàm để tạo token

const keytokenModel = require("../models/keytoken.model");

class keyTokenService {

    static createToken = async ({userId, publicKey}) => {
        try {
            // Xuất khóa công khai sang định dạng PEM
            // const publicKeyPem = publicKey.export({ type: 'pkcs1', format: 'pem' });

            // publicKey dùng thuật toán sinh ra đang ở dạng buffer => chuyển về String
            const publicKeyString = publicKey.toString(); 

            // save publicKeyString in DB
            const token = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            })

            // new keytokenModel({
            //     user: userId,
            //     publicKey: publicKeyString,
            // })

            return token ? token.publicKey : null
        } catch (error) {
            return error;
        }
    }
}

module.exports = keyTokenService