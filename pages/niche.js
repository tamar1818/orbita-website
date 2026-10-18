'use strict';
/** ნიშის გვერდები: /saiti-salonistvis, /saiti-kafestvis, /onlain-magazia (ტექსტები — data/niches.json) */
const { e } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const { map, ldJson } = require('../lib/tpl');
const { projects, mock, tags, ARROW } = require('../lib/projects');
const P = require('../lib/pricing');
const NICHES = require('../data/niches.json');

const { fmt } = P;

function render(slug) {
  const n = NICHES[slug];
  if (!n) return null;
  const pk = P.packages();
  const p = pk.find((x) => x.id === n.pkg) || pk[1];
  const start = `/start?type=${n.type}&pkg=${p.id}`;
  const all = projects();
  const work = n.projects.map((s) => all.find((x) => x.slug === s)).filter((x) => x && (x.shot || x.full));

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: n.title, provider: { '@id': 'https://webico.io/#org' }, areaServed: 'GE',
        offers: { '@type': 'Offer', price: p.setup, priceCurrency: 'GEL', description: `ჩართვა ${p.setup} ₾, შემდეგ ${p.month} ₾ თვეში` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://webico.io/' },
        { '@type': 'ListItem', position: 2, name: n.name, item: 'https://webico.io/' + slug }] },
      { '@type': 'FAQPage', mainEntity: n.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };

  return head({
    title: `${n.title} | Webico`,
    desc: n.desc,
    url: '/' + slug,
    ld: '\n  <script type="application/ld+json">' + ldJson(ld) + '</script>',
  }) + `
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">${e(n.name)}</span></li>
          </ol>
          <span class="eyebrow">${e(n.eyebrow)}</span>
          <h1>${e(n.h1)}</h1>
          <p>${e(n.lead)}</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="${start}">უფასო ნიმუში 24 საათში</a>
            <a class="btn btn--ghost" href="/plans">ფასები</a>
          </div>
          <ul class="hero__perks plans-perks">
            <li>გაშვება 7 დღეში</li>
            <li>${fmt(p.setup)} ₾ ჩართვა, ${fmt(p.month)} ₾ / თვე</li>
            <li>დომენი თქვენს სახელზე</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">ნაცნობია?</span>
          <h2>რას შეცვლის საიტი</h2>
        </div>
        <div class="grid grid--3">${map(n.pains, ([h, t], i) => `
          <article class="card niche-pain" data-reveal data-reveal-delay="${i * 70}">
            <h3>${e(h)}</h3>
            <p>${e(t)}</p>
          </article>`)}
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container niche-offer">
        <div data-reveal>
          <span class="eyebrow eyebrow--accent">რა იქნება საიტზე</span>
          <h2>ყველაფერი, რაც ${e(n.name === 'ონლაინ მაღაზია' ? 'მაღაზიას' : 'თქვენს ბიზნესს')} სჭირდება</h2>
          <ul class="niche-feats">${map(n.features, ([h, t]) => `
            <li><b>${e(h)}</b><span>${e(t)}</span></li>`)}
          </ul>
        </div>
        <article class="price price--featured niche-offer__card" data-reveal data-reveal-delay="80">
          <span class="price__badge">გირჩევთ</span>
          <h3>პაკეტი „${e(p.name)}“</h3>
          <p class="price__setup">${fmt(p.setup)} ₾ <span>ჩართვა, ერთხელ</span></p>
          <p class="price__amount"><b>${fmt(p.month)}</b><span>₾ / თვე</span></p>
          <ul class="card__list">${map(p.items, (li) => `<li>${e(li)}</li>`)}</ul>
          <a class="btn btn--primary btn--block" href="${start}">უფასო ნიმუში</a>
          <p class="niche-offer__note">7 დღეში ვერ გავუშვით? პირველი თვე უფასოა.</p>
        </article>
      </div>
    </section>
${work.length ? `
    <section class="section svc-work">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div>
            <span class="eyebrow">ნამუშევრები</span>
            <h2>ჩვენი ბოლო პროექტები</h2>
          </div>
          <a class="btn btn--ghost" href="/work">ყველა ნამუშევარი (${all.length})</a>
        </div>
        <div class="svc-work__grid">${map(work, (w, i) => `
          <a class="svc-work__item" href="/work-${e(w.slug)}" data-reveal data-reveal-delay="${i * 50}">
            ${mock(w.shot ? w : { ...w, shot: w.full }, '(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px')}
            <span class="svc-work__body">
              <b>${e(w.name)}</b>
              <small>${e(tags(w).slice(0, 2).join(' · '))}</small>
              <span class="svc-work__go" aria-hidden="true">${ARROW}</span>
            </span>
          </a>`)}
        </div>
      </div>
    </section>
` : ''}
    <section class="section section--soft" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <span class="eyebrow">კითხვები</span>
            <h2>ხშირი კითხვები</h2>
            <p>სხვა კითხვა გაქვთ? მოგვწერეთ WhatsApp-ზე.</p>
            <a class="btn btn--primary" href="${start}">უფასო ნიმუში</a>
          </div>
          <div class="faq">${map(n.faq, ([q, a], i) => `
            <div class="faq__item">
              <h3 style="margin:0">
                <button class="faq__q" type="button" aria-expanded="false" aria-controls="nf-${i + 1}">
                  <span>${e(q)}</span><span class="faq__icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__a" id="nf-${i + 1}" data-open="false"><div><p>${e(a)}</p></div></div>
            </div>`)}
          </div>
        </div>
      </div>
    </section>

    <section class="cta cta--center">
      <div class="container">
        <div class="cta__inner" data-reveal>
          <h2>ნახეთ თქვენი საიტი, სანამ გადაიხდით</h2>
          <p>მოგვწერეთ სახელი და ტელეფონი. 24 საათში გაჩვენებთ, როგორ შეიძლება გამოიყურებოდეს.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="${start}">უფასო ნიმუში</a>
            <a class="btn btn--light" href="/contact#booking">ზარის დაჯავშნა</a>
          </div>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render, SLUGS: Object.keys(NICHES), NICHES };
