/** ნიშის გვერდები: /saiti-salonistvis, /saiti-kafestvis, /onlain-magazia (ტექსტები — data/niches.json) */
import { projects } from '@/lib/projects';
import * as P from '@/lib/pricing';
import NICHES from '@/data/niches.json';
import { Faq, JsonLd, PageHero } from '@/components/blocks';
import { SvcWorkItem } from '@/components/work';

const { fmt } = P;
export const SLUGS = Object.keys(NICHES);

export default function niche(slug) {
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
  const meta = { title: `${n.title} | Webico`, desc: n.desc, url: '/' + slug };

  const body = (
    <>
      <JsonLd data={ld} indent={0} />
      <PageHero crumbs={[[null, n.name]]} eyebrow={n.eyebrow} title={n.h1}>
        <p>{n.lead}</p>
        <div className="btn-row">
          <a className="btn btn--primary" href={start}>უფასო ნიმუში 24 საათში</a>{' '}
          <a className="btn btn--ghost" href="/plans">ფასები</a>
        </div>
        <ul className="hero__perks plans-perks">
          <li>გაშვება 7 დღეში</li>
          <li>{fmt(p.setup)} ₾ ჩართვა, {fmt(p.month)} ₾ / თვე</li>
          <li>დომენი თქვენს სახელზე</li>
        </ul>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">ნაცნობია?</span>
            <h2>რას შეცვლის საიტი</h2>
          </div>
          <div className="grid grid--3">
            {n.pains.map(([h, t], i) => (
              <article className="card niche-pain" data-reveal="" data-reveal-delay={i * 70} key={h}>
                <h3>{h}</h3>
                <p>{t}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container niche-offer">
          <div data-reveal="">
            <span className="eyebrow eyebrow--accent">რა იქნება საიტზე</span>
            <h2>ყველაფერი, რაც {n.name === 'ონლაინ მაღაზია' ? 'მაღაზიას' : 'თქვენს ბიზნესს'} სჭირდება</h2>
            <ul className="niche-feats">
              {n.features.map(([h, t]) => <li key={h}><b>{h}</b><span>{t}</span></li>)}
            </ul>
          </div>
          <article className="price price--featured niche-offer__card" data-reveal="" data-reveal-delay="80">
            <span className="price__badge">გირჩევთ</span>
            <h3>პაკეტი „{p.name}“</h3>
            <p className="price__setup">{fmt(p.setup)} ₾ <span>ჩართვა, ერთხელ</span></p>
            <p className="price__amount"><b>{fmt(p.month)}</b><span>₾ / თვე</span></p>
            <ul className="card__list">{p.items.map((li) => <li key={li}>{li}</li>)}</ul>
            <a className="btn btn--primary btn--block" href={start}>უფასო ნიმუში</a>
            <p className="niche-offer__note">7 დღეში ვერ გავუშვით? პირველი თვე უფასოა.</p>
          </article>
        </div>
      </section>

      {work.length ? (
        <section className="section svc-work">
          <div className="container">
            <div className="section-head section-head--split" data-reveal="">
              <div>
                <span className="eyebrow">ნამუშევრები</span>
                <h2>ჩვენი ბოლო პროექტები</h2>
              </div>
              <a className="btn btn--ghost" href="/work">ყველა ნამუშევარი ({all.length})</a>
            </div>
            <div className="svc-work__grid">
              {work.map((w, i) => <SvcWorkItem p={w} i={i} key={w.slug} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--soft" id="faq">
        <div className="container">
          <div className="faq-split">
            <div className="faq-split__head" data-reveal="">
              <span className="eyebrow">კითხვები</span>
              <h2>ხშირი კითხვები</h2>
              <p>სხვა კითხვა გაქვთ? მოგვწერეთ WhatsApp-ზე.</p>
              <a className="btn btn--primary" href={start}>უფასო ნიმუში</a>
            </div>
            <Faq items={n.faq} id="nf-" />
          </div>
        </div>
      </section>

      <section className="cta cta--center">
        <div className="container">
          <div className="cta__inner" data-reveal="">
            <h2>ნახეთ თქვენი საიტი, სანამ გადაიხდით</h2>
            <p>მოგვწერეთ სახელი და ტელეფონი. 24 საათში გაჩვენებთ, როგორ შეიძლება გამოიყურებოდეს.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href={start}>უფასო ნიმუში</a>{' '}
              <a className="btn btn--light" href="/contact#booking">ზარის დაჯავშნა</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
