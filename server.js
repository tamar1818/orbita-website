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
function html(res, body, status = 200) {
  res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, must-revalidate' }).send(withFooter(withWhatsApp(withLang(body, res.req ? res.req.path : '/'))));
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
const page = (mod) => (req, res, next) => {
  try { html(res, require(mod).render(req)); } catch (err) { next(err); }
};
app.get('/', page('./pages/home'));
app.get('/work', page('./pages/work'));
app.get('/work-:slug', (req, res, next) => {
  const out = require('./pages/project').render(req.params.slug);
  out === null ? next() : html(res, out);
});
app.get('/blog', page('./pages/blog'));
app.get('/blog/:slug', (req, res, next) => {
  const out = require('./pages/post').render(req.params.slug);
  out === null ? next() : html(res, out);
});
app.get('/plans', page('./pages/plans'));
app.get('/start', page('./pages/start'));
for (const n of ['terms', 'privacy', 'refund', 'delivery']) app.get('/' + n, (req, res) => html(res, require('./pages/legal').render(n)));
for (const n of ['wordpress', 'ecommerce', 'maintenance']) {
  app.get('/service-' + n, (req, res) => html(res, servicePage(require('./data/services/' + n + '.json'))));
}
for (const n of require('./pages/niche').SLUGS) app.get('/' + n, (req, res) => html(res, require('./pages/niche').render(n)));
/* ------------------------------------------------------------ English */
const EN = () => require('./pages/en/pages');
const enPage = (fn) => (req, res, next) => { try { html(res, fn()); } catch (err) { next(err); } };
app.get('/en', enPage(() => require('./pages/en/home').render()));
app.get('/en/about', enPage(() => EN().about()));
app.get('/en/services', enPage(() => EN().services()));
app.get('/en/work', enPage(() => EN().work()));
app.get('/en/contact', enPage(() => EN().contact()));
for (const n of require('./pages/en/service').SLUGS) app.get('/en/' + n, enPage(() => require('./pages/en/service').render(n)));
app.get('/en/pricing', enPage(() => require('./pages/en/pricing').render()));
for (const n of ['privacy', 'terms']) app.get('/en/' + n, enPage(() => require('./pages/en/legal').render(n)));
app.get('/en/work-:slug', (req, res, next) => {
  const out = EN().projectPage(req.params.slug);
  out === null ? next() : html(res, out);
});

app.get('/sitemap.xml', (req, res) => {
  res.set({ 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' }).send(require('./pages/sitemap').render());
});
app.get('/:name', (req, res, next) => {
  if (!/^[a-z0-9-]+$/.test(req.params.name) || req.params.name === '404') return next();
  const out = staticPage(req.params.name);
  out === null ? next() : html(res, out);
});

/* ------------------------------------------------------------------ 404 */
app.use((req, res) => html(res, /^\/en(\/|$)/.test(req.path) ? EN().notFound() : (staticPage('404') || 'Not found'), 404));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  html(res, '<!doctype html><meta charset="utf-8"><title>შეცდომა</title><p style="font-family:sans-serif;padding:40px">სერვერის შეცდომა. სცადეთ მოგვიანებით.</p>', 500);
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log('Webico: http://localhost:' + PORT));
