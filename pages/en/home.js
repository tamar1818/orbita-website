'use strict';
/** /en — English home page */
const { e, url } = require('../../lib/core');
const { head, foot } = require('../../lib/layout-en');
const { mock } = require('../../lib/projects');
const { map, ldJson } = require('../../lib/tpl');
const S = require('./shared');
const { heroWall, stackStrip } = require('../../lib/hero');
const { statement, workBento, ctaGrow } = require('../../lib/blocks');

const FAQ = [
  ['Do you work with clients outside Georgia?', 'Yes. We work in English with companies in Europe and the US. Calls happen over Google Meet or Zoom, and our hours overlap with European business hours.'],
  ['How much does a website cost?', 'Every project is quoted individually, based on the number of pages, design depth, languages and integrations. After a first call you get a fixed quote within one or two business days.'],
  ['How long does a project take?', 'A website usually takes three to eight weeks. Online stores and web apps take longer. You get a schedule with milestones together with the quote.'],
  ['Who owns the website?', 'You do. The domain, code, content and all accounts are registered to you, and you can move them at any time.'],
  ['Do you support the site after launch?', 'Yes. We offer monthly maintenance: updates, security, backups and small changes.'],
];

const PREVIEW = { websites: 'arlo-funding', ecommerce: 'tamaras-collect', wordpress: 'outsourcify', design: 'linden-spa', seo: 'gcci-germany', care: 'bitefit' };

function render() {
  const all = S.projects();
  const shots = S.withShots();
  const PICK = ['arlo-funding', 'gcci-germany', 'linden-spa', 'outsourcify'];
  const cases = PICK.map((sl) => shots.find((x) => x.slug === sl)).filter(Boolean).slice(0, 4);
  const grid = shots.slice(0, 6);
  const prev = (sl) => { const f = shots.find((x) => x.slug === sl) || shots[0]; return f ? e(url(f.shot)) : ''; };

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': 'https://webico.io/#org', name: 'Webico', url: 'https://webico.io/',
        logo: 'https://webico.io/assets/img/apple-touch-icon.png', email: 'hello@webico.io' },
      { '@type': 'WebSite', '@id': 'https://webico.io/#website', url: 'https://webico.io/', name: 'Webico', inLanguage: ['ka', 'en'],
        publisher: { '@id': 'https://webico.io/#org' } },
      { '@type': 'ProfessionalService', name: 'Webico', url: 'https://webico.io/en', image: 'https://webico.io/assets/img/og-webico-en.jpg',
        description: 'Design and development studio in Tbilisi, Georgia: websites, online stores, UI/UX design, SEO and maintenance.',
        telephone: '+995557643225', email: 'hello@webico.io', priceRange: '$$',
        address: { '@type': 'PostalAddress', addressLocality: 'Tbilisi', addressCountry: 'GE' },
        areaServed: [{ '@type': 'Country', name: 'Georgia' }, { '@type': 'Place', name: 'Europe' }, { '@type': 'Country', name: 'United States' }],
        knowsAbout: ['Web design', 'Web development', 'WordPress', 'WooCommerce', 'Shopify', 'UI/UX design', 'SEO'],
        parentOrganization: { '@id': 'https://webico.io/#org' } },
      { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };

  return head({
    title: 'Webico | Web design & development studio',
    desc: 'Webico is a design and development studio in Tbilisi, Georgia. We build websites, online stores and digital products for companies in Georgia and abroad.',
    url: '/en',
    alt: '/',
    ld: '\n  <script type="application/ld+json">' + ldJson(ld) + '</script>',
  }) + `
${heroWall({
    base: '/en',
    title: 'Design and code that make your <em>brand</em> stronger',
    text: 'Webico is a design and development studio in Tbilisi. We build websites, online stores and digital products for companies in Georgia and abroad.',
    cta: ['Start a project', '/en/contact'],
    work: ['See our work', '/en/work'],
    wall: shots.slice(0, 16),
    tags: ['Strategy', 'UI/UX design', 'Development', 'SEO & growth'],
  })}
${stackStrip('Platforms we build on')}
${statement('en')}
    <section class="section" id="services">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>What we do</h2>
          <p>One team handles design, code and growth, so nothing gets lost between agencies.</p>
        </div>
        <div class="svc-list" data-reveal>${map(S.SERVICES, (s) => `
          <a class="svc svc--${s.tone}" href="/en/${s.page}" data-preview="${prev(PREVIEW[s.id] || 'marketing-agency')}">
            <div class="svc__main">
              <h3 class="svc__title">${e(s.title)}</h3>
              <span class="svc__desc"><span>${e(s.text)}</span></span>
            </div>
            <span class="svc__tags">${map(s.tags, (t) => `<span>${e(t)}</span>`)}</span>
            <span class="svc__go">${S.ARROW}</span>
          </a>`)}
        </div>
      </div>
    </section>


${workBento('en', shots, all.length, (w) => S.projectTags(w)[0])}
    <section class="section section--soft" id="process">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>How we work</h2>
          <p>You always know where the project stands and what comes next.</p>
        </div>
        <div class="steps">
          <article class="step" data-reveal><h3>Discovery</h3><p>We learn about your business, customers and competitors, and look at what you have today.</p></article>
          <article class="step" data-reveal data-reveal-delay="70"><h3>Plan</h3><p>A written scope, fixed price, timeline and an agreement on what success looks like.</p></article>
          <article class="step" data-reveal data-reveal-delay="140"><h3>Design &amp; build</h3><p>Design in Figma, then development. You get a short status update every week.</p></article>
          <article class="step" data-reveal data-reveal-delay="210"><h3>Launch &amp; improve</h3><p>We launch, watch the numbers and fix what doesn't perform.</p></article>
        </div>
      </div>
    </section>

${ctaGrow('en')}
    <section class="section" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <h2>Questions</h2>
            <p>Something else on your mind? Write to us.</p>
            <a class="btn btn--primary" href="/en/contact">Contact us</a>
          </div>
          ${S.faqBlock(FAQ, 'en-faq-')}
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render };
