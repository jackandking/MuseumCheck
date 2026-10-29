#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
博物馆馆藏图「自托管」补充模板（museumcheck.cn）

流程：研究馆照+N件镇馆之宝 → 从 Commons 下载 → 上传到自己的服务器(后端 /image/upload)
      → 拿到 https://museumcheck.cn/images/<file> 公网 URL → 写透 KV/MySQL/meta.json
      → 重新生成 js/museums-meta.js → 端到端验证。

用法：
  1) 复制本文件到项目 devops/scripts/（如 supplement_<馆拼音>_museum.py）
  2) 填下方常量：MID / NAME / PROV / DEDUP_KEY / 馆照 Commons 文件页 + 可选直连全图 URL /
     TREASURES（每件：名称/朝代/类别/commons 文件页 + 可选 direct 直连全图 URL）
  3) 在 /Users/jak/MuseumCheck 目录下运行：python3 devops/scripts/supplement_<馆>_museum.py

依赖：Python3 标准库（urllib 无第三方依赖）。图片下载走 Commons；上传走 museumcheck.cn/image/upload。

★ 图片全部自托管到 museumcheck.cn，绝不热链第三方；网站与付费 Skill 共用同一 URL。

★ 已固化坑（详见本 skill SKILL.md「关键陷阱」）：
  - 后端 /image/upload 约 >1MB 返回 413 → upload 前 maybe_resize 循环缩小（sips）。
  - upload.wikimedia.org 的 /thumb/ 路径本沙箱间歇 000 → download_commons 优先用 direct 全图 URL + API 原图兜底。
  - 后端按文件名去重，重传同名返回 409 → 视为幂等成功（公网可访问即复用）。
  - 写 museum_treasures 必须显式 museumDedupeKey（省_馆名），否则会造出读不到的孤儿行。
"""
import json, sys, time, os, urllib.request, urllib.parse, urllib.error

# ====================== 填写区 ======================
BASE = "https://museumcheck.cn"
KV_ENDPOINT = "https://rlyhccdr2g.execute-api.us-west-2.amazonaws.com/default/keyValueStore"
YEAR = 2026
MID = "example-museum"          # museums-meta.json 里的 id
NAME = "示例博物馆"              # 馆名（与 MySQL/meta 一致）
PROV = "示例省"                 # 省份（仅作回退；优先用 DEDUP_KEY）
# ★ 强烈建议填 DEDUP_KEY（省_馆名，如 "江苏省_镇江博物馆"），直接用后端去重键，
#   避免用 city 当 province 而写出孤儿行（真实行 provinces=江苏省 读不到）。
DEDUP_KEY = ""                  # 留空则回退 PROV
UA = {"User-Agent": "MuseumCheckBot/1.0 (contact: admin@museumcheck.cn)"}

# 馆照：Commons 文件页标题（File:...）
MUSEUM_PHOTO_COMMONS = "File:Example_museum.jpg"
MUSEUM_PHOTO_FILENAME = "example-museum-photo-v1.jpg"   # 唯一 slug，避免后端去重冲突
# 直连全图路径（可选；当 Special:FilePath 重定向到 /thumb/ 间歇失败时作为稳定候选优先用）
MUSEUM_PHOTO_DIRECT = ""        # 例："https://upload.wikimedia.org/wikipedia/commons/x/xx/File.jpg"

# N 件镇馆之宝（一般 3~6 件）。每件可加 "optional": True（无自由图时失败留空图、不中断）。
# 也可加 "direct": "<全图URL>" 直连兜底（文件含全角逗号/空格时尤其有用）。
TREASURES = [
    {
        "name": "藏品一", "dynasty": "西周", "category": "青铜器",
        "commons": "File:Example_treasure_1.jpg",
        "filename": "example-museum-t1-v1.jpg",
        "direct": "",   # 可选：直连全图 URL 兜底
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Example_treasure_1.jpg",
        "description": "一句话亮点（出土/尺寸/意义）。",
        "rightsType": "CC", "license": "CC BY-SA 4.0", "copyrightHolder": "Wikimedia Commons",
        "attribution": "CC BY-SA 4.0, via Wikimedia Commons",
        # 图片来源类型（入库护栏白名单）: commons-cc / unsplash / pexels / official-takedown-ready
        "sourceType": "commons-cc",
        # "optional": True,   # 无自由图时下载失败则 imageUrl 留空，不中断脚本
    },
    # ... 复制成 N 件
]
IMG_RIGHTS_NOTE = "图片版权归原作者所有；本服务仅提供信息检索与整理，不包含图片版权授权。"

# 馆照署名（2026-09-19 政策：馆照也必须可审计）。经 Commons API extmetadata 查
# LicenseShortName / Artist 后手工填这里；不填则馆照不写署名字段（前端不渲染署名块）。
MUSEUM_PHOTO_LICENSE = ""       # 例："CC BY-SA 4.0" 或 "CC0"
MUSEUM_PHOTO_ARTIST = ""        # 例："Windmemories"
MUSEUM_PHOTO_SOURCE_URL = ""    # 例："https://commons.wikimedia.org/wiki/File:Example_museum.jpg"

# ---- 入库护栏（政策 2026-09-19）：CC BY-NC / ND / 无许可一律拒绝 ----
SOURCE_TYPE_WHITELIST = {"commons-cc", "unsplash", "pexels", "official-takedown-ready"}


def validate_sources(treasures):
    import re as _re
    bad = []
    for t in treasures:
        lic = (t.get("license") or "").strip()
        st = (t.get("sourceType") or "").strip()
        if st and st not in SOURCE_TYPE_WHITELIST:
            bad.append(f"{t['name']}: sourceType「{st}」不在白名单")
        if _re.search(r"NC|ND|NonCommercial|NoDeriv", lic, _re.I):
            bad.append(f"{t['name']}: 许可「{lic}」为 NC/ND，禁止入库")
        if not lic:
            bad.append(f"{t['name']}: 无许可声明，禁止入库")
    if bad:
        for b in bad:
            print("❌ 护栏拒绝:", b)
        raise SystemExit("图片来源未过白名单，请换图后再补。")
    print(f"  护栏通过: {len(treasures)} 件藏品许可均在白名单内")


def museum_photo_fields():
    """馆照署名字段（meta/KV 顶层）。未配置则返回空 dict。"""
    if not MUSEUM_PHOTO_LICENSE:
        return {}
    artist = MUSEUM_PHOTO_ARTIST or "Wikimedia Commons"
    attr = f"{MUSEUM_PHOTO_LICENSE}, via Wikimedia Commons" if artist == "Wikimedia Commons" \
        else f"{artist} / {MUSEUM_PHOTO_LICENSE}, via Wikimedia Commons"
    fields = {"imageSourceType": "commons-cc", "imageLicense": MUSEUM_PHOTO_LICENSE,
              "imageCopyrightHolder": artist, "imageAttribution": attr}
    if MUSEUM_PHOTO_SOURCE_URL:
        fields["imageSourceUrl"] = MUSEUM_PHOTO_SOURCE_URL
    return fields

# ===================================================


def http_json(url, data=None, headers=None, method="GET", timeout=60):
    h = dict(UA); h.update(headers or {})
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, json.loads(r.read().decode())


def download_commons(file_title, dest, width=960, tries=5, direct=None):
    """从 Commons 下载原图。本沙箱 upload.wikimedia.org 的 /thumb/ 路径间歇 000，但
    /commons/<hash>/ 全图路径稳定，故 priority：direct 全图 > Special:FilePath > Commons API 原图兜底。"""
    fname = file_title.split(":", 1)[1] if ":" in file_title else file_title
    candidates = []
    if direct:
        candidates.append(direct)  # 可靠的全图直连优先
    candidates.append("https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(fname) + f"?width={width}")
    for i in range(tries):
        for c in candidates:
            try:
                req = urllib.request.Request(c, headers=UA)
                with urllib.request.urlopen(req, timeout=25) as r:
                    data = r.read()
                if data and len(data) > 100:
                    open(dest, "wb").write(data)
                    return True
            except Exception:
                continue
        # 仅首轮：经 Commons API 取直连「原始全图」URL（/commons/<hash>/，稳定）与缩略图 URL
        if i == 0:
            try:
                api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
                    {"action": "query", "titles": file_title, "prop": "imageinfo",
                     "iiprop": "url", "iiurlwidth": width, "format": "json"})
                with urllib.request.urlopen(urllib.request.Request(api, headers=UA), timeout=25) as r:
                    d = json.loads(r.read().decode())
                page = next(iter(d.get("query", {}).get("pages", {}).values()))
                if "imageinfo" in page:
                    ii = page["imageinfo"][0]
                    if ii.get("url"):
                        candidates.append(ii["url"])           # 原始全图（非 /thumb/，稳定）
                    if ii.get("thumburl"):
                        candidates.append(ii["thumburl"])
            except Exception:
                pass
        if i < tries - 1:
            time.sleep(1 + i)
    print(f"  ! 下载失败 {file_title}")
    return False


def maybe_resize(path, max_bytes=900000, max_dim=1000):
    """后端 /image/upload 约 >1MB 返回 413。超大图用 macOS 自带 sips 反复缩小最长边，
    直到体积 <= max_bytes（兜底到 400px 仍超则告警）。单缩一次常不够（平复帖/后母戊鼎实测），故循环。"""
    try:
        if os.path.getsize(path) <= max_bytes:
            return
        dim = max_dim
        while os.path.getsize(path) > max_bytes and dim > 400:
            dim = int(dim * 0.85)
            tmp2 = path + ".rsz.jpg"
            os.system(f'sips -Z {dim} "{path}" --out "{tmp2}" 2>/dev/null')
            if os.path.exists(tmp2) and os.path.getsize(tmp2) > 0:
                os.replace(tmp2, path)
            else:
                break
        if os.path.getsize(path) > max_bytes:
            print(f"  ! resize 仍超 {os.path.getsize(path)//1024}KB，可能 413：{os.path.basename(path)}")
        else:
            print(f"  (resized -> {os.path.getsize(path)//1024}KB) {os.path.basename(path)}")
    except Exception as e:
        print(f"  ! resize 跳过 {path}: {e}")


def upload_image(local_path, filename, tries=3):
    """POST /image/upload (multipart) → 返回公网 URL。后端按文件名去重，重传同名返回 409
    （内容相同）→ 公网可访问即视为幂等成功、复用 URL。"""
    expected = "https://museumcheck.cn/images/" + filename
    boundary = "----McheckBoundary%d" % int(time.time()*1000)
    body = b"\r\n".join([
        ("--" + boundary).encode(),
        ('Content-Disposition: form-data; name="file"; filename="%s"' % filename).encode(),
        b"Content-Type: image/jpeg", b"", open(local_path, "rb").read()])
    payload = b"\r\n" + body + b"\r\n--" + boundary.encode() + b"--\r\n"
    for i in range(tries):
        try:
            st, resp = http_json(BASE + "/image/upload", data=payload,
                                 headers={"Content-Type": "multipart/form-data; boundary=" + boundary},
                                 method="POST")
            if resp.get("success"):
                rel = resp.get("path") or resp.get("filename")
                return "https://museumcheck.cn/" + rel
        except urllib.error.HTTPError as e:
            if e.code == 409:
                if verify_public(expected):
                    print(f"  (409 同名已存在，复用) {filename}")
                    return expected
                print(f"  ! 409 但公网不可访问 {filename}")
                return None
            if i < tries - 1:
                time.sleep(2 + i * 2); continue
            print(f"  ! 上传失败 {filename}: HTTP {e.code}")
            return None
        except Exception as e:
            if i < tries - 1:
                time.sleep(2 + i * 2); continue
            print(f"  ! 上传失败 {filename}: {e}")
    return None


def verify_public(url):
    try:
        req = urllib.request.Request(url, headers=UA, method="HEAD")
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status == 200 and str(r.headers.get("Content-Type", "")).startswith("image/")
    except Exception:
        try:
            req = urllib.request.Request(url, headers={**UA, "Range": "bytes=0-0"}, method="GET")
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.status in (200, 206) and str(r.headers.get("Content-Type", "")).startswith("image/")
        except Exception:
            return False


def kv_post(key, sort_key, value):
    payload = {"key": key, "sortKey": sort_key, "value": json.dumps(value, ensure_ascii=False),
               "expireAt": int(time.time()) + 365 * 24 * 60 * 60}
    req = urllib.request.Request(KV_ENDPOINT, data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, json.loads(r.read().decode())


def patch_meta_json(img_museum, treasures):
    meta = json.load(open("data/museums-meta.json", encoding="utf-8"))
    photo_fields = museum_photo_fields()
    for m in meta:
        if m.get("id") == MID:
            m["image"] = img_museum
            m["hasCollections"] = True
            m["collections"] = [{k: t[k] for k in ("name", "dynasty", "category", "imageUrl",
                            "description", "sourceUrl", "rightsType", "license", "copyrightHolder",
                            "attribution", "sourceType")}
                            for t in treasures]
            m.update(photo_fields)   # 馆照署名（未配置则为空 dict，不写字段）
            break
    json.dump(meta, open("data/museums-meta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("  meta.json updated")


def write_kv(img_museum, treasures):
    meta = json.load(open("data/museums-meta.json", encoding="utf-8"))
    entry = next((x for x in meta if x.get("id") == MID), None)
    tags = entry.get("tags", [NAME]) if entry else [NAME]
    kv_data = {"id": MID, "name": NAME, "location": entry.get("location", ""), "tags": tags,
               "image": img_museum, "level": entry.get("level", "一级"),
               "hasCollections": True, "collections": treasures,
               "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    kv_data.update(museum_photo_fields())   # 馆照署名（未配置则不写）
    st, body = kv_post(f"museum-data-{MID}", "museum", kv_data)
    return st == 200


def mysql_photo(img_museum):
    st0, d = http_json(f"{BASE}/api/museums?year={YEAR}&q={urllib.parse.quote(NAME)}&limit=5")
    row = next((x for x in d.get("museums", []) if x.get("name") == NAME), None)
    if not row:
        print("  ! MySQL row not found for", NAME); return False
    vc = row.get("visitorCount"); inv = None
    if vc is not None:
        a = int(str(vc).replace(",", "")); inv = a / 10000.0
        if round(inv * 10000) != a:
            print(f"  ! visitorCount round-trip unsafe ({vc}); 跳过补照"); return False
    rec = dict(row); rec["imageUrl"] = img_museum; rec["visitorCount"] = inv
    st, body = http_json(f"{BASE}/api/museums/ingest", data=json.dumps({"year": YEAR, "records": [rec]}).encode(),
                         headers={"Content-Type": "application/json"}, method="POST")
    return st == 200


def mysql_treasures(treasures):
    records = []
    for t in treasures:
        rec = {"museumName": NAME, "name": t["name"],
            "dynasty": t["dynasty"], "category": t["category"], "description": t["description"],
            "imageUrl": t["imageUrl"], "sourceUrl": t["sourceUrl"], "rightsType": t["rightsType"],
            "license": t["license"], "copyrightHolder": t["copyrightHolder"],
            "attribution": t["attribution"], "sourceType": t.get("sourceType", "commons-cc"),
            "imageRightsNote": IMG_RIGHTS_NOTE}
        # 优先显式 dedupe_key，与 MySQL 现有行一致 → 原地更新不造重复行
        if DEDUP_KEY:
            rec["museumDedupeKey"] = DEDUP_KEY
        else:
            rec["museumProvince"] = PROV
        records.append(rec)
    st, body = http_json(f"{BASE}/api/museums/treasures", data=json.dumps({"records": records}).encode(),
                         headers={"Content-Type": "application/json"}, method="POST")
    return st == 200


def verify(img_museum, treasures):
    print("\n--- VERIFY ---")
    url = f"{KV_ENDPOINT}?key=museum-data-{MID}&sortKey=museum"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        kv = json.loads(r.read().decode())
    raw = kv.get("value")
    if isinstance(raw, list): raw = raw[0].get("value") if isinstance(raw[0], dict) else raw[0]
    obj = json.loads(raw) if isinstance(raw, str) else raw
    kv_ok = (len(obj.get("collections", [])) == len(treasures) and bool(obj.get("image")))
    print(f"  KV: collections={len(obj.get('collections', []))} image={'Y' if obj.get('image') else 'N'} -> {'OK' if kv_ok else 'BAD'}")

    st, d = http_json(f"{BASE}/api/museums?year={YEAR}&q={urllib.parse.quote(NAME)}&limit=3&_cb={int(time.time()*1000)}")
    r = next((x for x in d.get("museums", []) if x.get("name") == NAME), None)
    photo_ok = bool(r and r.get("imageUrl"))
    print(f"  MySQL photo: image={'Y' if photo_ok else 'N'} -> {'OK' if photo_ok else 'BAD'}")

    st, d2 = http_json(f"{BASE}/api/museums/treasures?year={YEAR}&museumName={urllib.parse.quote(NAME)}&province={urllib.parse.quote(PROV)}&limit=10",
                      headers={"Origin": "https://museumcheck.cn"})
    ts = d2.get("treasures") or d2.get("data") or []
    tre_ok = len(ts) >= len([t for t in treasures if t.get("imageUrl")])
    hot = [t for t in ts if (t.get("imageUrl") or "").startswith("http") and "museumcheck.cn" not in t.get("imageUrl")]
    print(f"  MySQL treasures: count={len(ts)} hotlinks={len(hot)} -> {'OK' if tre_ok and not hot else 'BAD'}")
    return kv_ok and photo_ok and tre_ok and not hot


def main():
    tmp = "/tmp/_mcheck_" + MID
    os.makedirs(tmp, exist_ok=True)
    # 0) 来源护栏：未过白名单直接拒绝（先校验再动手，避免白下载白上传）
    print("=== 0) 来源护栏校验 ===")
    validate_sources([t for t in TREASURES if not t.get("optional") or t.get("license")])
    # 1) 馆照
    print("=== 1) 馆照：下载 + 上传 ===")
    p = os.path.join(tmp, MUSEUM_PHOTO_FILENAME)
    if not download_commons(MUSEUM_PHOTO_COMMONS, p, width=1280, direct=MUSEUM_PHOTO_DIRECT or None):
        print("ABORT: 馆照下载失败"); sys.exit(1)
    maybe_resize(p)
    img_museum = upload_image(p, MUSEUM_PHOTO_FILENAME)
    if not img_museum or not verify_public(img_museum):
        print("ABORT: 馆照上传/公网验证失败"); sys.exit(1)
    print("  馆照 URL:", img_museum)
    # 2) N 件藏品
    print("\n=== 2) 镇馆之宝：下载 + 上传 ===")
    for t in TREASURES:
        tp = os.path.join(tmp, t["filename"])
        if not download_commons(t["commons"], tp, width=960, direct=t.get("direct") or None):
            if t.get("optional"):
                print(f"  (optional 项 {t['name']} 下载失败，imageUrl 留空)"); t["imageUrl"] = ""; continue
            print(f"ABORT: {t['name']} 下载失败"); sys.exit(1)
        maybe_resize(tp)
        u = upload_image(tp, t["filename"])
        if not u or not verify_public(u):
            if t.get("optional"):
                print(f"  (optional 项 {t['name']} 上传失败，imageUrl 留空)"); t["imageUrl"] = ""; continue
            print(f"ABORT: {t['name']} 上传/公网验证失败"); sys.exit(1)
        t["imageUrl"] = u
        print(f"  {t['name']}: {u}")
    # 3) 写四端
    print("\n=== 3) meta.json ==="); patch_meta_json(img_museum, TREASURES)
    print("=== 4) KV ==="); write_kv(img_museum, TREASURES)
    print("=== 5) MySQL photo ==="); mysql_photo(img_museum)
    print("=== 6) MySQL treasures ==="); mysql_treasures(TREASURES)
    # 4) 重新生成前端
    print("\n=== 7) 重新生成 js/museums-meta.js ===")
    os.system("node devops/tools/generate-museums-meta-js.js")
    ok = verify(img_museum, TREASURES)
    print("\n=== RESULT:", "ALL OK" if ok else "CHECK FAILED ===")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
