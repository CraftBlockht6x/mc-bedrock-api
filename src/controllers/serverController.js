const queryService = require('../services/queryService');
const { success, error } = require('../utils/response');

class ServerController {
  /**
   * 查询Java版服务器
   */
  async getJavaStatus(req, res, next) {
    try {
      const { host } = req.params;
      const { port, nocache } = req.query;

      const result = await queryService.queryJava(
        host, 
        port, 
        { noCache: nocache === 'true' }
      );
      
      success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 查询基岩版服务器
   */
  async getBedrockStatus(req, res, next) {
    try {
      const { host } = req.params;
      const { port, nocache } = req.query;

      const result = await queryService.queryBedrock(
        host, 
        port, 
        { noCache: nocache === 'true' }
      );
      
      success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 自动检测类型查询
   */
  async getAutoStatus(req, res, next) {
    try {
      const { host } = req.params;
      const { port, type, nocache } = req.query;

      // 如果指定了类型
      if (type) {
        if (type === 'bedrock') {
          const result = await queryService.queryBedrock(host, port, { noCache: nocache === 'true' });
          return success(res, result);
        } else {
          const result = await queryService.queryJava(host, port, { noCache: nocache === 'true' });
          return success(res, result);
        }
      }

      // 自动检测：先尝试Java版，如果失败再尝试基岩版
      let result = await queryService.queryJava(host, port, { noCache: nocache === 'true' });
      
      if (!result.online) {
        result = await queryService.queryBedrock(host, port, { noCache: nocache === 'true' });
      }

      success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Query协议查询（获取玩家列表等详细信息）
   */
  async getJavaQuery(req, res, next) {
    try {
      const { host } = req.params;
      const { port, queryPort } = req.query;

      const result = await queryService.queryJavaFull(host, port, queryPort);
      success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 批量查询
   */
  async batchQuery(req, res, next) {
    try {
      const { servers } = req.body;

      if (!Array.isArray(servers) || servers.length === 0) {
        return error(res, 400, '请提供服务器列表');
      }

      if (servers.length > 10) {
        return error(res, 400, '一次最多查询10个服务器');
      }

      const results = await queryService.batchQuery(servers);
      success(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 清除缓存
   */
  async clearCache(req, res, next) {
    try {
      const result = queryService.clearCache();
      success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取API信息
   */
  async getApiInfo(req, res) {
    success(res, {
      name: 'Minecraft Server API',
      version: '1.0.0',
      endpoints: {
        java: '/api/server/java/:host',
        bedrock: '/api/server/bedrock/:host',
        auto: '/api/server/:host',
        query: '/api/server/java/:host/query',
        batch: '/api/server/batch (POST)'
      },
      parameters: {
        port: '可选，自定义端口',
        nocache: '可选，true表示不使用缓存'
      }
    });
  }
}

module.exports = new ServerController();
