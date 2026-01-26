---
name: museum-mobile-playtest
description: >-
  Mobile playtest checklist for MuseumCheck. Forces Windsurf/Copilot agents to test
  gamified flows in phone mode by jumping into Capital Museum check-in, trimming
  settings to the target mini-game, and validating both the entrance task and the
  Treasure of the Museum finale before reporting results.
---

# Museum Mobile Playtest Protocol

This skill captures the exact steps QA volunteers follow when the team says "测试游戏" for MuseumCheck. Always run it before giving UX, gameplay, or bug feedback.

## When to Trigger
- User explicitly asks to "测试游戏" or "试用一下"
- Requests mentioning 门口打卡、镇馆之宝、小游戏 体验
- Anytime we validate Shared Menu → Capital Museum flow

## Preconditions
1. **Mobile-first browser context**
   - Switch DevTools to iPhone 12/13 viewport (≈390×844) or similar portrait size
   - Enable touch emulation + mobile UA string
   - Keep DPR ≥2 so animations match production
2. **Environment**
   - Local: `http://localhost:8000`
   - Staging: `https://jackandking.github.io/MuseumCheckDev`
3. **Clean storage**
   - Clear `localStorage` keys under `APP_CONFIG.LOCAL_STORAGE_KEYS`
   - Refresh page after clearing

## Step-by-Step Workflow
1. **Enter Mobile Mode**
   - Open browser, toggle device toolbar, choose iPhone preset, refresh once to force responsive CSS.
2. **Navigate to Capital Museum Check-in**
   - From the main menu tap "🏛️ 博物馆打卡"
   - In the museum list choose **首都博物馆** (Capital Museum)
   - Wait for `CapitalMuseumExperience` hero to finish loading (check hero badge + background image)
3. **Trim Settings to Target Game**
   - Tap the `⚙ 设置` button (top right)
   - Under mini-game toggles, disable all modules except the one you're about to test
   - Hit `保存设置` and confirm toast/snackbar text
4. **Entrance Task Validation (门口打卡)**
   - Ensure mission card reads "门口打卡"
   - Complete the task (simulate QR scan or use demo button)
   - ⚠️ **强制上传**：随便拍照或使用示例图片，务必在“点击上传照片”里选择文件再点完成，确保小游戏奖励链路被触发
   - Record: animation success, point increment, leaderboard event
   - Log result in notes (Pass/Fail + screenshot if needed)
5. **Treasure Finale Validation (镇馆之宝)**
   - Re-open settings and switch to the 镇馆之宝 game if different
   - Complete prerequisite steps if prompted (artifact clue, quiz, etc.)
   - Finish the treasure showcase interaction
   - ⚠️ **再次上传**：在完成前必须上传镇馆之宝合影（可用示例图），保证奖励系统判定为真实打卡
   - Confirm reward modal, sound cue, and data sync to Letmetry/mock server
6. **Regression Notes**
   - Capture console warnings, network failures, or unstyled states
   - Mention whether shared menu shortcuts still work afterward

## Reporting Template
```
📱 设备: iPhone viewport 390x844
🏛️ 博物馆: 首都博物馆
🎮 模块: <entrance | treasure>
✅ 结果: Pass/Fail (include symptom if fail)
🧪 步骤: <short bullet list>
📸 证据: <screenshot link if any>
```

## Success Criteria
- Both playthroughs finish without blocking errors
- Points/pet XP updated after each mission
- Settings persist when re-entering the page during the same session
- No desktop-only UI remnants (hover tooltips, oversized fonts)

## Quick Tips
- If page auto-scrolls past the mission list, lock scroll to body using DevTools sensors
- Use `localStorage.getItem('capital-museum-state')` to verify progress when debugging
- For repeated runs, call `window.AppState.resetCurrentMission()` via console, then refresh
