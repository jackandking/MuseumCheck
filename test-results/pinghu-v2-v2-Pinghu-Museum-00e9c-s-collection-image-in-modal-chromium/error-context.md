# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - text: "// Build parent tasks URL with focus=parent function buildParentTasksURL() { const params = new URLSearchParams(); params.set('museum', museumId); params.set('focus', 'parent'); return `index.html?${params.toString()}`; } // Wire parent tasks links document.addEventListener('DOMContentLoaded', () => { const link = document.getElementById('parentTasksLink'); if (link) link.setAttribute('href', buildParentTasksURL()); const btn = document.getElementById('viewParentTasks'); if (btn) btn.addEventListener('click', () => { window.location.href = buildParentTasksURL(); }); });"
  - generic [ref=e2]:
    - button "☰" [ref=e3] [cursor=pointer]
    - button "⚙️" [ref=e4] [cursor=pointer]
  - heading "小淘气的任务" [level=1] [ref=e5]
  - generic [ref=e6]: 平湖博物馆
  - generic [ref=e8]: 已完成 0/2 个任务
  - generic [ref=e10]:
    - generic [ref=e11] [cursor=pointer]:
      - generic [ref=e12]: ✓
      - generic [ref=e13]: 📸
      - generic [ref=e14]: 门口打卡
      - generic [ref=e15]: 家长给孩子在博物馆门口拍一张照片
    - generic [ref=e16] [cursor=pointer]:
      - generic [ref=e17]: ✓
      - generic [ref=e18]: 📸
      - generic [ref=e19]: 亲子合影
      - generic [ref=e20]: 和家长比心/拥抱/击掌等动作合影
```