const express = require('express');
const router = express.Router();
const serverRoutes = require('./server');
const serverController = require('../controllers/serverController');

// API信息
router.get('/', serverController.getApiInfo);

// 服务器查询路由
router.use('/server', serverRoutes);

module.exports = router;
