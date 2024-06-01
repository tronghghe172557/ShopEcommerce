const asyncHandler = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next) 
            // .catch sẽ bắt lỗi trong thằng func truyền vào( nếu có)
            // bắt lỗi với throw
    }
}

module.exports = {
    asyncHandler
}