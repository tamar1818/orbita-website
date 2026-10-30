'use strict';
/** პროექტების წაკითხვა (რენდერი — components/work.jsx) */
const fs = require('fs');
const path = require('path');
const { read, SEED_DIR } = require('./core');

/** რეპოს საწყისი აღწერა და ვიდეო — ადმინიდან შენახულ ასლს თუ აკლია, აქედან ივსება */
let seedMap = null;
let seedNew = [];
function seed(slug) {
  if (!seedMap) {
    seedMap = new Map();
    try {
      const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'projects.json'), 'utf8'));
      for (const x of data.projects || data) seedMap.set(x.slug, x);
      seedNew = (data.seed_new || []).filter((sl) => seedMap.has(sl));
    } catch { /* */ }
  }
  return seedMap.get(slug) || {};
}
const fill = (x) => {
  const sd = seed(x.slug);
  const out = { ...x };
  for (const k of ['summary', 'video', 'full', 'tile']) if (!String(out[k] ?? '').trim() && sd[k]) out[k] = sd[k];
  return out;
};

/** შენახული პროექტები + რეპოში ახლად დამატებულები (seed_new), თუ ადმინში არ წაუშლიათ */
function projectsData() {
  const data = read('projects', { projects: [] });
  const stored = data.projects || [];
  seed('');
  const have = new Set(stored.map((x) => x.slug));
  const gone = new Set(data.deleted || []);
  const added = seedNew.filter((sl) => !have.has(sl) && !gone.has(sl)).map((sl) => ({ ...seedMap.get(sl) }));
  return { ...data, projects: added.concat(stored) };
}

function projects(includeHidden = false) {
  const list = projectsData().projects.map(fill);
  return includeHidden ? list : list.filter((p) => !p.hidden);
}

function project(slug) {
  const p = projects(true).find((x) => (x.slug || '') === slug);
  return p && !p.hidden ? p : null;
}

const s = (v) => String(v ?? '').trim();

function initials(name) {
  const parts = s(name).split(/[\s'.-]+/u).filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return [...parts[0]].slice(0, 2).join('').toUpperCase();
  return ([...parts[0]][0] + [...parts[1]][0]).toUpperCase();
}

/** პროექტები, რომლებსაც რეალური მოკაპი აქვს, წინ (სტაბილური დალაგება) */
function showcase() {
  const list = projects();
  return list.map((p, i) => [p, i])
    .sort((a, b) => ((s(b[0].shot) !== '') - (s(a[0].shot) !== '')) || (a[1] - b[1]))
    .map((x) => x[0]);
}

function tags(p) {
  const t = (p.tags || []).map(s).filter(Boolean);
  return t.length ? t : ['ვებსაიტი'];
}


/* --------------------------------------------------- ინსტრუმენტების სია */
const TOOLS_DEFAULT = [
  ['WordPress', 'Wp', '#21759b'], ['WooCommerce', 'Wc', '#7f54b3'], ['Shopify', 'Sh', '#5a8f3d'],
  ['Webflow', 'Wf', '#4353ff'], ['Lovable', 'Lo', '#d1443c'], ['Next.js / React', 'Ne', '#0b7285'],
  ['Laravel', 'La', '#c0392b'], ['PHP', 'Php', '#5b6398'], ['AWS', 'aws', '#b26a00'],
  ['Cloudflare', 'Cf', '#c76a12'], ['Figma', 'Fi', '#8b45d6'], ['Google Ads', 'Gg', '#2f6fd0'],
  ['Meta Ads', 'Me', '#1666c2'], ['Google Analytics', 'Ga', '#c47b17'],
];

/** ინსტრუმენტის ლოგო assets/img/tech/-დან (სახელის მიხედვით) */
const TOOL_LOGOS = {
  wordpress: 'wordpress', woocommerce: 'woocommerce', shopify: 'shopify', webflow: 'webflow',
  lovable: 'lovable', 'next.js / react': 'nextjs', 'next.js': 'nextjs', laravel: 'laravel', php: 'php',
  aws: 'aws', cloudflare: 'cloudflare', figma: 'figma', 'google ads': 'googleads', 'meta ads': 'meta',
  'google analytics': 'googleanalytics',
};
const toolLogo = (name) => {
  const f = TOOL_LOGOS[name.toLowerCase()];
  return f ? '/assets/img/tech/' + f + '.svg' : '';
};

function tools() {
  const out = [];
  for (const t of read('site').tools || []) {
    const name = s(t.name);
    if (name) out.push([name, s(t.mark ?? [...name].slice(0, 2).join('')), s(t.color ?? '#181818'), s(t.logo) || toolLogo(name)]);
  }
  return out.length ? out : TOOLS_DEFAULT.map((t) => [...t, toolLogo(t[0])]);
}

/* ------------------------------------------- პროექტები სერვისების მიხედვით */
const SERVICE_KEYS = {
  'web-development': 'ვებსაიტის დამზადება',
  wordpress: 'WordPress დეველოპმენტი',
  ecommerce: 'ონლაინ მაღაზია',
  branding: 'ბრენდინგი და UI/UX დიზაინი',
  seo: 'SEO ოპტიმიზაცია',
  marketing: 'ციფრული მარკეტინგი',
  maintenance: 'ტექნიკური მხარდაჭერა',
};

/** რომელ სერვისებს ეკუთვნის პროექტი: ადმინში მონიშნული, თუ არა — თეგებიდან */
function projectServices(p) {
  const chosen = Object.keys(SERVICE_KEYS).filter((k) => (p.services || []).includes(k));
  if (chosen.length) return chosen;
  const set = [];
  const tg = (p.tags || []).map(s);
  if (!tg.length) set.push('web-development');
  const hay = tg.concat(p.stack || []).join(' | ').toLowerCase();
  const rules = {
    'web-development': ['ვებსაიტის დამზადება', 'ვებ-დეველოპმენტი', 'ვებსაიტი'],
    wordpress: ['wordpress', 'woocommerce'],
    ecommerce: ['მაღაზი', 'e-commerce', 'woocommerce', 'shopify'],
    branding: ['ui/ux', 'ბრენდ', 'ლოგო'],
    seo: ['seo'],
    marketing: ['მარკეტინგ', 'რეკლამ', 'google ads', 'meta ads'],
    maintenance: ['მხარდაჭერ'],
  };
  for (const [key, needles] of Object.entries(rules)) {
    if (needles.some((n) => hay.includes(n))) set.push(key);
  }
  return [...new Set(set)];
}

function serviceProjects(key, limit = 6) {
  const all = projects().filter((p) => s(p.shot) !== '' || s(p.full) !== '');
  const hit = all.filter((p) => projectServices(p).includes(key));
  return hit.length ? [hit.slice(0, limit), true] : [all.slice(0, limit), false];
}

module.exports = {
  projects, projectsData, project, initials, showcase, tags, tools, s,
  SERVICE_KEYS, projectServices, serviceProjects,
};
