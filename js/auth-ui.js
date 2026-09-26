/**
 * auth-ui.js — 过渡方案登录/注册弹窗
 *
 * 依赖 window.AuthClient（auth-client.js 须先加载）。
 * 在页面右下角注入一个浮动按钮 + 弹窗，登录成功后派发 window 事件
 * 'auth:changed'，供业务页面（如 museum-checkin.js）触发服务端数据合并。
 * 未登录时完全不干扰现有流程。
 */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  if (!window.AuthClient) {
    console.warn('[auth-ui] AuthClient 未加载，登录弹窗不可用');
    return;
  }

  var STYLE_ID = 'auth-ui-style';
  var CSS = [
    '#authFab{position:fixed;left:16px;bottom:16px;z-index:9998;padding:10px 16px;border:none;border-radius:24px;',
    'background:#ff6b6b;color:#fff;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);}',
    '#authFab:hover{background:#ff5252;}',
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
    '#authLogout{width:100%;margin-top:10px;padding:10px;border:1px solid #eee;background:#fff;border-radius:12px;color:#888;cursor:pointer;font-size:14px;}'
  ].join('');

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var fab, overlay, card, toggleReg, toggleLogin, phoneInput, pwInput, submitBtn, errorEl, logoutBtn;
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

  function updateFab() {
    if (!fab) return;
    if (window.AuthClient.isLoggedIn()) {
      var p = window.AuthClient.getPhone() || '';
      fab.textContent = '账户' + (p ? ' · ' + p.slice(-4) : '');
    } else {
      fab.textContent = '登录';
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
      updateFab();
      window.dispatchEvent(new Event('auth:changed'));
    } else {
      showError(result.error || '操作失败');
    }
  }

  function handleLogout() {
    window.AuthClient.logout();
    updateFab();
    close();
    window.dispatchEvent(new Event('auth:changed'));
  }

  function build() {
    ensureStyle();

    fab = document.createElement('button');
    fab.id = 'authFab';
    fab.type = 'button';
    fab.addEventListener('click', open);
    document.body.appendChild(fab);

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
    updateFab();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
