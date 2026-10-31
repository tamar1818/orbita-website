'use strict';
/**
 * Webico CMS — ბირთვი: გზები, JSON-საცავი, ესქეიპი, ტექსტები, თარიღები.
 * მონაცემები ინახება JSON ფაილებში — ბაზა არ სჭირდება.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Next.js-ის სერვერული ბანდლი სხვა საქაღალდიდან ეშვება, ამიტომ ძირი = პროცესის საქაღალდე
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const SEED_DIR = path.join(ROOT, 'content');
// ცვალებადი მონაცემები (ლიდები, ჯავშნები, პაროლი, ადმინის ცვლილებები).
// Hostinger-ზე DATA_DIR მიუთითეთ აპის გარეთ არსებულ საქაღალდეზე, რომ redeploy-მა არ წაშალოს.
/** საქაღალდე ჩაწერადია? თუ არა — სარეზერვო ვარიანტი (საიტი მაინც იმუშავებს) */
function writableDir(wanted, fallback, label) {
  if (!wanted) return fallback;
  const dir = path.resolve(wanted);
  try {
    fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, '.write-test');
    fs.writeFileSync(probe, 'ok');
    fs.unlinkSync(probe);
    return dir;
  } catch (err) {
    console.error(`${label}=${wanted} ვერ ჩაიწერა (${err.code}) — ვიყენებ ${fallback}`);
    return fallback;
  }
}
const DATA_DIR = writableDir(process.env.DATA_DIR, SEED_DIR, 'DATA_DIR');
const UPLOADS_DIR = writableDir(process.env.UPLOADS_DIR, path.join(ROOT, 'uploads'), 'UPLOADS_DIR');
console.log('მონაცემები:', DATA_DIR, '| ფოტოები:', UPLOADS_DIR);
const UPLOADS_URL = 'assets/img/uploads';

process.env.TZ = process.env.TZ || 'Asia/Tbilisi';

/* ------------------------------------------------------------- JSON საცავი */
const cache = new Map(); // name -> {mtime, data}

function filePath(name) {
  const base = path.basename(name) + '.json';
  const p = path.join(DATA_DIR, base);
  if (fs.existsSync(p)) return p;
  const seed = path.join(SEED_DIR, base);
  return fs.existsSync(seed) ? seed : p;
}

function read(name, fallback = {}) {
  const p = filePath(name);
  let st;
  try { st = fs.statSync(p); } catch { return clone(fallback); }
  const c = cache.get(p);
  if (c && c.mtime === st.mtimeMs) return clone(c.data);
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (data && typeof data === 'object') {
      cache.set(p, { mtime: st.mtimeMs, data });
      return clone(data);
    }
  } catch { /* დაზიანებული ფაილი */ }
  return clone(fallback);
}

/** ატომური ჩაწერა: ჯერ დროებით ფაილში, მერე rename */
function write(name, data) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const p = path.join(DATA_DIR, path.basename(name) + '.json');
    const tmp = p + '.' + crypto.randomBytes(4).toString('hex') + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 4));
    fs.renameSync(tmp, p);
    cache.delete(p);
    return true;
  } catch (e) {
    console.error('write failed', name, e.message);
    return false;
  }
}

function clone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }

/* -------------------------------------------------------------- დამხმარეები */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
function e(v) { return String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]); }

function slug(v) {
  return String(v || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** ტექსტი: ადმინის რედაქტირებული ვერსია, თუ არა — საწყისი (ესქეიპებული) */
function T(key, def = '') {
  const v = (read('site').texts || {})[key] || '';
  return e(v !== '' ? v : def);
}

/** იგივე, ოღონდ <br>, <em>, <strong>, <span> დაშვებულია */
function T_html(key, def = '') {
  const v = (read('site').texts || {})[key] || '';
  return stripTags(v !== '' ? v : def, ['br', 'em', 'strong', 'span']);
}

function stripTags(html, allowed = []) {
  return String(html).replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag) =>
    allowed.includes(tag.toLowerCase()) ? m : '');
}

function setting(key, def = '') {
  const s = read('site').settings || {};
  return e(s[key] ?? def);
}

/** React-ისთვის: იგივე ტექსტი და პარამეტრი, ოღონდ ესქეიპის გარეშე (React თავად ესქეიპავს) */
function txt(key, def = '') {
  const v = (read('site').texts || {})[key] || '';
  return String(v !== '' ? v : def);
}
function opt(key, def = '') {
  const s = read('site').settings || {};
  return String(s[key] ?? def);
}

/** ადგილობრივი (თბილისის) თარიღი Y-m-d და Y-m-d H:i */
function pad(n) { return String(n).padStart(2, '0'); }
function today(d = new Date()) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function nowStamp(d = new Date()) { return today(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function ts() { return Math.floor(Date.now() / 1000); }

/** მისამართი ძირიდან */
/** პროექტის ფოტოს/ვიდეოს ვერსია ბრაუზერის ქეშისთვის: ფაილის შეცვლისას ბმულიც იცვლება */
const versions = new Map();
function ver(rel) {
  if (!versions.has(rel)) {
    let v = '';
    try { v = '?v=' + crypto.createHash('md5').update(fs.readFileSync(path.join(PUBLIC, rel))).digest('hex').slice(0, 8); } catch { /* */ }
    versions.set(rel, v);
  }
  return versions.get(rel);
}

function url(p) {
  p = String(p || '').trim();
  if (p === '' || /^(https?:)?\/\//i.test(p) || p.startsWith('/')) return p;
  const rel = p.replace(/^[./]+/, '');
  return '/' + rel + (/^assets\/(img\/(?:work|blog)|video)\/[^?]+$/.test(rel) ? ver(rel) : '');
}

function isEmail(v) { return /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]{2,}$/.test(String(v || '')); }

module.exports = {
  ROOT, PUBLIC, SEED_DIR, DATA_DIR, UPLOADS_DIR, UPLOADS_URL,
  read, write, e, slug, T, T_html, txt, opt, stripTags, setting, today, nowStamp, ts, pad, url, isEmail,
};
