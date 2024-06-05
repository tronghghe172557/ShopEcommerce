
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('./handError.middleware')
const { NotFoundError, AuthFailureError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
// .sign(Data cần bảo mật, Mã( chữ kỹ), {thuật toán, time}) => trả ra 1 chuỗi JSON được mã hóa
// .verify(AccessToken, Mã ( chữ ký ), (err, decode)) => check xem accessToken còn được truy cập ko 

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // accessToken => dùng để user đảm bảo rằng user hoặc service đã được xác thực
        // để có thể truy cập vào tài nguyên mà được cho phép
        const accessToken = await JWT.sign(payload, publicKey, 
                                        // headers  // CHỮ KÝ 
            {
            // algorithm: 'RS256', => thuật toán
            expiresIn: '2 days' // => time hết hạn
            }
        )

        // refreshToken: để yêu cầu server trả về 1 accessToken mới
        const refreshToken = await JWT.sign( payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        // nếu cả 2 accessToken + refreshToken hết hạn => Đăng nhập lại để lấy access + refresh mới

        // kiểm tra xem accessToken còn sử dụng được không: Chưa biết để làm gì
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err) {
                console.error('error verify ::', err)
            } else {
                console.log('decode verify :: ', decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        
    }
}

const authentication = asyncHandler( async(req, res, next) => {
    /*
        1 - check userId missing ?
        2 - get accessToken 
        3 - verifyToken
        4 - check user in bds
        5 - check keyStore with this userId
        6 - ok all => return next()
    */

    // 1.
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request userId in authUtils')
    
    console.log(userId)
    // 2.
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore in authUtils')

    // 3.
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request accessToken in authUtils')

    // 4.
    try {
        const decodeUser = JWT.verify( accessToken, keyStore.publicKey)
        if(userId != decodeUser.userId) throw new AuthFailureError('Invalid userId in authUtils')

        req.keyStore = keyStore

        return next();
    } catch (error) {
        throw error
    }
            
})

module.exports = {
    createTokenPair,
    authentication
}