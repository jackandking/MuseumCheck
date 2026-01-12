# 仓库结构整理 - 目录组织指南

**日期**: 2026-01-12  
**目的**: 清理根目录混乱，建立清晰的项目结构

---

## 📊 整理成果

### 文件数量变化

```
整理前:
  根目录: ~140 个文件
  - 历史报告: 30+ 个
  - 调试文件: 10+ 个
  - 资源文件: 20+ 个
  - 游戏相关: 4 个

整理后:
  根目录: ~80 个文件
  - 核心文件: 保留
  - 历史文件: 已归档 → docs/archive/
  - 调试文件: 已归档 → docs/archive/
  - 资源文件: 已分类 → archive/
```

### 清晰度提升

```
❌ 混乱的根目录
  ├─ ACHIEVEMENT_POSTER_FIX.md
  ├─ debug-homepage-init.html
  ├─ MuseumCheck_QRCode_*.png (11 个)
  ├─ snake-game.js
  └─ ... (140+ 个文件)

✅ 清晰的结构
  ├─ 核心应用文件 (15 个)
  ├─ 核心目录 (docs/, core/, scripts/, tools/, etc.)
  ├─ docs/archive/ (历史报告)
  └─ archive/ (资源和归档文件)
```

---

## 🗂️ 新的目录结构

### 根目录 - 核心应用文件

```
/workspaces/MuseumCheck/
├─ 配置文件
│  ├─ package.json           # NPM 配置
│  ├─ .gitignore            # Git 忽略列表
│  ├─ CNAME                 # GitHub Pages 域名
│  └─ robots.txt            # SEO 配置
│
├─ 核心 HTML/CSS/JS
│  ├─ index.html            # 主应用
│  ├─ script.js             # 主逻辑 (3000+ 行)
│  ├─ style.css             # 样式
│  ├─ util.js               # 工具函数
│  └─ museums-data.js       # 博物馆数据 (915KB)
│
├─ 数据加载和管理
│  ├─ museum-data-loader.js # 数据加载器 ✨ 新架构
│  ├─ museums-meta.js       # 元数据列表
│  └─ workflows-data.js     # 工作流数据
│
├─ API 和服务
│  ├─ letmetry-cloud-api.js # 云服务 API
│  └─ deepseek-api.js       # DeepSeek API
│
├─ 功能模块 (HTML)
│  ├─ achievements.html     # 成就系统
│  ├─ treasures.html        # 文物展示
│  ├─ museum-checkin.html   # 博物馆打卡
│  ├─ settings.html         # 用户设置
│  ├─ fireworks.html        # 烟火效果
│  ├─ event-wall.html       # 事件墙
│  ├─ quiz/                 # 测验模块
│  └─ survey/               # 问卷模块
│
├─ 管理和测试页面
│  ├─ admin.html            # 管理后台
│  ├─ test-new-architecture.html  # 新架构测试 ✨
│  └─ (其他测试页面)
│
├─ 项目结构
│  ├─ docs/                 # 📚 文档 (见下)
│  ├─ core/                 # 核心模块
│  ├─ scripts/              # 构建脚本
│  ├─ tools/                # 工具脚本
│  ├─ tests/                # 单元测试
│  ├─ tests-e2e/            # E2E 测试
│  ├─ e2e/                  # E2E 配置
│  ├─ shared/               # 共享模块
│  ├─ shared-features/      # 共享功能
│  ├─ node_modules/         # NPM 依赖
│  ├─ museums/              # 静态数据 (现为空)
│  ├─ tmp/                  # 临时文件
│  ├─ test-results/         # 测试结果
│  ├─ wiki/                 # Wiki 页面
│  └─ archive/              # 📦 归档文件 (见下)
│
└─ 文档文件 (根目录)
   ├─ README.md             # 项目主文档
   ├─ QUICK_START_GUIDE.md  # 快速开始
   ├─ TESTING_GUIDE.md      # 测试指南
   ├─ QUIZ_README.md        # 测验说明
   ├─ MUSEUM_CHECKIN_DOC.md # 打卡说明
   ├─ DATABASE_INIT_GUIDE.md # 数据库初始化
   ├─ MCP_SETUP.md          # MCP 配置
   ├─ COPILOT_REQUESTS.md   # Copilot 请求
   └─ 其他说明文档
```

### docs/ - 文档目录

```
docs/
├─ ARCHITECTURE_OVERVIEW.md          # 架构概览
├─ SIMPLIFIED_ARCHITECTURE.md        # 简化架构 ✨
├─ ARCHITECTURE_SIMPLIFICATION_REPORT.md  # 简化报告 ✨
├─ MUSEUM_DATA_MANAGEMENT.md         # 数据管理
├─ CENTRALIZED_DATA_PATTERN.md       # 集中管理模式
├─ ADMIN_PAGES_README.md             # 管理页面说明
├─ MINECRAFT_IMAGES_README.md        # Minecraft 图片
│
└─ archive/                          # 📦 历史和调试文件
   ├─ ACHIEVEMENT_POSTER_FIX.md     # 成就海报修复
   ├─ CHANGELOG_1023.md              # 变更日志
   ├─ HOMEPAGE_LOADING_FIX.md       # 首页加载修复
   ├─ PHASE_3_COMPLETION_REPORT.md  # 阶段完成报告
   ├─ POSTER_PUBLISH_FEATURE_SUMMARY.md
   ├─ UX_IMPROVEMENTS_SUMMARY.md    # UX 改进总结
   ├─ ... (30+ 个历史文档)
   └─ 调试文件
      ├─ debug-homepage-init.html
      ├─ diag-init.html
      ├─ test-core-init.html
      └─ ... (10 个调试文件)
```

### archive/ - 归档目录

```
archive/
├─ qrcodes/                          # 二维码和图片
│  ├─ MuseumCheck_QRCode_ForbiddenCity.png
│  ├─ MuseumCheck_QRCode_NationalMuseum.png
│  ├─ MuseumCheck_logo.jpg
│  ├─ firework-types-settings.png
│  └─ ... (15+ 个文件)
│
└─ games/                            # 游戏相关
   ├─ snake-game.js
   ├─ snake-game-inline.js
   ├─ space-invaders.js
   └─ space-invaders.html
```

---

## 🎯 为什么这样组织?

### 根目录 - 保持简洁

**保留的是**:
- ✅ 核心应用文件 (index.html, script.js, style.css)
- ✅ 关键配置 (package.json, .gitignore, README.md)
- ✅ 主要业务模块 (museum-data-loader.js, museums-meta.js)
- ✅ 当前相关文档 (README.md, QUICK_START_GUIDE.md)

**移除的是**:
- ❌ 已完成的任务报告 (PHASE_3_COMPLETION_REPORT.md)
- ❌ 调试和修复文档 (HOMEPAGE_LOADING_FIX.md)
- ❌ 二维码、logo、游戏文件等资源

**优点**:
- 新开发者看到根目录时更清楚
- 减少文件浏览的认知负担
- 便于 Git 日志查看（减少根目录变更）

### docs/ - 集中文档

**目的**:
- 项目级文档 (架构、管理指南)
- archive 子目录存放历史文档
- 便于版本管理和检索

**优点**:
- 所有文档集中在一个地方
- 易于迁移和备份
- 支持文档版本控制

### archive/ - 资源归档

**目的**:
- 存放不影响运行的文件
- 需要时可以访问但不污染根目录
- 便于清理和管理

**优点**:
- 减少仓库根目录混乱
- 保留历史资源以备需要
- 便于分别提交/推送

---

## 📋 整理清单

### ✅ 已完成

- [x] 创建目录结构 (docs/archive/, archive/qrcodes/, archive/games/)
- [x] 移动历史报告 (30+ 个文档) → docs/archive/
- [x] 移动调试文件 (10+ 个) → docs/archive/
- [x] 移动二维码图片 (12+ 个) → archive/qrcodes/
- [x] 移动游戏文件 (4 个) → archive/games/
- [x] 移动资源文件 (logo, 截图等) → archive/

### 📊 整理结果

```
根目录文件数:
  整理前: 142 个
  整理后:  82 个
  减少:   60 个 (42%)

可快速访问的文件:
  - 核心应用: 15 个
  - 配置文件:  4 个
  - 文档:     12 个
  - 模块:     35 个
```

---

## 🔍 查找归档文件

### 我需要的文件在哪里？

| 文件类型 | 位置 |
|---------|------|
| 过去的报告/日志 | `docs/archive/` |
| 调试页面 | `docs/archive/` |
| 二维码图片 | `archive/qrcodes/` |
| Logo 和图片 | `archive/qrcodes/` |
| 游戏代码 | `archive/games/` |
| 当前文档 | `docs/` 或根目录 |
| 核心应用 | 根目录 |

### 常见查询命令

```bash
# 查看所有历史报告
ls -la docs/archive/*.md

# 查看二维码列表
ls -la archive/qrcodes/

# 查找特定文件
find . -name "PHASE_3_COMPLETION_REPORT.md"
# → docs/archive/PHASE_3_COMPLETION_REPORT.md

# 统计根目录文件
ls -1 | wc -l
# → 82
```

---

## 🚀 后续建议

### 短期 (可选)

1. **Git 提交**: 将整理结果提交到仓库
   ```bash
   git add -A
   git commit -m "refactor: organize directory structure, archive historical documents"
   ```

2. **更新文档导航**: 在 README.md 中添加目录结构说明

### 长期

1. **持续整理**: 新文档创建时直接放在合适的目录
2. **定期清理**: 每个季度检查一次根目录，移动过时文件
3. **自动化**: 考虑添加 Git hook 防止在根目录创建新的 .md 文档

---

## 📝 目录整理规范

### 新文件创建指南

```
场景 1: 当前工作的文档
→ 放在根目录 (README.md, QUICK_START_GUIDE.md)

场景 2: 项目级别文档
→ 放在 docs/ (ARCHITECTURE_OVERVIEW.md)

场景 3: 已完成的任务报告
→ 放在 docs/archive/ (PHASE_3_COMPLETION_REPORT.md)

场景 4: 调试和临时文件
→ 放在 docs/archive/ 或 tmp/

场景 5: 资源文件 (图片、logo 等)
→ 放在 archive/qrcodes/ 或新建 archive/subdir/

场景 6: 代码示例和演示
→ 如果是游戏或老功能 → archive/games/
→ 如果是当前功能演示 → 根目录或 demos/ (新建)
```

---

## 🎉 效果对比

### 整理前
```
ls -1 | head -20
ACHIEVEMENT_POSTER_FIX.md
ACHIEVEMENT_POSTER_VERIFICATION.md
ADMIN_PAGES_README.md
ARCHITECTURE_OVERVIEW.md
ARCHITECTURE_SIMPLIFICATION_REPORT.md
...
MuseumCheck_QRCode_BeijingArtMuseum.png
MuseumCheck_QRCode_BeijingCapitalMuseum.png
...
debug-homepage-init.html
debug-mode.js
...
```
**感觉**: 混乱、杂乱、难以找文件 😕

### 整理后
```
ls -1
.copilot-mcp.json
.devcontainer/
.git/
.github/
.gitignore
.vscode/
CNAME
COPILOT_REQUESTS.md
DATABASE_INIT_GUIDE.md
MCP_SETUP.md
MUSEUM_CHECKIN_DOC.md
MUSEUM_DATA_MANAGEMENT.md
QUICK_START_GUIDE.md
QUIZ_README.md
README.md
TESTING_GUIDE.md
admin.html
archive/
core/
docs/
... (清晰结构)
```
**感觉**: 清晰、专业、易于导航 ✨

---

*整理完成时间: 2026-01-12*  
*整理效果: 根目录文件数 -42%*  
*仓库结构: 更清晰、更专业*
