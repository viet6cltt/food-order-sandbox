const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code || null
    });
  }

  // những lỗi k mong muốn
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
}

module.exports = errorHandler;