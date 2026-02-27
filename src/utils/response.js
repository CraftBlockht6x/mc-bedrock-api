/**
 * 成功响应
 */
const success = (res, data, message = 'Success') => {
  res.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * 错误响应
 */
const error = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  success,
  error
};
