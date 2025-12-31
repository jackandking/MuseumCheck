# Copilot Requests Policy (补充)

本文件为对 `.github/copilot-instructions.md` 的补充说明：

从现在起，所有后续的需求、功能请求、变更说明、用户故事或产品方向调整（无论来源为用户、产品经理或维护者）都应统一记录到仓库根目录的 `COPILOT_REQUESTS.md` 文件中。

关键要求：
- 任何 Copilot 任务在开始修改代码或文档之前，应先把需求追加到 `COPILOT_REQUESTS.md`。
- 条目字段应包含：日期、提出者、标题、概要、详细描述、验收标准、优先级、相关文件、关联 Issue/PR、状态、后续任务（TODO 列表）。
- 若 `COPILOT_REQUESTS.md` 不存在，Copilot 应创建并使用模板。
- Copilot 在回复中应引用所追加的条目（路径 + 标题），并在实现步骤中包含该条目的 `TODO` 标识。

说明：
- 本文件作为临时补充，建议将内容合并回 `.github/copilot-instructions.md`。若您同意，我可以继续尝试将该段直接合并到 `.github/copilot-instructions.md`（需要 repo 文件可写，apply_patch 有时会遇到大文件处理限制）。
