'use strict';
/** English pages: about, services, work, project, contact */
const { e, url: cu, setting, slug: toSlug } = require('../../lib/core');
const { head, foot } = require('../../lib/layout-en');
const { project, mock } = require('../../lib/projects');
const { map, ldJson } = require('../../lib/tpl');
const S = require('./shared');
const { teamSection } = require('../../lib/team');

const crumbs = (items) => `<ol class="breadcrumb">${map(items, ([t, h], i) => i === items.length - 1
  ? `<li><span aria-current="page">${e(t)}</span></li>` : `<li><a href="${h}">${e(t)}</a></li>`)}</ol>`;

const pageHero = (items, h1, lead) => `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          ${crumbs(items)}
          <h1>${h1}</h1>
          <p>${lead}</p>
        </div>
      </div>
    </section>`;

/* ---------------------------------------------------------------- about */
function about() {
  return head({
    title: 'About | Webico',
    desc: 'Webico is a design and development studio in Tbilisi, Georgia, building websites and digital products for companies in Georgia and abroad.',
    url: '/en/about', alt: '/about',
  }) + pageHero([['Home', '/en'], ['About']], 'A small studio with high standards',
    'Webico is a design and development studio in Tbilisi, Georgia. We work with companies that care about how they look online and what their website actually does for them.') + `

    <section class="section">
      <div class="container">
        <div class="grid grid--2">
          <div data-reveal>
            <h2>Why we started</h2>
          </div>
          <div class="svc-intro" data-reveal data-reveal-delay="80">
            <p>Too many good businesses had websites that looked fine and did nothing. Design, code and marketing were handled by different people who rarely talked to each other.</p>
            <p>We put them in one team. The person who designs your site talks to the person who builds it, and both know what the site needs to achieve.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>How we work</h2>
        </div>
        <div class="grid grid--2">
          <article class="card" data-reveal><h3>Results over decoration</h3><p>A launch is the start, not the finish. We measure success by enquiries and sales, not by how many pages we shipped.</p></article>
          <article class="card" data-reveal data-reveal-delay="60"><h3>One point of contact</h3><p>Every project has one person responsible for it. You never have to chase answers across a team.</p></article>
          <article class="card" data-reveal data-reveal-delay="120"><h3>Fixed scope, fixed price</h3><p>You know the price and timeline before we start. Changes are discussed and priced before any work happens.</p></article>
          <article class="card" data-reveal data-reveal-delay="180"><h3>Everything is yours</h3><p>Domain, code, content, analytics and ad accounts are registered to you from day one.</p></article>
        </div>
      </div>
    </section>
${teamSection('en')}
${S.ctaSection('en-about-cta')}` + foot();
}

/* ------------------------------------------------------------- services */
function services() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: S.SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Service', name: s.title, description: s.text, provider: { '@id': 'https://webico.io/#org' } } })),
  };
  return head({
    title: 'Services | Webico',
    desc: 'Website design and development, online stores, WordPress, UI/UX and branding, SEO and maintenance from a studio in Tbilisi, Georgia.',
    url: '/en/services', alt: '/services',
    ld: '\n  <script type="application/ld+json">' + ldJson(ld) + '</script>',
  }) + pageHero([['Home', '/en'], ['Services']], 'Services',
    'Start with one service and add the rest when you need them. Every project gets a fixed quote within one or two business days.') + `
${map(S.SERVICES, (s, i) => `
    <section class="section${i % 2 ? ' section--soft' : ''}" id="${s.id}">
      <div class="container">
        <div class="grid grid--2" style="align-items:start">
          <div data-reveal>
            <h2>${e(s.title)}</h2>
            <p class="lead">${e(s.text)}</p>
            <div class="btn-row" style="margin-top:24px"><a class="btn btn--primary" href="/en/${s.page}">Learn more</a><a class="btn btn--ghost" href="/en/contact">Get a quote</a></div>
          </div>
          <ul class="checklist" data-reveal data-reveal-delay="80">${map(s.items, (li) => `<li>${e(li)}</li>`)}</ul>
        </div>
      </div>
    </section>`)}
${S.ctaSection('en-services-cta')}` + foot();
}

/* ----------------------------------------------------------------- work */
function work() {
  const list = S.projects();
  return head({
    title: 'Work | Webico',
    desc: `Selected projects by Webico: ${list.length} websites, online stores and interfaces for companies in Georgia and abroad.`,
    url: '/en/work', alt: '/work',
  }) + pageHero([['Home', '/en'], ['Work']], 'Work',
    `${list.length} projects for companies, organisations and online stores in Georgia and abroad.`) + `

    <section class="section svc-work">
      <div class="container">
        <div class="svc-work__grid">${map(list, (w, i) => `
          <a class="svc-work__item" href="/en/work-${e(w.slug)}" data-reveal data-reveal-delay="${Math.min(i % 6, 5) * 50}">
            ${mock(w.shot ? w : { ...w, shot: w.full || '' }, '(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px')}
            <span class="svc-work__body">
              <b>${e(w.name)}</b>
              <small>${e(S.projectTags(w).slice(0, 2).join(' · '))}</small>
              <span class="svc-work__go" aria-hidden="true">${S.ARROW}</span>
            </span>
          </a>`)}
        </div>
      </div>
    </section>
${S.ctaSection('en-work-cta')}` + foot();
}

/* -------------------------------------------------------------- project */
function projectPage(rawSlug) {
  const slug = toSlug(rawSlug);
  const p = slug ? project(slug) : null;
  if (!p) return null;
  const tr = S.projectEn(p);
  const all = S.projects();
  const idx = Math.max(0, all.findIndex((x) => x.slug === slug));
  const next = all[(idx + 1) % all.length];
  const domain = String(p.domain ?? '');
  const tg = S.projectTags(p);
  const summary = tr.summary || `${p.name}${domain ? ' (' + domain + ')' : ''}: ${tg.join(' and ').replace(/^./, (c) => c.toLowerCase())} by Webico, a design and development studio in Tbilisi, Georgia.`;
  const shot = String(p.shot ?? '').trim();
  const full = String(p.full ?? '').trim();

  return head({
    title: `${p.name}: ${tg[0]} | Webico`,
    desc: summary.length > 158 ? summary.slice(0, 155).replace(/\s+\S*$/, '') + '…' : summary,
    url: '/en/work-' + slug, alt: '/work-' + slug,
    image: shot ? shot.replace(/\.webp$/, '-og.jpg') : '',
  }) + pageHero([['Home', '/en'], ['Work', '/en/work'], [p.name]], e(p.name), e(summary)) + `

    <section class="section section--tight">
      <div class="container">
        <div class="case__tags" style="margin-bottom:22px">${map(tg, (t) => `<span class="tag">${e(t)}</span>`)}
          ${domain ? `<a class="link-arrow" href="https://${e(domain)}" target="_blank" rel="noopener">${e(domain)}</a>` : ''}
        </div>
        ${shot ? `<figure class="project-full" data-reveal><img src="${e(cu(shot))}" alt="${e(p.name)}" loading="eager"></figure>` : ''}
        ${full ? `<figure class="project-full" data-reveal style="margin-top:28px"><img src="${e(cu(full))}" alt="${e(p.name)} full page design" loading="lazy" decoding="async"></figure>` : ''}
      </div>
    </section>
${(tr.scope || tg).length ? `
    <section class="section section--soft">
      <div class="container">
        <div class="grid grid--2" style="align-items:start">
          <h2 data-reveal>What we did</h2>
          <ul class="checklist" data-reveal data-reveal-delay="80">${map(tr.scope || tg, (s) => `<li>${e(s)}</li>`)}</ul>
        </div>
      </div>
    </section>` : ''}

    <section class="section section--tight">
      <div class="container">
        <a class="link-arrow" href="/en/work-${e(next.slug)}">Next project: ${e(next.name)}</a>
      </div>
    </section>
${S.ctaSection('en-project-cta')}` + foot();
}

/* -------------------------------------------------------------- contact */
function contact() {
  const email = setting('email', 'hello@webico.io');
  return head({
    title: 'Contact | Webico',
    desc: 'Tell us about your project. Webico replies within one business day.',
    url: '/en/contact', alt: '/contact',
  }) + pageHero([['Home', '/en'], ['Contact']], 'Tell us about your project',
    'Write a few lines about what you need. We reply within one business day, usually sooner.') + `

    <section class="section">
      <div class="container">
        <div class="grid grid--2" style="align-items:start">
          <div data-reveal>
            ${S.leadForm('en-contact', 'Project enquiry')}
          </div>
          <div class="contact-info" data-reveal data-reveal-delay="80">
            <h2>Contact details</h2>
            <ul class="checklist">
              <li><a href="mailto:${email}">${email}</a></li>
              <li><a href="tel:+995557643225">${setting('phone', '+995 557 64 32 25')}</a> (also WhatsApp)</li>
              <li>Tbilisi, Georgia. We meet online or in person.</li>
              <li>Monday to Friday, 10:00–19:00 (GMT+4)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
` + foot();
}

/* ------------------------------------------------------------------ 404 */
function notFound() {
  return head({ title: 'Page not found | Webico', desc: 'This page does not exist.', url: '/en/404', alt: '/' })
    .replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">') + `
    <section class="page-hero">
      <div class="container">
        <div class="page-hero__inner">
          <h1>Page not found</h1>
          <p>The page you are looking for has moved or never existed.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/en">Back to home</a>
            <a class="btn btn--ghost" href="/en/work">See our work</a>
          </div>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { about, services, work, projectPage, contact, notFound };
