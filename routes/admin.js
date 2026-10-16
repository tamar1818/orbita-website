'use strict';
/** /admin — მართვის პანელი (PHP ვერსიის ზუსტი ანალოგი) */
const path = require('path');
const express = require('express');
const multer = require('multer');
const { read, write, e, slug: toSlug, today, ROOT } = require('../lib/core');
const auth = require('../lib/auth');
const media = require('../lib/media');
const blog = require('../lib/blog');
const booking = require('../lib/booking');
const { SERVICE_KEYS, projectServices } = require('../lib/projects');
const { map, truthy, empty } = require('../lib/tpl');
const FIELDS = require('../data/admin-fields.json');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: media.MAX_UPLOAD, files: 1 } });
const nl2br = (s) => String(s).replace(/(\r\n|\n|\r)/g, '<br />$1');
const str = (v) => String(v ?? '').trim();
const list = (v) => [].concat(v ?? []);

const NAV = {
  dashboard: 'მთავარი', projects: 'პროექტები', posts: 'ბლოგი', media: 'ფოტოები',
  texts: 'ტექსტები', bookings: 'შეხვედრები', settings: 'კონტაქტები', leads: 'განაცხადები',
};

router.use((req, res, next) => { res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }); next(); });
router.get('/admin.css', (req, res) => res.sendFile(path.join(ROOT, 'views/admin/admin.css')));
router.get('/logout.php', (req, res) => { auth.clearSession(res); res.redirect('/admin/index.php?p=login'); });

// /admin → /admin/ (შედარებითი ბმულები index.php?p=… სწორად რომ მუშაობდეს)
router.use((req, res, next) => {
  if (req.originalUrl === '/admin' || req.originalUrl.startsWith('/admin?')) {
    return res.redirect(301, '/admin/' + req.originalUrl.slice('/admin'.length));
  }
  next();
});

const parseForm = express.urlencoded({ extended: true, limit: '2mb', parameterLimit: 2000 });
const maybeUpload = (req, res, next) => (req.is('multipart/form-data')
  ? upload.single('file')(req, res, (err) => { if (err) req.uploadError = err.code === 'LIMIT_FILE_SIZE' ? 'ფაილი 6 MB-ზე დიდია' : 'ატვირთვის შეცდომა'; next(); })
  : parseForm(req, res, next));

router.all(['/', '/index.php'], maybeUpload, (req, res) => {
  const s = auth.loadSession(req);
  const B = req.body || {};
  const isPost = req.method === 'POST';
  let page = String(req.query.p || 'dashboard');
  let msg = '';
  let err = '';
  const done = (body) => { auth.saveSession(req, res, s); res.type('html').send(body); };
  const go = (to) => { auth.saveSession(req, res, s); res.redirect(to); };

  /* ------------------------------------------------------------ Setup */
  if (!auth.isInstalled()) {
    if (isPost) {
      const u = str(B.user);
      const p = String(B.password ?? '');
      if ([...u].length < 3) err = 'მომხმარებლის სახელი მინიმუმ 3 სიმბოლო';
      else if ([...p].length < 10) err = 'პაროლი მინიმუმ 10 სიმბოლო უნდა იყოს';
      else if (p !== String(B.password2 ?? '')) err = 'პაროლები არ ემთხვევა';
      else if (auth.install(u, p)) return go('/admin/index.php?p=login&setup=1');
      else err = 'ჩაწერა ვერ მოხერხდა — შეამოწმეთ მონაცემების საქაღალდის (DATA_DIR) უფლებები';
    }
    page = 'setup';
  } else if (page === 'login') {
    if (isPost) {
      const left = auth.lockedFor(req.ip);
      if (!auth.csrfOk(s, B._csrf)) err = 'სესია ამოიწურა — სცადეთ თავიდან';
      else if (left > 0) err = 'ბევრი მცდელობა. სცადეთ ' + Math.ceil(left / 60) + ' წუთში';
      else {
        const uid = auth.login(req.ip, str(B.user), String(B.password ?? ''));
        if (uid) {
          s.uid = uid;
          s.csrf = require('crypto').randomBytes(24).toString('hex');
          return go('/admin/index.php');
        }
        err = 'მომხმარებელი ან პაროლი არასწორია';
      }
    }
  } else if (!s.uid) {
    return go('/admin/index.php?p=login');
  }

  /* ---------------------------------------------------------- Actions */
  if (s.uid && isPost && page !== 'login' && page !== 'setup') {
    if (!auth.csrfOk(s, B._csrf)) {
      err = 'უსაფრთხოების შემოწმება ვერ გაიარა — გვერდი განაახლეთ';
    } else {
      const action = String(B.action ?? '');
      const save = (name, data, ok, fail = 'შენახვა ვერ მოხერხდა') => { if (write(name, data)) msg = ok; else err = fail; };

      if (action === 'save_texts') {
        const site = read('site');
        site.texts = Object.fromEntries(Object.entries(B.texts || {}).map(([k, v]) => [k, str(v)]));
        save('site', site, 'ტექსტები შენახულია');
      }
      if (action === 'save_settings') {
        const site = read('site');
        site.settings = Object.fromEntries(Object.entries(B.settings || {}).map(([k, v]) => [k, str(v)]));
        save('site', site, 'კონტაქტები შენახულია');
      }
      if (action === 'save_project') {
        const all = read('projects', { projects: [] });
        const items = all.projects || [];
        const slug = toSlug(B.slug);
        if (!slug) err = 'slug სავალდებულოა';
        else {
          const csv = (v) => String(v ?? '').split(',').map((x) => x.trim()).filter(Boolean);
          const item = {
            slug, name: str(B.name), domain: str(B.domain),
            tone: ['lilac', 'lime', 'pink', 'soft'].includes(B.tone) ? B.tone : 'lilac',
            year: str(B.year), partner: str(B.partner), summary: str(B.summary),
            challenge: str(B.challenge), solution: str(B.solution), result: str(B.result),
            shot: str(B.shot), logo: str(B.logo), full: str(B.full), full_caption: str(B.full_caption),
            hide_shot: !empty(B.hide_shot), hidden: !empty(B.hidden),
            tags: csv(B.tags), stack: csv(B.stack),
            scope: String(B.scope ?? '').split('\n').map((x) => x.trim()).filter(Boolean),
            services: Object.keys(SERVICE_KEYS).filter((k) => list(B.services).includes(k)),
          };
          const i = items.findIndex((p) => (p.slug || '') === slug);
          if (i >= 0) items[i] = item; else items.push(item);
          all.projects = items;
          save('projects', all, 'პროექტი შენახულია');
        }
      }
      if (action === 'delete_project') {
        const all = read('projects', { projects: [] });
        const slug = toSlug(B.slug);
        all.projects = (all.projects || []).filter((p) => (p.slug || '') !== slug);
        save('projects', all, 'პროექტი წაიშალა', 'წაშლა ვერ მოხერხდა');
      }
      if (action === 'reorder') {
        const all = read('projects', { projects: [] });
        const by = new Map((all.projects || []).map((p) => [p.slug || '', p]));
        const sorted = [];
        for (const sl of list(B.order)) if (by.has(sl)) { sorted.push(by.get(sl)); by.delete(sl); }
        all.projects = sorted.concat([...by.values()]);
        save('projects', all, 'რიგი განახლდა', 'ვერ განახლდა');
      }
      if (action === 'save_post') {
        const all = read('posts', { posts: [] });
        const items = all.posts || [];
        const slug = toSlug(B.slug);
        const date = String(B.date ?? '');
        if (!slug) err = 'slug სავალდებულოა (ლათინური ასოები, ციფრები და ტირე)';
        else if (!str(B.title)) err = 'სათაური სავალდებულოა';
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) err = 'თარიღი არასწორია';
        else {
          const item = {
            slug, title: str(B.title), excerpt: str(B.excerpt),
            category: Object.prototype.hasOwnProperty.call(blog.CATS, B.category) ? B.category : 'business',
            tone: blog.TONES.includes(B.tone) ? B.tone : 'lilac',
            date, updated: today(), author: str(B.author), cover: str(B.cover), cover_text: str(B.cover_text),
            faq: blog.parseFaq(String(B.faq ?? '')), body: String(B.body ?? ''), hidden: !empty(B.hidden),
          };
          if (item.cover_text === '') delete item.cover_text;
          const orig = toSlug(B.orig_slug);
          const i = items.findIndex((p) => (p.slug || '') === (orig || slug));
          if (i >= 0) items[i] = item;
          else if (items.some((p) => (p.slug || '') === slug)) err = 'ასეთი slug უკვე არსებობს';
          else items.push(item);
          if (!err) {
            all.posts = items;
            if (write('posts', all)) { msg = 'სტატია შენახულია'; page = 'posts'; } else err = 'შენახვა ვერ მოხერხდა';
          }
        }
      }
      if (action === 'delete_post') {
        const all = read('posts', { posts: [] });
        const slug = toSlug(B.slug);
        all.posts = (all.posts || []).filter((p) => (p.slug || '') !== slug);
        save('posts', all, 'სტატია წაიშალა', 'წაშლა ვერ მოხერხდა');
      }
      if (action === 'upload') {
        const r = req.uploadError ? { ok: false, error: req.uploadError } : media.upload(req.file, String(B.prefix ?? 'img'));
        if (r.ok) msg = 'ატვირთულია: ' + r.file; else err = r.error;
      }
      if (action === 'delete_media') {
        if (media.remove(B.name)) msg = 'ფაილი წაიშალა'; else err = 'წაშლა ვერ მოხერხდა';
      }
      if (action === 'booking_status') {
        const store = read('bookings', { bookings: [] });
        const st = ['new', 'done', 'cancelled'].includes(B.status) ? B.status : 'new';
        for (const b of store.bookings || []) if ((b.id || '') === String(B.id ?? '')) b.status = st;
        save('bookings', store, st === 'cancelled' ? 'შეხვედრა გაუქმდა — დრო ისევ თავისუფალია' : 'სტატუსი განახლდა');
      }
      if (action === 'save_booking_settings') {
        const site = read('site');
        const blocked = String(B.blocked ?? '').split(/[\s,]+/).map((d) => d.trim()).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
        site.booking = {
          days: list(B.days).map((d) => parseInt(d, 10) || 0),
          start: String(B.start ?? '10:00'), end: String(B.end ?? '18:00'),
          slot: parseInt(B.slot ?? 30, 10) || 0, notice: parseInt(B.notice ?? 3, 10) || 0,
          ahead: parseInt(B.ahead ?? 21, 10) || 0, blocked,
        };
        save('site', site, 'განრიგი შენახულია');
      }
      if (action === 'delete_lead') {
        const store = read('leads', { leads: [] });
        store.leads = (store.leads || []).filter((l) => (l.id || '') !== String(B.id ?? ''));
        save('leads', store, 'განაცხადი წაიშალა', 'წაშლა ვერ მოხერხდა');
      }
    }
  }

  done(view({ page, msg, err, s, query: req.query, body: B, isPost }));
});

function renderB(items, actions, csrfField) {
  if (!items.length) return '<p class="muted">არაფერია.</p>';
  const pills = { new: '<span class="pill">ახალი</span>', done: '<span class="pill">ჩატარდა</span>', cancelled: '<span class="pill pill--off">გაუქმდა</span>' };
  let out = '<table class="table"><thead><tr><th>დრო</th><th>კლიენტი</th><th>თემა</th><th>სტატუსი</th><th></th></tr></thead><tbody>';
  for (const b of items) {
    const st = b.status || 'new';
    out += '<tr><td><b>' + e(booking.label(String(b.date), String(b.time))) + '</b></td>'
      + '<td><b>' + e(b.name ?? '') + '</b>' + (!empty(b.company) ? ' · ' + e(b.company) : '')
      + '<br><small><a href="mailto:' + e(b.email ?? '') + '">' + e(b.email ?? '') + '</a> · <a href="tel:' + e(b.phone ?? '') + '">' + e(b.phone ?? '') + '</a></small>'
      + (!empty(b.message) ? '<br><small class="muted">' + e(b.message) + '</small>' : '') + '</td>'
      + '<td>' + e(b.topic ?? '') + (!empty(b.format) ? '<br><small class="muted">' + e(b.format) + '</small>' : '') + '</td>'
      + '<td>' + (pills[st] || pills.new) + '</td><td class="right">';
    if (actions) {
      for (const [k, lbl] of [['done', 'ჩატარდა'], ['cancelled', 'გაუქმება']]) {
        if (k === st) continue;
        out += '<form method="post" class="inline"' + (k === 'cancelled' ? ' onsubmit="return confirm(\'გავაუქმოთ შეხვედრა?\')"' : '') + '>' + csrfField
          + '<input type="hidden" name="action" value="booking_status"><input type="hidden" name="id" value="' + e(b.id ?? '') + '">'
          + '<input type="hidden" name="status" value="' + k + '"><button class="link' + (k === 'cancelled' ? ' link--danger' : '') + '" type="submit">' + lbl + '</button></form> ';
      }
    }
    out += '</td></tr>';
  }
  return out + '</tbody></table>';
}

function view({ page, msg, err, s, query, body, isPost }) {
  const site = read('site');
  const texts = site.texts || {};
  const settings = site.settings || {};
  const projectsList = read('projects', { projects: [] }).projects || [];
  const projects = projectsList;
  const leads = (read('leads', { leads: [] }).leads || []).slice().reverse();
  const postsList = blog.posts(true);
  const posts = postsList;
  const t = today();
  const bookings = booking.bookings().slice().sort((a, b) => String((a.date || '') + (a.time || '')).localeCompare(String((b.date || '') + (b.time || ''))));
  const isUpcoming = (b) => (b.date || '') >= t && (b.status || 'new') !== 'cancelled';
  const upcoming = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter((b) => !isUpcoming(b)).reverse();
  const bcfg = booking.config();
  const TEXT_FIELDS = FIELDS.text;
  const SETTING_FIELDS = FIELDS.settings;
  const nav = NAV;
  const csrfField = '<input type="hidden" name="_csrf" value="' + e(s.csrf) + '">';

  let editPost = null;
  if (page === 'post' && query.slug !== undefined) editPost = postsList.find((p) => (p.slug || '') === query.slug) || null;
  if (page === 'post' && err && isPost && body.action === 'save_post') {
    editPost = Object.fromEntries(Object.entries(body).map(([k, v]) => [k, typeof v === 'string' ? v : '']));
    editPost._new = empty(body.orig_slug);
  }
  const P = editPost || {};
  const isNew = !editPost || !empty(editPost._new);

  let edit = null;
  if (page === 'project' && query.slug !== undefined) edit = projectsList.find((p) => (p.slug || '') === query.slug) || null;
  const E = edit || {};
  const svcOn = !empty(E.slug) ? projectServices(E) : [];
  const renderBk = (items, actions) => renderB(items, actions, csrfField);

  return (() => { const renderB = renderBk; return `<!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Webico — მართვის პანელი</title>
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="admin.css">
</head>
<body>

${truthy(page === 'setup') ? `  <main class="auth">
    <form method="post" class="card">
      <h1>პირველი გაშვება</h1>
      <p class="muted">შექმენით ადმინისტრატორის ანგარიში. პაროლი ინახება მხოლოდ ჰეშის სახით.</p>
      ${truthy(err) ? `<p class="alert alert--err">${e(err)}</p>` : ''}      <label>მომხმარებელი<input name="user" required autocomplete="username"></label>
      <label>პაროლი (მინ. 10 სიმბოლო)<input type="password" name="password" required minlength="10" autocomplete="new-password"></label>
      <label>გაიმეორეთ პაროლი<input type="password" name="password2" required minlength="10" autocomplete="new-password"></label>
      <button class="btn" type="submit">ანგარიშის შექმნა</button>
    </form>
  </main>

` : truthy(page === 'login') ? `  <main class="auth">
    <form method="post" class="card">
      <h1>შესვლა</h1>
      ${truthy(query.setup !== undefined) ? `<p class="alert alert--ok">ანგარიში შეიქმნა — შედით.</p>` : ''}      ${truthy(err) ? `<p class="alert alert--err">${e(err)}</p>` : ''}      ${csrfField}      <label>მომხმარებელი<input name="user" required autocomplete="username"></label>
      <label>პაროლი<input type="password" name="password" required autocomplete="current-password"></label>
      <button class="btn" type="submit">შესვლა</button>
    </form>
  </main>

` : `  <div class="shell">
    <aside class="side">
      <div class="side__brand">Webico <span>CMS</span></div>
      <nav>
        ${map(Object.entries(nav), ([k, label]) => { return `          <a href="index.php?p=${k}" class="${page === k || (k === 'projects' && page === 'project') || (k === 'posts' && page === 'post') ? 'on' : ''}">${e(label)}</a>
        `; })}      </nav>
      <div class="side__foot">
        <a href="../" target="_blank" rel="noopener">საიტის ნახვა ↗</a>
        <a href="logout.php">გასვლა</a>
      </div>
    </aside>

    <main class="main">
      ${truthy(msg) ? `<p class="alert alert--ok">${e(msg)}</p>` : ''}      ${truthy(err) ? `<p class="alert alert--err">${e(err)}</p>` : ''}
      ${truthy(page === 'dashboard') ? `        <h1>მართვის პანელი</h1>
        <div class="tiles">
          <a class="tile" href="index.php?p=projects"><b>${projects.length}</b><span>პროექტი</span></a>
          <a class="tile" href="index.php?p=posts"><b>${posts.length}</b><span>სტატია</span></a>
          <a class="tile" href="index.php?p=media"><b>${media.list().length}</b><span>ფოტო</span></a>
          <a class="tile" href="index.php?p=bookings"><b>${upcoming.length}</b><span>მომავალი შეხვედრა</span></a>
          <a class="tile" href="index.php?p=leads"><b>${leads.length}</b><span>განაცხადი</span></a>
        </div>
        <p class="muted" style="margin-top:22px">ცვლილებები საიტზე მაშინვე აისახება — გადაშენება არ სჭირდება.</p>

      ` : truthy(page === 'projects') ? `        <div class="head">
          <h1>პროექტები</h1>
          <a class="btn" href="index.php?p=project">+ ახალი</a>
        </div>
        <table class="table">
          <thead><tr><th>სახელი</th><th>დომენი</th><th>სტატუსი</th><th></th></tr></thead>
          <tbody>
          ${map(projectsList, (p) => { return `            <tr>
              <td><b>${e(p.name ?? '')}</b><br><small class="muted">${e(p.slug ?? '')}</small></td>
              <td>${e(p.domain ?? '')}</td>
              <td>${!empty(p.hidden) ? '<span class="pill pill--off">დამალული</span>' : '<span class="pill">გამოქვეყნებული</span>'}</td>
              <td class="right">
                <a class="link" href="index.php?p=project&amp;slug=${encodeURIComponent(p.slug ?? '')}">რედაქტირება</a>
                <form method="post" class="inline" onsubmit="return confirm('წავშალოთ ეს პროექტი?')">
                  ${csrfField}                  <input type="hidden" name="action" value="delete_project">
                  <input type="hidden" name="slug" value="${e(p.slug ?? '')}">
                  <button class="link link--danger" type="submit">წაშლა</button>
                </form>
              </td>
            </tr>
          `; })}          </tbody>
        </table>

      ` : truthy(page === 'project') ? `        <h1>${edit ? 'პროექტის რედაქტირება' : 'ახალი პროექტი'}</h1>
        <form method="post" class="card form">
          ${csrfField}          <input type="hidden" name="action" value="save_project">
          <div class="row">
            <label>სახელი<input name="name" required value="${e(E.name ?? '')}"></label>
            <label>Slug (URL)<input name="slug" required value="${e(E.slug ?? '')}" ${edit ? 'readonly' : ''}></label>
          </div>
          <div class="row">
            <label>დომენი<input name="domain" placeholder="example.ge" value="${e(E.domain ?? '')}"></label>
            <label>წელი<input name="year" value="${e(E.year ?? '')}"></label>
          </div>
          <div class="row">
            <label>ფერი
              <select name="tone">
                ${map(Object.entries({ lilac: 'იისფერი', lime: 'ლაიმი', pink: 'ვარდისფერი', soft: 'ნაცრისფერი' }), ([v, l]) => { return `                  <option value="${v}" ${(E.tone ?? 'lilac') === v ? 'selected' : ''}>${l}</option>
                `; })}              </select>
            </label>
            <label>თანამშრომლობა<input name="partner" value="${e(E.partner ?? '')}"></label>
          </div>
          <div class="row">
            <label>სქრინშოტი
              <input name="shot" placeholder="assets/img/uploads/…" value="${e(E.shot ?? '')}">
              <small class="muted">მოკაპის სურათი, 3:2 (მაგ. 1536×1024)</small>
            </label>
            <label>ლოგო
              <input name="logo" placeholder="assets/img/uploads/…" value="${e(E.logo ?? '')}">
              <small class="muted">კლიენტების კარუსელში; PNG/SVG გამჭვირვალე ფონით</small>
            </label>
          </div>
          <label>სრული გვერდის სურათი (არასავალდებულო)
            <input name="full" placeholder="assets/img/uploads/…" value="${e(E.full ?? '')}">
            <small class="muted">გრძელი სქრინშოტი ან დამატებითი ეკრანი — პროექტის გვერდზე სრულად გამოჩნდება</small>
          </label>
          <label>დამატებითი სურათის წარწერა<input name="full_caption" placeholder="სრული გვერდის დიზაინი" value="${e(E.full_caption ?? '')}"></label>
          <label class="check"><input type="checkbox" name="hide_shot" ${!empty(E.hide_shot) ? 'checked' : ''}> პროექტის გვერდზე მთავარი მოკაპი არ გამოჩნდეს (დაბალი გარჩევადობისას)</label>
          <label>მოკლე აღწერა<textarea name="summary" rows="2">${e(E.summary ?? '')}</textarea></label>
          <label>გამოწვევა<textarea name="challenge" rows="3">${e(E.challenge ?? '')}</textarea></label>
          <label>რა გავაკეთეთ<textarea name="solution" rows="3">${e(E.solution ?? '')}</textarea></label>
          <label>შედეგი<textarea name="result" rows="2">${e(E.result ?? '')}</textarea></label>
          <div class="row">
            <label>თეგები (მძიმით)<input name="tags" value="${e((E.tags ?? []).join(', '))}"></label>
            <label>ინსტრუმენტები (მძიმით)<input name="stack" value="${e((E.stack ?? []).join(', '))}"></label>
          </div>
          <fieldset class="checks">
            <legend>სერვისები — პროექტი ამ სერვისების გვერდებზე გამოჩნდება</legend>
            ${map(Object.entries(SERVICE_KEYS), ([sk, sl]) => { return `            <label class="check"><input type="checkbox" name="services[]" value="${e(sk)}" ${svcOn.includes(sk) ? 'checked' : ''}> ${e(sl)}</label>
            `; })}          </fieldset>
          <label>სამუშაოს მოცულობა (თითო ხაზზე)<textarea name="scope" rows="4">${e((E.scope ?? []).join('\n'))}</textarea></label>
          <label class="check"><input type="checkbox" name="hidden" ${!empty(E.hidden) ? 'checked' : ''}> დამალული (საიტზე არ გამოჩნდება)</label>
          <div class="actions">
            <button class="btn" type="submit">შენახვა</button>
            <a class="link" href="index.php?p=projects">გაუქმება</a>
          </div>
        </form>

      ` : truthy(page === 'posts') ? `        <div class="head">
          <h1>ბლოგი</h1>
          <a class="btn" href="index.php?p=post">+ ახალი სტატია</a>
        </div>
        <table class="table">
          <thead><tr><th>სათაური</th><th>კატეგორია</th><th>თარიღი</th><th>სტატუსი</th><th></th></tr></thead>
          <tbody>
          ${map(postsList, (p) => { return `            <tr>
              <td><b>${e(p.title ?? '')}</b><br><small class="muted">/blog/${e(p.slug ?? '')}</small></td>
              <td>${e(blog.cat(p))}</td>
              <td>${e(p.date ?? '')}</td>
              <td>${truthy(!empty(p.hidden)) ? `<span class="pill pill--off">დამალული</span>` : truthy((p.date ?? '') > today()) ? `<span class="pill pill--off">დაგეგმილი</span>` : `<span class="pill">გამოქვეყნებული</span>`}</td>
              <td class="right">
                <a class="link" href="../blog/${e(p.slug ?? '')}" target="_blank" rel="noopener">ნახვა</a>
                <a class="link" href="index.php?p=post&amp;slug=${encodeURIComponent(p.slug ?? '')}">რედაქტირება</a>
                <form method="post" class="inline" onsubmit="return confirm('წავშალოთ ეს სტატია?')">
                  ${csrfField}                  <input type="hidden" name="action" value="delete_post">
                  <input type="hidden" name="slug" value="${e(p.slug ?? '')}">
                  <button class="link link--danger" type="submit">წაშლა</button>
                </form>
              </td>
            </tr>
          `; })}          </tbody>
        </table>

      ` : truthy(page === 'post') ? `        <h1>${isNew ? 'ახალი სტატია' : 'სტატიის რედაქტირება'}</h1>
        <form method="post" class="card form" action="index.php?p=post${!isNew ? '&amp;slug=' + encodeURIComponent(P.slug ?? '') : ''}">
          ${csrfField}          <input type="hidden" name="action" value="save_post">
          <input type="hidden" name="orig_slug" value="${isNew ? '' : e(P.orig_slug ?? P.slug ?? '')}">
          <label>სათაური<input name="title" required value="${e(P.title ?? '')}"></label>
          <div class="row">
            <label>Slug (URL — ლათინურად)<input name="slug" required pattern="[a-z0-9-]+" placeholder="google-maps-guide" value="${e(P.slug ?? '')}"></label>
            <label>თარიღი<input type="date" name="date" required value="${e(P.date ?? today())}">
              <small class="muted">მომავალი თარიღი = დაგეგმილი გამოქვეყნება</small></label>
          </div>
          <div class="row">
            <label>კატეგორია
              <select name="category">
                ${map(Object.entries(blog.CATS), ([v, l]) => { return `                  <option value="${v}" ${(P.category ?? '') === v ? 'selected' : ''}>${e(l)}</option>
                `; })}              </select>
            </label>
            <label>ყდის ფერი
              <select name="tone">
                ${map(Object.entries({ lilac: 'იისფერი', lime: 'ლაიმი', pink: 'ვარდისფერი', soft: 'ნაცრისფერი', dark: 'მუქი' }), ([v, l]) => { return `                  <option value="${v}" ${(P.tone ?? 'lilac') === v ? 'selected' : ''}>${l}</option>
                `; })}              </select>
            </label>
          </div>
          <label>მოკლე აღწერა (ჩანს ბარათზე და Google-ში)<textarea name="excerpt" rows="2" maxlength="300">${e(P.excerpt ?? '')}</textarea></label>
          <div class="row">
            <label>ყდის ფოტო (არასავალდებულო)<input name="cover" placeholder="assets/img/uploads/…" value="${e(P.cover ?? '')}">
              <small class="muted">თუ ცარიელია, ყდა ავტომატურად დაიხატება</small></label>
            <label>ყდის ტექსტი (არასავალდებულო)<input name="cover_text" placeholder="მოკლე ფრაზა ყდისთვის" value="${e(P.cover_text ?? '')}"></label>
          </div>
          <label>ავტორი<input name="author" placeholder="${e(blog.AUTHOR)}" value="${e(P.author ?? '')}"></label>
          <label>ტექსტი
            <textarea name="body" rows="22" class="mono">${e(P.body ?? '')}</textarea>
            <small class="muted">შეგიძლიათ დაწეროთ უბრალო ტექსტი — ცარიელი ხაზი ახალ აბზაცს ნიშნავს. ან HTML: &lt;h2&gt; ქვესათაური (სარჩევში გამოჩნდება), &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;a href&gt;, &lt;blockquote&gt;, &lt;img src&gt;.</small>
          </label>
          <label>ხშირი კითხვები (არასავალდებულო)
            <textarea name="faq" rows="8" class="mono" placeholder="რა ღირს საიტის დამზადება?&#10;პასუხი ერთ ან რამდენიმე ხაზად.&#10;&#10;შემდეგი კითხვა?&#10;პასუხი.">${e(Array.isArray(P.faq) ? P.faq.map((f) => (f[0] ?? '') + '\n' + (f[1] ?? '')).join('\n\n') : String(P.faq ?? ''))}</textarea>
            <small class="muted">ყოველი კითხვა — ახალ ხაზზე, პასუხი — მის ქვემოთ; კითხვებს შორის ცარიელი ხაზი. გამოჩნდება სტატიის ბოლოს და Google-ს FAQ სქემად მიეწოდება.</small>
          </label>
          <label class="check"><input type="checkbox" name="hidden" ${!empty(P.hidden) ? 'checked' : ''}> დამალული (მონახაზი)</label>
          <div class="actions">
            <button class="btn" type="submit">შენახვა</button>
            <a class="link" href="index.php?p=posts">გაუქმება</a>
          </div>
        </form>

      ` : truthy(page === 'media') ? `        <h1>ფოტოები</h1>
        <form method="post" enctype="multipart/form-data" class="card upload">
          ${csrfField}          <input type="hidden" name="action" value="upload">
          <label>ფაილი<input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" required></label>
          <label>სახელის პრეფიქსი<input name="prefix" placeholder="oribu"></label>
          <button class="btn" type="submit">ატვირთვა</button>
          <small class="muted">JPG, PNG, WebP, SVG — მაქსიმუმ 6 MB</small>
        </form>
        <div class="grid">
          ${map(media.list(), (m) => { return `            <figure class="shot">
              <img src="../${e(m.url)}" alt="" loading="lazy">
              <figcaption>
                <input class="copy" value="${e(m.url)}" readonly onclick="this.select()">
                <form method="post" onsubmit="return confirm('წავშალოთ?')">
                  ${csrfField}                  <input type="hidden" name="action" value="delete_media">
                  <input type="hidden" name="name" value="${e(m.name)}">
                  <button class="link link--danger" type="submit">წაშლა</button>
                </form>
              </figcaption>
            </figure>
          `; })}        </div>

      ` : truthy(page === 'texts') ? `        <h1>გვერდების ტექსტები</h1>
        <p class="muted">ცარიელი ველი ნიშნავს, რომ საიტზე საწყისი ტექსტი დარჩება.</p>
        <form method="post" class="card form">
          ${csrfField}          <input type="hidden" name="action" value="save_texts">
          ${map(Object.entries(TEXT_FIELDS), ([key, [label, type, def]]) => { return `            <label>${e(label)}              ${truthy(type === 'area') ? `                <textarea name="texts[${e(key)}]" rows="3" placeholder="${e(def)}">${e(texts[key] ?? '')}</textarea>
              ` : `                <input name="texts[${e(key)}]" placeholder="${e(def)}" value="${e(texts[key] ?? '')}">
              `}            </label>
          `; })}          <div class="actions"><button class="btn" type="submit">შენახვა</button></div>
        </form>

      ` : truthy(page === 'settings') ? `        <h1>კონტაქტები</h1>
        <form method="post" class="card form">
          ${csrfField}          <input type="hidden" name="action" value="save_settings">
          ${map(Object.entries(SETTING_FIELDS), ([key, [label, def]]) => { return `            <label>${e(label)}              <input name="settings[${e(key)}]" placeholder="${e(def)}" value="${e(settings[key] ?? '')}">
            </label>
          `; })}          <div class="actions"><button class="btn" type="submit">შენახვა</button></div>
        </form>

      ` : truthy(page === 'bookings') ? `        <h1>შეხვედრები</h1>
        <p class="muted">საიტიდან დაჯავშნილი კონსულტაციები (თბილისის დროით). გაუქმებისას დრო ისევ თავისუფლდება. კლიენტს გაუქმების შესახებ თავად აცნობეთ.</p>
                <h2>მომავალი (${upcoming.length})</h2>
        ${renderB(upcoming, true)}
        <h2 style="margin-top:34px">განრიგი</h2>
        <form method="post" class="card form">
          ${csrfField}          <input type="hidden" name="action" value="save_booking_settings">
          <label>სამუშაო დღეები</label>
          <div class="row" style="flex-wrap:wrap;gap:14px">
            ${map(Object.entries(booking.WEEKDAYS_FULL), ([n, l]) => { return `              <label class="check"><input type="checkbox" name="days[]" value="${n}" ${bcfg.days.includes(Number(n)) ? 'checked' : ''}> ${l}</label>
            `; })}          </div>
          <div class="row">
            <label>დაწყება<input type="time" name="start" value="${e(bcfg.start)}"></label>
            <label>დასრულება<input type="time" name="end" value="${e(bcfg.end)}"></label>
            <label>ხანგრძლივობა (წთ)
              <select name="slot">${map([15, 20, 30, 45, 60], (m) => { return `<option ${bcfg.slot === m ? 'selected' : ''}>${m}</option>`; })}</select></label>
          </div>
          <div class="row">
            <label>მინიმუმ რამდენი საათით ადრე<input type="number" min="0" max="72" name="notice" value="${bcfg.notice}"></label>
            <label>რამდენი დღით წინ შეიძლება დაჯავშნა<input type="number" min="1" max="90" name="ahead" value="${bcfg.ahead}"></label>
          </div>
          <label>დაკეტილი დღეები (დღესასწაულები, შვებულება)
            <textarea name="blocked" rows="2" placeholder="2026-10-14, 2026-11-23">${e(bcfg.blocked.join(', '))}</textarea>
            <small class="muted">ფორმატი: წელი-თვე-დღე, მძიმით გამოყოფილი</small></label>
          <div class="actions"><button class="btn" type="submit">შენახვა</button></div>
        </form>

        <h2 style="margin-top:34px">წარსული და გაუქმებული</h2>
        ${renderB(pastBookings.slice(0, 50), false)}
      ` : truthy(page === 'leads') ? `        <h1>განაცხადები <small class="muted">(${leads.length})</small></h1>
        ${truthy(!leads.length) ? `          <p class="muted">ჯერ არცერთი განაცხადი არ მოსულა.</p>
        ` : ''}        ${map(leads, (l) => { return `          <article class="card lead">
            <div class="lead__top">
              <b>${e(l.name ?? '')}</b>
              <time class="muted">${e(l.date ?? '')}</time>
            </div>
            <p class="muted">
              <a href="mailto:${e(l.email ?? '')}">${e(l.email ?? '')}</a>
              ${truthy(!empty(l.phone)) ? ` · <a href="tel:${e(l.phone)}">${e(l.phone)}</a>` : ''}              ${truthy(!empty(l.service)) ? ` · ${e(l.service)}` : ''}              ${truthy(!empty(l.budget)) ? ` · ბიუჯეტი: ${e(l.budget)}` : ''}              ${truthy(!empty(l.timeline)) ? ` · ვადა: ${e(l.timeline)}` : ''}              ${truthy(!empty(l.website)) ? ` · ${e(l.website)}` : ''}              ${truthy(!empty(l.source)) ? ` · ${e(l.source)}` : ''}            </p>
            ${truthy(!empty(l.message)) ? `<p>${nl2br(e(l.message))}</p>` : ''}            <form method="post" onsubmit="return confirm('წავშალოთ?')">
              ${csrfField}              <input type="hidden" name="action" value="delete_lead">
              <input type="hidden" name="id" value="${e(l.id ?? '')}">
              <button class="link link--danger" type="submit">წაშლა</button>
            </form>
          </article>
        `; })}      ` : ''}    </main>
  </div>
`}
</body>
</html>
`; })();
}

module.exports = router;
