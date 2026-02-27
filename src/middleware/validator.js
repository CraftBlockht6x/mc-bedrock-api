const { error } = require('../utils/response');

/**
 * 验证服务器地址
 */
const validateServerAddress = (req, res, next) => {
  const { host } = req.params;
  
  if (!host) {
    return error(res, 400, '缺少服务器地址参数');
  }

  // 验证地址格式
  const hostRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.:]+[a-zA-Z0-9]$/;
  if (!hostRegex.test(host)) {
    return error(res, 400, '服务器地址格式不正确');
  }

  next();
};

/**
 * 验证端口
 */
const validatePort = (req, res, next) => {
  let { port } = req.query;
  
  if (port) {
    port = parseInt(port);
    if (isNaN(port) || port < 1 || port > 65535) {
      return error(res, 400, '端口号必须在 1-65535 之间');
    }
    req.query.port = port;
  }

  next();
};

/**
 * 验证服务器类型
 */
const validateServerType = (req, res, next) => {
  const { type } = req.params;
  const validTypes = ['java', 'bedrock'];
  
  if (!validTypes.includes(type.toLowerCase())) {
    return error(res, 400, '服务器类型必须是 java 或 bedrock');
  }

  next();
};

module.exports = {
  validateServerAddress,
  validatePort,
  validateServerType
};
