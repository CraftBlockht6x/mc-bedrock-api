const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const { 
  validateServerAddress, 
  validatePort, 
  validateServerType 
} = require('../middleware/validator');
const { strictLimiter } = require('../middleware/rateLimiter');

// Java版服务器状态
router.get(
  '/java/:host',
  validateServerAddress,
  validatePort,
  serverController.getJavaStatus
);

// 基岩版服务器状态
router.get(
  '/bedrock/:host',
  validateServerAddress,
  validatePort,
  serverController.getBedrockStatus
);

// 自动检测类型
router.get(
  '/:host',
  validateServerAddress,
  validatePort,
  serverController.getAutoStatus
);

// Query协议查询（Java版详细查询）
router.get(
  '/java/:host/query',
  validateServerAddress,
  validatePort,
  serverController.getJavaQuery
);

// 批量查询
router.post(
  '/batch',
  strictLimiter,
  serverController.batchQuery
);

// 清除缓存
router.delete('/cache', serverController.clearCache);

module.exports = router;
