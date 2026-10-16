'use strict';
/**
 * სერვისის გვერდის შაბლონი (data/services/*.json-დან).
 * სქემა: Service + BreadcrumbList + FAQPage (FAQ გვერდზე ხილულია).
 */
const { e } = require('./core');
const { head, foot } = require('./layout');
const blog = require('./blog');
const { serviceWorkSection } = require('./projects');

const SVG_ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

/** ყველა სერვისი — „სხვა სერვისების“ ბლოკისთვის */
const SERVICES = {
  '/service-web-development': ['ვებსაიტის დამზადება', 'კორპორატიული საიტები, ლენდინგები და ვებ-აპლიკაციები.'],
  '/service-wordpress': ['WordPress დეველოპმენტი', 'WordPress საიტები, საკუთარი თემები და პლაგინები.'],
  '/service-ecommerce': ['ონლაინ მაღაზიის შექმნა', 'WooCommerce და Shopify მაღაზიები ქართული გადახდებით.'],
  '/service-seo': ['SEO ოპტიმიზაცია', 'ტექნიკური SEO, სემანტიკა და კონტენტი ქართულად.'],
  '/service-maintenance': ['საიტის ტექნიკური მხარდაჭერა', 'განახლებები, უსაფრთხოება, სარეზერვო ასლები.'],
  '/service-branding': ['ბრენდინგი და UI/UX დიზაინი', 'ლოგო, ბრენდბუქი და ინტერფეისის დიზაინი.'],
  '/service-marketing': ['ციფრული მარკეტინგი', 'Google Ads, Meta და TikTok კამპანიები.'],
};

const map = (a, f) => (a || []).map(f).join('');

function servicePage(S) {
  const u = 'https://webico.io' + S.path;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service', name: S.service_name, serviceType: S.service_type, description: S.desc, url: u,
        areaServed: { '@type': 'Country', name: 'Georgia' },
        provider: { '@type': 'ProfessionalService', name: 'Webico', url: 'https://webico.io/' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://webico.io/' },
          { '@type': 'ListItem', position: 2, name: 'სერვისები', item: 'https://webico.io/services' },
          { '@type': 'ListItem', position: 3, name: S.crumb, item: u },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: S.faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })),
      },
    ],
  };
  const pageLd = '\n  <script type="application/ld+json">\n' + JSON.stringify(ld, null, 4).replace(/</g, '\\u003c') + '\n  </script>';

  const arts = (S.posts || []).map(blog.post).filter(Boolean);
  const rel = Object.entries(SERVICES).filter(([k]) => k !== S.path && (S.related || []).includes(k)).slice(0, 3);

  return head({ title: S.title, desc: S.desc, url: S.path, ld: pageLd }) + `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/services">სერვისები</a></li>
            <li><span aria-current="page">${e(S.crumb)}</span></li>
          </ol>
          <span class="eyebrow">${e(S.eyebrow)}</span>
          <h1>${e(S.h1)}</h1>
          <p>${e(S.lead)}</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/contact#booking">უფასო კონსულტაცია</a>
            <a class="btn btn--ghost" href="/work">ნამუშევრები</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="svc-intro" data-reveal>
          ${map(S.intro, (p) => `<p>${e(p)}</p>`)}
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">რას მოიცავს</span>
          <h2>${e(S.features_title)}</h2>
        </div>
        <div class="grid grid--3">
          ${map(S.features, ([h, t], i) => `
          <article class="card" data-reveal data-reveal-delay="${Math.min(i, 5) * 50}">
            <h3>${e(h)}</h3>
            <p>${e(t)}</p>
          </article>`)}
        </div>
      </div>
    </section>
${S.for && S.for.length ? `
    <section class="section">
      <div class="container">
        <div class="feature-row">
          <div class="feature-row__body" data-reveal>
            <span class="eyebrow">ვისთვის</span>
            <h2>${e(S.for_title)}</h2>
            ${S.for_text ? `<p>${e(S.for_text)}</p>` : ''}
            <ul class="checklist">
              ${map(S.for, (li) => `<li>${e(li)}</li>`)}
            </ul>
          </div>
          <div class="feature-row__media" data-reveal data-reveal-delay="90">
            <div class="panel panel--brand">
              <h3>რას იღებთ</h3>
              <ul class="checklist">
                ${map(S.deliver, (li) => `<li>${e(li)}</li>`)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>` : ''}
${serviceWorkSection(S.path.slice('/service-'.length))}
    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">პროცესი</span>
          <h2>${e(S.process_title)}</h2>
        </div>
        <div class="steps">
          ${map(S.process, ([h, t], i) => `
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
            <span class="eyebrow">კითხვები</span>
            <h2>${e(S.faq_title)}</h2>
            <p>ვერ იპოვეთ პასუხი? დაჯავშნეთ უფასო ზარი ან მოგვწერეთ ჩატში.</p>
            <a class="btn btn--primary" href="/contact#booking">შეხვედრის დაჯავშნა</a>
          </div>
          <div class="faq">
            ${map(S.faq, ([q, a], i) => `
            <div class="faq__item">
              <h3 style="margin:0">
                <button class="faq__q" type="button" aria-expanded="false" aria-controls="sf-${i + 1}">
                  <span>${e(q)}</span><span class="faq__icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__a" id="sf-${i + 1}" data-open="false"><div><p>${e(a)}</p></div></div>
            </div>`)}
          </div>
        </div>
      </div>
    </section>
${arts.length ? `
    <section class="section">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div><span class="eyebrow">ბლოგიდან</span><h2>სასარგებლო სტატიები</h2></div>
          <a class="btn btn--ghost" href="/blog">ყველა სტატია</a>
        </div>
        <div class="post-grid" data-reveal>
          ${arts.slice(0, 3).map((a) => blog.postCard(a)).join('')}
        </div>
      </div>
    </section>` : ''}

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">სხვა სერვისები</span>
          <h2>რითი შეგვიძლია კიდევ დაგეხმაროთ</h2>
        </div>
        <div class="grid grid--3">
          ${map(rel, ([href, [name, txt]]) => `
          <article class="card card--link" data-reveal>
            <h3>${e(name)}</h3>
            <p>${e(txt)}</p>
            <a class="link-arrow" href="${e(href)}">დეტალურად ${SVG_ARROW}<span class="sr-only"> — ${e(name)}</span></a>
          </article>`)}
        </div>
      </div>
    </section>

    <section class="cta cta--center">
      <div class="container">
        <div class="cta__inner" data-reveal>
          <h2>${e(S.cta_title)}</h2>
          <p>უფასო კონსულტაციაზე მოვისმენთ თქვენს ამოცანას და ერთ სამუშაო დღეში გამოგიგზავნით
            საორიენტაციო გეგმას, ვადებსა და ღირებულებას.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/contact#booking">შეხვედრის დაჯავშნა</a>
            <a class="btn btn--light" href="/contact#contact-form">განაცხადის გაგზავნა</a>
          </div>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { servicePage, SERVICES, SVG_ARROW };
