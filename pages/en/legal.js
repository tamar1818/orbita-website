'use strict';
/** /en/privacy and /en/terms (texts in data/en/legal/) */
const fs = require('fs');
const path = require('path');
const { e, setting, ROOT } = require('../../lib/core');
const { head, foot } = require('../../lib/layout-en');

const PAGES = {
  privacy: { title: 'Privacy policy', ka: '/privacy', updated: '2026-10-15',
    desc: 'How Webico collects, uses and protects personal data: forms, bookings, payments, cookies and your rights.',
    lead: 'What data we collect, why we use it and how we protect it.' },
  terms: { title: 'Terms of service', ka: '/terms', updated: '2026-10-15',
    desc: 'Terms of service for Webico: orders, prices and payment, subscriptions and cancellation, ownership, hosting and liability.',
    lead: 'The rules for ordering and using our services.' },
};

function owner() {
  const email = setting('email', 'hello@webico.io');
  const phone = setting('phone', '+995 557 64 32 25');
  return '<ul class="legal-owner">'
    + '<li><b>Service provider</b><span>' + setting('legal_name_en', 'Tamar Geliashvili') + ' (brand "Webico")</span></li>'
    + '<li><b>Personal ID number</b><span>' + setting('legal_id', '01024088829') + '</span></li>'
    + '<li><b>Address</b><span>Tbilisi, Georgia</span></li>'
    + '<li><b>Phone</b><span><a href="tel:' + phone.replace(/[^\d+]/g, '') + '">' + phone + '</a></span></li>'
    + '<li><b>Email</b><span><a href="mailto:' + email + '">' + email + '</a></span></li>'
    + '</ul>';
}

function render(name) {
  const L = PAGES[name];
  if (!L) return null;
  const body = fs.readFileSync(path.join(ROOT, 'data/en/legal', name + '.html'), 'utf8');
  const url = '/en/' + name;
  const ld = '\n  <script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebPage', name: L.title, url: 'https://webico.io' + url,
    dateModified: L.updated, inLanguage: 'en', publisher: { '@id': 'https://webico.io/#org' },
  }) + '</script>';
  const nav = Object.entries(PAGES).map(([k, p]) => `
            <li><a href="/en/${k}"${k === name ? ' aria-current="page"' : ''}>${e(p.title)}</a></li>`).join('');
  const date = new Date(L.updated + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return head({ title: L.title + ' | Webico', desc: L.desc, url, alt: L.ka, ld }) + `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/en">Home</a></li>
            <li><span aria-current="page">${e(L.title)}</span></li>
          </ol>
          <h1>${e(L.title)}</h1>
          <p>${e(L.lead)}</p>
          <p class="legal-updated">Last updated: ${date}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container legal">
        <aside class="legal__nav" aria-label="Legal documents">
          <p>Documents</p>
          <ul>${nav}
          </ul>
        </aside>
        <div class="legal__body prose">
          ${owner()}
          ${body}
          <p class="legal__contact">Questions? Email <a href="mailto:${setting('email', 'hello@webico.io')}">${setting('email', 'hello@webico.io')}</a> or call ${setting('phone', '+995 557 64 32 25')}.</p>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render, PAGES };
