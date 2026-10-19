'use strict';
/** /en/<service> — English service pages (content in data/en/services.json) */
const { e } = require('../../lib/core');
const { head, foot } = require('../../lib/layout-en');
const { mock, serviceProjects } = require('../../lib/projects');
const { map, ldJson } = require('../../lib/tpl');
const S = require('./shared');
const SERVICES = require('../../data/en/services.json');

const ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

function render(slug) {
  const D = SERVICES[slug];
  if (!D) return null;
  const url = '/en/' + slug;
  const full = 'https://webico.io' + url;
  const [work] = serviceProjects(D.key, 6);
  const rel = (D.related || []).filter((r) => SERVICES[r]).slice(0, 3);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: D.crumb, serviceType: D.service_type, description: D.desc, url: full, inLanguage: 'en',
        areaServed: [{ '@type': 'Country', name: 'Georgia' }, { '@type': 'Place', name: 'Europe' }],
        provider: { '@id': 'https://webico.io/#org' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://webico.io/en' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://webico.io/en/services' },
        { '@type': 'ListItem', position: 3, name: D.crumb, item: full }] },
      { '@type': 'FAQPage', mainEntity: D.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };

  return head({
    title: D.title, desc: D.desc, url, alt: D.ka,
    ld: '\n  <script type="application/ld+json">' + ldJson(ld) + '</script>',
  }) + `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/en">Home</a></li>
            <li><a href="/en/services">Services</a></li>
            <li><span aria-current="page">${e(D.crumb)}</span></li>
          </ol>
          <h1>${e(D.h1)}</h1>
          <p>${e(D.lead)}</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/en/contact">Get a quote</a>
            <a class="btn btn--ghost" href="/en/work">See our work</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="svc-intro" data-reveal>${map(D.intro, (p) => `<p>${e(p)}</p>`)}</div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>What is included</h2>
        </div>
        <div class="grid grid--3">${map(D.features, ([h, t], i) => `
          <article class="card" data-reveal data-reveal-delay="${Math.min(i, 5) * 50}">
            <h3>${e(h)}</h3>
            <p>${e(t)}</p>
          </article>`)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="feature-row">
          <div class="feature-row__body" data-reveal>
            <h2>${e(D.for_title)}</h2>
            <p>${e(D.for_text)}</p>
            <ul class="checklist">${map(D.for, (li) => `<li>${e(li)}</li>`)}</ul>
          </div>
          <div class="feature-row__media" data-reveal data-reveal-delay="90">
            <div class="panel panel--brand">
              <h3>What you get</h3>
              <ul class="checklist">${map(D.deliver, (li) => `<li>${e(li)}</li>`)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
${work.length ? `
    <section class="section svc-work">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div><h2>Recent work</h2></div>
          <a class="btn btn--ghost" href="/en/work">All projects</a>
        </div>
        <div class="svc-work__grid">${map(work, (w, i) => `
          <a class="svc-work__item" href="/en/work-${e(w.slug)}" data-reveal data-reveal-delay="${Math.min(i, 5) * 50}">
            ${mock(w.shot ? w : { ...w, shot: w.full }, '(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px')}
            <span class="svc-work__body">
              <b>${e(w.name)}</b>
              <small>${e(S.projectTags(w).slice(0, 2).join(' · '))}</small>
              <span class="svc-work__go" aria-hidden="true">${S.ARROW}</span>
            </span>
          </a>`)}
        </div>
      </div>
    </section>` : ''}

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>How it works</h2>
        </div>
        <div class="steps">${map(D.process, ([h, t], i) => `
          <article class="step" data-reveal data-reveal-delay="${i * 70}">
            <h3>${e(h)}</h3>
            <p>${e(t)}</p>
          </article>`)}
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <h2>Questions</h2>
            <p>Something else on your mind? Write to us.</p>
            <a class="btn btn--primary" href="/en/contact">Contact us</a>
          </div>
          ${S.faqBlock(D.faq, 'svc-faq-')}
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>Related services</h2>
        </div>
        <div class="grid grid--3">${map(rel, (r) => `
          <article class="card card--link" data-reveal>
            <h3>${e(SERVICES[r].crumb)}</h3>
            <p>${e(SERVICES[r].lead)}</p>
            <a class="link-arrow" href="/en/${r}">Learn more ${ARROW}<span class="sr-only"> about ${e(SERVICES[r].crumb)}</span></a>
          </article>`)}
        </div>
      </div>
    </section>
${S.ctaSection('en-svc-cta').replace("Let's talk about your project", e(D.cta_title))}` + foot();
}

module.exports = { render, SLUGS: Object.keys(SERVICES), SERVICES };
