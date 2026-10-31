'use strict';
/**
 * ინგლისური ვერსია: ქართული გვერდის HTML ითარგმნება data/en/i18n.json ლექსიკონით.
 * ასე ინგლისურ გვერდს ყოველთვის იგივე სექციები და შიგთავსი აქვს, რაც ქართულს.
 *
 * თარგმნის ერთეული: ელემენტი, რომლის შიგთავსი მხოლოდ ტექსტი და მარტივი ტეგებია
 * (b, a, em, br...) — მაგ. <p>, <h2>, <li>. ასეთ ელემენტს თარგმანი მთლიანად ცვლის,
 * ამიტომ წინადადება ტეგებით არ იჭრება. დანარჩენ შემთხვევაში ითარგმნება ცალკე ტექსტი.
 * ატრიბუტები (alt, title, placeholder, aria-label, meta content) და JSON-LD — იმავე ლექსიკონით.
 *
 * ახალი ქართული ტექსტი, რომელსაც თარგმანი არ აქვს, ქართულად რჩება და missing()-ში ჩანს.
 * სათარგმნის ამოღება და შევსება: node tools/i18n.js
 */
const fs = require('fs');
const path = require('path');
const { parseDocument } = require('htmlparser2');
const render = require('dom-serializer').default;
const { ROOT } = require('./core');

const GE = /[Ⴀ-ჿᲐ-Ჿ]/;
const INLINE = new Set(['a', 'b', 'strong', 'em', 'i', 'u', 's', 'br', 'span', 'small', 'sup', 'sub', 'mark', 'code', 'abbr', 'time', 'q', 'cite', 'bdi', 'wbr']);
const SKIP = new Set(['style', 'svg', 'template', 'textarea']);
const ATTRS = ['alt', 'title', 'placeholder', 'aria-label', 'content', 'value', 'label', 'data-label', 'data-title', 'data-text', 'data-msg', 'data-empty', 'data-filter-noun', 'data-unit-month', 'data-unit-year'];
/** ატრიბუტები, რომლებშიც JSON-ია (კონფიგურატორი) */
const JSON_ATTRS = ['data-cfg-conf'];
const OPT = { encodeEntities: 'utf8', decodeEntities: true };

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

/* --------------------------------------------------------- ლექსიკონი */
const DICT_FILE = path.join(ROOT, 'data/en/i18n.json');
let dict = null;
let dictMtime = 0;
function D() {
  let st = 0;
  try { st = fs.statSync(DICT_FILE).mtimeMs; } catch { /* */ }
  if (!dict || st !== dictMtime) {
    dict = new Map();
    try { for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(DICT_FILE, 'utf8')))) dict.set(norm(k), v); } catch { /* */ }
    dictMtime = st;
  }
  return dict;
}

/* ცვალებადი ტექსტი: რიცხვები ლექსიკონში # ნიშნით ინახება ("ყველა პროექტი (#)"), თარიღები ავტომატურად ითარგმნება */
const MONTHS = { 'იანვარი': 'January', 'თებერვალი': 'February', 'მარტი': 'March', 'აპრილი': 'April', 'მაისი': 'May', 'ივნისი': 'June', 'ივლისი': 'July', 'აგვისტო': 'August', 'სექტემბერი': 'September', 'ოქტომბერი': 'October', 'ნოემბერი': 'November', 'დეკემბერი': 'December' };
const MONTH_RE = new RegExp(`(\\d{1,2}) (${Object.keys(MONTHS).join('|')}),? (\\d{4})`, 'g');
const PATTERNS = [
  [/^(.+) — Webico-ს ნამუშევარი$/, '$1 — a Webico project'],
  [/^(.+) — ვებსაიტი, შექმნილი Webico-ს მიერ$/, '$1 — website built by Webico'],
];

const missingSet = new Map(); // ტექსტი -> გვერდი
function look(ka, where) {
  const k = norm(ka);
  if (!k || !GE.test(k)) return null;
  const d = D();
  let v = d.get(k);
  if (v !== undefined) return v;
  const nums = k.match(/\d+(?:[.,]\d+)?/g);
  if (nums) {
    const t = d.get(k.replace(/\d+(?:[.,]\d+)?/g, '#'));
    if (t !== undefined) { let i = 0; return t.replace(/#/g, () => nums[i++] ?? '#'); }
  }
  for (const [re, en] of PATTERNS) if (re.test(k)) return k.replace(re, en);
  v = k.replace(MONTH_RE, (m, day, mon, y) => `${MONTHS[mon]} ${day}, ${y}`);
  if (v !== k && !GE.test(v)) return v;
  if (!missingSet.has(k)) missingSet.set(k, where);
  return null;
}

/* ----------------------------------------------------- მისამართები */
const PAGES = ['/about', '/services', '/work', '/contact', '/blog', '/start', '/terms', '/privacy'];
const MAP = {
  '/service-web-development': '/en/web-development', '/service-wordpress': '/en/wordpress-development',
  '/service-ecommerce': '/en/ecommerce-development', '/service-branding': '/en/ui-ux-design', '/service-seo': '/en/seo',
  '/service-maintenance': '/en/website-maintenance', '/service-marketing': '/en/digital-marketing',
  '/saiti-salonistvis': '/en/website-for-salons', '/saiti-kafestvis': '/en/website-for-cafes', '/onlain-magazia': '/en/online-store',
};
const BACK = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]));

/** ქართული მისამართის ინგლისური შესატყვისი (null — თუ არ არსებობს) */
function enPath(p) {
  p = String(p || '');
  if (p === '/' || p === '') return '/en';
  if (PAGES.includes(p) || /^\/work-[a-z0-9-]+$/.test(p) || /^\/blog\/[a-z0-9-]+$/.test(p)) return '/en' + p;
  return MAP[p] || null;
}

/** ინგლისური მისამართის ქართული წყარო (null — თუ არ არსებობს) */
function kaPath(p) {
  p = String(p || '');
  if (p === '/en') return '/';
  if (BACK[p]) return BACK[p];
  const rest = p.replace(/^\/en(?=\/)/, '');
  if (rest !== p && enPath(rest) === p) return rest;
  return null;
}

function mapHref(h) {
  const m = String(h).match(/^(\/[^?#]*)([?#].*)?$/);
  if (!m || /^\/(assets|api|admin|en)(\/|$)/.test(m[1]) || /\.[a-z0-9]{2,5}$/i.test(m[1])) return h;
  const en = enPath(m[1]);
  return en ? en + (m[2] || '') : h;
}

/* -------------------------------------------------------------- DOM */
const isEl = (n) => n.type === 'tag' || n.type === 'script' || n.type === 'style';
const textOf = (n) => (n.type === 'text' ? n.data : (n.children || []).map(textOf).join(''));

/** ქართული ტექსტი პირდაპირ ელემენტშია (და არა მხოლოდ შიდა ტეგებში)? */
/** ქართული ტექსტი ან ატრიბუტი სადმე ქვეხეში? */
function hasGe(n) {
  if (n.type === 'text') return GE.test(n.data);
  if (n.type === 'comment') return GE.test(n.data);
  if (!isEl(n) && n.type !== 'root') return false;
  if (n.attribs && Object.values(n.attribs).some((v) => GE.test(v))) return true;
  return (n.children || []).some(hasGe);
}

const directGe = (n) => (n.children || []).some((c) => c.type === 'text' && GE.test(c.data));

/** ელემენტი მხოლოდ ტექსტს და მარტივ ტეგებს შეიცავს? */
function richLeaf(n) {
  for (const c of n.children || []) {
    if (c.type === 'text' || c.type === 'comment') continue;
    if (!isEl(c) || !INLINE.has(c.name) || !richLeaf(c)) return false;
  }
  return true;
}

function setHtml(n, htmlStr) {
  const kids = parseDocument(htmlStr, { decodeEntities: true }).children;
  for (const k of kids) k.parent = n;
  n.children = kids;
}

function translateAttrs(n, where) {
  for (const a of ATTRS) {
    const v = n.attribs && n.attribs[a];
    if (v && GE.test(v)) { const t = look(v, where); if (t !== null) n.attribs[a] = t.replace(/<[^>]+>/g, ''); }
  }
  for (const a of JSON_ATTRS) {
    const v = n.attribs && n.attribs[a];
    if (v && GE.test(v)) { try { n.attribs[a] = JSON.stringify(translateJson(JSON.parse(v), where)); } catch { /* */ } }
  }
}

function translateJson(v, where) {
  if (typeof v === 'string') {
    if (GE.test(v)) { const t = look(v, where); return t === null ? v : t.replace(/<[^>]+>/g, ''); }
    if (v === 'ka') return 'en';
    if (v === 'ka_GE') return 'en_US';
    return v.replace(/^https:\/\/webico\.io(\/[^?#]*)?(.*)$/, (m, p, rest) => {
      const en = enPath(p || '/');
      return en && !/^\/(assets|api)\//.test(p || '') ? 'https://webico.io' + en + rest : m;
    });
  }
  if (Array.isArray(v)) return v.map((x) => translateJson(x, where));
  if (v && typeof v === 'object') { for (const k of Object.keys(v)) v[k] = translateJson(v[k], where); }
  return v;
}

/** ფარდობითი მისამართები (assets/...) /en/ ქვეგვერდზე სხვაგან მიუთითებდა — ვაქცევთ აბსოლუტურად */
const REL = /^(?![a-z][a-z0-9+.-]*:|\/|#|\?|$)/i;
function absUrls(n) {
  for (const a of ['src', 'href', 'poster', 'action']) if (n.attribs[a] && REL.test(n.attribs[a])) n.attribs[a] = '/' + n.attribs[a];
  if (n.attribs.srcset) n.attribs.srcset = n.attribs.srcset.split(',').map((x) => { const t = x.trim(); return REL.test(t) ? '/' + t : t; }).join(', ');
}

function walk(n, where) {
  n.children = (n.children || []).filter((c) => !(c.type === 'comment' && GE.test(c.data)));
  for (const c of n.children) {
    if (c.type === 'text') {
      if (GE.test(c.data)) {
        const t = look(c.data, where);
        if (t !== null) { const lead = c.data.match(/^\s*/)[0]; const tail = c.data.match(/\s*$/)[0]; c.data = lead + t + tail; }
      }
      continue;
    }
    if (!isEl(c)) continue;
    if (c.name === 'script') {
      if ((c.attribs.type || '') === 'application/ld+json' && c.children[0]) {
        try { c.children[0].data = JSON.stringify(translateJson(JSON.parse(c.children[0].data), where), null, 4).replace(/</g, '\\u003c'); } catch { /* */ }
      }
      continue;
    }
    if (c.name === 'textarea') translateAttrs(c, where);
    if (SKIP.has(c.name)) continue;
    translateAttrs(c, where);
    if (c.name === 'a' && c.attribs.href) c.attribs.href = mapHref(c.attribs.href);
    if (c.name === 'form' && c.attribs.action) c.attribs.action = mapHref(c.attribs.action);
    if (!hasGe(c)) continue;
    if (richLeaf(c) && directGe(c) && (c.children || []).some(isEl)) {
      const t = look(render(c.children, OPT), where);
      if (t !== null) {
        setHtml(c, t);
        for (const a of c.children) if (isEl(a)) fixLinks(a);
        continue;
      }
    }
    walk(c, where);
  }
}

function fixLinks(n) {
  if (n.name === 'a' && n.attribs.href) n.attribs.href = mapHref(n.attribs.href);
  for (const c of n.children || []) if (isEl(c)) fixLinks(c);
}

/** თარგმნის ერთეულები გვერდზე (ამოსაღებად) */
function units(html) {
  const out = [];
  // React ტექსტებს შორის <!-- -->-ს სვამს — მოვაშოროთ, რომ ტექსტი ისევ ერთიანი იყოს
  const doc = parseDocument(String(html).replace(/<!--\/?\$?\??-->|<!-- -->/g, ''), { decodeEntities: true });
  const attrs = (n) => {
    for (const a of ATTRS) { const v = n.attribs && n.attribs[a]; if (v && GE.test(v)) out.push(norm(v)); }
    for (const a of JSON_ATTRS) { const v = n.attribs && n.attribs[a]; if (v && GE.test(v)) { try { json(JSON.parse(v)); } catch { /* */ } } }
  };
  const json = (v) => { if (typeof v === 'string') { if (GE.test(v)) out.push(norm(v)); } else if (v && typeof v === 'object') Object.values(v).forEach(json); };
  (function rec(n) {
    for (const c of n.children || []) {
      if (c.type === 'text') { if (GE.test(c.data)) out.push(norm(c.data)); continue; }
      if (!isEl(c)) continue;
      if (c.name === 'script') { if ((c.attribs.type || '') === 'application/ld+json' && c.children[0]) { try { json(JSON.parse(c.children[0].data)); } catch { /* */ } } continue; }
      if (c.name === 'textarea') attrs(c);
      if (SKIP.has(c.name)) continue;
      attrs(c);
      if (!hasGe(c)) continue;
      if (richLeaf(c) && directGe(c) && (c.children || []).some(isEl)) { out.push(norm(render(c.children, OPT))); continue; }
      rec(c);
    }
  }(doc));
  return out.filter((s) => GE.test(s));
}

/** ტექსტი, რომელსაც ლექსიკონი (ან რიცხვის/თარიღის წესი) ვერ თარგმნის */
const untranslated = (s) => look(s, '') === null;

/** ქართული გვერდი → ინგლისური */
function toEnglish(html, ka) {
  const en = enPath(ka) || '/en';
  const doc = parseDocument(html, { decodeEntities: true });
  walk(doc, ka);
  (function post(n) {
    for (const c of n.children || []) {
      if (c.type === 'text' && c.data.includes('₾')) c.data = c.data.replace(/(\d)\s*₾/g, '$1 GEL').replace(/₾/g, 'GEL');
      else if (isEl(c)) { absUrls(c); if (c.name !== 'script' && c.name !== 'style') post(c); }
    }
  }(doc));
  let out = render(doc, OPT);
  out = out
    .replace('<html lang="ka"', '<html lang="en"')
    .replace(/<link rel="canonical" href="https:\/\/webico\.io[^"]*">/, `<link rel="canonical" href="https://webico.io${en}">`)
    .replace(/<meta property="og:url" content="https:\/\/webico\.io[^"]*">/, `<meta property="og:url" content="https://webico.io${en}">`)
    .replace('content="ka_GE"', 'content="en_US"')
    .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*/g, '')
    .replace('</head>', `  <link rel="alternate" hreflang="ka" href="https://webico.io${ka}">\n  <link rel="alternate" hreflang="en" href="https://webico.io${en}">\n  <link rel="alternate" hreflang="x-default" href="https://webico.io${ka}">\n</head>`)
    // ენის გადამრთველები ქართულზე
    // გაზიარების ბმულები ინგლისურ მისამართზე
    .replace(/https%3A%2F%2Fwebico\.io((?:%2F[a-z0-9-]*)*)/g, (m, p) => {
      const e = enPath(decodeURIComponent(p) || '/');
      return e ? 'https%3A%2F%2Fwebico.io' + encodeURIComponent(e) : m;
    })
    .replace(/<a class="foot__lang" href="[^"]*" hreflang="en">[^<]*<\/a>/, `<a class="foot__lang" href="${ka}" hreflang="ka" lang="ka">ქართული</a>`);
  return out;
}

/** HTML ფრაგმენტის თარგმნა (სტატიის ტექსტი, სამართლებრივი ტექსტები და სხვა მზა HTML) */
function translateHtml(html, ka) {
  const doc = parseDocument(String(html), { decodeEntities: true });
  walk(doc, ka);
  (function post(n) {
    for (const c of n.children || []) {
      if (c.type === 'text') c.data = gel(c.data);
      else if (isEl(c)) { absUrls(c); if (c.name !== 'script' && c.name !== 'style') post(c); }
    }
  }(doc));
  return render(doc, OPT);
}

/** ფასები ინგლისურად: „490 ₾“ → „490 GEL“ */
const gel = (s) => (String(s).includes('₾') ? String(s).replace(/(\d)\s*₾/g, '$1 GEL').replace(/₾/g, 'GEL') : s);

/** ბმულები მზა HTML-ში ინგლისურ მისამართებზე */
function mapLinks(html) {
  const doc = parseDocument(String(html), { decodeEntities: true });
  for (const c of doc.children) if (isEl(c)) fixLinks(c);
  return render(doc, OPT);
}

const missing = () => [...missingSet.entries()];

module.exports = {
  toEnglish, units, untranslated, enPath, kaPath, missing, norm, GE,
  look, mapHref, translateJson, translateHtml, mapLinks, gel, ATTRS, JSON_ATTRS, INLINE,
};
