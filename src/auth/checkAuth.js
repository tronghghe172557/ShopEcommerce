// Dùng như 1 MIDDLEWARES

const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

// KHI SỬ DỤNG API => client truyền lên thêm 1 apiKey để xác nhận xem
// màn hình client ấy có quyền được truy cập vào API hay không 

// HÀM apiKey + permission để thực hiện điều đó
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // Check objKey in DB
        const objKey = await findById(key);

        if(!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey

        return next() 
    } catch (error) {
        
    }
}

const permission = ( permission ) => {
    // hàm Closures là 1 hàm => return 1 hàm
    // hàm con có thể xử dụng những biến của hàm cha
    return (req, res, next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        }

        console.log('permission::', req.objKey.permissions)

        const validPermission = req.objKey.permissions.includes(permission)

        if(!validPermission) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission
}