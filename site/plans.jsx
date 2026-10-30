/** /plans — პაკეტები: ჩართვის საფასური + თვიური გადასახადი; მოვლა არსებული საიტებისთვის */
import { txt } from '@/lib/core';
import * as P from '@/lib/pricing';
import { Faq, JsonLd, PageHero } from '@/components/blocks';

const { fmt } = P;

const STEPS = [
  ['მოთხოვნა', 'აირჩიეთ პაკეტი და მოგვწერეთ. ერთ საათში დაგიკავშირდებით.'],
  ['უფასო ნიმუში', '24 საათში გიგზავნით, როგორ გამოიყურება თქვენი საიტი თქვენი ლოგოთი და ფერებით.'],
  ['გაშვება 7 დღეში', 'იხდით ჩართვის საფასურს, ჩვენ ვაწყობთ საიტს და ვაერთებთ თქვენს დომენზე.'],
  ['მოვლა', 'ყოველთვე ვანახლებთ, ვამოწმებთ და ვცვლით, რასაც მოგვწერთ.'],
];

function faq(pk) {
  const b = pk.find((x) => x.id === 'business');
  return [
    ['რა არის ჩართვის საფასური?', 'ერთჯერადი თანხა საიტის აწყობისთვის: დიზაინს ვარგებთ თქვენს ლოგოსა და ფერებს, ვსვამთ ტექსტებს და ფოტოებს, ვაერთებთ დომენს. იხდით ერთხელ, მუშაობის დაწყებამდე.'],
    ['რას ვიხდი ყოველთვიურად?', 'ჰოსტინგს, SSL სერტიფიკატს, ასლებს, განახლებებს და მცირე ცვლილებებს. სხვა რამის ცალკე ყიდვა არ მოგიწევთ.'],
    ['წლიურად გადახდა შეიძლება?', `კი. წლიურად თუ გადაიხდით, 12 თვის ნაცვლად 10 თვის თანხას იხდით. მაგალითად, „ბიზნესი“ ${fmt(b.month)} ₾-ის ნაცვლად თვეში ${fmt(Math.round(P.yearly(b.month) / 12))} ₾ გამოდის.`],
    ['ვის ეკუთვნის საიტი?', 'დომენი თქვენს სახელზე რეგისტრირდება, ტექსტები და ფოტოებიც თქვენია. 12 თვის შემდეგ შეგიძლიათ საიტი გამოისყიდოთ და სხვა ჰოსტინგზე გადაიტანოთ.'],
    ['თუ გადახდას დავაგვიანებ?', 'ჯერ შეგახსენებთ ელფოსტით და ტელეფონით. თუ 10 დღეში თანხა არ ჩაირიცხა, საიტი დროებით ჩერდება. გადახდისთანავე ისევ ჩაირთვება და არაფერი იკარგება.'],
    ['შემიძლია გავაუქმო?', 'პირველი 12 თვე ხელშეკრულებით არის განსაზღვრული. ამის შემდეგ ნებისმიერ დროს შეწყვეტთ, უბრალოდ 30 დღით ადრე უნდა შეგვატყობინოთ.'],
    ['დომენის ფასი შედის?', 'არა, დომენის (.ge ან .com) წლიური საფასური ცალკე იხდება და თქვენს სახელზეა. რეგისტრაციას ჩვენ მოვაგვარებთ.'],
    ['თუ 7 დღეში ვერ მოასწარით?', 'მაშინ პირველი თვე უფასოა. ვადა იწყება მას შემდეგ, რაც ტექსტებს და ფოტოებს მოგვაწვდით.'],
  ];
}

/** ფასის ბარათი (პაკეტი ან მოვლა) */
function Price({ p, i, badge, children, href, cta }) {
  return (
    <article className={'price' + (p.featured ? ' price--featured' : '')} id={p.id} data-reveal="" data-reveal-delay={i * 80}>
      {p.featured ? <span className="price__badge">{badge}</span> : null}
      <h3>{p.name}</h3>
      {children}
      <ul className="card__list">{p.items.map((li) => <li key={li}>{li}</li>)}</ul>
      <a className={'btn ' + (p.featured ? 'btn--primary' : 'btn--ghost') + ' btn--block'} href={href}>{cta}</a>
    </article>
  );
}

export default function plans() {
  const pk = P.packages();
  const mt = P.maintenance();
  const ad = Object.values(P.addons());
  const FAQ = faq(pk);
  const min = Math.min(...pk.map((x) => x.setup));

  const offers = pk.map((p) => ({
    '@type': 'Offer', name: 'საიტი — ' + p.name, priceCurrency: 'GEL', price: p.setup,
    priceSpecification: [
      { '@type': 'UnitPriceSpecification', price: p.setup, priceCurrency: 'GEL', name: 'ჩართვის საფასური' },
      { '@type': 'UnitPriceSpecification', price: p.month, priceCurrency: 'GEL', unitCode: 'MON', name: 'თვიური გადასახადი' },
    ],
    url: 'https://webico.io/plans#' + p.id,
  })).concat(mt.map((p) => ({
    '@type': 'Offer', name: p.name, priceCurrency: 'GEL', price: p.price,
    priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'GEL', unitCode: 'MON' },
    url: 'https://webico.io/plans#' + p.id,
  })));
  const ld = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', name: 'საიტის დამზადება და მოვლა', provider: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
        areaServed: 'GE', url: 'https://webico.io/plans',
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'პაკეტები', itemListElement: offers } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://webico.io/' },
        { '@type': 'ListItem', position: 2, name: 'ფასები', item: 'https://webico.io/plans' }] },
      { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
  const meta = {
    title: `ფასები: საიტი 7 დღეში, ${min} ₾-დან | Webico`,
    desc: `საიტი მცირე ბიზნესისთვის 7 დღეში: ჩართვა ${min} ₾-დან და თვიური გადასახადი ${Math.min(...pk.map((x) => x.month))} ₾-დან. ჰოსტინგი და მოვლა შედის. უფასო ნიმუში 24 საათში.`,
    url: '/plans',
  };

  const body = (
    <>
      <JsonLd data={ld} indent={0} />
      <PageHero crumbs={[[null, 'ფასები']]} eyebrow="ფასები" title={txt('plans.title', `საიტი 7 დღეში, ${min} ₾-დან`)}>
        <p>{txt('plans.lead', 'ერთხელ იხდით აწყობაში, მერე კი თვიურად ჰოსტინგსა და მოვლაში. ფასი წინასწარ იცით და დამატებითი ხარჯი არ გელით.')}</p>
        <ul className="hero__perks plans-perks">
          <li>გაშვება 7 დღეში</li>
          <li>უფასო ნიმუში 24 საათში</li>
          <li>დომენი თქვენს სახელზე</li>
        </ul>
      </PageHero>

      <section className="section" id="packages">
        <div className="container">
          <div className="bill-toggle" role="group" aria-label="გადახდის პერიოდი" data-bill="">
            <button type="button" aria-pressed="true" data-bill-set="month">თვიურად</button>
            <button type="button" aria-pressed="false" data-bill-set="year">წლიურად <span>2 თვე უფასოდ</span></button>
          </div>
          <div className="grid grid--3 plans">
            {pk.map((p, i) => (
              <Price p={p} i={i} badge="ყველაზე ხშირად ირჩევენ" href={'/start?pkg=' + p.id} cta="უფასო ნიმუში" key={p.id}>
                <p className="price__desc">{p.who}</p>
                <p className="price__setup">{fmt(p.setup)} ₾ <span>ჩართვა, ერთხელ</span></p>
                <p className="price__amount" data-month={fmt(p.month)} data-year={fmt(P.yearly(p.month))}>
                  <b>{fmt(p.month)}</b><span data-unit-month="₾ / თვე" data-unit-year="₾ / წელი">₾ / თვე</span>
                </p>
              </Price>
            ))}
          </div>
          <div className="guarantee" data-reveal="">
            <b>7 დღეში ვერ გავუშვით? პირველი თვე უფასოა.</b>
            <span>ერთჯერადად ყიდვა გირჩევნიათ? სტარტი {fmt(pk[0].buy)} ₾, ბიზნესი {fmt(pk[1].buy)} ₾, მაღაზია {fmt(pk[2].buy)} ₾. მოვლა ამ შემთხვევაში ცალკე იხდება.</span>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">დამატებები</span>
            <h2>რაც შეიძლება მოგვიანებით დაამატოთ</h2>
            <p>ნებისმიერ პაკეტს ემატება და ნებისმიერ დროს ითიშება.</p>
          </div>
          <div className="addons">
            {ad.map(([n, pr, t], i) => (
              <article className="addon" data-reveal="" data-reveal-delay={i * 60} key={n}>
                <h3>{n}</h3>
                <p>{t}</p>
                <span className="addon__price">+{fmt(pr)} ₾ / თვე</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">როგორ ვმუშაობთ</span>
            <h2>მოთხოვნიდან გაშვებამდე ერთი კვირა</h2>
          </div>
          <div className="steps">
            {STEPS.map(([h, t], i) => (
              <article className="step" data-reveal="" data-reveal-delay={i * 70} key={h}>
                <h3>{h}</h3>
                <p>{t}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="care">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">უკვე გაქვთ საიტი?</span>
            <h2>მოვლა არსებული საიტისთვის</h2>
            <p>თქვენ ბიზნესს მიხედეთ, საიტზე ჩვენ ვიზრუნებთ: განახლებები, უსაფრთხოება, ასლები და ცვლილებები.</p>
          </div>
          <div className="grid grid--3">
            {mt.map((p, i) => (
              <Price p={p} i={i} badge="ზრდისთვის" href={'/contact?plan=' + p.id + '#booking'} cta="უფასო აუდიტი" key={p.id}>
                <p className="price__desc">{p.desc}</p>
                <p className="price__amount"><b>{fmt(p.price)}</b><span>₾ / თვე</span></p>
              </Price>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="faq-split">
            <div className="faq-split__head" data-reveal="">
              <span className="eyebrow">კითხვები</span>
              <h2>რასაც ყველაზე ხშირად გვეკითხებიან</h2>
              <p>პასუხი ვერ იპოვეთ? მოგვწერეთ WhatsApp-ზე ან ჩატში.</p>
              <a className="btn btn--primary" href="/start">უფასო ნიმუში</a>
            </div>
            <Faq items={FAQ} id="pf-" />
          </div>
        </div>
      </section>

      <section className="cta cta--center">
        <div className="container">
          <div className="cta__inner" data-reveal="">
            <h2>ნახეთ თქვენი საიტი, სანამ გადაიხდით</h2>
            <p>მოგვწერეთ ბიზნესის სახელი და 24 საათში გამოგიგზავნით, როგორ გამოიყურება. უფასოდ და ვალდებულების გარეშე.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/start">უფასო ნიმუში</a>{' '}
              <a className="btn btn--light" href="/contact#booking">ზარის დაჯავშნა</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
