'use strict';
/** /plans — საიტი და მოვლა ყოველთვიური გამოწერით */
const { e, T } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const { map, truthy, empty, decode } = require('../lib/tpl');

/** ფასი ადმინიდან (ტექსტები) ან ნაგულისხმევი; მხოლოდ ციფრები */
function price(key, def) {
  const n = parseInt(decode(T(key, String(def))).replace(/\D/g, ''), 10);
  return n || def;
}
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function data() {
  const START = {
      month: price('plans.start.price', 99),
      year: price('plans.start.year', 79),
      items: ['5-გვერდიანი საიტი თქვენი ბიზნესისთვის', 'მობილურზე ადაპტირებული, სწრაფი', 'საბაზისო SEO და Google Analytics', 'ჰოსტინგი, SSL და სარეზერვო ასლები', 'განახლებები და 30 წთ ცვლილებები ყოველთვე'],
  };

  const PLANS = [
      {
          id: 'wordpress', name: 'WordPress მოვლა', price: price('plans.wp.price', 500),
          desc: 'WordPress საიტისთვის, რომელიც ყოველთვის განახლებული და დაცული უნდა იყოს.',
          note: 'ყოველთვიური გადახდა',
          items: ['ბირთვის, თემისა და პლაგინების განახლება', 'უსაფრთხოება და მავნე კოდის შემოწმება', 'ყოველდღიური სარეზერვო ასლები', '24/7 მონიტორინგი და სისწრაფის კონტროლი', 'ტექსტების, ფოტოებისა და მცირე ცვლილებების შეტანა'],
      },
      {
          id: 'custom', name: 'ინდივიდუალური საიტის მოვლა', price: price('plans.custom.price', 1000),
          desc: 'საკუთარ კოდზე აწყობილი საიტისთვის ან ვებ-აპლიკაციისთვის.',
          note: 'ყოველთვიური გადახდა',
          items: ['კოდისა და სერვერის მხარდაჭერა', 'უსაფრთხოების განახლებები', 'ხარვეზების გასწორება', 'ყოველდღიური სარეზერვო ასლები და მონიტორინგი', 'ცვლილებები და მცირე ახალი ფუნქციები'],
      },
      {
          id: 'seo', name: 'SEO + მოვლა', price: price('plans.seo.price', 1500), featured: true,
          desc: 'საიტის სრული მოვლა და ზრდა Google-ში — ერთ პაკეტში.',
          note: 'ყოველთვიური გადახდა · მინიმალური ვადა — 3 თვე',
          items: ['WordPress მოვლის ყველა პუნქტი', 'ტექნიკური SEO და სისწრაფის ოპტიმიზაცია', 'საძიებო სიტყვების კვლევა ქართულად', 'ყოველთვიური კონტენტი და გვერდების ოპტიმიზაცია', 'Google Search Console და ყოველთვიური ანგარიში'],
      },
  ];

  const ADDONS = [
      ['ლიდების ჩატბოტი', price('plans.addon.chat', 49), 'რამდენიმე კითხვით აგროვებს მოთხოვნებს და პირდაპირ ელფოსტაზე გიგზავნით.'],
      ['ონლაინ ჯავშანი', price('plans.addon.booking', 39), 'კლიენტი თავად ირჩევს დღესა და საათს — ზარების გარეშე.'],
      ['SEO სტატიები', price('plans.addon.seo', 149), 'თვეში 2 სტატია ქართულად, საძიებო სიტყვებზე მორგებული.'],
      ['მეორე ენა', price('plans.addon.lang', 59), 'ინგლისური ან რუსული ვერსია და მისი განახლება.'],
  ];

  const STEPS = [
      ['აირჩიეთ ონლაინ', 'კონფიგურატორში 2 წუთში აირჩევთ გვერდებს, დამატებებსა და დიზაინს — ფასს მაშინვე ხედავთ.'],
      ['დიზაინი', 'დაგირეკავთ, დავაზუსტებთ დეტალებს და მოგიმზადებთ დიზაინს. გადახდა — მხოლოდ დამტკიცების შემდეგ.'],
      ['აწყობა და გაშვება', 'საიტს ვაწყობთ და ვუშვებთ თქვენს დომენზე. თქვენ მხოლოდ ტექსტებსა და ფოტოებს გვიგზავნით.'],
      ['მოვლა და ცვლილებები', 'ყოველთვე ვანახლებთ, ვამოწმებთ და ვცვლით, რასაც მოგვწერთ.'],
  ];

  const FAQ = [
      ['ვის ეკუთვნის საიტი?', 'დომენი თავიდანვე თქვენს სახელზე რეგისტრირდება. საიტი, ტექსტები და ფოტოები თქვენია. 12 თვის შემდეგ შეგიძლიათ გააგრძელოთ გამოწერა ან გამოისყიდოთ საიტის კოდი და სხვაგან გადაიტანოთ.'],
      ['ჰოსტინგი ცალკე უნდა ვიყიდო?', 'საიტი გამოწერით — არა: ჰოსტინგი, SSL სერტიფიკატი, სარეზერვო ასლები და მონიტორინგი ფასში შედის. მოვლის პაკეტებში საიტი შეიძლება თქვენს ამჟამინდელ ჰოსტინგზე დარჩეს, ან ჩვენ გადმოვიტანოთ.'],
      ['რა ხდება 12 თვის შემდეგ?', 'გამოწერა თვიურად გრძელდება, ნებისმიერ დროს შეწყვეტის უფლებით (30 დღით ადრე შეტყობინებით). თუ შეწყვეტთ, საიტის ფაილებს და მონაცემებს გადმოგცემთ.'],
      ['რა მოხდება, თუ თვიურ საათებზე მეტი ცვლილება დამჭირდება?', 'მცირე ცვლილებებს ჩვეულებრივ ვეტევით. დიდ ამოცანაზე (ახალი განყოფილება, ინტეგრაცია) ჯერ ფასს გეტყვით და მხოლოდ თქვენი თანხმობის შემდეგ დავიწყებთ.'],
      ['დომენის ფასი შედის?', 'დომენის წლიური საფასური (.ge ან .com) ცალკე იხდება და თქვენს სახელზეა. რეგისტრაციასა და ტექნიკურ მხარეს ჩვენ ვაგვარებთ.'],
      ['რა განსხვავებაა თვიურ და წლიურ გადახდას შორის?', 'თვიურად იხდით ' + START.month + ' ₾-ს, წლიური გადახდისას კი თვეში ' + START.year + ' ₾ გამოდის (' + START.year * 12 + ' ₾ წელიწადში).'],
      ['რა შედის მოვლის პაკეტებში?', 'განახლებები, უსაფრთხოება, სარეზერვო ასლები, მონიტორინგი და ცვლილებები. SEO + მოვლის პაკეტში ამას ემატება ყოველთვიური SEO სამუშაო და ანგარიში. მოვლას ვიღებთ ჩვენ მიერ შექმნილ და სხვა გუნდის მიერ აწყობილ საიტებზეც — პირველ თვეში საიტს ვაუდიტებთ.'],
      ['ფასში დღგ შედის?', 'ფასები მითითებულია დღგ-ს გარეშე.'],
  ];
  return { START, PLANS, ADDONS, STEPS, FAQ };
}

function render() {
  const { START, PLANS, ADDONS, STEPS, FAQ } = data();
  const offers = [{ id: 'start', name: 'საიტი გამოწერით', desc: 'ახალი საიტი ჰოსტინგითა და მოვლით', price: START.month }, ...PLANS].map((p) => ({
    '@type': 'Offer', name: p.name, description: p.desc, priceCurrency: 'GEL', price: p.price,
    priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'GEL', unitCode: 'MON', valueAddedTaxIncluded: false },
    url: 'https://webico.io/plans#' + p.id,
  }));
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: 'საიტი გამოწერით', serviceType: 'Website as a Service',
      provider: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
      areaServed: 'GE', url: 'https://webico.io/plans',
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'ყოველთვიური პაკეტები', itemListElement: offers } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://webico.io/' },
      { '@type': 'ListItem', position: 2, name: 'ფასები', item: 'https://webico.io/plans' }] },
    { '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) },
  ] };
  return head({
    title: 'ფასები: საიტი ' + START.year + ' ₾-დან თვეში და საიტის მოვლა | Webico',
    desc: 'ახალი საიტი წინასწარი გადახდის გარეშე — ' + START.year + ' ₾-დან თვეში, ჰოსტინგითა და მოვლით. WordPress საიტის მოვლა ' + PLANS[0].price + ' ₾, ინდივიდუალური საიტის — ' + PLANS[1].price + ' ₾, SEO + მოვლა — ' + PLANS[2].price + ' ₾ თვეში.',
    url: '/plans',
    ld: '\n  <script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>',
  }) + `    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ფასები</span></li>
          </ol>
          <span class="eyebrow">ფასები</span>
          <h1>${T('plans.title', 'საიტი ' + START.year + ' ₾-დან თვეში — წინასწარი გადახდის გარეშე')}</h1>
          <p>${T('plans.lead', 'იხდით თვიურად, როგორც ტელეფონის გეგმაში. საიტის აწყობა, ჰოსტინგი, უსაფრთხოება და ყოველთვიური ცვლილებები — ერთ ფასში.')}</p>
          <ul class="hero__perks plans-perks">
            <li>0 ₾ წინასწარ</li>
            <li>ჰოსტინგი და SSL შედის</li>
            <li>დომენი თქვენს სახელზე</li>
          </ul>
          <div class="btn-row">
            <a class="btn btn--primary" href="/start">ააწყვეთ საიტი 2 წუთში</a>
            <a class="btn btn--ghost" href="#care">საიტის მოვლა</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="start">
      <div class="container">
        <article class="start-card" data-reveal>
          <div class="start-card__body">
            <span class="price__badge">დაიწყეთ მარტივად</span>
            <h2>საიტი გამოწერით</h2>
            <p>აირჩიეთ ბიზნესი, გვერდები და დიზაინი ონლაინ — ჩვენ ავაწყობთ, განვათავსებთ და ყოველთვე მოვუვლით. გადახდა მხოლოდ დიზაინის დამტკიცების შემდეგ.</p>
            <ul class="card__list">
              ${map(START.items, (li) => { return `<li>${e(li)}</li>`; })}            </ul>
          </div>
          <div class="start-card__price">
            <p class="start-card__from">წლიური გადახდით</p>
            <p class="price__amount"><b>${fmt(START.year)}</b><span>₾ / თვე</span></p>
            <p class="price__note">თვიური გადახდით — ${fmt(START.month)} ₾ / თვე · 0 ₾ წინასწარ · მინიმალური ვადა 12 თვე</p>
            <a class="btn btn--primary btn--block" href="/start">ააწყვეთ საიტი</a>
            <a class="link-arrow" href="/contact?plan=start#booking">ან დაჯავშნეთ უფასო ზარი</a>
          </div>
        </article>
      </div>
    </section>

    <section class="section section--soft" id="care">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">საიტის მოვლა</span>
          <h2>მოვლის პაკეტები არსებული საიტებისთვის</h2>
          <p>თქვენ ბიზნესს აკეთებთ — საიტზე ჩვენ ვზრუნავთ: განახლებები, უსაფრთხოება, ასლები და ცვლილებები.</p>
        </div>
        <div class="grid grid--3 plans">
          ${map(PLANS, (p, i) => { return `          <article class="price${!empty(p.featured) ? ' price--featured' : ''}" id="${p.id}" data-reveal data-reveal-delay="${i * 80}">
            ${truthy(!empty(p.featured)) ? `<span class="price__badge">ზრდისთვის</span>` : ''}            <h3>${e(p.name)}</h3>
            <p class="price__desc">${e(p.desc)}</p>
            <p class="price__amount"><b>${fmt(p.price)}</b><span>₾ / თვე</span></p>
            <p class="price__note">${e(p.note)}</p>
            <ul class="card__list">
              ${map(p.items, (li) => { return `<li>${e(li)}</li>`; })}            </ul>
            <a class="btn ${!empty(p.featured) ? 'btn--primary' : 'btn--ghost'} btn--block" href="/contact?plan=${p.id}#booking">უფასო აუდიტი და კონსულტაცია</a>
          </article>
          `; })}        </div>
        <p class="text-center muted" style="margin-top:28px;font-size:.92rem">ფასები მითითებულია დღგ-ს გარეშე.
          ერთჯერადი გადახდით საიტი გირჩევნიათ? <a class="link-arrow" href="/services">იხილეთ სერვისები</a></p>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">დამატებები</span>
          <h2>დაამატეთ საიტს გამოწერით</h2>
          <p>ჩართეთ, როცა დაგჭირდებათ, და გამორთეთ ნებისმიერ დროს.</p>
        </div>
        <div class="addons">
          ${map(ADDONS, ([n, pr, t], i) => { return `          <article class="addon" data-reveal data-reveal-delay="${i * 60}">
            <h3>${e(n)}</h3>
            <p>${e(t)}</p>
            <span class="addon__price">+${fmt(pr)} ₾ / თვე</span>
          </article>
          `; })}        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">როგორ მუშაობს</span>
          <h2>ოთხი ნაბიჯი გაშვებამდე</h2>
        </div>
        <div class="steps">
          ${map(STEPS, ([h, t], i) => { return `          <article class="step" data-reveal data-reveal-delay="${i * 70}">
            <h3>${e(h)}</h3>
            <p>${e(t)}</p>
          </article>
          `; })}        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">შედარება</span>
          <h2>გამოწერა თუ ერთჯერადი გადახდა?</h2>
        </div>
        <div class="compare" data-reveal>
          <table>
            <thead><tr><th scope="col"></th><th scope="col">ერთჯერადი</th><th scope="col">გამოწერა</th></tr></thead>
            <tbody>
              <tr><th scope="row">წინასწარი გადახდა</th><td>სრული თანხა</td><td><b>0 ₾</b></td></tr>
              <tr><th scope="row">ჰოსტინგი და SSL</th><td>ცალკე იხდით</td><td><b>შედის</b></td></tr>
              <tr><th scope="row">განახლებები და უსაფრთხოება</th><td>3–6 თვე</td><td><b>მუდმივად</b></td></tr>
              <tr><th scope="row">ყოველთვიური ცვლილებები</th><td>ცალკე ანაზღაურებით</td><td><b>შედის</b></td></tr>
              <tr><th scope="row">საიტის საკუთრება</th><td>თქვენია</td><td>თქვენია; კოდის გამოსყიდვა 12 თვის შემდეგ</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <span class="eyebrow">კითხვები</span>
            <h2>ხშირად დასმული კითხვები გამოწერაზე</h2>
            <p>ვერ იპოვეთ პასუხი? დაჯავშნეთ უფასო ზარი ან მოგვწერეთ ჩატში.</p>
            <a class="btn btn--primary" href="/contact?plan=start#booking">შეხვედრის დაჯავშნა</a>
          </div>
          <div class="faq">
            ${map(FAQ, ([q, a], i) => { const id = 'pf-' + (i + 1); return `            <div class="faq__item">
              <h3 style="margin:0">
                <button class="faq__q" type="button" aria-expanded="false" aria-controls="${id}">
                  <span>${e(q)}</span><span class="faq__icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__a" id="${id}" data-open="false"><div><p>${e(a)}</p></div></div>
            </div>
            `; })}          </div>
        </div>
      </div>
    </section>

    <section class="cta cta--center">
      <div class="container">
        <div class="cta__inner" data-reveal>
          <h2>დაიწყეთ საიტი ${START.year} ₾-დან თვეში</h2>
          <p>ააწყვეთ საიტი ონლაინ 2 წუთში — ან დაჯავშნეთ უფასო ზარი და ყველაფერს ერთად გავივლით.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/start">ააწყვეთ საიტი</a>
            <button class="btn btn--light" type="button" data-open-chat>მოგვწერეთ ჩატში</button>
          </div>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render, price };
