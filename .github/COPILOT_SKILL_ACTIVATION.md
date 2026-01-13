# 🎯 GitHub Copilot Skill 激活指南

## 📍 Museum Verification Skill 位置

**文件位置**: `.github/copilot-skills/museum-verification.md` (已创建)

该skill已经在GitHub Copilot的系统中注册，现在可以直接使用！

---

## 🚀 三种方式启动 Skill

### 方式1️⃣ - 在 GitHub Copilot Chat 中直接询问

#### 激活关键词（任选一个）:
```
- "verify museum"
- "check museum data"  
- "validate museum against official database"
- "ensure museum is official"
- "museum verification"
- "官方博物馆验证"
- "验证博物馆"
```

#### 示例对话:

```
You: "我要添加一个新的博物馆，你能帮我验证吗？"
Copilot: [Activates museum-verification skill]
         "我会帮你验证这个博物馆是否在官方数据库中。请告诉我博物馆名称。"

You: "故宫博物院"
Copilot: [Runs verification]
         "✅ 故宫博物院 已在官方数据库中验证"
         "- 官方名称: 故宫博物院"
         "- 省份: 北京市"  
         "- 等级: 一级"
         "- 可以安全添加到代码中"
```

---

### 方式2️⃣ - 直接要求执行验证命令

```
You: "请运行 node tools/verify-museum-official.js \"故宫博物院\" --strict"

Copilot: [Executes command and shows result]
         ✅ 故宫博物院
            Official Name: 故宫博物院
            Province: 北京市
            Quality Grade: 一级
            Match Score: 100% (exact)
```

---

### 方式3️⃣ - 请求 Copilot 编写验证脚本

```
You: "写一个脚本来批量验证这些博物馆：[list]"

Copilot: [Generates batch verification code]
         [Uses the museum-verification skill knowledge]
         [Creates appropriate test file and commands]
```

---

## 📋 Skill 能做什么

✅ **单个博物馆验证**
```
"验证 '新博物馆' 是否在官方数据库中"
→ Copilot 会调用验证工具并显示结果
```

✅ **批量验证**
```
"批量验证这10个博物馆"
→ Copilot 创建 JSON 文件并运行批量验证
```

✅ **提供修复建议**
```
"验证失败，怎样才能让这个博物馆通过验证？"
→ Copilot 提示使用官方名称，提供替代方案
```

✅ **整合开发工作流**
```
"我要添加新博物馆并确保通过验证"
→ Copilot 指导完整的添加流程，包括验证
```

✅ **生成验证报告**
```
"给我生成一份所有博物馆的验证报告"
→ Copilot 运行脚本并生成报告
```

---

## 🎓 使用场景和示例

### 场景1: 开发者想添加新博物馆

```
You: "我要给项目添加一个博物馆，叫'故宫博物院'"

Copilot: [Activates museum-verification skill]
         "好的，我会帮你验证这个博物馆。让我先检查它是否在官方数据库中..."
         
         ✅ 结果:
         "✅ 故宫博物院 已验证通过"
         "- Match Score: 100% (exact match)"
         "- Official Name: 故宫博物院"
         "- Province: 北京市"
         "- Quality Grade: 一级"
         
         下一步:
         "现在我会帮你:"
         "1. 编辑 script.js 添加博物馆数据"
         "2. 运行 pre-commit hook 验证"
         "3. 生成提交消息"
```

### 场景2: 验证多个博物馆

```
You: "请验证这些博物馆: 故宫博物院、上海博物馆、国家博物馆"

Copilot: [Activates museum-verification skill]
         [Creates batch verification file]
         [Runs batch verification]
         
         报告:
         ✅ 故宫博物院 - Verified (100%)
         ✅ 上海博物馆 - Verified (100%)
         ✅ 国家博物馆 - Verified (100%)
         
         Summary:
         "All 3 museums verified successfully. Ready for commit."
```

### 场景3: 验证失败的修复

```
You: "验证 '博物馆' 失败了，怎么办？"

Copilot: [Uses museum-verification knowledge]
         "这个名称太通用了。让我提供几个建议:"
         
         1. "博物馆" 不是官方名称，请尝试:
            - 中国国家博物馆
            - 北京博物馆  
            - 地方博物馆名称
         
         "请告诉我你想添加的具体博物馆名称，"
         "我会验证它是否在官方数据库中。"
```

### 场景4: 在提交前完整验证

```
You: "我修改了 script.js，添加了新博物馆。能帮我验证并提交吗？"

Copilot: [Activates museum-verification skill]
         [Extracts museums from script.js]
         [Runs verification on all modified museums]
         
         "检查修改的博物馆..."
         ✅ All museums verified
         
         "运行 git pre-commit hook..."
         ✅ Pre-commit check passed
         
         "生成提交信息并推荐提交"
```

---

## 💡 Copilot 会自动做什么

当你提出验证请求时，Copilot 会：

1. **理解请求** - 识别你需要验证博物馆
2. **激活 Skill** - 加载 museum-verification.md 中的知识
3. **提取信息** - 从对话中获取博物馆名称
4. **选择工具** - 决定用 CLI、API 还是脚本
5. **执行验证** - 调用 Letmetry API 进行验证
6. **解释结果** - 用清晰的格式展示验证结果
7. **提供建议** - 如果失败，给出修复方案
8. **后续步骤** - 指导下一步行动

---

## ⚡ 快速命令参考

在 GitHub Copilot Chat 中输入（Copilot 会理解并执行）：

```
# 单个验证
"Verify museum '故宫博物院'"
"Check if '上海博物馆' is official"
"Validate museum '国家博物馆' against official database"

# 批量验证
"Verify these museums: 故宫, 上海博物馆, 南京博物院"
"Run batch verification on museums.json"

# 脚本验证
"Check all museums in script.js"
"Verify script.js museums in strict mode"

# 修复
"Why did the museum verification fail?"
"What's the official name for this museum?"
"Help me add a museum that passes verification"

# 中文指令
"验证 '博物馆名称' 是否官方"
"批量验证这些博物馆"
"检查 script.js 中的所有博物馆"
"帮我修复验证失败的博物馆"
```

---

## 🔧 Skill 系统架构

```
用户请求 (Chat)
    ↓
GitHub Copilot 识别关键词
    ↓
加载 museum-verification.md
    ↓
执行对应工作流
    ├─ 单个验证 → CLI tool
    ├─ 批量验证 → Batch tool
    └─ 脚本检查 → Script verification
    ↓
返回结果给用户
    ├─ ✅ 通过
    ├─ ⚠️  警告
    └─ ❌ 失败
    ↓
提供后续建议
```

---

## 📚 底层集成

### Skill 使用的资源

| 资源 | 位置 | 用途 |
|------|------|------|
| API 方法 | `js/letmetry-cloud-api.js` | `verifyMuseumOfficial()` |
| CLI 工具 | `tools/verify-museum-official.js` | 命令行执行 |
| 单元测试 | `tests/museum-verification.test.js` | 验证逻辑 |
| Pre-commit | `.husky/pre-commit` | 自动验证 |
| 官方数据 | Letmetry API | `museum/search` endpoint |

### Copilot 权限

Skill 可以：
- ✅ 读取 script.js 和其他项目文件
- ✅ 执行验证命令
- ✅ 运行 CLI 工具
- ✅ 生成和建议代码变更
- ✅ 创建验证报告

---

## 🎯 成功标志

当 Skill 正确激活时，你会看到：

```
Copilot: "I'll help you verify this museum against the official database."

[Running museum verification...]

✅ Museum Name - Verified (100% match)
   Official Name: Museum Name
   Province: Province Name
   Quality Grade: Grade Level
```

---

## ❓ 常见问题

### Q1: Copilot 没有激活 Skill？

**A:** 试试这些方法：
1. 使用明确的关键词："verify museum"、"check official database"
2. 在对话中清楚地提到"museum verification"
3. 如果还是不行，直接要求："Use the museum-verification skill"

### Q2: 如何强制使用这个 Skill？

**A:** 在 Copilot Chat 中明确说：
```
"Use the museum-verification skill to verify '博物馆名称'"
"Activate the museum-verification workflow"
```

### Q3: Skill 不可用怎么办？

**A:** 确保：
1. ✅ 文件存在：`.github/copilot-skills/museum-verification.md`
2. ✅ 格式正确（YAML 前置和 Markdown 内容）
3. ✅ 你在 MuseumCheck 项目中打开了文件
4. ✅ 刷新 Copilot 或重启 VS Code

### Q4: 能改动 Skill 吗？

**A:** 可以！编辑 `.github/copilot-skills/museum-verification.md` 来：
- 调整触发关键词
- 修改工作流步骤
- 添加新的验证场景
- 更新故障排除指南

---

## 🔗 相关文档

- 📖 **完整使用指南**: `docs/guides/museum-verification-strict-guide.md`
- 🛠️ **API 文档**: `js/letmetry-cloud-api.js` (JSDoc 注释)
- 🧪 **测试文档**: `tests/museum-verification.test.js`
- 🎯 **Copilot 指令**: `.github/copilot-instructions.md`

---

## 📞 支持和反馈

如果：
- ✅ Skill 工作正常 → 继续使用！
- ⚠️ Skill 有问题 → 编辑 `.github/copilot-skills/museum-verification.md`
- ❓ 有疑问 → 参考本指南或项目文档

---

**现在就可以使用！** 在 GitHub Copilot Chat 中试试说：

> "帮我验证 '故宫博物院' 是否在官方博物馆数据库中"

🎉 Copilot 会自动激活 museum-verification skill 并帮助你！
