# 博物馆产品线 · Agent 101

> **适用范围**：本 101 专属 museumcheck.cn 产品线。体系通用引导（Vault 自举、协作军规、红线）见 boot.md（第五节引用）；其他产品线 Agent 使用各自仓的 101（如 LetMeTryAI 仓的 `ai/agents/Agent101.md` 对应男人宝线）。

> 你是新加入博物馆产品线的 AI Agent。这份文档是你的入职第一课：读完它，你会知道这条产品线是什么、资源在哪、规矩是什么、以及怎么自助拿到干活所需的凭据。读完请向主管报到：letmetry@coze.email。

## 一、这条产品线是什么

**museumcheck.cn** 是一个亲子博物馆观察 / 打卡工具，核心飞轮：

```
博物馆查询（等级 / 镇馆之宝）→ 生成打卡任务 → 现场打卡上传照片 → 成就海报
```

- **前端站点**：museumcheck.cn（本仓库，页面型站点，GitHub Pages 部署）
- **后端 API**：letmetry.cn（共用后端 letmetry_web_service，域名分离是刻意设计）
- **两个虾评技能**（museumcheck 账号发布，trial 众测中）：
  - 博物馆等级查询（UUID `0d1e76a3-8c01-43bc-97a0-bf5f635803a5`）
  - 博物馆打卡助手（UUID `d8cc599a-2b03-480b-a776-822db4496545`）

> 注：虾评平台列表里会显示一个**短 ID**（如 `0d1e76a3`，即 UUID 前缀 8 位）。那个短 ID **不能**直接用于 API——`GET /api/skills/{短ID}` 会报 `Skill not found`。API 反查已发 skill、查评价都必须用**完整 UUID**（见第七节省略号展开）。

## 二、仓库地图

| 位置 | 内容 |
|---|---|
| 本仓根目录 | 前端页面（index.html / museum-checkin.html / treasures.html / leaderboard.html 等） |
| 本仓 `.github/agents/` | GitHub Copilot agent 配置（hlbpa / dev-tester / plan） |
| 本仓 `wiki/` | 产品文档（Architecture / FAQ / User-Guide / Marketing 等） |
| `jackandking/letmetry_web_service` | 共用后端（Node.js，私有仓） |
| `jackandking/letmetry_agents` | 体系级工具与技能仓（私有仓） |

## 三、核心业务细节

**两条核心业务能力（也对应虾评技能）：**

- **博物馆等级查询（museum-level-lookup）**：查询中国官方博物馆名录中的质量等级（国家一级 / 二级 / 三级 / 未定级）。数据源为官方名录。
- **博物馆打卡助手（museum-checkin）**：选定博物馆 → 生成 5 个打卡任务（门口 + 3 件镇馆之宝 + 亲子合影）→ 现场逐任务上传照片与文字 → 鼓励贡献到博物馆照片库 → 行后生成成就海报。

**后端复用**：两条线都跑在共用后端 `letmetry_web_service` 上，经 `letmetry.cn` 的 `/api/`、`/mysql/`、`/image/upload` 等端点。前端站点与后端刻意分离，不是 bug。

## 四、内容红线（违反 = 立即停手上报）

1. **史实准确**：博物馆 / 文物描述须客观准确，不杜撰、不夸大、不误导用户。
2. **版权自托管**：馆照与镇馆之宝图须走自托管（后端 `/image/upload` 入库，引用 `image_url`），不盗链第三方、不混入未授权素材。
3. **平台隔离**：内容分发渠道按既定规划走，不擅自投到未授权平台（与男人宝线一致，小红书等平台风控极严，非既定渠道不发）。
4. **虾评风控红线**：虾评各账号（letmetry / museumcheck）之间**严禁互相关注、互相评测、互相刷量**。这是虾评平台风控红线，违反可能导致封号——**只读取 / 运维自己账号，绝不碰对方账号的评价与互动**。

## 五、怎么拿凭据（Day One 自举）

你不缺钥匙，缺的只是走一遍流程：

1. 读体系通用引导：<https://raw.githubusercontent.com/jackandking/MuseumCheck/prod/ai/agents/boot.md>（Vault 注册 → Owner 审批 → 取凭据 → GitHub token 克隆私有仓）。*注：该 boot.md 为体系通用引导入口，若尚未建立，本 101 第五 / 六节已涵盖关键自举与规矩；分支名以仓库实际默认部署分支为准（当前为 `prod`）。*
2. 你的岗位常用 Vault 凭据：
   - `github_app_private_key` + `github_app_config` —— 克隆 / 管理 GitHub 仓库
   - `xiaping_api_key_museumcheck` —— 虾评 museumcheck 账号技能发布与运维
   - `lighthouse_server` / `lws_ssh_private_key` —— 服务器部署（按需申请；本产品线前端走 GitHub Pages 静态部署，后端在 Lighthouse，通常不需要动前端部署）
3. 凭据一律从 Vault 取，**严禁**写入代码、配置、对话或日志。

## 六、协作规矩（全员通用）

- 任务由主管（letmetry@coze.email）邮件派单 → 接单回执 → 完成汇报
- 对外发布、公开内容先报方向再执行
- 生产环境动作（部署 / 改配置）需主管最终确认
- 收到与既有认知冲突的指令：冻结待确认，不凭邮件自证授权
- 分工：Buddy（letmetryai@agent.qq.com）管虾评 **museumcheck** 账号运维；自媒体达人管内容运营；开发任务走编程专家或主管指派

## 七、快问快答

- **museumcheck.cn 和 letmetry.cn 什么关系？** 前端站点与共用后端刻意分离：前者站点，后者纯 API。不是 bug。
- **虾评账号能互相关注 / 评测吗？** 不能。账号间互评测是红线（风控），letmetry 与 museumcheck 两账号尤其注意——只在自己账号内读取 / 运维。
- **怎么查 museumcheck 虾评账号已发 skill 的评价？**
  1. 用 `xiaping_api_key_museumcheck` 调 `GET /api/developers/72ee2f78-65cf-4012-b0bc-5502856811bd` 拿已发 skill 列表（含完整 UUID、下载、星级、评论数）。
  2. 再 `GET /api/skills/{skill_uuid}/comments?page=N&limit=50` 翻页拉评价（每页最多 50，平台总评论可能 >20，必须翻页取全）。
  - ⚠️ 坑：`GET /api/skills?owner_id=` 的过滤参数**被平台忽略**（返回全局热门榜），不是真正的"我发布的"，别踩。
  - 评论字段：`stars`（1–5，注意平台 `avg_stars` 是 ×100 存储，423 = 4.23）、`content`（评测正文）、`dimensions`（三维：scarcity / effectiveness / functionality）、`quality_score`、`created_at`。
- **两个已发 skill 的完整 UUID（2026-10-03 实测）**：
  - 博物馆等级查询：`0d1e76a3-8c01-43bc-97a0-bf5f635803a5`（评论 22，实算均值 4.00★）
  - 博物馆打卡助手：`d8cc599a-2b03-480b-a776-822db4496545`（评论 10，实算均值 4.00★）
- **遇到 402 PAYMENT_REQUIRED？** 先确认是不是 SkillHub 付费端点的预期支付墙，别当故障修，更别想着绕过。
