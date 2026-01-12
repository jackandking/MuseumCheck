# Copilot 文档创建规范

**⚠️ CRITICAL: 强制执行的文档组织规则 ⚠️**

## 🚫 禁止行为

**绝对禁止在根目录创建新的 Markdown 文件！**

所有文档必须创建在 `docs/` 目录的相应子目录中。

---

## 📁 文档目录结构规范

```
docs/
├── architecture/         # 架构设计文档
│   ├── overview.md
│   ├── data-flow.md
│   └── simplification-report.md
│
├── features/            # 功能说明文档
│   ├── museum-checkin.md
│   ├── achievements.md
│   └── leaderboard.md
│
├── guides/              # 开发指南
│   ├── quick-start.md
│   ├── testing-guide.md
│   └── database-init.md
│
├── api/                 # API 文档
│   ├── letmetry-api.md
│   └── storage-api.md
│
└── reports/             # 进度报告、总结
    ├── phase-1.md
    ├── phase-2.md
    └── changelog.md
```

---

## ✅ 正确示例

### 创建架构文档
```bash
# ✅ CORRECT
touch docs/architecture/new-feature-design.md

# ❌ WRONG
touch NEW_FEATURE_DESIGN.md
```

### 创建功能说明
```bash
# ✅ CORRECT
touch docs/features/poster-publishing.md

# ❌ WRONG  
touch POSTER_PUBLISHING_FEATURE.md
```

### 创建开发指南
```bash
# ✅ CORRECT
touch docs/guides/mobile-ux-best-practices.md

# ❌ WRONG
touch MOBILE_UX_GUIDE.md
```

---

## 📋 文档类型分类规则

### 🏗️ Architecture (docs/architecture/)
- 系统架构设计
- 数据流图
- 技术选型说明
- 架构重构报告

**示例**:
- `architecture-overview.md`
- `kv-store-design.md`
- `centralized-data-pattern.md`

---

### 🎯 Features (docs/features/)
- 功能需求说明
- 功能实现文档
- 功能测试报告
- 用户故事

**示例**:
- `museum-checkin.md`
- `achievement-system.md`
- `quiz-module.md`

---

### 📚 Guides (docs/guides/)
- 快速开始指南
- 开发规范
- 测试指南
- 部署手册
- 最佳实践

**示例**:
- `quick-start-guide.md`
- `testing-guide.md`
- `database-init-guide.md`

---

### 🔌 API (docs/api/)
- API 接口文档
- 接口集成指南
- API 变更日志

**示例**:
- `letmetry-api.md`
- `storage-api.md`
- `museum-data-api.md`

---

### 📊 Reports (docs/reports/)
- 阶段进度报告
- 性能分析报告
- Bug 修复总结
- 版本更新日志

**示例**:
- `phase-1-completion.md`
- `performance-optimization.md`
- `changelog-2026-01.md`

---

## 🤖 Copilot 工作流检查清单

在创建任何文档之前，Copilot **必须**：

1. ✅ **确定文档类型**：这是架构文档？功能文档？指南？报告？
2. ✅ **选择正确目录**：根据类型选择 `docs/` 下的子目录
3. ✅ **检查现有文档**：避免创建重复内容
4. ✅ **使用规范命名**：小写字母 + 连字符，避免大写和下划线

### 决策流程图

```
需要创建文档？
    │
    ├─ 是系统架构相关？ → docs/architecture/
    ├─ 是功能说明相关？ → docs/features/
    ├─ 是开发指南相关？ → docs/guides/
    ├─ 是 API 文档相关？ → docs/api/
    └─ 是进度报告相关？ → docs/reports/
```

---

## 🔍 自动化检查（未来）

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

NEW_ROOT_MD=$(git diff --cached --name-only --diff-filter=A | grep "^[A-Z_].*\.md$")

if [ -n "$NEW_ROOT_MD" ]; then
    echo "❌ 错误: 检测到在根目录创建新的 MD 文件："
    echo "$NEW_ROOT_MD"
    echo ""
    echo "请将文档移动到 docs/ 子目录中："
    echo "  - docs/architecture/ - 架构文档"
    echo "  - docs/features/     - 功能文档"
    echo "  - docs/guides/       - 开发指南"
    echo "  - docs/api/          - API 文档"
    echo "  - docs/reports/      - 进度报告"
    exit 1
fi
```

### GitHub Actions 检查
```yaml
# .github/workflows/docs-check.yml
name: 文档位置检查

on: [pull_request]

jobs:
  check-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 检查根目录 MD 文件
        run: |
          NEW_MD=$(git diff --name-only origin/${{ github.base_ref }}..HEAD | grep "^[A-Z_].*\.md$" || true)
          if [ -n "$NEW_MD" ]; then
            echo "::error::不允许在根目录创建新的 MD 文件"
            exit 1
          fi
```

---

## 📝 命名规范

### 文件命名规则

**格式**: `feature-name.md` (全小写，连字符分隔)

**✅ GOOD**:
- `quick-start-guide.md`
- `achievement-system.md`
- `api-integration.md`

**❌ BAD**:
- `QUICK_START_GUIDE.md` (大写 + 下划线)
- `Achievement-System.MD` (驼峰命名)
- `api_integration.md` (下划线)

---

## 🎯 例外情况

**仅以下文件允许存在于根目录**:

1. ✅ `README.md` - 项目主说明文件（**必须**）
2. ✅ `CHANGELOG.md` - 版本更新日志（可选）
3. ✅ `CONTRIBUTING.md` - 贡献指南（可选）
4. ✅ `LICENSE.md` - 许可证文件（可选）

**其他任何文档必须在 `docs/` 子目录中！**

---

## 🔄 迁移现有文档

当前根目录有 **14 个 MD 文件**需要迁移：

```bash
# 建议迁移计划
ADMIN_PAGES_README.md          → docs/features/admin-pages.md
ARCHITECTURE_OVERVIEW.md       → docs/architecture/overview.md
CENTRALIZED_DATA_PATTERN.md    → docs/architecture/centralized-data-pattern.md
COPILOT_REQUESTS.md            → docs/reports/copilot-requests.md
DATABASE_INIT_GUIDE.md         → docs/guides/database-init.md
MCP_SETUP.md                   → docs/guides/mcp-setup.md
MINECRAFT_IMAGES_README.md     → docs/features/minecraft-images.md
MUSEUM_CHECKIN_DOC.md          → docs/features/museum-checkin.md
MUSEUM_DATA_MANAGEMENT.md      → docs/architecture/data-management.md
QUICK_START_GUIDE.md           → docs/guides/quick-start.md
QUIZ_README.md                 → docs/features/quiz.md
README.md                      → [保留在根目录]
TESTING_GUIDE.md               → docs/guides/testing.md
```

---

## 🚀 强制执行

### 对 Copilot 的强制要求

**在创建任何文档文件前，Copilot 必须**:

1. 询问用户文档类型
2. 确认目标目录
3. 在 `docs/` 子目录中创建文件
4. 如果用户未指定目录，**默认使用 `docs/reports/`**

**绝不允许在根目录创建新的大写命名的 MD 文件！**

---

**最后更新**: 2026-01-12  
**强制执行日期**: 2026-01-12 起生效  
**维护者**: MuseumCheck Team
