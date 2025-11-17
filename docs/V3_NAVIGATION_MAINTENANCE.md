# 博物馆导览功能维护指南 (V3 Navigation Support Maintenance Guide)

## 概述 (Overview)

本文档说明如何为博物馆添加导览功能（🧭 导览按钮），以及如何避免类似问题的发生。

This document explains how to add navigation functionality (🧭 Navigation button) for museums and how to prevent similar issues from occurring.

## 问题背景 (Issue Background)

**问题**: 上海博物馆等博物馆在主页没有显示导览按钮，导致用户无法进入单页导览模式。

**原因**: 博物馆虽然在 `museums-data.js` 中有 `collections` 数据（镇馆之宝），但没有被添加到 `V3_SUPPORTED` 列表中。

**Issue**: Museums like Shanghai Museum were missing the navigation button on the homepage, preventing users from accessing the single-page navigation mode.

**Cause**: While museums had `collections` data (treasures) in `museums-data.js`, they were not added to the `V3_SUPPORTED` list.

## 导览功能要求 (Navigation Feature Requirements)

一个博物馆需要满足以下条件才能启用导览功能：

A museum needs to meet the following requirements to enable navigation functionality:

### 1. 数据要求 (Data Requirements)

**必需 (Required)**:
- 博物馆必须在 `museums-data.js` 中有 `collections` 数组数据
- `collections` 中应包含至少 1 个镇馆之宝，每个包含：
  - `name`: 宝物名称
  - `description`: 宝物描述
  - `imageUrl`: 宝物图片链接（可选，但推荐）

**Example**:
```javascript
{
  id: 'shanghai-museum',
  name: '上海博物馆',
  location: '上海',
  description: '以古代艺术为主的综合性博物馆',
  tags: ['艺术', '文物', '收藏'],
  collections: [
    {
      name: '大克鼎',
      imageUrl: 'https://example.com/da-ke-ding.jpg',
      description: '西周晚期青铜器，高93.1厘米...'
    },
    // ... more treasures
  ],
  checklists: {
    // ... checklists data
  }
}
```

### 2. 代码配置 (Code Configuration)

**必需 (Required)** - 在两个文件中添加博物馆 ID：

1. **`script.js`** - 用于在主页显示导览按钮
2. **`single-museum.js`** - 用于导览页面功能

**两个列表必须保持一致！** (The two lists MUST be kept in sync!)

## 添加新博物馆导览支持 (Adding Navigation Support for New Museums)

### 步骤 1: 准备数据 (Step 1: Prepare Data)

确保博物馆在 `museums-data.js` 中有完整的 `collections` 数据。

Ensure the museum has complete `collections` data in `museums-data.js`.

### 步骤 2: 更新 V3_SUPPORTED 列表 (Step 2: Update V3_SUPPORTED Lists)

在 **两个文件** 中添加博物馆 ID：

Add the museum ID in **both files**:

#### 文件 1: `script.js`

找到 `V3_SUPPORTED` 数组（约 5962 行），添加博物馆 ID：

```javascript
const V3_SUPPORTED = [
  'forbidden-city',
  'national-museum',
  'shanghai-museum',  // ← 添加新博物馆 ID
  // ... other museums
];
```

#### 文件 2: `single-museum.js`

找到 `V3_SUPPORTED` 数组（约 14 行），添加**相同的**博物馆 ID：

```javascript
const V3_SUPPORTED = [
  'forbidden-city',
  'national-museum',
  'shanghai-museum',  // ← 添加新博物馆 ID
  // ... other museums
];
```

### 步骤 3: 验证更改 (Step 3: Validate Changes)

运行验证脚本确保一致性：

Run the validation script to ensure consistency:

```bash
node tools/validate-v3-support.js
```

**预期输出 (Expected Output)**:
```
✓ V3_SUPPORTED lists are consistent between script.js and single-museum.js
✓ No duplicate entries found
✓ All museums with collections are in V3_SUPPORTED
✓ All validations PASSED! ✨
```

### 步骤 4: 测试功能 (Step 4: Test Functionality)

1. 启动本地服务器：
   ```bash
   python3 -m http.server 8000
   ```

2. 访问 http://localhost:8000

3. 验证：
   - ✅ 博物馆卡片上显示 🧭 导览 按钮
   - ✅ 点击导览按钮跳转到 `single-museum.html?museum={museum-id}`
   - ✅ 导览页面正确显示镇馆之宝和工作流

## 自动化检查 (Automated Checks)

### 使用验证工具 (Using the Validation Tool)

验证工具会自动检查：

The validation tool automatically checks:

1. ✅ `script.js` 和 `single-museum.js` 中的 `V3_SUPPORTED` 列表是否一致
2. ✅ 没有重复条目
3. ✅ 所有有 `collections` 数据的博物馆都在 `V3_SUPPORTED` 中

**运行验证**:
```bash
cd /home/runner/work/MuseumCheck/MuseumCheck
node tools/validate-v3-support.js
```

**集成到 CI/CD**:
在 `.github/workflows/` 中添加此步骤可以自动检测问题：

```yaml
- name: Validate V3 Support
  run: node tools/validate-v3-support.js
```

## 常见问题 (FAQ)

### Q1: 为什么需要在两个文件中都添加？

**A**: `script.js` 控制主页按钮显示，`single-museum.js` 控制导览页面功能。两者必须一致才能确保用户体验完整。

**A**: `script.js` controls the homepage button display, while `single-museum.js` controls the navigation page functionality. Both must be consistent to ensure complete user experience.

### Q2: 博物馆没有 collections 数据可以添加导览吗？

**A**: 可以！`treasure-workflow-generator.js` 会为没有 collections 的博物馆自动生成占位符宝物。例如 `pinghu-museum` 就是这种情况。

**A**: Yes! The `treasure-workflow-generator.js` will automatically generate placeholder treasures for museums without collections data. `pinghu-museum` is an example of this.

### Q3: 如何批量检查所有博物馆的导览支持状态？

**A**: 使用验证工具：
```bash
node tools/validate-v3-support.js
```

它会列出：
- 有 collections 但没有导览支持的博物馆
- 有导览支持但没有 collections 的博物馆（使用生成器）

### Q4: 我添加了新博物馆，如何确保它有导览功能？

**A**: 按照本文档的步骤：
1. 在 `museums-data.js` 中添加 collections 数据（推荐）
2. 在 `script.js` 和 `single-museum.js` 的 `V3_SUPPORTED` 中添加博物馆 ID
3. 运行 `node tools/validate-v3-support.js` 验证
4. 测试功能

## 已修复的博物馆列表 (Fixed Museums List)

以下博物馆在本次修复中被添加到 V3_SUPPORTED：

The following museums were added to V3_SUPPORTED in this fix:

1. **上海博物馆** (`shanghai-museum`) - 主要修复对象
2. **秦始皇帝陵博物院** (`terracotta-warriors`)
3. **南京博物院** (`nanjing-museum`)
4. **湖北省博物馆** (`hubei-museum`)
5. **陕西历史博物馆** (`shaanxi-history`)
6. **兰州市博物馆** (`lanzhou-museum`)

## 维护最佳实践 (Maintenance Best Practices)

1. **添加新博物馆时**:
   - 如果有 collections 数据，立即添加到 V3_SUPPORTED
   - 运行验证工具确认

2. **定期检查**:
   - 每次添加新博物馆后运行验证工具
   - 定期审查是否有新博物馆需要导览支持

3. **代码审查**:
   - PR 中修改 V3_SUPPORTED 时，确保两个文件同步更新
   - 要求运行验证工具作为 PR 检查项

4. **文档更新**:
   - 新增博物馆时更新此文档的"已修复的博物馆列表"

## 技术架构 (Technical Architecture)

### 导览按钮显示逻辑 (Navigation Button Display Logic)

```javascript
// In script.js (line ~6015)
${V3_SUPPORTED.includes(museum.id) ? 
  `<button class="museum-v3-button" title="进入导览模式">🧭 导览</button>` : 
  ''}
```

### 导览页面跳转 (Navigation Page Redirection)

```javascript
// In script.js (line ~6037)
v3Btn.addEventListener('click', (e) => {
  e.stopPropagation();
  window.location.href = `single-museum.html?museum=${museum.id}`;
});
```

### 镇馆之宝工作流生成 (Treasure Workflow Generation)

```javascript
// In treasure-workflow-generator.js
function generateTreasureItems(museum) {
  // Use existing collections if available
  if (museum.collections && Array.isArray(museum.collections)) {
    return museum.collections.slice(0, 3);
  }
  
  // Otherwise generate placeholders
  // ...
}
```

## 相关文件 (Related Files)

- **`script.js`** - 主页逻辑，包含 V3_SUPPORTED 列表
- **`single-museum.js`** - 导览页面逻辑，包含 V3_SUPPORTED 列表
- **`museums-data.js`** - 博物馆数据，包含 collections
- **`treasure-workflow-generator.js`** - 自动生成镇馆之宝工作流
- **`tools/validate-v3-support.js`** - V3 支持验证工具（本次新增）

## 版本历史 (Version History)

- **v1.0** (2025-01-17) - 初始版本，修复上海博物馆等 6 个博物馆的导览按钮缺失问题

---

**维护者**: GitHub Copilot  
**最后更新**: 2025-01-17  
**相关 Issue**: 导览 - 主页为什么上海博物馆没有导览按钮？
