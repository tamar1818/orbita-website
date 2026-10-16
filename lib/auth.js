'use strict';
/**
 * ავტორიზაცია: პაროლის ჰეში (scrypt) — DATA_DIR/auth.json; სესია — ხელმოწერილი cookie (HMAC).
 */
const crypto = require('crypto');
const { read, write } = require('./core');

const COOKIE = 'webico_cms';
const MAX_TRIES = 6;
const LOCK_SECONDS = 900;
const SESSION_DAYS = 7;

let secretCache = null;
function secret() {
  if (secretCache) return secretCache;
  if (process.env.SESSION_SECRET) return (secretCache = process.env.SESSION_SECRET);
  const s = read('secret', {});
  if (s.key) return (secretCache = s.key);
  const key = crypto.randomBytes(32).toString('hex');
  write('secret', { key });
  return (secretCache = key);
}

/* ---------------------------------------------------------------- პაროლი */
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return 'scrypt$' + salt + '$' + h;
}
function verifyPassword(pw, stored) {
  const [alg, salt, h] = String(stored || '').split('$');
  if (alg !== 'scrypt' || !salt || !h) return false;
  const calc = crypto.scryptSync(String(pw), salt, 64);
  const want = Buffer.from(h, 'hex');
  return want.length === calc.length && crypto.timingSafeEqual(want, calc);
}

function config() { return read('auth', {}); }
function isInstalled() { return Boolean(config().hash); }
function install(user, pw) { return write('auth', { user, hash: hashPassword(pw) }); }

/* ---------------------------------------------------------------- სესია */
function sign(data) { return crypto.createHmac('sha256', secret()).update(data).digest('base64url'); }

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function loadSession(req) {
  const raw = parseCookies(req)[COOKIE] || '';
  const [data, mac] = raw.split('.');
  if (data && mac) {
    const good = sign(data);
    if (good.length === mac.length && crypto.timingSafeEqual(Buffer.from(good), Buffer.from(mac))) {
      try {
        const s = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
        if (s && s.exp > Date.now()) return s;
      } catch { /* */ }
    }
  }
  return { csrf: crypto.randomBytes(24).toString('hex') };
}

function saveSession(req, res, s) {
  s.exp = Date.now() + SESSION_DAYS * 864e5;
  const data = Buffer.from(JSON.stringify(s)).toString('base64url');
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.append('Set-Cookie', `${COOKIE}=${data}.${sign(data)}; Path=/admin; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}; Max-Age=${SESSION_DAYS * 86400}`);
}

function clearSession(res) {
  res.append('Set-Cookie', `${COOKIE}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function csrfOk(s, token) {
  const a = Buffer.from(String(s.csrf || ''));
  const b = Buffer.from(String(token || ''));
  return a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ------------------------------------------------- მცდელობების შეზღუდვა (IP) */
const tries = new Map();
function lockedFor(ip) {
  const t = tries.get(ip);
  if (!t || t.n < MAX_TRIES) return 0;
  const left = LOCK_SECONDS - Math.floor((Date.now() - t.last) / 1000);
  if (left <= 0) { tries.delete(ip); return 0; }
  return left;
}

function login(ip, user, pw) {
  const c = config();
  const ok = Boolean(c.hash) && String(c.user || '') === user && verifyPassword(pw, c.hash);
  if (!ok) {
    const t = tries.get(ip) || { n: 0, last: 0 };
    tries.set(ip, { n: t.n + 1, last: Date.now() });
    return false;
  }
  tries.delete(ip);
  return c.user;
}

module.exports = { isInstalled, install, loadSession, saveSession, clearSession, csrfOk, lockedFor, login };
