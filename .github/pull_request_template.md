## 变更说明
<!-- 简要描述此 PR 的主要变更 -->


## 变更类型
<!-- 请勾选适用的变更类型 -->

- [ ] 🐛 Bug 修复
- [ ] ✨ 新功能
- [ ] ⚡ 性能改进
- [ ] ♻️  代码重构
- [ ] 📝 文档更新
- [ ] 🏗️  架构变更

## 测试情况
<!-- 描述测试情况 -->

- [ ] 已运行所有单元测试 (`npm test`)
- [ ] 已添加新的测试用例（如适用）
- [ ] 已运行数据质量检查 (`npm run test:data-quality`，如修改博物馆数据)
- [ ] 已手动测试通过
- [ ] 已验证测试覆盖率达标 (`npm run test:coverage`)

## 技术规范与架构
<!-- 如果涉及架构或数据模型变更，请完成以下检查 -->

- [ ] **技术规范已更新**（如适用）
  - 位置: `docs/architecture/[spec-name].md`
  - 或创建新规范: [TECH_SPEC_TEMPLATE.md](../docs/architecture/TECH_SPEC_TEMPLATE.md)

- [ ] **架构决策记录 (ADR) 已创建**（如有重大架构决策）
  - 位置: `docs/architecture/adr/NNNN-decision-title.md`
  - 参考模板: [adr-template.md](../docs/architecture/adr/adr-template.md)

- [ ] **API 文档已更新**（如修改 API）
  - DataManager API: `docs/architecture/API_REFERENCE.md`
  - 或添加到: `docs/api/`

## 回归测试
<!-- Bug 修复必须包含回归测试 -->

- [ ] **已添加回归测试**（如修复 Bug）
  - 测试位置: `tests/regression.test.js` 或新的测试文件
  - 测试描述: <!-- 简述回归测试场景 -->

- [ ] **已验证修复有效**
  - 测试覆盖了 Bug 重现场景
  - 所有相关测试通过

## 数据质量
<!-- 如果修改了博物馆数据 -->

- [ ] **无重复博物馆**（已运行重复检查）
- [ ] **数据结构完整**（所有必需字段存在）
- [ ] **已验证数据一致性**

## 相关 Issue
<!-- 关联相关的 GitHub Issue -->

关闭 #<!-- issue number -->

## 检查清单
<!-- 提交前最终检查 -->

- [ ] 代码遵循项目编码规范
- [ ] 提交信息清晰明确（遵循 [Conventional Commits](https://www.conventionalcommits.org/)）
- [ ] 文档已更新（README, Wiki, 技术规范等）
- [ ] 向后兼容（或已记录破坏性变更）
- [ ] 无 console.log 或调试代码残留
- [ ] 已在本地环境完整测试

## 截图/演示
<!-- 如果是 UI 变更，请提供截图或 GIF 演示 -->


## 额外说明
<!-- 其他需要审查者知道的信息 -->

