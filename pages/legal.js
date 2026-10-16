'use strict';
/** სამართლებრივი გვერდები: /terms, /privacy, /refund, /delivery (ტექსტები — data/legal/) */
const fs = require('fs');
const path = require('path');
const { e, setting, ROOT } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const { dateKa } = require('../lib/blog');

const PAGES = {
  '/terms': 'წესები და პირობები',
  '/privacy': 'კონფიდენციალურობის პოლიტიკა',
  '/refund': 'გაუქმება და თანხის დაბრუნება',
  '/delivery': 'მომსახურების მიწოდება',
};

function ownerHtml() {
  const o = {
    name: setting('legal_name', 'თამარ გელიაშვილი'), id: setting('legal_id', '01024088829'),
    phone: setting('phone', '+995 557 64 32 25'), email: setting('email', 'hello@webico.io'),
    city: setting('address', 'თბილისი, საქართველო'),
  };
  const tel = o.phone.replace(/&amp;/g, '&').replace(/[^\d+]/g, '');
  return '<ul class="legal-owner">'
    + '<li><b>მომსახურების მიმწოდებელი</b><span>' + o.name + ' (ბრენდი „Webico“)</span></li>'
    + '<li><b>საიდენტიფიკაციო ნომერი</b><span>' + o.id + '</span></li>'
    + '<li><b>მისამართი</b><span>' + o.city + '</span></li>'
    + '<li><b>ტელეფონი</b><span><a href="tel:' + tel + '">' + o.phone + '</a></span></li>'
    + '<li><b>ელფოსტა</b><span><a href="mailto:' + o.email + '">' + o.email + '</a></span></li>'
    + '<li><b>ვებსაიტი</b><span><a href="https://webico.io/">webico.io</a></span></li>'
    + '</ul>';
}

function render(name) {
  const dir = path.join(ROOT, 'data/legal');
  const L = JSON.parse(fs.readFileSync(path.join(dir, name + '.json'), 'utf8'));
  const body = fs.readFileSync(path.join(dir, name + '.html'), 'utf8');
  const ld = '\n  <script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebPage', name: L.title,
    url: 'https://webico.io' + L.path, dateModified: L.updated, inLanguage: 'ka',
    publisher: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
  }) + '</script>';
  const nav = Object.entries(PAGES).map(([href, n]) => `
            <li><a href="${href}"${href === L.path ? ' aria-current="page"' : ''}>${e(n)}</a></li>`).join('');
  return head({ title: L.title + ' | Webico', desc: L.desc, url: L.path, ld }) + `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">${e(L.title)}</span></li>
          </ol>
          <span class="eyebrow">სამართლებრივი ინფორმაცია</span>
          <h1>${e(L.title)}</h1>
          <p>${e(L.lead)}</p>
          <p class="legal-updated">ბოლო განახლება: ${e(dateKa(L.updated))}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container legal">
        <aside class="legal__nav" aria-label="სამართლებრივი დოკუმენტები">
          <p>დოკუმენტები</p>
          <ul>${nav}
          </ul>
        </aside>
        <div class="legal__body prose">
          ${ownerHtml()}
          ${body}
          <p class="legal__contact">კითხვების შემთხვევაში მოგვწერეთ <a href="mailto:${setting('email', 'hello@webico.io')}">${setting('email', 'hello@webico.io')}</a>-ზე ან დაგვირეკეთ ${setting('phone', '+995 557 64 32 25')}.</p>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render, PAGES };
