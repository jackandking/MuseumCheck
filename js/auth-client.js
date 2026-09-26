/**
 * auth-client.js — 过渡方案：手机号 + 自设密码 登录/注册客户端
 *
 * 设计要点（与后端 authApi.js 对齐）：
 *  - 仅做长度校验，不校验手机号真实性、不依赖短信（将来短信就绪，前端改传 code 即可）。
 *  - JWT 存 localStorage（key: mc_auth_token）。服务端用 Bearer 头鉴权。
 *  - 非破坏性：本文件只负责"拿到并保存 token"，是否同步业务数据由调用方决定。
 *
 * 【退场线 / 退役计划】本文件是过渡 hack，短信验证码上线后退出：
 *  触发条件：腾讯云短信 签名+模板审核通过、SmsSdkAppId 就绪。
 *  退出动作：register/login 改传 { phone, code }（去掉 password 字段）；后端 loginHandler 已内置 code 分支可直接切。
 *  详细步骤见 auth-ui.js 顶部注释。
 *
 * 依赖：config/api-endpoints.js 须先于本文件加载（提供 window.API_ENDPOINTS.BASE_URL）。
 */
(function (global) {
  'use strict';

  var TOKEN_KEY = 'mc_auth_token';
  var PHONE_KEY = 'mc_auth_phone';

  function baseUrl() {
    var base = (global.API_ENDPOINTS && global.API_ENDPOINTS.BASE_URL) || '';
    return base.replace(/\/+$/, '');
  }

  function read(key) {
    try { return global.localStorage ? global.localStorage.getItem(key) : null; }
    catch (e) { return null; }
  }
  function write(key, val) {
    try { if (global.localStorage && val != null) global.localStorage.setItem(key, val); } catch (e) {}
  }
  function remove(key) {
    try { if (global.localStorage) global.localStorage.removeItem(key); } catch (e) {}
  }

  function getToken() { return read(TOKEN_KEY); }
  function getPhone() { return read(PHONE_KEY); }
  function isLoggedIn() { return !!getToken(); }

  function authHeaders() {
    var h = { 'Content-Type': 'application/json' };
    var t = getToken();
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  }

  function storeSession(token, phone) {
    write(TOKEN_KEY, token);
    if (phone) write(PHONE_KEY, phone);
  }
  function clearSession() {
    remove(TOKEN_KEY);
    remove(PHONE_KEY);
  }

  async function postJSON(path, payload) {
    try {
      // 带鉴权头：登录/注册时无 token 仅 Content-Type；/api/checkin、/api/userdata 等需 Bearer
      var res = await fetch(baseUrl() + path, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });
      var data = await res.json().catch(function () { return {}; });
      return { ok: res.ok, status: res.status, data: data };
    } catch (e) {
      return { ok: false, status: 0, data: { error: (e && e.message) || 'network error' } };
    }
  }

  async function getJSON(path) {
    try {
      var res = await fetch(baseUrl() + path, {
        method: 'GET',
        headers: authHeaders(),
        credentials: 'same-origin'
      });
      var data = await res.json().catch(function () { return {}; });
      return { ok: res.ok, status: res.status, data: data };
    } catch (e) {
      return { ok: false, status: 0, data: { error: (e && e.message) || 'network error' } };
    }
  }

  function extract(result, fallbackPhone) {
    if (result.ok && result.data && result.data.success) {
      var token = result.data.token;
      var phone = (result.data.user && result.data.user.phone) || fallbackPhone;
      storeSession(token, phone);
      return { ok: true, phone: phone };
    }
    return {
      ok: false,
      error: (result.data && result.data.error) || ('操作失败 (HTTP ' + result.status + ')')
    };
  }

  async function register(phone, password) {
    return extract(await postJSON('/api/auth/register', { phone: phone, password: password }), phone);
  }

  async function login(phone, password) {
    return extract(await postJSON('/api/auth/login', { phone: phone, password: password }), phone);
  }

  function logout() { clearSession(); }

  global.AuthClient = {
    TOKEN_KEY: TOKEN_KEY,
    PHONE_KEY: PHONE_KEY,
    getToken: getToken,
    getPhone: getPhone,
    isLoggedIn: isLoggedIn,
    authHeaders: authHeaders,
    register: register,
    login: login,
    logout: logout,
    _postJSON: postJSON,
    _getJSON: getJSON
  };
})(typeof window !== 'undefined' ? window : this);
