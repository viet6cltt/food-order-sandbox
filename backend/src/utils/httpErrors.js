const AppError = require('./AppError');

// 400 Bad Request: Lỗi dữ liệu đầu vào không hợp lệ (vd: thiếu trường)
class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = null, details = null) {
    super(message, 400, code, details);
  }
}

// 401 Unauthorized: Thiếu hoặc sai thông tin xác thực (chưa đăng nhập)
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = null, details = null) {
    super(message, 401, code, details);
  }
}

// 403 Forbidden: Đã đăng nhập nhưng không có quyền truy cập tài nguyên
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = null, details = null) {
    super(message, 403, code, details);
  }
}

// 404 Not Found: Tài nguyên không tồn tại
class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = null, details = null) {
    super(message, 404, code, details);
  }
}

// 409 Conflict: Yêu cầu mâu thuẫn với trạng thái hiện tại (vd: email đã tồn tại)
class ConflictError extends AppError {
  constructor(message = 'Resource conflict', code = null, details = null) {
    super(message, 409, code, details);
  }
}

// 422 Unprocessable Entity: Lỗi logic nghiệp vụ validation (vd: số lượng món ăn = 0)
class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable entity', code = null, details = null) {
    super(message, 422, code, details);
  }
}


module.exports = { 
  BadRequestError, 
  UnauthorizedError,
  ForbiddenError, 
  NotFoundError,
  ConflictError, 
  UnprocessableEntityError,
}