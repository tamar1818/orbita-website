'use strict';
/** პროექტების წაკითხვა და საერთო რენდერი */
const fs = require('fs');
const path = require('path');
const { read, e, url, ROOT } = require('./core');

function projects(includeHidden = false) {
  const list = read('projects', { projects: [] }).projects || [];
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

/** პროექტის მოკაპის <img> — srcset-ით, თუ პატარა ვერსია (-sm.webp) არსებობს */
function shotImg(p, sizes = '(max-width: 620px) 100vw, 50vw', eager = false) {
  const shot = s(p.shot);
  if (shot === '') return '';
  const src = url(shot);
  let srcset = '';
  const m = shot.match(/^(.+)\.webp$/);
  if (m && fs.existsSync(path.join(ROOT, m[1].replace(/^\/+/, '') + '-sm.webp'))) {
    srcset = ' srcset="' + e(url(m[1] + '-sm.webp')) + ' 720w, ' + e(src) + ' 1400w"' + ' sizes="' + e(sizes) + '"';
  }
  return '<img src="' + e(src) + '"' + srcset
    + ' alt="' + e((p.name || '') + ' — ვებსაიტი, შექმნილი Webico-ს მიერ') + '"'
    + ' width="1400" height="900" decoding="async"' + (eager ? '' : ' loading="lazy"') + '>';
}

function mock(p, sizes = '(max-width: 620px) 100vw, 50vw', eager = false) {
  const tone = p.tone || 'lilac';
  if (s(p.shot) !== '') return '<figure class="shot">' + shotImg(p, sizes, eager) + '</figure>';
  const cls = tone === 'lilac' ? '' : ' mock-site--' + e(tone);
  const page = '<div class="mock-site__page">'
    + '<div class="mock-site__nav">'
    + '<span class="mock-site__brand">' + e(initials(p.name || '')) + '</span>'
    + '<i></i><i></i><i></i></div>'
    + '<div class="mock-site__hero">'
    + '<span class="mock-site__h"></span>'
    + '<span class="mock-site__h mock-site__h--sm"></span>'
    + '<span class="mock-site__cta"></span></div>'
    + '<div class="mock-site__cols"><i></i><i></i><i></i></div>'
    + '</div>';
  return '<div class="mock-site' + cls + '">'
    + '<div class="mock-site__bar"><i></i><i></i><i></i>'
    + '<span class="mock-site__url">' + e(p.domain || '') + '</span></div>'
    + '<div class="mock-site__view">' + page + '</div></div>';
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

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
const EXT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

/* --------------------------------------------------- ინსტრუმენტების სია */
const TOOLS_DEFAULT = [
  ['WordPress', 'Wp', '#21759b'], ['WooCommerce', 'Wc', '#7f54b3'], ['Shopify', 'Sh', '#5a8f3d'],
  ['Webflow', 'Wf', '#4353ff'], ['Lovable', 'Lo', '#d1443c'], ['Next.js / React', 'Ne', '#0b7285'],
  ['Laravel', 'La', '#c0392b'], ['PHP', 'Php', '#5b6398'], ['AWS', 'aws', '#b26a00'],
  ['Cloudflare', 'Cf', '#c76a12'], ['Figma', 'Fi', '#8b45d6'], ['Google Ads', 'Gg', '#2f6fd0'],
  ['Meta Ads', 'Me', '#1666c2'], ['Google Analytics', 'Ga', '#c47b17'],
];

function tools() {
  const out = [];
  for (const t of read('site').tools || []) {
    const name = s(t.name);
    if (name) out.push([name, s(t.mark ?? [...name].slice(0, 2).join('')), s(t.color ?? '#181818')]);
  }
  return out.length ? out : TOOLS_DEFAULT;
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

function serviceWorkSection(key) {
  const [list, match] = serviceProjects(key);
  if (!list.length) return '';
  const eyebrow = match ? (SERVICE_KEYS[key] || 'ნამუშევრები') : 'ნამუშევრები';
  const title = match ? 'შესრულებული პროექტები' : 'ჩვენი ბოლო ნამუშევრები';
  const total = projects().length;
  const items = list.map((p, i) => {
    const shown = { ...p };
    if (s(p.shot) === '') shown.shot = p.full;
    return `
          <a class="svc-work__item" href="/work-${e(p.slug)}" data-reveal data-reveal-delay="${Math.min(i, 5) * 50}">
            ${mock(shown, '(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px')}
            <span class="svc-work__body">
              <b>${e(p.name)}</b>
              <small>${e(tags(p).slice(0, 2).join(' · '))}</small>
              <span class="svc-work__go" aria-hidden="true">${ARROW}</span>
            </span>
          </a>`;
  }).join('');
  return `
    <section class="section svc-work" id="projects">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div>
            <span class="eyebrow">${e(eyebrow)}</span>
            <h2>${e(title)}</h2>
          </div>
          <a class="btn btn--ghost" href="/work">ყველა ნამუშევარი (${total})</a>
        </div>
        <div class="svc-work__grid">${items}
        </div>
      </div>
    </section>
`;
}

module.exports = {
  projects, project, initials, shotImg, mock, showcase, tags, tools, ARROW, EXT,
  SERVICE_KEYS, projectServices, serviceProjects, serviceWorkSection,
};
