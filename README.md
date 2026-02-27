# Minecraft 服务器状态查询 API

这是一个简单的 Minecraft 服务器状态查询 API 项目。

## 功能

- 查询 Java 版服务器状态
- 查询基岩版服务器状态
- 自动检测服务器类型
- 支持批量查询
- 响应缓存
## 克隆项目
```bash
git clone https://github.com/CraftBlockht6x/mc-bedrock-api.git
cd mc-bedrock-api
```

## 安装

```bash
npm install
```

## 启动

```bash
npm run start
```

## API 接口

| 接口 | 说明 |
|------|------|
| `GET /api/server/java/:host` | 查询 Java 版服务器 |
| `GET /api/server/bedrock/:host` | 查询基岩版服务器 |
| `GET /api/server/:host` | 自动检测类型 |
| `POST /api/server/batch` | 批量查询 |

## 示例

```bash
# 查询 Java 版服务器
curl http://localhost:3000/api/server/java/mineku.top?port=11451

# 查询基岩版服务器
curl http://localhost:3000/api/server/bedrock/play.craftblock.chaxil.top?port=59954
```

## 配置

编辑 `.env` 文件：

```
PORT=3000
CACHE_TTL=60
```

## 依赖

- Node.js >= 14
- Express
- minecraft-server-util
- node-mcstatus
