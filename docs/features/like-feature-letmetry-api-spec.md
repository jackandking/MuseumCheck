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

## 📊 数据库表结构要求（完整方案）

### 概述

点赞功能需要以下数据库变更：
1. **新建表**: `poster_likes` - 存储点赞记录
2. **可选新建表**: `like_notifications` - 存储点赞通知（如需通知功能）
3. **修改现有表**: `achievement_posters` - 添加点赞数缓存字段（性能优化）

---

### 表1: poster_likes（点赞记录表）- **必需**

#### 完整 DDL

```sql
CREATE TABLE IF NOT EXISTS poster_likes (
  -- 主键
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '点赞记录ID',
  
  -- 核心字段
  poster_id INT UNSIGNED NOT NULL COMMENT '海报ID，关联 achievement_posters.id',
  user_id VARCHAR(100) NOT NULL COMMENT '用户ID，匿名用户或登录用户的唯一标识',
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  
  -- 唯一约束：一个用户只能对同一海报点赞一次
  UNIQUE KEY uk_poster_user (poster_id, user_id),
  
  -- 性能索引
  INDEX idx_poster_id (poster_id) COMMENT '按海报查询点赞',
  INDEX idx_user_id (user_id) COMMENT '按用户查询点赞历史',
  INDEX idx_created_at (created_at) COMMENT '按时间排序（最近点赞）'
  
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='成就海报点赞记录表';
```

#### 字段详细说明

| 字段名 | 类型 | 约束 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | INT UNSIGNED | PK, AUTO_INCREMENT | 点赞记录唯一ID | 1, 2, 3... |
| poster_id | INT UNSIGNED | NOT NULL | 海报ID（外键关联） | 123 |
| user_id | VARCHAR(100) | NOT NULL | 用户唯一标识 | "user_abc_123" |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 点赞时间 | "2026-02-07 10:30:00" |
| updated_at | DATETIME | ON UPDATE | 记录更新时间 | "2026-02-07 10:30:00" |

#### 索引说明

| 索引名 | 类型 | 字段 | 用途 | 预估查询性能 |
|--------|------|------|------|--------------|
| PRIMARY | 主键 | id | 唯一标识 | O(1) |
| uk_poster_user | 唯一索引 | (poster_id, user_id) | 防止重复点赞 | O(log n) |
| idx_poster_id | 普通索引 | poster_id | 查询某海报的所有点赞 | O(log n) |
| idx_user_id | 普通索引 | user_id | 查询某用户的点赞历史 | O(log n) |
| idx_created_at | 普通索引 | created_at | 按时间排序查询 | O(log n) |

#### 数据示例

```sql
-- 插入示例数据
INSERT INTO poster_likes (poster_id, user_id) VALUES
(123, 'user_abc_123'),
(123, 'user_xyz_456'),
(124, 'user_abc_123'),
(125, 'user_def_789');

-- 查询示例
SELECT * FROM poster_likes WHERE poster_id = 123;  -- 海报123的所有点赞
SELECT * FROM poster_likes WHERE user_id = 'user_abc_123';  -- 用户的点赞历史
```

---

### 表2: achievement_posters（修改现有表）- **推荐但可选**

#### 修改目的

添加 `like_count` 缓存字段，避免每次都 COUNT 查询，提升性能。

#### DDL - 添加字段

```sql
-- 步骤1: 添加点赞数缓存字段
ALTER TABLE achievement_posters 
ADD COLUMN like_count INT UNSIGNED DEFAULT 0 
COMMENT '点赞数缓存（冗余字段，提升查询性能）'
AFTER visibility;

-- 步骤2: 添加索引以支持排行榜查询
ALTER TABLE achievement_posters 
ADD INDEX idx_like_count (like_count DESC)
COMMENT '点赞数排序索引（用于热门排行）';

-- 步骤3: 初始化现有数据的点赞数（如果表中已有数据）
UPDATE achievement_posters p
SET like_count = (
  SELECT COUNT(*) 
  FROM poster_likes l 
  WHERE l.poster_id = p.id
);
```

#### 字段说明

| 字段名 | 类型 | 约束 | 说明 | 何时更新 |
|--------|------|------|------|----------|
| like_count | INT UNSIGNED | DEFAULT 0 | 点赞数缓存 | 每次点赞/取消点赞时 +1/-1 |

#### 数据一致性保证

**方案1: 应用层维护（推荐）**
```sql
-- 点赞时
BEGIN;
INSERT INTO poster_likes (poster_id, user_id) VALUES (?, ?);
UPDATE achievement_posters SET like_count = like_count + 1 WHERE id = ?;
COMMIT;

-- 取消点赞时
BEGIN;
DELETE FROM poster_likes WHERE poster_id = ? AND user_id = ?;
UPDATE achievement_posters SET like_count = like_count - 1 WHERE id = ?;
COMMIT;
```

**方案2: 数据库触发器（备选）**
```sql
-- 创建触发器：点赞时自动 +1
DELIMITER $$
CREATE TRIGGER trg_after_like_insert
AFTER INSERT ON poster_likes
FOR EACH ROW
BEGIN
  UPDATE achievement_posters 
  SET like_count = like_count + 1 
  WHERE id = NEW.poster_id;
END$$

-- 创建触发器：取消点赞时自动 -1
CREATE TRIGGER trg_after_like_delete
AFTER DELETE ON poster_likes
FOR EACH ROW
BEGIN
  UPDATE achievement_posters 
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = OLD.poster_id;
END$$
DELIMITER ;
```

**推荐**: 使用应用层维护，更灵活，易于测试和调试。

#### 定期数据修复（可选）

```sql
-- 定时任务：每天凌晨修复不一致的数据
UPDATE achievement_posters p
SET like_count = (
  SELECT COUNT(*) 
  FROM poster_likes l 
  WHERE l.poster_id = p.id
)
WHERE like_count != (
  SELECT COUNT(*) 
  FROM poster_likes l 
  WHERE l.poster_id = p.id
);
```

---

### 表3: like_notifications（点赞通知表）- **可选**

#### 完整 DDL

```sql
CREATE TABLE IF NOT EXISTS like_notifications (
  -- 主键
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '通知ID',
  
  -- 关联字段
  poster_id INT UNSIGNED NOT NULL COMMENT '海报ID',
  poster_owner_id VARCHAR(100) NOT NULL COMMENT '海报作者ID（接收通知的人）',
  liker_user_id VARCHAR(100) NOT NULL COMMENT '点赞用户ID（触发通知的人）',
  liker_user_name VARCHAR(100) DEFAULT NULL COMMENT '点赞用户昵称（冗余，避免JOIN）',
  
  -- 通知状态
  is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
  read_at DATETIME DEFAULT NULL COMMENT '阅读时间',
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '通知创建时间',
  
  -- 性能索引
  INDEX idx_owner_unread (poster_owner_id, is_read, created_at DESC) 
    COMMENT '查询用户未读通知（复合索引）',
  INDEX idx_poster_id (poster_id) COMMENT '按海报查询通知',
  INDEX idx_created_at (created_at) COMMENT '按时间排序'
  
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='点赞通知表';
```

#### 字段详细说明

| 字段名 | 类型 | 约束 | 说明 | 示例值 |
|--------|------|------|------|--------|
| id | INT UNSIGNED | PK, AUTO_INCREMENT | 通知唯一ID | 1, 2, 3... |
| poster_id | INT UNSIGNED | NOT NULL | 海报ID | 123 |
| poster_owner_id | VARCHAR(100) | NOT NULL | 海报作者ID | "user_owner_123" |
| liker_user_id | VARCHAR(100) | NOT NULL | 点赞用户ID | "user_abc_456" |
| liker_user_name | VARCHAR(100) | NULL | 点赞用户昵称 | "张三" |
| is_read | BOOLEAN | DEFAULT FALSE | 是否已读 | false |
| read_at | DATETIME | NULL | 阅读时间 | "2026-02-07 11:00:00" |
| created_at | DATETIME | DEFAULT NOW | 创建时间 | "2026-02-07 10:30:00" |

#### 业务逻辑

```sql
-- 创建通知（点赞时）
INSERT INTO like_notifications 
  (poster_id, poster_owner_id, liker_user_id, liker_user_name)
SELECT 
  ?, 
  p.user_name, 
  ?, 
  ?
FROM achievement_posters p
WHERE p.id = ?;

-- 获取未读通知
SELECT 
  n.id,
  n.poster_id,
  n.liker_user_name,
  n.created_at,
  p.title AS poster_title
FROM like_notifications n
JOIN achievement_posters p ON n.poster_id = p.id
WHERE n.poster_owner_id = ?
  AND n.is_read = FALSE
ORDER BY n.created_at DESC
LIMIT 20;

-- 标记已读
UPDATE like_notifications 
SET is_read = TRUE, read_at = NOW()
WHERE id = ?;
```

---

## 🔧 数据库迁移脚本

### 完整迁移脚本（MySQL）

```sql
-- ============================================
-- MuseumCheck 点赞功能数据库迁移脚本
-- 版本: v1.0
-- 创建日期: 2026-02-07
-- ============================================

-- 步骤1: 创建点赞记录表
CREATE TABLE IF NOT EXISTS poster_likes (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '点赞记录ID',
  poster_id INT UNSIGNED NOT NULL COMMENT '海报ID',
  user_id VARCHAR(100) NOT NULL COMMENT '用户ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_poster_user (poster_id, user_id),
  INDEX idx_poster_id (poster_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 步骤2: 修改现有表（添加缓存字段）
ALTER TABLE achievement_posters 
ADD COLUMN IF NOT EXISTS like_count INT UNSIGNED DEFAULT 0 
COMMENT '点赞数缓存';

ALTER TABLE achievement_posters 
ADD INDEX IF NOT EXISTS idx_like_count (like_count DESC);

-- 步骤3: 创建通知表（可选）
CREATE TABLE IF NOT EXISTS like_notifications (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  poster_id INT UNSIGNED NOT NULL,
  poster_owner_id VARCHAR(100) NOT NULL,
  liker_user_id VARCHAR(100) NOT NULL,
  liker_user_name VARCHAR(100) DEFAULT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_owner_unread (poster_owner_id, is_read, created_at DESC),
  INDEX idx_poster_id (poster_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 步骤4: 验证表创建
SELECT 'poster_likes' AS table_name, COUNT(*) AS row_count FROM poster_likes
UNION ALL
SELECT 'like_notifications', COUNT(*) FROM like_notifications;

-- 步骤5: 记录迁移历史（建议创建迁移记录表）
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  description VARCHAR(255),
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO schema_migrations (version, description) 
VALUES ('2026020701', '添加点赞功能相关表');
```

### 回滚脚本（如需要）

```sql
-- ============================================
-- 回滚脚本：移除点赞功能
-- 警告：会删除所有点赞数据！
-- ============================================

-- 步骤1: 删除通知表
DROP TABLE IF EXISTS like_notifications;

-- 步骤2: 删除点赞记录表
DROP TABLE IF EXISTS poster_likes;

-- 步骤3: 移除缓存字段
ALTER TABLE achievement_posters DROP COLUMN IF EXISTS like_count;
ALTER TABLE achievement_posters DROP INDEX IF EXISTS idx_like_count;

-- 步骤4: 删除迁移记录
DELETE FROM schema_migrations WHERE version = '2026020701';
```

---

## 📈 数据库性能优化建议

### 1. 索引优化

```sql
-- 分析索引使用情况
EXPLAIN SELECT * FROM poster_likes WHERE poster_id = 123;
EXPLAIN SELECT COUNT(*) FROM poster_likes WHERE poster_id = 123;

-- 查看索引统计
SHOW INDEX FROM poster_likes;
```

### 2. 查询优化

```sql
-- 优化前：使用子查询 COUNT（慢）
SELECT 
  p.*,
  (SELECT COUNT(*) FROM poster_likes WHERE poster_id = p.id) AS like_count
FROM achievement_posters p;

-- 优化后：使用缓存字段（快）
SELECT p.*, p.like_count 
FROM achievement_posters p;

-- 优化前：JOIN + COUNT（慢）
SELECT p.*, COUNT(l.id) AS like_count
FROM achievement_posters p
LEFT JOIN poster_likes l ON p.id = l.poster_id
GROUP BY p.id;

-- 优化后：直接读缓存（快）
SELECT p.*, p.like_count 
FROM achievement_posters p;
```

### 3. 分区表（高流量场景）

```sql
-- 如果点赞记录超过千万级别，考虑按时间分区
ALTER TABLE poster_likes 
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

---

## 🔍 数据完整性检查

### 检查脚本

```sql
-- 检查1: 验证唯一约束（不应该有重复点赞）
SELECT poster_id, user_id, COUNT(*) AS duplicate_count
FROM poster_likes
GROUP BY poster_id, user_id
HAVING COUNT(*) > 1;
-- 预期结果：空（无重复）

-- 检查2: 验证 like_count 缓存一致性
SELECT 
  p.id,
  p.like_count AS cached_count,
  COUNT(l.id) AS actual_count,
  p.like_count - COUNT(l.id) AS difference
FROM achievement_posters p
LEFT JOIN poster_likes l ON p.id = l.poster_id
GROUP BY p.id
HAVING difference != 0;
-- 预期结果：空（缓存与实际一致）

-- 检查3: 验证是否有孤立的点赞记录（海报已删除）
SELECT l.* 
FROM poster_likes l
LEFT JOIN achievement_posters p ON l.poster_id = p.id
WHERE p.id IS NULL;
-- 预期结果：空（无孤立记录）
```

---

## 💾 备份和恢复建议

### 备份策略

```bash
# 1. 备份点赞相关表
mysqldump -u username -p database_name \
  poster_likes like_notifications \
  > like_feature_backup_$(date +%Y%m%d).sql

# 2. 仅备份表结构
mysqldump -u username -p --no-data database_name \
  poster_likes like_notifications \
  > like_feature_schema.sql

# 3. 恢复
mysql -u username -p database_name < like_feature_backup_20260207.sql
```

### 数据归档（可选）

```sql
-- 归档6个月前的点赞记录（如需要）
CREATE TABLE poster_likes_archive LIKE poster_likes;

INSERT INTO poster_likes_archive
SELECT * FROM poster_likes
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

DELETE FROM poster_likes
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
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
