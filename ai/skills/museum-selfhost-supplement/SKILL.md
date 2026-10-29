---
name: museum-selfhost-supplement
displayName: 博物馆馆藏图自托管补充
description: 给 museumcheck.cn 补一个博物馆的「馆照 + 3 件镇馆之宝」，图片下载后自托管到自己的服务器（后端 /image/upload 接口），再写透 KV / MySQL / meta.json / museums-meta.js 四端。当用户说"再来一个博物馆""补 XX 博物馆数据""把馆藏图存到自己的服务器"时使用。
---

# 博物馆馆藏图自托管补充 Skill

为 museumcheck.cn 补充单个博物馆的馆照与镇馆之宝，并**把图片真正下载后上传到自己的服务器**（museumcheck.cn 后端 `/image/upload` 接口），再统一写入四个数据端，保证网站打卡页与付费 Skill 共用同一份 `museumcheck.cn/images/...` 公网 URL。

## ⚠️ 架构变更（2026-09-20）：打卡页镇馆之宝主源 = MySQL
- 打卡页 `museumDataLoader.loadMuseum` 主源已切换为 **MySQL `/api/museums/treasures`**（前端按馆名查询即可，后端无 `province` 时按 dedupeKey 后缀 `%_馆名` 匹配，2026-09-20 后端 fae5a85）；KV `museum-data-<id>` **降级为兜底**。
- **封面图也来自 MySQL 了**：`GET /api/museums/treasures?museumName=` 现在同时返回 `museum{name,province,dedupeKey,imageUrl}`，loader 用 `museum.imageUrl` 覆盖静态 `museums-meta.js` 的 `image`（无值才回退 meta）。**后果：MySQL `museums.image_url` 若是旧的/错的，会盖掉正确的新 meta 馆照**——补馆时必须四端（含 MySQL `museums.image_url`）都写对，否则线上显示的是 MySQL 那张。
- **纠错审核写回 MySQL（2026-09-20）**：`admin/museum-photo-review.html` 审核通过 → 后端 UPDATE `museum_treasures.image_url`（镇馆之宝）或 `museums.image_url`（封面）。发布请求**必须带 `museumName`**（前端用 `museums-meta.js` 反查），缺名/馆不存在会明确 400/404 且候选保持 pending。KV 只剩「候选审核队列」。
- **`admin/museum-data-manager.html` 已过时**：它把馆数据（含 collections/封面）存 KV，现在会被 MySQL 盖住。补馆/改藏品**不要**再用它，改走 `POST /api/museums/treasures` 与本 skill 流程。
- **验证优先级反转**：补馆后先验 MySQL treasures（用户实际看到的数据源），`GET /api/museums/treasures?museumName=<馆名>`（带 `Origin`/`Referer: https://www.museumcheck.cn/...`，注意带路径的 Referer 也必须 200）。KV/meta.json 变为离线兜底，可后验。
- **CDN immutable 缓存红线**：`js/museum-data-loader.js`、`config/api-endpoints.js`、`js/museums-meta.js` 都是 immutable 缓存。改了前两者必须 bump 所有引用页的 `?v=`（当前 `?v=mysql-treasures-20260920b`）；改 meta.js 走既有两段式提交流程。**只改 loader 不改 api-endpoints 时也必须 bump loader 的 `?v=`**，否则用户最长 30 天拿旧 loader。
- 四端写入流程保持不变（KV 兜底保持新鲜仍有价值），但**漏写 MySQL 现在直接等于白补**。
- **另注**：`museumRepo.upsertMuseums` 的 `image_url` 已改 `COALESCE(VALUES(image_url), image_url)`（2026-09-20），重新 ingest 不带 `imageUrl` 不会再清空已策展封面；但**其它字段仍是 `VALUES()`**，最小字段 upsert 照样会把未传列清成 NULL（见下方陷阱）。

## 何时使用
- 用户要求"补一个博物馆""补 XX 博物馆数据"。
- 明确要求"图片存到自己服务器 / 不要热链第三方"。
- 延续既定约定：每个可打卡馆 = 1 张馆照 + 3 件镇馆之宝。

## 前置条件（已验证）
- 后端上传接口 `POST https://museumcheck.cn/image/upload`（multipart，字段名 `file`）公开可调用，返回 `{success, filename, path}`，`path` 形如 `images/<file>`（已去掉 nginx 根前缀）。公网访问 `https://museumcheck.cn/<path>`。
- **部署已修复**：`deploy-server.yml` 的 `rsync` 已加 `--exclude 'images/' --exclude 'files/'`，后端上传的图不再被前端发版 `--delete` 清掉（这是改 skill 前修掉的关键隐患）。
- 四端写入依赖：KV endpoint（开放写）、`POST /api/museums/ingest`、`POST /api/museums/treasures`（需 `Origin: museumcheck.cn` 读）、`data/museums-meta.json`、`js/museums-meta.js`（由 `devops/tools/generate-museums-meta-js.js` 生成）。

## 工作流程（四步）

### 1. 研究：馆照 + 3 件镇馆之宝（权威 + CC 图）
- 馆照：优先该馆官方建筑照（Wikimedia Commons，CC BY-SA/CC0）。
- 3 件镇馆之宝：选**确藏于该馆**且 **Commons 有自由授权图**的器物。
- ⚠️ 纠偏：网传"镇馆之宝"清单常有误（如宜侯夨簋现藏国博；驿使图/中山王铁足大铜鼎无自由图）。**确藏该馆 + 有自由图**两条都满足才入选；官方代表藏品缺自由图时，以同馆同级别"禁止出境展览文物"替代，并在脚本注释标注可换回。
- 每件需：名称、年代、类别、一句话亮点（含出土/尺寸/意义）、图片 Commons 文件页 URL、许可（CC BY-SA 4.0 等）、原作者署名。

### 2. 取图 + 自托管上传（核心：不热链）
- 从 Commons 下载到本地临时目录。`Special:FilePath/<File>?width=960` 重定向与 `upload.wikimedia.org` 直连**互有可用/超时（本沙箱实测抖动）**——模板脚本两者都试并设显式 25s 超时、首轮失败再经 Commons API 取直连缩略图 URL 兜底。下载后 HEAD/GET 验证 200 image/*。
- ⚠️ **`/thumb/` 路径不稳定（2026-09-12 湖北省博物馆实测）**：`upload.wikimedia.org/wikipedia/commons/thumb/.../960px-*.jpg` 在本沙箱频繁返回 `000`（连接失败），但**全图路径** `upload.wikimedia.org/wikipedia/commons/<hash>/<File>`（即 Commons API `imageinfo.url` 原图字段，**非** `thumburl`）稳定可达。模板脚本的 `download_commons` 现在把 API 返回的**原图 URL 作为优先候选**；对文件名含全角逗号/空格的藏品（如 `File:曾侯乙尊盘，2015-04-06 01.jpg`），可在藏品 dict 里加 `direct="<全图URL>"` 直连兜底。
- 对每张图 `POST https://museumcheck.cn/image/upload`（multipart `file` 字段），取回 `path`，拼成绝对 URL：
  `IMG_URL = "https://museumcheck.cn/" + resp["path"]`
- 文件名冲突：后端按原文件名去重，**拒绝同名**。务必用稳定唯一 slug（如 `<馆拼音>-<藏品拼音>-v1.<ext>`），避免覆盖他人图。
- ⚠️ **重跑脚本的 409 幂等（2026-09-12 湖北省博物馆实测）**：脚本因下载/上传中途失败重跑时，已上传的同名文件会再传触发 `HTTP 409 Conflict`。内容相同，应视为成功——`upload_image` 捕获 409 后 `HEAD` 验证公网可达即返回预期 URL，不报错中止。
- ⚠️ **413 体积超限（2026-09-12 故宫/国博/上博实测，修正上限）**：后端 `/image/upload` 对约 `>1MB` 文件返回 `HTTP 413`（实测 1174KB 即触发，根本不是 2MB）。Commons 原图常 1~2MB，**单次 `sips -Z 1400` 仍可能 >900KB 触发 413**（平复帖 1842KB→1412KB、后母戊鼎 1174KB 均失败）。**上传前用 `maybe_resize` 循环缩小**：`while size>max_bytes(900KB) and dim>400: dim=int(dim*0.85); sips -Z dim --out`，直到 ≤900KB（兜底 400px）。模板已含循环版——补馆时**无条件调用 `maybe_resize(path)`**（它内部会判断是否需要缩），不要只在 >1.5MB 才缩。无 sips 改 ImageMagick/PIL。藏品图 1000px 足够清晰。
- 上传后**立即 `HEAD` 验证公网 200 image/**，失败则中止并报错（不要写死链）。

### 3. 写四端（保持一致性）
1. `data/museums-meta.json`：该馆条目设 `image = <馆照URL>`、`hasCollections = true`、`collections = [{name, dynasty, category, imageUrl, description, sourceUrl, rightsType, license, copyrightHolder, attribution}]`。
2. KV `museum-data-<id>`（`sortKey=museum`）：完整记录，`image` + `collections`（含自托管 URL）。
3. MySQL `museums`（`POST /api/museums/ingest`）：设 `imageUrl = <馆照URL>`。
   - ⚠️ **visitorCount 防损坏**：该表存绝对值（`parseVisitor` 把"万人次"×10000）。补照时需回传 `visitorCount = 原值/10000`（inverse 变换），使读回时还原原值。**round-trip 不符（取整不一致）则跳过补照，绝不硬写**，否则会损坏访问量。
4. MySQL `museum_treasures`（`POST /api/museums/treasures`）：3 件，`dedupe_key = <省份>_<馆名>`（如 `河北省_河北博物院`），`imageUrl = <自托管URL>`。
   - ⚠️ **务必用显式 `museumDedupeKey` 写**（不要用 `museumProvince` 让后端重算）。后端 `resolveMuseumKey` 用 `province_馆名` 去重；若把 **city**（如"镇江"）当 province 传，会 upsert 出 `镇江_镇江博物馆` **孤儿行**，而站点实际读取的 `江苏省_镇江博物馆` 行仍是旧值，图片不更新。模板的 `DEDUP_KEY` 常量即为此设——直接填 `省_馆名`。

### 4. 重新生成前端 + 验证
- 改完 `data/museums-meta.json` 后跑 `node devops/tools/generate-museums-meta-js.js` 重新生成 `js/museums-meta.js`（首页/打卡页一致）。
- 端到端验证：① KV 直读 `collections` 数=3 且 `image` 非空；② MySQL `GET /api/museums?q=<馆名>` 的 `imageUrl` 非空；③ MySQL `GET /api/museums/treasures?museumName=...&province=...`（带 `Origin`）返回 3 件且 `imageUrl` 为公网 `museumcheck.cn/images/...`。
- ⚠️ **推 prod 后必须 bump `js/museums-meta.js` 的 `?v=` + 强制 curl 验证（见陷阱「museums-meta.js CDN 焊死」）**：本文件同样 `immutable, max-age=2592000`。补馆导致 museums-meta.js 变化后，必须给所有生产 HTML 消费者（`index.html`/`museum-checkin.html`/`treasures.html`/`pilot.html`/`together.html` + `quiz/{session,wrong-questions,index}.html`）的 `js/museums-meta.js` 引用加/升 `?v=<日期>`（together 用 `?v=together-<日期>`），再 `git push`。
  - **部署后必须 curl CDN 新键验证（铁律）**：`curl -s "https://museumcheck.cn/js/museums-meta.js?v=<日期>" | wc -c` 对比**本地** `wc -c < js/museums-meta.js`，并 `grep -o "<本馆mid>" | wc -l` 确认该馆已进文件。若 CDN 字节数 ≠ 本地字节数（典型：CDN 回旧版、缺本馆），说明新键在 deploy 的 rsync 窗口被 race 缓存成旧内容 → **立刻再 bump 一次版本**（如 `?v=20260912-2` → `?v=20260912-3`），重推，再 curl 验证，直到 CDN 字节数与本地一致。对比源站直连：`curl -sk -H "Host: museumcheck.cn" "https://43.143.241.181/js/museums-meta.js?v=<日期>"` 取真相（非 ssh）。**不 bump/不验证则线上最长 30 天仍显示旧（热链）馆图**。

## 关键陷阱（已踩过）
- **⚠️ MySQL 孤儿行会抢走按名匹配的写入（2026-09-19 甘肃馆实测）**：`museum_treasures` 里同名藏品可能同时存在 `省_馆名`（真实行，站点读取）与 `市_馆名`（历史孤儿行）两套行（如 兰州_/甘肃省_甘肃省博物馆、镇江_/江苏省_、石家庄_/河北省_）。按 name 全局匹配回填/更新时，API 按 museum_dedupe_key 排序返回第一个，**可能命中孤儿行**（Unicode 序：兰<甘、镇<江、石<河 都会中招）。对策：批量回填必须显式 `DEDUP_KEY_OVERRIDES`（见 `devops/scripts/backfill_source_type_kv_mysql.py`）；多 key 且无映射时**直接报错**，绝不静默选。**恢复手段**：服务器 MySQL `log_bin=ON`（`/var/lib/mysql/binlog.0000xx`），用 `mysqlbinlog --base64-output=DECODE-ROWS -v | grep '@10=.*<藏品名>'` 可取任意行损坏前的完整镜像。另警告：**最小字段 upsert 会把未传字段清成 NULL**（ON DUPLICATE KEY UPDATE 全列 VALUES()），必须先 GET 全行再整体回写。
- **⚠️ 岳阳馆（yueyang-museum）图片无任何许可信息（2026-09-19 排查）**：馆照 `building.jpg` 无 Commons 来源记录，KV 藏品无 license/attribution/sourceUrl——按政策不可凭空标注，待重新选图补录或下架。
- **⚠️ 先核四端现状再定目标（2026-09-15 河南博物院实测）**：用户说"再补一个馆"时，**先跑四端核查再让用户选馆**，别凭印象推荐——某馆可能 meta.json/KV/treasures 都完整、唯独 MySQL `museums` 行 `imageUrl` 还是热链（历史补馆漏跑 3.3 步）。核查要点：`GET /api/museums?year=<年>&q=<馆名>` 响应的行数组键是 `museums`（treasures 端点是 `treasures`），不是 `data`/`rows`；KV 读端点在 AWS keyValueStore（模板 `KV_ENDPOINT`），不是 `/api/kv`。若只缺 museums 行馆照，用模板 `mysql_photo` 逻辑写个 10 行小脚本即可（见 `devops/scripts/fix_henan_mysql_photo.py`）。
- **部署删图**：前端 `rsync --delete` 会清掉后端上传目录——已通过 deploy-server.yml 加 `--exclude 'images/' --exclude 'files/'` 修复。改部署脚本后必须 `git push origin dev:prod` 才生效（仅提交 dev 不生效）。
- **visitorCount inverse**：见步骤 3.3，round-trip 校验不过就跳过补照。
- **Commons 限流/抖动**：`Special:FilePath` 与 `upload.wikimedia.org` 直连互有可用/超时；模板两者都尝试、显式超时、API 兜底。不要只赌一条路径。
- **treasures 孤儿行（高概率坑）**：写 `museum_treasures` 必须用显式 `museumDedupeKey`（省_馆名）。用 `museumProvince` 传 city 会造出读不到的孤儿行，真实行不更新。
- **CDN 30 天 immutable（图片）**：更新某张已上线图时，旧 URL 最长 30 天仍返回旧图。对策：文件名带版本段（`<藏品>-v2.jpg`），更新=换新文件名=新 URL，不动旧链。
- **⚠️ museums-meta.js CDN 焊死（致命，2026-09-12 实测，2026-09-12 二次 race 复核）**：`js/museums-meta.js` 被 CDN 当 `immutable, max-age=2592000` 缓存。腾讯 purge 已于 **2026-09-12 配置 repo secrets `TENCENT_SECRET_ID/KEY` 并实测可用**（清空已存在的 `/js/` 旧键变体）。**但新 `?v=` 键仍会发生 race**：deploy 的 rsync 写文件窗口期内，CDN 首次抓取新键时源站可能还是旧 `meta.js`，于是把旧内容 `immutable` 焊死 30 天（本日志南京馆即此——`?v=20260912-2` 回 47567 旧字节，bump `?v=20260912-3` 才取到正确 49683）。
  - **根因定位（2026-09-12 湖北省博物馆复核）**：race 只在「`?v=` bump 与 meta.js 变更在**同一提交**」时发生——该提交 push 后的 rsync 窗口内 meta.js 正在被重写，CDN 首次抓新键即抓到旧 meta.js。**根治做法（推荐，免二次 bump）**：把补馆数据提交与 `?v=` bump 拆成**两次提交**——① 先提交 `meta.json`+`js`+数据并 push；② **轮询源站直连** `curl -sk -H "Host: museumcheck.cn" "https://43.143.241.181/js/museums-meta.js" | wc -c` 直到等于本地字节数（确认 deploy 已落地）；③ **再**单独提交 8 个 HTML 的 `?v=` bump 并 push。此时源站 meta.js 已稳定，CDN 抓新键即得新鲜、一次成功（湖北省博物馆 `?v=20260912-5` 即此，免二次 bump）。
  - **兜底（铁律）**：若仍撞 race（CDN 字节数 ≠ 本地），立即再 bump 一次版本（×2/×3）重推，直到一致。**根治**：purge 配好后旧键变体自动清，但新键 race 仍需手工 verify+rebump，无法靠 purge 完全消除。若用 `--no-verify` 绕过 pre-commit，会跳过 purge 触发逻辑，更需手动 bump+验证。
- **⚠️ KV 已有 `isUserAdded` 藏品时勿整写覆盖（2026-09-19 上海科技馆实测）**：模板 `write_kv` 会用官方藏品**整体替换** `collections`——若该馆 KV 里已有用户打卡添加的藏品（`isUserAdded: true`、无图），会被静默丢掉。对策：写 KV 前先 GET 现值，把 `isUserAdded` 条目追加在官方藏品之后（参考 `supplement_shanghai_science_museum.py` 的 `kv_get` + `user_added` 保留逻辑）；verify 时按「官方藏品名集合」计数而非总数。
- **GET /api/museums/treasures 查询参数陷阱**：该只读端点**只认 `museumName`+`province`**（后端内部 `buildDedupeKey` 重算 dedupe key），**不认 `museumDedupeKey` 查询参数**。若传无效/不存在的 param，后端会**忽略过滤、返回前 50 行全局**（按 `museum_dedupe_key` 排序，排在后面的省如「陕西省」会超出 50 行 cap 而不显示）。排障/计数务必用 `?museumName=<馆名>&province=<省>&limit=50` + `Origin: https://museumcheck.cn`。写库走 POST 时才用 `museumDedupeKey`。
- **pre-commit 文件规范门**：`.husky/pre-commit` → `check-file-placement.sh` 仅白名单部分根目录 `.html`（`index/museum-checkin/treasures/...`）。改 `pilot.html` 等白名单外根 HTML 会被 `❌ COMMIT BLOCKED`。已在白名单补 `pilot`；若改其他根 HTML 触发，往白名单正则加该文件名（合理修正），而非 `--no-verify`。
- **⚠️ KV 现有藏品 `imageUrl` 文件名错记（2026-09-12 故宫/上博实测）**：复用 KV 早有藏品（只换图、不改名）时，**不要盲信 KV 里的 Commons 文件名**——它常编码错误/不存在，导致 `download_commons` 404：①"故宫博物院"被错编码成"效博"（`%E6%95%88%E5%AE%AB`），推导 URL 404，真实文件名是 `File:金瓯永固杯_故宫珍宝馆.jpg`；②"王献之_鸭头丸帖"真实文件名是 `File:王献之 行书鸭头丸帖卷.jpg`（简体，KV 漏了"行书"/"卷"）。**对策**：经 Commons API `srsearch=<藏品名>` 取真实 `File:` 标题与稳定全图 URL（`imageinfo.url`），再填 `commons`/`direct`；脚本 `download_commons` 的 `direct` 参数即为此设（全图直连稳定，绕开 `/thumb/` 与编码坑）。
- **⚠️ MySQL museums 行名可能是全称变体（2026-09-15 秦陵实测）**：meta.json/KV 的 `name`（如「秦始皇帝陵博物院」）与 MySQL `museums` 行名（如「秦始皇帝陵博物院（秦始皇兵马俑博物馆）」）**可能不一致**，`mysql_photo` 精确匹配会 `row not found`。对策：先 `q=<关键词>`（如「兵马俑」）搜出真实全称行，脚本用独立 `MYSQL_NAME` 常量查行/ingest/verify（`supplement_qinling_museum.py` 已固化此模式）；查不到行时**不要**用 `museumProvince` 新建，先确认是否全称变体。
- **后端上传接口公开无鉴权**：任何人可上传。上线后建议加 token/来源校验（待办，不阻塞补馆）。
- **⚠️ Commons `File:` 标题必须从 API 输出原样复制，严禁手抄（2026-09-20 十省馆实测）**：手抄标题极易出错——本轮把 `File:四川川省彭州市太平乡出土-七盘舞杂技画像砖…`（原文就是"四川川省"，无"省"字）误抄成 `四川**省**川省…`，导致 `titles=` 查询 imageinfo 返回 null、Special:FilePath 404、下载重试全败。**对策**：研究阶段一律 `print(repr(title))` 或直接把 JSON 里的 title 写进脚本；`imageinfo` 为 null = 标题错，先用 `generator=search` 取精确标题再下。
- **⚠️ 验证 treasures GET 必须用 MySQL 全称 real_name（2026-09-20 实测）**：`GET /api/museums/treasures` 按 `museumName+province` 重算 dedupe key，MySQL 行名常是全称变体（如「苏州博物馆（苏州民俗博物馆、苏州工艺美术博物馆）」「广东省博物馆（广州鲁迅纪念馆）」「安徽博物院（安徽省文物鉴定站）」）。用短名查询 → key 不匹配 → 后端忽略过滤返回全局前 50 行 → **假 FAIL/假数据**。端到端验证要用脚本日志里的 `real_name` 原文。
- **⚠️ /api/museums GET 有 CDN 缓存，写库后别信公网 GET（2026-09-20 实测）**：ingest 成功后 `GET /api/museums?q=` 可能仍返回旧 imageUrl（热链/空）。先直连源站分辨缓存 vs 写失败：`curl -sk -H "Host: museumcheck.cn" "https://43.143.241.181/api/museums?year=<年>&q=<关键词>&limit=5"`——源站已是新值即为缓存，无需重写。
- **山西博物院/首博/皖博等官方藏品补充来源（2026-09-20）**：Kcx36（四川博物院藏系列，文件名自证馆藏）、Cangminzho（注意其金节 03699 是**国博**藏品，勿用于皖博）、Windmemories（安徽/河南）、Underbar dk（山西博物院）、G41rn8（山西博物院 2009 系列）、Zhangzhugang（江西省博物馆 2018 系列，文件描述自证馆藏+出土信息）。Gary Todd（CC0）照片馆藏需逐张核 category，勿按文件名推断（其"Shandong"铜钺实为国博）。**山东博物馆暂缓**：亚醜钺/颂簋/九旒冕均无该馆自由图，仅蛋壳黑陶杯有图（G41rn8 Jinan 2009 系列）。
- **⚠️ meta.json 藏品署名映射 bug（2026-09-19 南湖+嘉兴4馆实测）**：`patch_or_add_meta` 从 `m["treasures"]` 取字段时，藏品 dict 用的是 `holder`/`attr` 键，但旧代码误写成读 `copyrightHolder`/`attribution`（两者在 dict 里不存在，被 `.get(..., "CC")` 兜底成字符串 `"CC"`）——导致已上线馆的 `data/museums-meta.json` 与生成的 `js/museums-meta.js` 里 `copyrightHolder`/`attribution` 全错写成 `"CC"`，**版权署名完全丢失**。修复：映射时显式 `copyrightHolder = t.get("holder")`、`attribution = t.get("attr")`（已在 `supplement_jiaxing_museums.py` 修）。**教训**：藏品 dict 的键是 `holder`/`attr`（给 Commons 上传者署名），meta/MySQL 落库时映射成 `copyrightHolder`/`attribution`（前端字段名），两处命名不同，写映射时别抄错。若发现历史馆署名是 `"CC"`，按 `（省份_馆名）` 反查脚本 `MUSEUMS` 定义回填即可（参考 `supplement_nanhu_fix_attr.py` 的 `fix_existing_attr`）。

## 复用资产
- 模板脚本：`supplement_museum_template.py`（本 skill 目录）。复制进项目 `devops/scripts/`，填 `NAME/ID/PROV/MID/TREASURES/IMG_*` 常量后运行即可完成四端落库。
- 历史参考实现（已提交 dev）：`devops/scripts/supplement_zhenjiang_museum.py`、`supplement_gansu_museum.py`、`supplement_hebei_museum.py`、`supplement_nanjing_museum.py`、`supplement_hubei_museum.py`、`supplement_forbidden_city.py`、`supplement_national_museum.py`、`supplement_shanghai_museum.py`。**最完整的三个头部馆脚本**（含 `direct` 直连全图 + `maybe_resize` 循环缩放 + `upload_image` 409 幂等 + `optional` 容错）：`supplement_forbidden_city.py`（含大禹治水玉山 optional 留空）、`supplement_national_museum.py`、`supplement_shanghai_museum.py`——与当前模板结构一致，建议新馆直接复制 `supplement_forbidden_city.py` 改常量即可。模板 `supplement_museum_template.py` 现已内置上述全部修复。另有 `supplement_qinling_museum.py`（含 `MYSQL_NAME` 全称变体处理），可作为「MySQL 馆名≠meta 名」场景的参考。`supplement_jiaxing_museums.py`（2026-09-17）为**批量多馆**脚本：单文件 `MUSEUMS` 列表循环处理 4 馆，新馆自动 append 到 `meta.json`（不再仅 patch 现有 id），MySQL 写库时抓取 GET 返回的 `real_name` 回写 treasures 的 `museumDedupeKey` 防孤儿行；某馆 Commons 无馆照则 `photo=None`、image 留空仅补藏品。可作为「一次补多个市县馆」的参考。`supplement_nanhu_fix_attr.py`（2026-09-19）是它的补丁版：import 复用其全部 helper，先 `fix_existing_attr` 把嘉兴4馆错写成 `"CC"` 的署名回填正确作者，再新增南湖革命纪念馆（MySQL 全称 `南湖革命纪念馆（红船精神研究院）`）。`supplement_provincial_museums_10.py`（2026-09-20）为**十大省级大馆批量**参考：苏浙粤川辽晋首都皖赣黔 10 馆 28 藏品，含 isUserAdded 保留 + 全称变体兜底 + 全角文件名修正记录；本轮 `?v=20260920-1` 两段式提交一次成功（CDN 字节数与本地一致，免二次 bump）。
