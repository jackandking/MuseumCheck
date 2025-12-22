# 临时分支清理 / Temporary Branch Cleanup

## 📋 任务概述 / Task Overview

根据issue要求，本PR提供了自动化工具来清理临时分支，保留dev、prod、simple三个主要分支。

According to the issue requirements, this PR provides automation tools to clean up temporary branches while keeping dev, prod, and simple main branches.

## 🎯 目标 / Goal

**保留 (Keep):**
- `dev` - 开发分支
- `prod` - 生产分支  
- `simple` - 简化版分支

**删除 (Delete):**
- 32个临时分支 (29个copilot分支 + 3个patch分支)

## 🚀 执行方式 / How to Execute

### 方式1：GitHub Actions 自动化（推荐）/ Method 1: GitHub Actions (Recommended)

这是最简单、最安全的方式，通过GitHub界面点击即可完成。

1. 打开仓库的 **Actions** 标签页
2. 在左侧找到 **"Delete Temporary Branches"** 工作流
3. 点击右侧的 **"Run workflow"** 按钮
4. 在弹出框中输入 **"DELETE"** 确认删除
5. 点击绿色的 **"Run workflow"** 按钮启动

工作流会：
- ✅ 自动删除所有32个临时分支
- ✅ 显示删除进度和结果
- ✅ 验证最后只剩下dev、prod、simple三个分支
- ✅ 提供详细的执行日志

### 方式2：运行脚本 / Method 2: Run Script

如果你有命令行访问权限：

```bash
# 赋予脚本执行权限
chmod +x delete-temporary-branches.sh

# 运行脚本
./delete-temporary-branches.sh
```

### 方式3：手动命令 / Method 3: Manual Commands

查看 `BRANCH_CLEANUP.md` 文件获取详细的手动删除命令。

## 📦 提交内容 / Files Included

本PR包含以下文件：

1. **`.github/workflows/delete-temporary-branches.yml`**
   - GitHub Actions自动化工作流
   - 提供网页界面一键执行
   - 包含安全确认机制

2. **`delete-temporary-branches.sh`**
   - Bash自动化脚本
   - 可在本地或服务器执行
   - 提供进度反馈

3. **`BRANCH_CLEANUP.md`**
   - 详细的英文文档
   - 包含所有删除方法
   - 提供手动命令参考

4. **`CLEANUP_README_CN.md`**（本文件）
   - 中文快速指南
   - 简化的执行说明

## ⚠️ 重要提示 / Important Notes

1. **此操作不可逆** - 删除的分支无法恢复，但这些都是已完成的临时分支
2. **建议使用GitHub Actions** - 更安全，有完整日志记录
3. **当前工作分支也会被删除** - `copilot/delete-temporary-branches` 在PR合并后可删除
4. **需要适当权限** - 删除分支需要仓库的写权限

## ✅ 验证 / Verification

删除完成后，运行以下命令验证：

```bash
git ls-remote --heads origin
```

应该只看到三个分支：
```
refs/heads/dev
refs/heads/prod
refs/heads/simple
```

## 📞 需要帮助？ / Need Help?

如有问题，请查看：
- 详细文档：`BRANCH_CLEANUP.md`
- GitHub Actions日志（如果使用自动化）
- 或在issue中提问

---

**预计执行时间：** 2-3分钟（自动化） / 5-10分钟（手动）

**建议执行时间：** 低峰期，避免影响正在进行的开发工作
