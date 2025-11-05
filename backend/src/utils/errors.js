const AppError = require('./AppError');

// 400 Bad Request: Lỗi dữ liệu đầu vào không hợp lệ (vd: thiếu trường)
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

// 401 Unauthorized: Thiếu hoặc sai thông tin xác thực (chưa đăng nhập)
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// 403 Forbidden: Đã đăng nhập nhưng không có quyền truy cập tài nguyên
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 Not Found: Tài nguyên không tồn tại
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 Conflict: Yêu cầu mâu thuẫn với trạng thái hiện tại (vd: email đã tồn tại)
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

// 422 Unprocessable Entity: Lỗi logic nghiệp vụ validation (vd: số lượng món ăn = 0)
class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable entity') {
    super(message, 422);
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