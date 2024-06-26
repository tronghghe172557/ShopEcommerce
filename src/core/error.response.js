
const ReasonPhrases = require('../utils/httpStatusCode')

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

class AuthFailureError extends ErrorResponse {
    constructor( message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor( message = ReasonPhrases.NOT_FOUND , statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor( message = ReasonPhrases.FORBIDDEN , statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}


module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
}