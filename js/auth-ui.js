/**
 * auth-ui.js — 过渡方案登录/注册弹窗（入口在「设置」菜单内，非强制、低存在感）
 *
 * 依赖 window.AuthClient（auth-client.js 须先加载）。
 *
 * 设计约束（来自产品决策 2026-09-26）：
 *  - 【非强制】手机号注册对用户是可选的，不弹出任何提示/横幅，也不作为任何功能的前置条件。
 *    入口只在右上角「设置 ⚙️」里放一个「账户（可选）」项，不打扰现有流程。
 *  - 【退场线 / 退役计划】本方案是过渡 hack，短信验证码就绪后必须可干净退出：
 *      1) 触发条件：腾讯云短信 签名+模板审核通过、SmsSdkAppId 就绪。
 *      2) 前端 auth-client.js 的 register/login 改传 { phone, code }（去掉 password 字段）；
 *         auth-ui.js 把「密码」输入框换成「验证码」、去掉「注册」选项卡、默认即登录。
 *      3) 后端 authApi.js 的 loginHandler 已内置 code 分支，可直接切；password 分支可灰度后删除，
 *         并清理 users 表 pw_hash / pw_salt 两列。
 *      4) 删除本文件里的「过渡方案 / 退场线」文案；「账户」设置项保留为正式登录入口，仅去「可选」标注。
 *      5) 已用 password 注册的账户：升级时首次用 code 登录若该手机无密码记录，走「验证码注册」自动建号。
 *    弹窗内的「过渡方案 · 短信验证码上线后停用」即本退场线的线上可见标识。
 */

(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  if (!window.AuthClient) {
    console.warn('[auth-ui] AuthClient 未加载，账户入口不可用');
    return;
  }

  var STYLE_ID = 'auth-ui-style';
  var CSS = [
    // 设置菜单内的「账户」项（点击展开弹窗）
    '.auth-account-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;}',
    '.auth-account-row:hover{background:#f3f4f6;}',
    '.auth-account-row .settings-label{margin:0;}',
    '#authAccountChevron{color:#9ca3af;font-size:18px;line-height:1;}',
    // 登录/注册弹窗
    '#authOverlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;',
    'background:rgba(0,0,0,.45);}',
    '#authOverlay.open{display:flex;}',
    '#authCard{width:320px;max-width:90vw;background:#fff;border-radius:16px;padding:24px 22px;box-shadow:0 10px 40px rgba(0,0,0,.3);',
    'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;color:#222;}',
    '#authCard h3{margin:0 0 4px;font-size:18px;}',
    '#authCard .sub{margin:0 0 16px;font-size:12px;color:#888;}',
    '#authCard label{display:block;font-size:13px;margin:10px 0 4px;color:#555;}',
    '#authCard input{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #ddd;border-radius:10px;font-size:15px;}',
    '#authCard input:focus{outline:none;border-color:#ff6b6b;}',
    '#authToggle{display:flex;gap:8px;margin-bottom:6px;}',
    '#authToggle button{flex:1;padding:8px;border:1px solid #eee;background:#f7f7f7;border-radius:10px;cursor:pointer;font-size:14px;color:#666;}',
    '#authToggle button.active{background:#ff6b6b;border-color:#ff6b6b;color:#fff;font-weight:600;}',
    '#authSubmit{width:100%;margin-top:16px;padding:12px;border:none;border-radius:12px;background:#ff6b6b;color:#fff;',
    'font-size:15px;font-weight:600;cursor:pointer;}',
    '#authSubmit:hover{background:#ff5252;}',
    '#authError{margin-top:12px;font-size:13px;color:#e53935;min-height:18px;}',
    '#authLogout{width:100%;margin-top:10px;padding:10px;border:1px solid #eee;background:#fff;border-radius:12px;color:#888;cursor:pointer;font-size:14px;}',
    '#authExitNote{margin:14px 0 0;font-size:11px;color:#aaa;text-align:center;line-height:1.5;}'
  ].join('');

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var accountRow, accountLabel, accountHint, overlay, card, toggleReg, toggleLogin, phoneInput, pwInput, submitBtn, errorEl, logoutBtn;
  var mode = 'login';

  function setMode(m) {
    mode = m;
    if (toggleReg) toggleReg.classList.toggle('active', m === 'register');
    if (toggleLogin) toggleLogin.classList.toggle('active', m === 'login');
    if (submitBtn) submitBtn.textContent = (m === 'register' ? '注册并登录' : '登录');
  }

  function showError(msg) { if (errorEl) errorEl.textContent = msg || ''; }

  function close() { if (overlay) overlay.classList.remove('open'); showError(''); }
  function open() {
    if (!window.AuthClient.isLoggedIn()) { setMode('login'); }
    if (overlay) overlay.classList.add('open');
  }

  // 设置项里的「账户」状态随登录态变化
  function updateAccountItem() {
    if (!accountLabel) return;
    if (window.AuthClient.isLoggedIn()) {
      var p = window.AuthClient.getPhone() || '';
      accountLabel.textContent = '已登录' + (p ? ' · ' + p.slice(-4) : '');
      accountHint.textContent = '点击管理账户 / 退出';
    } else {
      accountLabel.textContent = '未登录';
      accountHint.textContent = '可选 · 跨设备保存打卡进度';
    }
  }

  async function handleSubmit() {
    if (!phoneInput || !pwInput) return;
    var phone = phoneInput.value.trim();
    var pw = pwInput.value;
    showError('');
    if (!/^\d{6,20}$/.test(phone)) { showError('手机号需为 6-20 位数字'); return; }
    if (pw.length < 4 || pw.length > 64) { showError('密码长度需为 4-64 位'); return; }
    submitBtn.disabled = true;
    submitBtn.textContent = '处理中…';
    var result = (mode === 'register')
      ? await window.AuthClient.register(phone, pw)
      : await window.AuthClient.login(phone, pw);
    submitBtn.disabled = false;
    submitBtn.textContent = (mode === 'register' ? '注册并登录' : '登录');
    if (result.ok) {
      close();
      updateAccountItem();
      window.dispatchEvent(new Event('auth:changed'));
    } else {
      showError(result.error || '操作失败');
    }
  }

  function handleLogout() {
    window.AuthClient.logout();
    updateAccountItem();
    close();
    window.dispatchEvent(new Event('auth:changed'));
  }

  function buildAccountEntry() {
    var settingsContent = document.querySelector('#settingsModal .settings-content');
    if (!settingsContent) {
      console.warn('[auth-ui] 未找到 #settingsModal，账户入口无法挂载');
      return;
    }
    var section = document.createElement('div');
    section.className = 'settings-section';
    section.id = 'authSettingsSection';
    section.innerHTML = [
      '<h3>📱 账户（可选）</h3>',
      '<div class="settings-item">',
      '  <div class="auth-account-row" id="authAccountRow" role="button" tabindex="0">',
      '    <div>',
      '      <div class="settings-label" id="authAccountLabel">未登录</div>',
      '      <div class="settings-hint" id="authAccountHint">可选 · 跨设备保存打卡进度</div>',
      '    </div>',
      '    <span id="authAccountChevron">›</span>',
      '  </div>',
      '</div>'
    ].join('');
    // 插到第一个 settings-section 之前（即设置面板顶部）
    var first = settingsContent.querySelector('.settings-section');
    settingsContent.insertBefore(section, first);

    accountRow = section.querySelector('#authAccountRow');
    accountLabel = section.querySelector('#authAccountLabel');
    accountHint = section.querySelector('#authAccountHint');
    accountRow.addEventListener('click', open);
    accountRow.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
    updateAccountItem();
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.innerHTML = [
      '<div id="authCard">',
      '  <h3>账户</h3>',
      '  <p class="sub">过渡方案：手机号 + 自设密码（数据存服务端，未来可升级短信验证）</p>',
      '  <div id="authToggle">',
      '    <button id="authToggleLogin" type="button">登录</button>',
      '    <button id="authToggleReg" type="button">注册</button>',
      '  </div>',
      '  <label for="authPhone">手机号</label>',
      '  <input id="authPhone" type="tel" inputmode="numeric" placeholder="6-20 位数字" autocomplete="username">',
      '  <label for="authPw">密码</label>',
      '  <input id="authPw" type="password" placeholder="4-64 位，随意设置" autocomplete="current-password">',
      '  <button id="authSubmit" type="button">登录</button>',
      '  <div id="authError"></div>',
      '  <button id="authLogout" type="button" style="display:none">退出登录</button>',
      '  <p id="authExitNote">过渡方案 · 短信验证码上线后停用</p>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    card = overlay.querySelector('#authCard');
    toggleLogin = overlay.querySelector('#authToggleLogin');
    toggleReg = overlay.querySelector('#authToggleReg');
    phoneInput = overlay.querySelector('#authPhone');
    pwInput = overlay.querySelector('#authPw');
    submitBtn = overlay.querySelector('#authSubmit');
    errorEl = overlay.querySelector('#authError');
    logoutBtn = overlay.querySelector('#authLogout');

    toggleLogin.addEventListener('click', function () { setMode('login'); showError(''); });
    toggleReg.addEventListener('click', function () { setMode('register'); showError(''); });
    submitBtn.addEventListener('click', handleSubmit);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    // 已登录则展示退出
    if (window.AuthClient.isLoggedIn()) {
      logoutBtn.style.display = 'block';
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  function build() {
    ensureStyle();
    buildAccountEntry();
    buildOverlay();
  }

  // 业务页面（museum-checkin.js）在登录态变化时会派发 auth:changed，同步更新设置项
  window.addEventListener('auth:changed', function () { updateAccountItem(); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
