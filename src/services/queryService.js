const mcutil = require('minecraft-server-util');
const mcs = require('node-mcstatus');
const cache = require('../utils/cache');

class QueryService {
  constructor() {
    this.defaultPorts = {
      java: 25565,
      bedrock: 19132
    };
  }

  /**
   * 获取缓存键
   */
  getCacheKey(type, host, port) {
    return cache.generateKey(type, host, port);
  }

  /**
   * 查询Java版服务器
   */
  async queryJava(host, port = this.defaultPorts.java, options = {}) {
    const cacheKey = this.getCacheKey('java', host, port);
    
    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached && !options.noCache) {
      return { ...cached, cached: true };
    }

    try {
      // 使用 minecraft-server-util 查询
      const result = await mcutil.status(host, port, {
        timeout: options.timeout || 5000,
        enableSRV: true
      });

      const data = {
        online: true,
        host,
        port,
        type: 'java',
        version: {
          name: result.version.name,
          protocol: result.version.protocol
        },
        players: {
          online: result.players.online,
          max: result.players.max,
          list: result.players.sample || []
        },
        motd: {
          raw: result.motd.raw,
          clean: result.motd.clean,
          html: result.motd.html
        },
        icon: result.favicon || null,
        latency: result.roundTripLatency,
        mods: result.mods || null,
        software: result.software || null
      };

      // 缓存结果
      cache.set(cacheKey, data);
      return data;

    } catch (err) {
      // 尝试使用 node-mcstatus 作为备用
      try {
        const result = await mcs.statusJava(host, port);
        
        if (!result.online) {
          return this.getOfflineResponse(host, port, 'java');
        }

        const data = {
          online: true,
          host,
          port,
          type: 'java',
          version: result.version,
          players: result.players,
          motd: result.motd,
          icon: result.icon,
          latency: null,
          mods: result.mods || null,
          software: result.software || null
        };

        cache.set(cacheKey, data);
        return data;

      } catch (backupErr) {
        return this.getOfflineResponse(host, port, 'java', err.message);
      }
    }
  }

  /**
   * 查询基岩版服务器
   */
  async queryBedrock(host, port = this.defaultPorts.bedrock, options = {}) {
    const cacheKey = this.getCacheKey('bedrock', host, port);
    
    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached && !options.noCache) {
      return { ...cached, cached: true };
    }

    try {
      // 使用 minecraft-server-util 查询
      const result = await mcutil.statusBedrock(host, port, {
        timeout: options.timeout || 5000,
        enableSRV: true
      });

      const data = {
        online: true,
        host,
        port,
        type: 'bedrock',
        version: {
          name: result.version.name,
          protocol: result.version.protocol
        },
        players: {
          online: result.players.online,
          max: result.players.max
        },
        motd: {
          raw: result.motd.raw,
          clean: result.motd.clean,
          html: result.motd.html
        },
        gamemode: result.gamemode || null,
        serverId: result.serverId || null,
        latency: result.roundTripLatency
      };

      cache.set(cacheKey, data);
      return data;

    } catch (err) {
      // 尝试使用 node-mcstatus 作为备用
      try {
        const result = await mcs.statusBedrock(host, port);
        
        if (!result.online) {
          return this.getOfflineResponse(host, port, 'bedrock');
        }

        const data = {
          online: true,
          host,
          port,
          type: 'bedrock',
          version: result.version,
          players: result.players,
          motd: result.motd,
          gamemode: result.gamemode,
          serverId: result.serverid,
          latency: null
        };

        cache.set(cacheKey, data);
        return data;

      } catch (backupErr) {
        return this.getOfflineResponse(host, port, 'bedrock', err.message);
      }
    }
  }

  /**
   * 使用Query协议查询Java版服务器（获取详细信息）
   */
  async queryJavaFull(host, port = 25565, queryPort = null) {
    const cacheKey = this.getCacheKey('java-query', host, port);
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      const result = await mcutil.queryFull(host, queryPort || port, {
        timeout: 10000
      });

      const data = {
        online: true,
        host,
        port,
        type: 'java',
        query: true,
        motd: result.motd,
        gametype: result.gametype,
        gameId: result.game_id,
        version: result.version,
        plugins: result.plugins,
        map: result.map,
        players: {
          online: parseInt(result.numplayers),
          max: parseInt(result.maxplayers),
          list: result.players || []
        },
        hostInfo: {
          ip: result.hostip,
          port: parseInt(result.hostport)
        }
      };

      cache.set(cacheKey, data, 30); // Query数据缓存30秒
      return data;

    } catch (err) {
      return this.getOfflineResponse(host, port, 'java', err.message);
    }
  }

  /**
   * 批量查询多个服务器
   */
  async batchQuery(servers) {
    const promises = servers.map(server => {
      const { host, port, type = 'java' } = server;
      
      if (type === 'bedrock') {
        return this.queryBedrock(host, port).catch(err => ({
          host,
          port,
          type: 'bedrock',
          error: err.message
        }));
      } else {
        return this.queryJava(host, port).catch(err => ({
          host,
          port,
          type: 'java',
          error: err.message
        }));
      }
    });

    return Promise.all(promises);
  }

  /**
   * 获取离线响应
   */
  getOfflineResponse(host, port, type, errorMessage = null) {
    return {
      online: false,
      host,
      port,
      type,
      error: errorMessage,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 清除缓存
   */
  clearCache() {
    cache.flush();
    return { message: '缓存已清除' };
  }
}

module.exports = new QueryService();
