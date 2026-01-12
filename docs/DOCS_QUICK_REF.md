# 📝 文档创建快速参考

## 🚫 禁止行为

**绝对不要在根目录创建大写命名的 .md 文件！**

---

## ✅ 正确做法

### 文档类型 → 目标目录

| 文档类型 | 目录 | 示例 |
|---------|------|------|
| 🏗️ 架构设计 | `docs/architecture/` | `kv-store-design.md` |
| 🎯 功能说明 | `docs/features/` | `museum-checkin.md` |
| 📚 开发指南 | `docs/guides/` | `quick-start.md` |
| 🔌 API 文档 | `docs/api/` | `letmetry-api.md` |
| 📊 进度报告 | `docs/reports/` | `phase-1-completion.md` |

---

## 🤖 Copilot 工作流

```
需要创建文档？
    │
    ├─ 确定类型（架构/功能/指南/API/报告）
    ├─ 选择 docs/ 子目录
    ├─ 使用小写连字符命名 (feature-name.md)
    └─ 创建文件
```

---

## 📋 命名规范

**✅ GOOD**: `quick-start-guide.md`  
**❌ BAD**: `QUICK_START_GUIDE.md`

---

## 🔍 自动检查

```bash
# 本地检查
bash scripts/check-docs-location.sh

# CI/CD 自动检查（PR 时）
# 见 .github/workflows/check-docs-location.yml
```

---

## 📖 详细文档

完整规范请查看: [.github/copilot-instructions-docs.md](../.github/copilot-instructions-docs.md)
