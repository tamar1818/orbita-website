'use strict';
/** /en/pricing — packages, maintenance and add-ons (prices from lib/pricing) */
const { e } = require('../../lib/core');
const { head, foot } = require('../../lib/layout-en');
const { map, ldJson } = require('../../lib/tpl');
const P = require('../../lib/pricing');
const S = require('./shared');

const { fmt } = P;

const PKG = {
  start: { name: 'Starter', who: 'For freelancers, consultants and small service businesses',
    items: ['One-page website', 'Enquiry form and WhatsApp button', 'Google Maps and contact details', 'Hosting, SSL and backups'] },
  business: { name: 'Business', who: 'For cafés, salons, clinics and growing companies',
    items: ['Up to 5 pages', 'Online booking or menu', 'SEO foundations', 'Hosting, SSL and backups', '30 minutes of changes per month'] },
  shop: { name: 'Store', who: 'For a small online store',
    items: ['Catalogue and cart', 'Card payments', 'Delivery rules', 'Hosting, SSL and backups', '1 hour of changes per month'] },
};
const CARE = {
  wordpress: { name: 'WordPress maintenance', desc: 'For sites built on WordPress.',
    items: ['Core, theme and plugin updates', 'Malware and security checks', 'Daily backups', 'Speed monitoring', 'Text and image changes'] },
  custom: { name: 'Custom site maintenance', desc: 'For custom-coded sites and web apps.',
    items: ['Code and server support', 'Bug fixes', 'Security updates', 'Daily backups', 'Small new features'] },
  seo: { name: 'SEO and maintenance', desc: 'Maintenance plus growth on Google.',
    items: ['Everything in WordPress maintenance', 'Technical SEO', 'Keyword research', 'Monthly content and page improvements', 'Monthly report'] },
};
const ADDONS = {
  chat: ['Lead chatbot', 'Asks visitors a few questions and emails you the answers.'],
  booking: ['Online booking', 'Clients pick a day and time themselves, no phone call needed.'],
  lang: ['Second language', 'English, Georgian or Russian version.'],
  seo: ['SEO articles', 'Two articles a month.'],
};
const FAQ = [
  ['What is the setup fee?', 'A one-off amount for building the site: adapting the design to your logo and colours, adding texts and photos and connecting the domain. It is paid once, before work starts.'],
  ['What does the monthly fee cover?', 'Hosting, SSL, backups, updates and small changes. Nothing else needs to be bought separately.'],
  ['Can I pay yearly?', 'Yes. Paying yearly costs 10 months instead of 12.'],
  ['Who owns the website?', 'The domain is registered in your name and the content is yours. After 12 months you can buy out the site and move it to other hosting.'],
  ['Do you work on larger, custom projects?', 'Yes. Packages are for small businesses. Larger sites, stores and web apps get an individual fixed quote within one or two business days.'],
];

function render() {
  const pk = P.packages();
  const mt = P.maintenance();
  const ad = P.addons();
  const min = Math.min(...pk.map((x) => x.setup));

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'OfferCatalog', name: 'Webico website packages', itemListElement: pk.map((p) => ({
        '@type': 'Offer', name: PKG[p.id].name, price: p.setup, priceCurrency: 'GEL',
        description: `Setup ${p.setup} GEL, then ${p.month} GEL per month` })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://webico.io/en' },
        { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://webico.io/en/pricing' }] },
      { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };

  return head({
    title: 'Pricing: website packages and maintenance | Webico',
    desc: `Website packages from ${min} GEL setup plus a monthly fee that covers hosting and care, maintenance plans and add-ons. Larger projects get a fixed quote.`,
    url: '/en/pricing', alt: '/plans',
    ld: '\n  <script type="application/ld+json">' + ldJson(ld) + '</script>',
  }) + `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/en">Home</a></li>
            <li><span aria-current="page">Pricing</span></li>
          </ol>
          <h1>Clear prices, no surprises</h1>
          <p>Ready-made packages for small businesses: a one-off setup fee, then a monthly fee for hosting and care. Larger projects get an individual fixed quote.</p>
        </div>
      </div>
    </section>

    <section class="section" id="packages">
      <div class="container">
        <div class="bill-toggle" role="group" aria-label="Billing period" data-bill>
          <button type="button" aria-pressed="true" data-bill-set="month">Monthly</button>
          <button type="button" aria-pressed="false" data-bill-set="year">Yearly <span>2 months free</span></button>
        </div>
        <div class="grid grid--3 plans">${map(pk, (p, i) => `
          <article class="price${p.featured ? ' price--featured' : ''}" data-reveal data-reveal-delay="${i * 80}">
            ${p.featured ? '<span class="price__badge">Most popular</span>' : ''}
            <h3>${e(PKG[p.id].name)}</h3>
            <p class="price__desc">${e(PKG[p.id].who)}</p>
            <p class="price__setup">${fmt(p.setup)} GEL <span>setup, once</span></p>
            <p class="price__amount" data-month="${fmt(p.month)}" data-year="${fmt(P.yearly(p.month))}">
              <b>${fmt(p.month)}</b><span data-unit-month="GEL / month" data-unit-year="GEL / year">GEL / month</span>
            </p>
            <ul class="card__list">${map(PKG[p.id].items, (li) => `<li>${e(li)}</li>`)}</ul>
            <a class="btn ${p.featured ? 'btn--primary' : 'btn--ghost'} btn--block" href="/en/contact?plan=${p.id}">Get started</a>
          </article>`)}
        </div>
        <div class="guarantee" data-reveal>
          <b>Not live in 7 days? Your first month is free.</b>
          <span>Prefer to buy the site outright? Starter ${fmt(pk[0].buy)} GEL, Business ${fmt(pk[1].buy)} GEL, Store ${fmt(pk[2].buy)} GEL. Maintenance is then billed separately.</span>
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>Add-ons</h2>
          <p>Add to any package, cancel any time.</p>
        </div>
        <div class="addons">${map(Object.entries(ad), ([k, [, pr]], i) => `
          <article class="addon" data-reveal data-reveal-delay="${i * 60}">
            <h3>${e(ADDONS[k][0])}</h3>
            <p>${e(ADDONS[k][1])}</p>
            <span class="addon__price">+${fmt(pr)} GEL / month</span>
          </article>`)}
        </div>
      </div>
    </section>

    <section class="section" id="care">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>Maintenance for existing sites</h2>
          <p>You run the business, we look after the site: updates, security, backups and changes.</p>
        </div>
        <div class="grid grid--3">${map(mt, (p, i) => `
          <article class="price${p.featured ? ' price--featured' : ''}" data-reveal data-reveal-delay="${i * 80}">
            ${p.featured ? '<span class="price__badge">For growth</span>' : ''}
            <h3>${e(CARE[p.id].name)}</h3>
            <p class="price__desc">${e(CARE[p.id].desc)}</p>
            <p class="price__amount"><b>${fmt(p.price)}</b><span>GEL / month</span></p>
            <ul class="card__list">${map(CARE[p.id].items, (li) => `<li>${e(li)}</li>`)}</ul>
            <a class="btn ${p.featured ? 'btn--primary' : 'btn--ghost'} btn--block" href="/en/contact?plan=${p.id}">Free audit</a>
          </article>`)}
        </div>
      </div>
    </section>

    <section class="section section--soft" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <h2>Pricing questions</h2>
            <p>Need something bigger or different? Ask for a fixed quote.</p>
            <a class="btn btn--primary" href="/en/contact">Get a quote</a>
          </div>
          ${S.faqBlock(FAQ, 'price-faq-')}
        </div>
      </div>
    </section>
${S.ctaSection('en-pricing-cta')}` + foot();
}

module.exports = { render };
