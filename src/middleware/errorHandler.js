const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // 处理特定错误类型
  if (err.name === 'ValidationError') {
    return error(res, 400, '参数验证失败', err.message);
  }

  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return error(res, 503, '无法连接到服务器', '请检查服务器地址和端口是否正确');
  }

  if (err.message && err.message.includes('timeout')) {
    return error(res, 504, '查询超时', '服务器响应时间过长');
  }

  // 默认错误
  error(res, 500, '服务器内部错误', err.message);
};

// 404处理
const notFound = (req, res) => {
  error(res, 404, '接口不存在', `Cannot ${req.method} ${req.path}`);
};

module.exports = {
  errorHandler,
  notFound
};
