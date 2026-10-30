/** საერთო ბლოკები: ბანერი, პლატფორმების ზოლი, გუნდი, „ვიზრდებით ერთად“, FAQ, JSON-LD */
import { url } from '@/lib/core';
import { TEAM, ver } from '@/lib/team';
import { ArrowUpRight } from './icons';

/** JSON-LD სქემა (</script>-ისგან დაცული) */
export function JsonLd({ data, indent = 4 }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, indent).replace(/</g, '\\u003c') }} />;
}

/** FAQ აკორდეონი */
export function Faq({ items, id }) {
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div className="faq__item" key={i}>
          <h3 style={{ margin: 0 }}>
            <button className="faq__q" type="button" aria-expanded="false" aria-controls={id + (i + 1)}>
              <span>{q}</span><span className="faq__icon" aria-hidden="true" />
            </button>
          </h3>
          <div className="faq__a" id={id + (i + 1)} data-open="false"><div><p>{a}</p></div></div>
        </div>
      ))}
    </div>
  );
}

/** მუქი ბანერი, უკან მოძრავი ნამუშევრებით */
export function HeroWall({ title, text, cta, work, wall, altSuffix = '', tags }) {
  const cols = [0, 1, 2, 3].map((k) => wall.filter((_, i) => i % 4 === k));
  return (
    <section className="hx-b">
      <div className="hx-b__wall" aria-hidden="true">
        {cols.map((col, k) => (
          <div className={'hx-b__col hx-b__col--' + (k % 2 ? 'down' : 'up')} key={k}>
            <div className="hx-b__track">
              {col.concat(col).map((c, i) => <img src={url(c.shot)} alt={(c.name || '') + altSuffix} loading="lazy" width="480" height="320" key={i} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="hx-b__inner">
        <h1 className="hx-b__title">{title}</h1>
        <div className="hx-b__aside">
          <p>{text}</p>
          <div className="btn-row">
            <a className="btn btn--white" href={cta[1]}>{cta[0]}</a>{' '}
            <a className="btn btn--outline-light" href={work[1]}>{work[0]}</a>
          </div>
        </div>
        {tags ? <ul className="hx-b__tags">{tags.map((t) => <li key={t}>{t}</li>)}</ul> : null}
      </div>
    </section>
  );
}

/** ბანერის ქვეშ: პლატფორმები, რომლებზეც ვმუშაობთ (მკრთალი ლოგოები, ნელა მოძრაობს) */
const STACK = [
  ['WordPress', 'wordpress'], ['WooCommerce', 'woocommerce'], ['Shopify', 'shopify'], ['Webflow', 'webflow'],
  ['Flitt', ''], ['Stripe', 'stripe'], ['Next.js', 'nextjs'], ['React', 'react'], ['Laravel', 'laravel'],
  ['Figma', 'figma'], ['Vercel', 'vercel'], ['AWS', 'aws'], ['Cloudflare', 'cloudflare'],
  ['Google Ads', 'googleads'], ['Meta', 'meta'], ['Lovable', 'lovable'],
];

export function StackStrip({ label }) {
  const items = STACK.map(([name, icon]) => (
    <li key={name}>
      {icon ? <img src={`/assets/img/tech/${icon}.svg`} alt={name + ' logo'} width="22" height="22" loading="lazy" /> : <i className="stack__mark" aria-hidden="true">f</i>}
      <span>{name}</span>
    </li>
  ));
  return (
    <section className="stack" aria-label={label}>
      <div className="stack__viewport">
        <ul className="stack__track">{items}</ul>
        <ul className="stack__track" aria-hidden="true">{items}</ul>
      </div>
    </section>
  );
}

/** გუნდის ფოტოები ჰორიზონტალურ ზოლში */
export function TeamStrip() {
  return (
    <section className="team-strip" aria-label="გუნდი">
      <div className="container">
        <div className="team-strip__row">
          {TEAM.map((m, i) => (
            <a className={'team-strip__item team-strip__item--' + (i + 1)} href="/about#team" key={m.slug}>
              <img src={`/assets/img/team/${m.slug}-sm.webp`} alt={m.ka[0]} width="560" height="700" loading="lazy" decoding="async" />
              <span className="team-strip__cap"><b>{m.ka[0]}</b><small>{m.ka[1]}</small></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** გუნდის სექცია (ჩვენ შესახებ) */
export function TeamSection() {
  return (
    <section className="section team" id="team">
      <div className="container">
        <div className="section-head section-head--center" data-reveal="">
          <h2>გუნდი</h2>
          <p>ადამიანები, ვისთანაც იმუშავებთ: პირველი ზარიდან გაშვებამდე და შემდეგაც.</p>
        </div>
        <div className="team-grid">
          {TEAM.map((m, i) => {
            const big = `/assets/img/team/${m.slug}.webp` + ver(`assets/img/team/${m.slug}.webp`);
            const sm = `/assets/img/team/${m.slug}-sm.webp` + ver(`assets/img/team/${m.slug}-sm.webp`);
            return (
              <figure className="person" data-reveal="" data-reveal-delay={i * 70} key={m.slug}>
                <div className="person__photo">
                  <img src={big} srcSet={`${sm} 560w, ${big} 1100w`} sizes={`(max-width: 700px) ${i ? '50vw' : '100vw'}, (max-width: 1100px) 33vw, 260px`}
                    alt={m.ka[0]} width="1100" height="1375" loading="lazy" decoding="async" />
                </div>
                <figcaption><b>{m.ka[0]}</b><span>{m.ka[1]}</span></figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** „ვიზრდებით ერთად“: მუქი ბარათი ღილაკით + დიდი ფოტო */
export function CtaGrow() {
  return (
    <section className="grow">
      <div className="container">
        <div className="grow__box">
          <div className="grow__card">
            <svg className="grow__curl" viewBox="0 0 220 120" aria-hidden="true"><path d="M-10 40 C 40 -10, 90 10, 70 45 C 55 72, 20 60, 34 34 C 50 6, 120 0, 230 30" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" /></svg>
            <h2>მოდი, ერთად გავზარდოთ თქვენი ბრენდი</h2>
            <p>მოგვიყევით, რას აკეთებთ და რა გსურთ. ერთ სამუშაო დღეში დაგიკავშირდებით და შემდეგ ნაბიჯებს ერთად დავგეგმავთ.</p>
            <a className="grow__btn" href="/contact">დაიწყეთ პროექტი<i><ArrowUpRight size={18} width="2.2" /></i></a>
          </div>
          <div className="grow__photo">
            <img src="/assets/img/team/office-wide.webp" srcSet="/assets/img/team/office-wide-sm.webp 960w, /assets/img/team/office-wide.webp 1536w"
              sizes="(max-width: 900px) 100vw, 60vw" alt="Webico-ს ოფისი" width="1536" height="1024" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** გვერდის სათაური breadcrumb-ით */
export function PageHero({ crumbs, eyebrow, title, children, compact = false }) {
  return (
    <section className={'page-hero' + (compact ? ' page-hero--compact' : '') + ' pattern-grid'}>
      <div className="container">
        <div className="page-hero__inner">
          <ol className="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            {crumbs.map(([href, label], i) => (
              <li key={i}>{href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}</li>
            ))}
          </ol>
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title !== undefined ? <h1>{title}</h1> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
