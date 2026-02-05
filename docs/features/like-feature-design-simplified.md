# 点赞功能设计文档（简化版）
## "大家的成就"页面点赞系统

**文档类型**: 设计文档（Design-Only，不包含实现）  
**目标页面**: everyone-achievements.html  
**创建日期**: 2026-02-05  
**设计版本**: v2.0 - Simplified for Low Traffic

---

## 📋 执行摘要

本文档是针对低流量场景的简化设计方案。相比完整版本，简化版：
- ✅ **仅使用 `/mysql/query` API**（不使用 insert/delete 专用端点）
- ✅ **简化数据库结构**（2个表而非3个）
- ✅ **移除复杂功能**（暂不实现通知系统和用户列表）
- ✅ **降低开发成本**（6-8天而非12-17天）

### 核心功能（MVP）
- ❤️ 点赞/取消点赞成就海报
- 📊 实时显示点赞数量

### 移除的功能（未来扩展）
- ~~👤 显示点赞用户列表~~
- ~~🔔 点赞通知系统~~
- ~~📈 点赞排行榜~~

---

## 🎨 一、用户体验设计（简化版）

### 1.1 视觉设计

#### 点赞按钮（简化）
```
┌─────────────────────────────────────┐
│  成就海报卡片                        │
│  ┌─────────────────────────────┐    │
│  │     [海报图片]               │   │
│  │                              │   │
│  └─────────────────────────────┘    │
│  标题：完成故宫博物院参观            │
│  作者：张三 · 2026-02-05            │
│  ┌─────────┐                        │
│  │ ❤️ 12  │  (仅点赞按钮)          │
│  └─────────┘                        │
└─────────────────────────────────────┘
```

#### 点赞按钮状态
1. **未点赞状态**: 🤍 + 数字（灰色）
2. **已点赞状态**: ❤️ + 数字（红色）
3. **加载状态**: ⏳（禁用交互）

### 1.2 交互流程（简化）

```
用户点击点赞按钮
    ↓
立即更新UI (乐观更新)
├─ 按钮变色
└─ 点赞数 ±1
    ↓
发送 /mysql/query API 请求
    ↓
[成功] 保持UI状态
[失败] 回滚UI + 显示错误
```

---

## 🏗️ 二、系统架构（简化版）

### 2.1 架构概览

```
┌────────────────────────────────────────────────┐
│            前端层 (Frontend)                    │
├────────────────────────────────────────────────┤
│  everyone-achievements.html                    │
│  └─ LikeButton Component (点赞按钮)            │
└────────────────────┬───────────────────────────┘
                     │ HTTP REST API
                     ↓
┌────────────────────────────────────────────────┐
│           API层 (Letmetry Cloud)               │
├────────────────────────────────────────────────┤
│  /mysql/query  - 所有操作（查询、点赞、取消）  │
└────────────────────┬───────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────┐
│            数据库层 (MySQL)                     │
├────────────────────────────────────────────────┤
│  achievement_posters (成就海报表 - 已存在)     │
│  poster_likes (点赞记录表 - NEW)               │
└────────────────────────────────────────────────┘
```

**简化要点**:
- ✅ 仅1个API端点（`/mysql/query`）
- ✅ 仅1个前端组件（LikeButton）
- ✅ 仅2个数据库表（移除通知表）

---

## 💾 三、数据库设计（简化版）

### 3.1 表结构

#### 1. 修改现有表: achievement_posters
```sql
-- 添加点赞数缓存字段（可选，低流量下可直接COUNT）
ALTER TABLE achievement_posters 
ADD COLUMN like_count INT DEFAULT 0 COMMENT '点赞数缓存（可选）';
```

**注意**: 低流量下，`like_count` 字段可选。可以直接从 `poster_likes` 表 COUNT。

#### 2. 新建表: poster_likes（简化）
```sql
CREATE TABLE poster_likes (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞记录ID',
  poster_id INT NOT NULL COMMENT '海报ID',
  user_id VARCHAR(100) NOT NULL COMMENT '用户ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  
  -- 唯一索引：防止重复点赞
  UNIQUE KEY uk_poster_user (poster_id, user_id),
  
  -- 查询索引
  INDEX idx_poster_id (poster_id)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 
  COMMENT='成就海报点赞记录表';
```

**简化要点**:
- ✅ 移除外键约束（低流量下不必要，减少复杂度）
- ✅ 减少索引数量（仅保留必要索引）
- ✅ 移除通知表（暂不实现通知功能）

### 3.2 查询设计（使用 /mysql/query）

#### 查询1: 获取海报列表和点赞状态（批量）
```sql
SELECT 
  p.id,
  p.image_url,
  p.title,
  p.user_name,
  p.created_at,
  (SELECT COUNT(*) FROM poster_likes WHERE poster_id = p.id) AS like_count,
  EXISTS(SELECT 1 FROM poster_likes WHERE poster_id = p.id AND user_id = ?) AS user_has_liked
FROM achievement_posters p
WHERE p.visibility = 'public'
ORDER BY p.created_at DESC
LIMIT 100;
```

**API调用**:
```javascript
const response = await fetch('https://letmetry.cloud/mysql/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sql: "SELECT p.id, (SELECT COUNT(*) FROM poster_likes WHERE poster_id = p.id) AS like_count, EXISTS(SELECT 1 FROM poster_likes WHERE poster_id = p.id AND user_id = ?) AS user_has_liked FROM achievement_posters p WHERE p.visibility = 'public' LIMIT 100",
    params: [userId]
  })
});
```

#### 查询2: 点赞操作（INSERT）
```sql
-- 点赞：插入记录（如果不存在）
INSERT INTO poster_likes (poster_id, user_id) 
VALUES (?, ?)
ON DUPLICATE KEY UPDATE id = id;
```

**API调用**:
```javascript
const response = await fetch('https://letmetry.cloud/mysql/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sql: "INSERT INTO poster_likes (poster_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id",
    params: [posterId, userId]
  })
});
```

#### 查询3: 取消点赞（DELETE）
```sql
-- 取消点赞：删除记录
DELETE FROM poster_likes 
WHERE poster_id = ? AND user_id = ?;
```

**API调用**:
```javascript
const response = await fetch('https://letmetry.cloud/mysql/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sql: "DELETE FROM poster_likes WHERE poster_id = ? AND user_id = ?",
    params: [posterId, userId]
  })
});
```

---

## 🔌 四、API设计（仅使用 /mysql/query）

### 4.1 统一API端点

**唯一端点**: `POST /mysql/query`

所有操作（查询、插入、删除）都通过此端点，传递不同的SQL语句。

### 4.2 API封装

```javascript
// js/like-api-simple.js
const SimpleLikeAPI = {
  // 点赞
  async likePoster(posterId, userId) {
    const response = await fetch('https://letmetry.cloud/mysql/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sql: "INSERT INTO poster_likes (poster_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id",
        params: [posterId, userId]
      })
    });
    return await response.json();
  },
  
  // 取消点赞
  async unlikePoster(posterId, userId) {
    const response = await fetch('https://letmetry.cloud/mysql/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sql: "DELETE FROM poster_likes WHERE poster_id = ? AND user_id = ?",
        params: [posterId, userId]
      })
    });
    return await response.json();
  },
  
  // 获取点赞状态（批量）
  async getLikeStatus(userId) {
    const response = await fetch('https://letmetry.cloud/mysql/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sql: "SELECT p.id, (SELECT COUNT(*) FROM poster_likes WHERE poster_id = p.id) AS like_count, EXISTS(SELECT 1 FROM poster_likes WHERE poster_id = p.id AND user_id = ?) AS user_has_liked FROM achievement_posters p WHERE p.visibility = 'public' ORDER BY p.created_at DESC LIMIT 100",
        params: [userId]
      })
    });
    return await response.json();
  }
};
```

---

## 💻 五、前端实现（简化版）

### 5.1 LikeButton 组件（简化）

```javascript
/**
 * 简化的点赞按钮组件
 */
class SimpleLikeButton {
  constructor(posterId, initialLikeCount, initialLiked) {
    this.posterId = posterId;
    this.likeCount = initialLikeCount || 0;
    this.isLiked = initialLiked || false;
    this.isLoading = false;
  }
  
  // 渲染按钮
  render() {
    const icon = this.isLoading ? '⏳' : (this.isLiked ? '❤️' : '🤍');
    const color = this.isLiked ? '#ff4444' : '#888';
    
    return `
      <button class="like-button-simple" 
              data-poster-id="${this.posterId}"
              style="color: ${color}"
              ${this.isLoading ? 'disabled' : ''}>
        <span class="like-icon">${icon}</span>
        ${this.likeCount > 0 ? `<span class="like-count">${this.likeCount}</span>` : ''}
      </button>
    `;
  }
  
  // 点击处理（乐观更新）
  async handleClick() {
    if (this.isLoading) return;
    
    // 保存之前的状态（用于回滚）
    const previousLiked = this.isLiked;
    const previousCount = this.likeCount;
    
    // 乐观更新UI
    this.isLiked = !this.isLiked;
    this.likeCount += this.isLiked ? 1 : -1;
    this.updateUI();
    
    // 发送请求
    this.isLoading = true;
    try {
      if (this.isLiked) {
        await SimpleLikeAPI.likePoster(this.posterId, getUserId());
      } else {
        await SimpleLikeAPI.unlikePoster(this.posterId, getUserId());
      }
      // 成功 - UI已更新
    } catch (error) {
      // 失败 - 回滚UI
      this.isLiked = previousLiked;
      this.likeCount = previousCount;
      this.updateUI();
      alert('操作失败，请重试');
    } finally {
      this.isLoading = false;
      this.updateUI();
    }
  }
  
  // 更新UI
  updateUI() {
    const button = document.querySelector(`[data-poster-id="${this.posterId}"]`);
    if (button) {
      button.outerHTML = this.render();
      // 重新绑定事件
      const newButton = document.querySelector(`[data-poster-id="${this.posterId}"]`);
      newButton.addEventListener('click', () => this.handleClick());
    }
  }
}

// 用户ID管理（localStorage）
function getUserId() {
  let userId = localStorage.getItem('museumcheck_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('museumcheck_user_id', userId);
  }
  return userId;
}
```

### 5.2 CSS样式（简化）

```css
/* 简化的点赞按钮样式 */
.like-button-simple {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid currentColor;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.like-button-simple:hover {
  transform: scale(1.05);
}

.like-button-simple:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.like-icon {
  font-size: 16px;
  line-height: 1;
}

.like-count {
  font-weight: 500;
}
```

---

## 🔒 六、安全性（简化版）

### 6.1 防刷赞（简化）

#### 前端防抖（300ms）
```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 应用防抖
button.addEventListener('click', debounce(() => handleLike(), 300));
```

#### 数据库唯一索引
```sql
UNIQUE KEY uk_poster_user (poster_id, user_id)
```

**简化要点**:
- ✅ 移除复杂的速率限制（低流量下不必要）
- ✅ 依赖数据库唯一索引防止重复
- ✅ 仅保留前端防抖

---

## ⚡ 七、性能优化（简化版）

### 7.1 批量加载（简化）

```javascript
// 页面加载时一次性获取所有点赞状态
async function loadPostersWithLikes() {
  const userId = getUserId();
  const data = await SimpleLikeAPI.getLikeStatus(userId);
  
  // 渲染海报和点赞按钮
  data.forEach(poster => {
    renderPosterCard(poster);
  });
}
```

### 7.2 缓存策略（可选）

```javascript
// 低流量下可以不使用缓存，或仅使用简单的内存缓存
const likeCache = new Map();

function getCachedLikeStatus(posterId) {
  return likeCache.get(posterId);
}

function setCachedLikeStatus(posterId, status) {
  likeCache.set(posterId, status);
}
```

**简化要点**:
- ✅ 移除多层缓存（低流量下不必要）
- ✅ 可选使用简单的内存缓存
- ✅ 主要依赖数据库查询（性能足够）

---

## 🚀 八、实施计划（简化版）

### 8.1 开发阶段

**总计**: 6-8个工作日

| 阶段 | 任务 | 工期 |
|------|------|------|
| 阶段1 | 数据库准备 | 1天 |
| 阶段2 | 前端开发 | 3-4天 |
| 阶段3 | 测试和上线 | 2-3天 |

#### 阶段1: 数据库准备 (1天)
- [ ] 创建 poster_likes 表
- [ ] （可选）修改 achievement_posters 表添加 like_count
- [ ] 创建唯一索引

#### 阶段2: 前端开发 (3-4天)
- [ ] 实现 SimpleLikeButton 组件
- [ ] 实现 SimpleLikeAPI 模块
- [ ] 集成到 everyone-achievements.html
- [ ] CSS样式和基础动画

#### 阶段3: 测试和上线 (2-3天)
- [ ] 功能测试
- [ ] 防刷赞测试
- [ ] 性能测试
- [ ] 上线

---

## 📊 九、与完整版的对比

| 功能/特性 | 完整版 | 简化版 |
|----------|--------|--------|
| 点赞/取消点赞 | ✅ | ✅ |
| 显示点赞数 | ✅ | ✅ |
| 点赞用户列表 | ✅ | ❌ |
| 点赞通知 | ✅ | ❌ |
| 点赞排行榜 | ✅ | ❌ |
| API端点数量 | 6个 | 1个 |
| 数据库表数量 | 3个 | 2个 |
| 前端组件 | 3个 | 1个 |
| 开发周期 | 12-17天 | 6-8天 |
| 缓存策略 | 3层 | 可选 |
| 速率限制 | 3层 | 1层 |

---

## ✅ 十、成功指标（简化版）

### 10.1 技术指标

- ✅ API响应时间 < 1s (P95)
- ✅ 点赞操作成功率 > 95%
- ✅ 页面加载时间增加 < 500ms

### 10.2 业务指标

- 📈 用户参与度：点赞用户 > 10% 活跃用户
- 📈 内容互动：平均每个海报 > 2 点赞

---

## 🔄 十一、未来扩展路径

当流量增长时，可以逐步升级：

### 第一阶段（当前）- MVP
- ✅ 基础点赞功能
- ✅ 仅使用 /mysql/query API
- ✅ 2个数据库表

### 第二阶段 - 流量增长
- 🔜 添加 like_count 缓存字段
- 🔜 添加内存缓存
- 🔜 优化批量查询

### 第三阶段 - 功能扩展
- 🔜 添加点赞通知表
- 🔜 实现通知功能
- 🔜 添加点赞用户列表

### 第四阶段 - 完整版本
- 🔜 使用专用 insert/delete API
- 🔜 3层缓存策略
- 🔜 完整的点赞排行榜

---

## 📝 十二、待讨论问题

1. **是否需要 like_count 缓存字段？**
   - 低流量：可以不要，直接 COUNT
   - 建议：先不加，等流量增长后再添加

2. **是否需要内存缓存？**
   - 低流量：不需要
   - 建议：先不加，简化开发

3. **用户身份系统**
   - 当前：localStorage 匿名ID
   - 未来：可集成登录系统

---

**文档状态**: ✅ 简化设计完成  
**适用场景**: 低流量（<1000日活）  
**优势**: 开发快、成本低、易维护  
**升级路径**: 清晰的扩展计划  

---

**维护者**: GitHub Copilot  
**创建日期**: 2026-02-05  
**版本**: v2.0 Simplified
