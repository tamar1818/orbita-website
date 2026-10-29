'use strict';
/**
 * Webico — ვებ სააგენტოს საიტი და CMS (Node.js / Express).
 * გაშვება: npm start   (PORT — გარემოს ცვლადიდან, ნაგულისხმევად 3000)
 */
process.env.TZ = process.env.TZ || 'Asia/Tbilisi';

const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const { ROOT, UPLOADS_DIR } = require('./lib/core');
const { ASSET_V, withWhatsApp, withLang } = require('./lib/layout');
const { serviceWorkSection } = require('./lib/projects');
const { servicePage } = require('./lib/service');
const { teamSection } = require('./lib/team');
const { withFooter } = require('./lib/blocks');
const { toEnglish, kaPath } = require('./lib/i18n');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(compression());

/* ------------------------------------------------- უსაფრთხოების ჰედერები */
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  });
  next();
});

/* ------------------------------------------------------- გადამისამართებები */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (/^\/(api|admin)(\/|$)/.test(req.path)) return next();
  const q = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  // www → non-www
  const host = String(req.headers.host || '');
  if (/^www\./i.test(host)) return res.redirect(301, 'https://' + host.replace(/^www\./i, '') + req.originalUrl);
  // მხოლოდ ლოკალური მისამართები: „//evil.com“ სხვა საიტზე გადამისამართება არ უნდა გახდეს
  const local = (p) => '/' + p.replace(/^[\/\\]+/, '');
  const p = req.path;
  // /index.html, /index.php → /
  if (/^\/index\.(html|php)$/i.test(p)) return res.redirect(301, '/' + q);
  // /page.html, /page.php → /page
  const m = p.match(/^\/(.+?)\.(html|php)$/i);
  if (m) return res.redirect(301, local(m[1]) + q);
  // ბოლო სლეში
  if (p.length > 1 && p.endsWith('/')) return res.redirect(301, local(p.replace(/\/+$/, '')) + q);
  next();
});

/* ---------------------------------------------------------------- ასეტები */
const longCache = { maxAge: '7d', setHeaders: (res, p) => { if (/\.(svg|png|jpe?g|webp|woff2?)$/i.test(p)) res.set('Cache-Control', 'public, max-age=31536000'); } };
app.use('/assets/img/uploads', express.static(UPLOADS_DIR, { ...longCache, dotfiles: 'deny' }));
app.use('/assets', express.static(path.join(ROOT, 'assets'), { ...longCache, dotfiles: 'deny' }));
for (const f of ['favicon.ico', 'robots.txt']) app.get('/' + f, (req, res) => res.sendFile(path.join(ROOT, f)));

/* ------------------------------------------------------------ HTML პასუხი */
const HTML_HEAD = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, must-revalidate' };
function html(res, body, status = 200) {
  res.status(status).set(HTML_HEAD).send(withFooter(withWhatsApp(withLang(body, res.req ? res.req.path : '/'))));
}
/** ინგლისური: ქართული გვერდი სრულად აიწყობა და ითარგმნება */
function htmlEn(res, body, ka, status = 200) {
  res.status(status).set(HTML_HEAD).send(toEnglish(withFooter(withWhatsApp(withLang(body, ka))), ka));
}

/** სტატიკური გვერდი views/static/-დან: ასეტების ვერსია + სერვისის პროექტები */
const staticCache = new Map();
function staticPage(name) {
  let src = staticCache.get(name);
  if (src === undefined) {
    const p = path.join(ROOT, 'views/static', name + '.html');
    src = fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/\?v=[0-9a-f]{8}/g, '?v=' + ASSET_V) : null;
    if (process.env.NODE_ENV === 'production') staticCache.set(name, src);
  }
  return src === null ? null : src.replace(/<!--@work:([a-z-]+)-->/g, (m, k) => serviceWorkSection(k)).replace('<!--@team-->', () => teamSection('ka'));
}

/* ------------------------------------------------------------------ API */
app.use('/api', require('./routes/api'));

/* ------------------------------------------------------------- ადმინი */
app.use('/admin', require('./routes/admin'));

/* -------------------------------------------------------------- გვერდები */
/** ქართული გვერდის HTML მისამართით (null — თუ ასეთი გვერდი არ არსებობს) */
function kaRender(p, req) {
  const m = (mod) => require(mod);
  if (p === '/') return m('./pages/home').render(req);
  if (p === '/work') return m('./pages/work').render(req);
  if (p === '/blog') return m('./pages/blog').render(req);
  if (p === '/plans') return m('./pages/plans').render(req);
  if (p === '/start') return m('./pages/start').render(req);
  let r = p.match(/^\/work-([a-z0-9-]+)$/);
  if (r) return m('./pages/project').render(r[1]);
  r = p.match(/^\/blog\/([^/]+)$/);
  if (r) return m('./pages/post').render(r[1]);
  r = p.match(/^\/(terms|privacy|refund|delivery)$/);
  if (r) return m('./pages/legal').render(r[1]);
  r = p.match(/^\/service-(wordpress|ecommerce|maintenance)$/);
  if (r) return servicePage(require('./data/services/' + r[1] + '.json'));
  if (m('./pages/niche').SLUGS.includes(p.slice(1))) return m('./pages/niche').render(p.slice(1));
  r = p.match(/^\/([a-z0-9-]+)$/);
  if (r && r[1] !== '404') return staticPage(r[1]);
  return null;
}

/* ------------------------------------------------------------ English */
// ინგლისური გვერდი = ქართული გვერდი, ნათარგმნი data/en/i18n.json-ით (lib/i18n.js)
app.get(/^\/en(\/.*)?$/, (req, res, next) => {
  try {
    const kp = kaPath(req.path);
    const body = kp === null ? null : kaRender(kp, req);
    if (body === null) return next();
    htmlEn(res, body, kp);
  } catch (err) { next(err); }
});

app.get('/sitemap.xml', (req, res) => {
  res.set({ 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' }).send(require('./pages/sitemap').render());
});
app.get(/^\/[^.]*$/, (req, res, next) => {
  try {
    const body = kaRender(req.path, req);
    body === null ? next() : html(res, body);
  } catch (err) { next(err); }
});

/* ------------------------------------------------------------------ 404 */
app.use((req, res) => (/^\/en(\/|$)/.test(req.path) ? htmlEn(res, staticPage('404') || 'Not found', '/404', 404) : html(res, staticPage('404') || 'Not found', 404)));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  html(res, '<!doctype html><meta charset="utf-8"><title>შეცდომა</title><p style="font-family:sans-serif;padding:40px">სერვერის შეცდომა. სცადეთ მოგვიანებით.</p>', 500);
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log('Webico: http://localhost:' + PORT));
