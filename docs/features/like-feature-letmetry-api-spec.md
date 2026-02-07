# Letmetry API 规范：点赞功能专用端点
## Like Feature Dedicated API Endpoints Specification

**文档类型**: API 规范文档  
**目标项目**: https://github.com/jackandking/letmetry_web_service  
**创建日期**: 2026-02-07  
**版本**: v1.0

---

## 📋 概述

本文档定义了为点赞功能设计的专用 API 端点。相比使用通用的 `/mysql/query` 端点，专用端点提供：
- ✅ **更好的语义化**：API 名称清晰表达意图
- ✅ **参数验证**：后端统一验证，减少错误
- ✅ **安全性增强**：隐藏 SQL 细节，防止注入
- ✅ **性能优化**：后端可以针对性优化
- ✅ **扩展性**：易于添加业务逻辑（如通知、统计）

---

## 🎯 推荐的 API 端点设计

### 端点1: 点赞海报 (Like Poster)

**端点**: `POST /posters/like`

**用途**: 用户点赞某个成就海报

**请求体**:
```json
{
  "poster_id": 123,
  "user_id": "user_abc_123"
}
```

**请求参数说明**:
| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| poster_id | Integer | 是 | 海报ID，对应 achievement_posters.id |
| user_id | String | 是 | 用户ID，最长100字符 |

**成功响应** (HTTP 200):
```json
{
  "success": true,
  "data": {
    "poster_id": 123,
    "user_id": "user_abc_123",
    "like_count": 13,
    "created_at": "2026-02-07T12:00:00Z"
  },
  "message": "点赞成功"
}
```

**错误响应1** - 已点赞 (HTTP 409):
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_LIKED",
    "message": "您已经点赞过这个海报了"
  }
}
```

**错误响应2** - 海报不存在 (HTTP 404):
```json
{
  "success": false,
  "error": {
    "code": "POSTER_NOT_FOUND",
    "message": "海报不存在"
  }
}
```

**错误响应3** - 参数错误 (HTTP 400):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "参数错误：poster_id 必须是正整数"
  }
}
```

**后端实现逻辑**:
```javascript
// 伪代码
async function likePoster(req, res) {
  const { poster_id, user_id } = req.body;
  
  // 1. 参数验证
  if (!poster_id || !Number.isInteger(poster_id) || poster_id <= 0) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_PARAMS', message: 'poster_id 必须是正整数' }
    });
  }
  
  // 2. 检查海报是否存在
  const poster = await db.query('SELECT id FROM achievement_posters WHERE id = ?', [poster_id]);
  if (!poster) {
    return res.status(404).json({
      success: false,
      error: { code: 'POSTER_NOT_FOUND', message: '海报不存在' }
    });
  }
  
  // 3. 插入点赞记录（使用 ON DUPLICATE KEY 防止重复）
  try {
    const result = await db.query(
      'INSERT INTO poster_likes (poster_id, user_id) VALUES (?, ?)',
      [poster_id, user_id]
    );
    
    // 4. 获取最新点赞数
    const likeCount = await db.query(
      'SELECT COUNT(*) as count FROM poster_likes WHERE poster_id = ?',
      [poster_id]
    );
    
    // 5. 返回成功
    return res.status(200).json({
      success: true,
      data: {
        poster_id,
        user_id,
        like_count: likeCount[0].count,
        created_at: new Date().toISOString()
      },
      message: '点赞成功'
    });
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: { code: 'ALREADY_LIKED', message: '您已经点赞过这个海报了' }
      });
    }
    throw error;
  }
}
```

---

### 端点2: 取消点赞 (Unlike Poster)

**端点**: `POST /posters/unlike` 或 `DELETE /posters/like`

**用途**: 用户取消对某个成就海报的点赞

**请求体**:
```json
{
  "poster_id": 123,
  "user_id": "user_abc_123"
}
```

**请求参数说明**:
| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| poster_id | Integer | 是 | 海报ID |
| user_id | String | 是 | 用户ID |

**成功响应** (HTTP 200):
```json
{
  "success": true,
  "data": {
    "poster_id": 123,
    "user_id": "user_abc_123",
    "like_count": 12
  },
  "message": "取消点赞成功"
}
```

**错误响应** - 未点赞 (HTTP 404):
```json
{
  "success": false,
  "error": {
    "code": "NOT_LIKED",
    "message": "您还未点赞此海报"
  }
}
```

**后端实现逻辑**:
```javascript
async function unlikePoster(req, res) {
  const { poster_id, user_id } = req.body;
  
  // 1. 参数验证（同 likePoster）
  
  // 2. 删除点赞记录
  const result = await db.query(
    'DELETE FROM poster_likes WHERE poster_id = ? AND user_id = ?',
    [poster_id, user_id]
  );
  
  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_LIKED', message: '您还未点赞此海报' }
    });
  }
  
  // 3. 获取最新点赞数
  const likeCount = await db.query(
    'SELECT COUNT(*) as count FROM poster_likes WHERE poster_id = ?',
    [poster_id]
  );
  
  return res.status(200).json({
    success: true,
    data: {
      poster_id,
      user_id,
      like_count: likeCount[0].count
    },
    message: '取消点赞成功'
  });
}
```

---

### 端点3: 批量获取点赞状态 (Get Like Status)

**端点**: `POST /posters/like-status`

**用途**: 批量查询多个海报的点赞数和当前用户是否已点赞

**请求体**:
```json
{
  "poster_ids": [123, 124, 125],
  "user_id": "user_abc_123"
}
```

**请求参数说明**:
| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| poster_ids | Array[Integer] | 是 | 海报ID数组，最多100个 |
| user_id | String | 是 | 用户ID |

**成功响应** (HTTP 200):
```json
{
  "success": true,
  "data": [
    {
      "poster_id": 123,
      "like_count": 13,
      "user_has_liked": true
    },
    {
      "poster_id": 124,
      "like_count": 5,
      "user_has_liked": false
    },
    {
      "poster_id": 125,
      "like_count": 20,
      "user_has_liked": true
    }
  ]
}
```

**后端实现逻辑**:
```javascript
async function getLikeStatus(req, res) {
  const { poster_ids, user_id } = req.body;
  
  // 1. 参数验证
  if (!Array.isArray(poster_ids) || poster_ids.length === 0) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_PARAMS', message: 'poster_ids 必须是非空数组' }
    });
  }
  
  if (poster_ids.length > 100) {
    return res.status(400).json({
      success: false,
      error: { code: 'TOO_MANY_IDS', message: '一次最多查询100个海报' }
    });
  }
  
  // 2. 批量查询
  const placeholders = poster_ids.map(() => '?').join(',');
  const results = await db.query(`
    SELECT 
      p.id as poster_id,
      COUNT(l.id) as like_count,
      MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) as user_has_liked
    FROM achievement_posters p
    LEFT JOIN poster_likes l ON p.id = l.poster_id
    WHERE p.id IN (${placeholders})
    GROUP BY p.id
  `, [user_id, ...poster_ids]);
  
  return res.status(200).json({
    success: true,
    data: results.map(row => ({
      poster_id: row.poster_id,
      like_count: row.like_count,
      user_has_liked: row.user_has_liked === 1
    }))
  });
}
```

---

### 端点4: 获取点赞用户列表 (Get Likers)

**端点**: `GET /posters/{poster_id}/likers`

**用途**: 获取点赞某个海报的用户列表

**URL参数**:
- `poster_id`: 海报ID（路径参数）

**查询参数**:
| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | Integer | 否 | 50 | 返回数量，最大100 |
| offset | Integer | 否 | 0 | 分页偏移 |

**请求示例**:
```
GET /posters/123/likers?limit=20&offset=0
```

**成功响应** (HTTP 200):
```json
{
  "success": true,
  "data": {
    "poster_id": 123,
    "total_likes": 150,
    "likers": [
      {
        "user_id": "user_xyz",
        "created_at": "2026-02-07T10:30:00Z"
      },
      {
        "user_id": "user_abc",
        "created_at": "2026-02-07T09:15:00Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

**后端实现逻辑**:
```javascript
async function getLikers(req, res) {
  const { poster_id } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const offset = parseInt(req.query.offset) || 0;
  
  // 1. 获取总点赞数
  const totalResult = await db.query(
    'SELECT COUNT(*) as total FROM poster_likes WHERE poster_id = ?',
    [poster_id]
  );
  
  // 2. 获取点赞用户列表
  const likers = await db.query(
    'SELECT user_id, created_at FROM poster_likes WHERE poster_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [poster_id, limit, offset]
  );
  
  return res.status(200).json({
    success: true,
    data: {
      poster_id: parseInt(poster_id),
      total_likes: totalResult[0].total,
      likers: likers,
      pagination: {
        limit,
        offset,
        has_more: totalResult[0].total > offset + likers.length
      }
    }
  });
}
```

---

### 端点5: 获取热门海报 (Get Trending Posters)

**端点**: `GET /posters/trending`

**用途**: 获取点赞数最多的海报列表（排行榜）

**查询参数**:
| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | Integer | 否 | 50 | 返回数量，最大100 |
| time_range | String | 否 | all | 时间范围：all, 7d, 30d |

**请求示例**:
```
GET /posters/trending?limit=20&time_range=7d
```

**成功响应** (HTTP 200):
```json
{
  "success": true,
  "data": [
    {
      "poster_id": 125,
      "title": "完成故宫博物院参观",
      "user_name": "张三",
      "image_url": "https://...",
      "like_count": 234,
      "created_at": "2026-02-01T10:00:00Z"
    },
    {
      "poster_id": 123,
      "title": "国家博物馆游记",
      "user_name": "李四",
      "image_url": "https://...",
      "like_count": 189,
      "created_at": "2026-02-05T15:30:00Z"
    }
  ]
}
```

**后端实现逻辑**:
```javascript
async function getTrendingPosters(req, res) {
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const timeRange = req.query.time_range || 'all';
  
  // 构建时间过滤条件
  let timeCondition = '';
  if (timeRange === '7d') {
    timeCondition = 'AND p.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
  } else if (timeRange === '30d') {
    timeCondition = 'AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
  }
  
  const results = await db.query(`
    SELECT 
      p.id as poster_id,
      p.title,
      p.user_name,
      p.image_url,
      COUNT(l.id) as like_count,
      p.created_at
    FROM achievement_posters p
    LEFT JOIN poster_likes l ON p.id = l.poster_id
    WHERE p.visibility = 'public' ${timeCondition}
    GROUP BY p.id
    HAVING like_count > 0
    ORDER BY like_count DESC, p.created_at DESC
    LIMIT ?
  `, [limit]);
  
  return res.status(200).json({
    success: true,
    data: results
  });
}
```

---

## 🔐 安全性和性能考虑

### 1. 速率限制 (Rate Limiting)

建议在 API 网关层或应用层实现速率限制：

```javascript
// 推荐的速率限制策略
const rateLimits = {
  '/posters/like': {
    points: 10,      // 10次操作
    duration: 60,    // 每分钟
    blockDuration: 300 // 超限后封禁5分钟
  },
  '/posters/unlike': {
    points: 10,
    duration: 60,
    blockDuration: 300
  },
  '/posters/like-status': {
    points: 60,      // 批量查询限制宽松
    duration: 60
  }
};
```

### 2. 参数验证

所有端点都应该验证：
- ✅ `poster_id`: 必须是正整数
- ✅ `user_id`: 必须是非空字符串，长度 5-100
- ✅ 数组参数：检查长度和元素类型

### 3. SQL注入防护

- ✅ 使用参数化查询（prepared statements）
- ✅ 永远不要拼接用户输入到SQL语句

### 4. 性能优化

- ✅ 批量查询端点（`/posters/like-status`）应该使用 `IN` 查询
- ✅ 考虑添加 Redis 缓存热门数据
- ✅ 数据库索引优化（参见数据库设计部分）

---

## 📊 数据库表结构要求

### 表1: poster_likes

```sql
CREATE TABLE poster_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  poster_id INT NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_poster_user (poster_id, user_id),
  INDEX idx_poster_id (poster_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 表2: achievement_posters (需要修改)

```sql
-- 可选：添加缓存字段以提高性能
ALTER TABLE achievement_posters 
ADD COLUMN like_count INT DEFAULT 0;

-- 可选：添加索引以支持排行榜查询
ALTER TABLE achievement_posters 
ADD INDEX idx_like_count (like_count);
```

---

## 🔄 API 版本控制

建议使用 URL 路径版本控制：

```
v1: /api/v1/posters/like
v2: /api/v2/posters/like (未来版本)
```

当前设计为 v1 版本。

---

## 📝 错误码标准

统一的错误码格式：

| 错误码 | HTTP状态 | 说明 |
|--------|----------|------|
| INVALID_PARAMS | 400 | 参数错误 |
| POSTER_NOT_FOUND | 404 | 海报不存在 |
| NOT_LIKED | 404 | 未点赞 |
| ALREADY_LIKED | 409 | 已点赞 |
| TOO_MANY_IDS | 400 | 请求ID过多 |
| RATE_LIMIT_EXCEEDED | 429 | 超过速率限制 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

## 🚀 推荐实施顺序

### 阶段1: 核心功能 (1-2天)
1. ✅ `POST /posters/like` - 点赞
2. ✅ `POST /posters/unlike` - 取消点赞
3. ✅ `POST /posters/like-status` - 批量查询

### 阶段2: 扩展功能 (1-2天)
4. ✅ `GET /posters/{poster_id}/likers` - 点赞用户列表
5. ✅ `GET /posters/trending` - 热门排行榜

### 阶段3: 优化 (可选)
- Redis 缓存
- 速率限制完善
- 性能监控

---

## 📋 测试用例

### 测试1: 点赞成功
```bash
curl -X POST https://letmetry.cloud/api/v1/posters/like \
  -H "Content-Type: application/json" \
  -d '{"poster_id": 123, "user_id": "user_test"}'

# 预期: HTTP 200, success: true
```

### 测试2: 重复点赞
```bash
# 第二次点赞同一个海报
curl -X POST https://letmetry.cloud/api/v1/posters/like \
  -H "Content-Type: application/json" \
  -d '{"poster_id": 123, "user_id": "user_test"}'

# 预期: HTTP 409, error.code: "ALREADY_LIKED"
```

### 测试3: 批量查询
```bash
curl -X POST https://letmetry.cloud/api/v1/posters/like-status \
  -H "Content-Type: application/json" \
  -d '{"poster_ids": [123, 124, 125], "user_id": "user_test"}'

# 预期: HTTP 200, 返回3个海报的点赞状态
```

---

## 🎯 与现有 API 的对比

| 操作 | 通用 /mysql/query | 专用端点 |
|------|-------------------|----------|
| 点赞 | POST /mysql/query<br>{sql: "INSERT..."} | POST /posters/like<br>{poster_id, user_id} |
| 灵活性 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐ 中 |
| 安全性 | ⭐⭐ 低（暴露SQL） | ⭐⭐⭐⭐⭐ 高 |
| 易用性 | ⭐⭐ 低（需要写SQL） | ⭐⭐⭐⭐⭐ 高 |
| 性能优化 | ⭐⭐ 难 | ⭐⭐⭐⭐ 易 |
| 参数验证 | ⭐⭐ 前端负责 | ⭐⭐⭐⭐⭐ 后端统一 |

**推荐**: 如果 letmetry.cloud 支持添加专用端点，强烈推荐使用专用端点。

---

## 📌 GitHub Issue 模板

可以在 https://github.com/jackandking/letmetry_web_service/issues 创建以下 Issue：

---

**Issue 标题**: [Feature Request] 添加点赞功能专用 API 端点

**Issue 内容**:

### 需求概述

为 MuseumCheck 的成就海报点赞功能添加专用 API 端点，替代通用的 `/mysql/query` 端点。

### 背景

当前使用 `/mysql/query` 端点虽然灵活，但存在以下问题：
- SQL 语句暴露在前端，安全性较低
- 参数验证由前端负责，容易出错
- 难以针对性优化性能
- 代码可读性差

### 需要的端点

#### 1. 点赞端点
- **路径**: `POST /api/v1/posters/like`
- **参数**: `{poster_id: number, user_id: string}`
- **返回**: `{success: boolean, data: {like_count: number}, message: string}`

#### 2. 取消点赞端点
- **路径**: `POST /api/v1/posters/unlike`
- **参数**: `{poster_id: number, user_id: string}`
- **返回**: `{success: boolean, data: {like_count: number}, message: string}`

#### 3. 批量查询点赞状态
- **路径**: `POST /api/v1/posters/like-status`
- **参数**: `{poster_ids: number[], user_id: string}`
- **返回**: `{success: boolean, data: [{poster_id, like_count, user_has_liked}]}`

#### 4. 获取点赞用户列表（可选）
- **路径**: `GET /api/v1/posters/{poster_id}/likers?limit=50&offset=0`
- **返回**: 点赞用户列表和分页信息

#### 5. 获取热门海报（可选）
- **路径**: `GET /api/v1/posters/trending?limit=50&time_range=7d`
- **返回**: 点赞数最多的海报列表

### 详细规范

完整 API 规范文档：[like-feature-letmetry-api-spec.md](链接到本文档)

### 优先级

- P0（必需）: 端点 1, 2, 3
- P1（推荐）: 端点 4, 5

### 预期收益

- ✅ 提高安全性（隐藏 SQL 细节）
- ✅ 简化前端代码（无需编写 SQL）
- ✅ 统一参数验证
- ✅ 便于后端性能优化
- ✅ 更好的可维护性

---

## 📞 联系方式

如有疑问，请在以下位置讨论：
- GitHub Issue: https://github.com/jackandking/letmetry_web_service/issues
- PR 评论: https://github.com/jackandking/MuseumCheck/pull/[PR编号]

---

**文档维护者**: GitHub Copilot  
**创建日期**: 2026-02-07  
**版本**: v1.0  
**状态**: ✅ 完成，待评审
