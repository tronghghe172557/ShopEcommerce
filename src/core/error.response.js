
const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {

    constructor(message, status) {
        super(message) // gọi hàm khởi tạo của lớp cha
        this.status = status // biến của thằng con mới có
    }
}

class ConflictRequestError extends ErrorResponse {
    
    // nếu ko có biến truyền vào thì truyền giá trị mặc định
    constructor( message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN ) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    
    constructor( message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN ) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}