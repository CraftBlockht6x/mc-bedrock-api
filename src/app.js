const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');
const { limiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// 安全中间件
app.use(helmet());

// CORS
app.use(cors());

// 速率限制
app.use(limiter);

// 解析JSON
app.use(express.json());

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404处理
app.use(notFound);

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║        Minecraft Server API 已启动                     ║
║                                                        ║
║  环境: ${config.nodeEnv.padEnd(40)} ║
║  端口: ${config.port.toString().padEnd(40)} ║
║  缓存: ${config.cache.ttl + '秒'.padEnd(38)} ║
║                                                        ║
║  API地址: http://localhost:${config.port}/api            ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
