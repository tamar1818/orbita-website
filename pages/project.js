'use strict';
/** /work-<slug> — პროექტის გვერდი */
const fs = require('fs');
const path = require('path');
const { e, slug: toSlug, url: cu, ROOT } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const { projects, project, mock, tags, projectServices } = require('../lib/projects');
const { map, truthy, empty } = require('../lib/tpl');

const nl2br = (s) => String(s).replace(/(\r\n|\n|\r)/g, '<br />$1');

/** JPEG-ის სიმაღლე (SOF მარკერიდან) */
function jpegHeight(file) {
  try {
    const b = fs.readFileSync(file);
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return null;
      const m = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return b.readUInt16BE(i + 5);
      i += 2 + len;
    }
  } catch { /* */ }
  return null;
}

function render(rawSlug) {
  const slug = toSlug(rawSlug);
  const p = slug ? project(slug) : null;
  if (!p) return null;

  const all = projects();
  const idx = Math.max(0, all.findIndex((x) => (x.slug || '') === slug));
  const n = all.length;
  const prev = all[(idx - 1 + n) % n];
  const next = all[(idx + 1) % n];

  const name = String(p.name ?? '');
  const domain = String(p.domain ?? '');
  const url = domain !== '' ? 'https://' + domain + '/' : '';
  const stack = (p.stack || []).map((x) => String(x).trim()).filter(Boolean);
  const scope = (p.scope || []).map((x) => String(x).trim()).filter(Boolean);
  const full = String(p.full ?? '').trim();

  const svcs = projectServices(p);
  const isApp = (p.tags || []).join(' ').toLowerCase().includes('აპლიკაცი');
  const title = name + (isApp ? ' — აპლიკაციის დიზაინი და დეველოპმენტი'
    : (svcs.includes('web-development') || !svcs.includes('branding') ? ' — ვებსაიტის შექმნა' : ' — ვებსაიტის UI/UX დიზაინი')) + ' | Webico';
  const desc = !empty(p.summary) ? String(p.summary)
    : name + (domain !== '' ? ' (' + domain + ')' : '') + ' — ვებსაიტი, რომელიც შექმნა Webico-მ, ვებ დეველოპმენტის სააგენტომ თბილისში. ნახეთ პროექტის დეტალები.';
  const ogRel = 'assets/img/work/' + slug + '-website-og.jpg';
  const ogFile = path.join(ROOT, ogRel);
  const image = fs.existsSync(ogFile) ? ogRel : null;
  const imageH = image ? (jpegHeight(ogFile) || 770) : 630;
  const ld = '\n  <script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'CreativeWork', name, url: 'https://webico.io/work-' + slug,
    creator: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
  }, null, 4).replace(/</g, '\\u003c') + '\n  </script>';

  return head({ title, desc, url: '/work-' + slug, image, imageW: 1200, imageH, ld }) + `    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/work">ნამუშევრები</a></li>
            <li><span aria-current="page">${e(name)}</span></li>
          </ol>
          <span class="eyebrow">პროექტი</span>
          ${truthy(!empty(p.partner)) ? `<span class="partner-badge">${e(p.partner)}-თან ერთად</span>` : ''}          <h1>${e(name)}</h1>
          ${truthy(!empty(p.summary)) ? `<p>${e(p.summary)}</p>` : ''}          <div class="case__tags" style="margin-top:18px">
            ${map(tags(p), (t) => { return `<span class="tag">${e(t)}</span>`; })}          </div>
          <div class="btn-row">
            ${truthy(url) ? `<a class="btn btn--primary" href="${e(url)}" target="_blank" rel="noopener noreferrer">საიტის ნახვა ↗</a>` : ''}            <a class="btn btn--ghost" href="/work">ყველა ნამუშევარი</a>
          </div>
        </div>
      </div>
    </section>

    ${truthy(empty(p.hide_shot)) ? `    <section class="section section--tight">
      <div class="container"><div class="project-shot" data-reveal>${mock(p, '(max-width: 1280px) 100vw, 1232px', true)}</div></div>
    </section>
    ` : ''}
    ${truthy(full !== '') ? `    <section class="section section--tight">
      <div class="container">
        <figure class="project-full" data-reveal>
          <img src="${e(cu(full))}" alt="${e(name + ' — ' + (String(p.full_caption ?? '').trim() || 'ვებსაიტის სრული დიზაინი'))}" loading="lazy" decoding="async">
          <figcaption>${e(String(p.full_caption ?? '').trim() || 'სრული გვერდის დიზაინი')}</figcaption>
        </figure>
      </div>
    </section>
    ` : ''}
    <section class="section section--tight">
      <div class="container">
        <div class="project-meta">
          <div><b>კლიენტი</b><span>${e(name)}</span></div>
          ${truthy(!empty(p.year)) ? `<div><b>წელი</b><span>${e(p.year)}</span></div>` : ''}          ${truthy(url) ? `<div><b>ვებსაიტი</b><a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(domain)} ↗</a></div>` : ''}          ${truthy(!empty(p.partner)) ? `<div><b>თანამშრომლობა</b><span>${e(p.partner)}</span></div>` : ''}          <div><b>კატეგორია</b><span>${e(tags(p).join(', '))}</span></div>
        </div>
      </div>
    </section>

${truthy(!empty(p.challenge) || !empty(p.solution)) ? `    <section class="section">
      <div class="container">
        ${truthy(!empty(p.challenge)) ? `        <div class="feature-row__body" data-reveal>
          <span class="eyebrow">ამოცანა</span><h2>გამოწვევა</h2>
          <p>${nl2br(e(p.challenge))}</p>
        </div>
        ` : ''}        ${truthy(!empty(p.solution)) ? `        <div class="feature-row__body" data-reveal>
          <span class="eyebrow eyebrow--accent">გადაწყვეტა</span><h2>რა გავაკეთეთ</h2>
          <p>${nl2br(e(p.solution))}</p>
        </div>
        ` : ''}      </div>
    </section>
` : ''}
${truthy(scope.length || stack.length) ? `    <section class="section section--soft">
      <div class="container">
        <div class="grid grid--2">
          ${truthy(scope) ? `          <div data-reveal>
            <h3>სამუშაოს მოცულობა</h3>
            <ul class="checklist">${map(scope, (s) => { return `<li>${e(s)}</li>`; })}</ul>
          </div>
          ` : ''}          ${truthy(stack) ? `          <div data-reveal data-reveal-delay="80">
            <h3>ტექნოლოგიები</h3>
            <div class="case__tags" style="margin-top:18px">${map(stack, (s) => { return `<span class="tag">${e(s)}</span>`; })}</div>
          </div>
          ` : ''}        </div>
      </div>
    </section>
` : ''}
${truthy(!empty(p.result)) ? `    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">შედეგი</span><h2>${e(p.result)}</h2>
        </div>
      </div>
    </section>
` : ''}
    <section class="section section--tight">
      <div class="container">
        <div class="project-nav">
          <a href="/work-${e(prev.slug)}"><span><small>წინა</small>${e(prev.name)}</span></a>
          <a href="/work-${e(next.slug)}"><span><small>შემდეგი</small>${e(next.name)}</span></a>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render };
