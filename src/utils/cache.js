const NodeCache = require('node-cache');
const config = require('../config');

const cache = new NodeCache({ stdTTL: config.cache.ttl });

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value, ttl = config.cache.ttl) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),
  has: (key) => cache.has(key),
  // 生成缓存键
  generateKey: (type, host, port) => `${type}:${host}:${port || 'default'}`
};
