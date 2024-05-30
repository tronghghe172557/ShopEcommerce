
const JWT = require('jsonwebtoken')
// .sign(Data cần bảo mật, Mã( chữ kỹ), {thuật toán, time}) => trả ra 1 chuỗi JSON được mã hóa
// .verify(AccessToken, Mã ( chữ ký ), (err, decode)) => check xem accessToken còn được truy cập ko 

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

module.exports = {
    createTokenPair
}