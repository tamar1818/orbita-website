/** მთავარი გვერდი */
import { txt, opt } from '@/lib/core';
import { projects, showcase, tags } from '@/lib/projects';
import { posts as allPosts } from '@/lib/blog';
import { SOCIAL } from '@/lib/blocks';
import { HeroWall, StackStrip, CtaGrow, JsonLd } from '@/components/blocks';
import { WorkBento } from '@/components/work';
import { PostCard } from '@/components/posts';
import { ArrowRight } from '@/components/icons';
import { CATALOG } from '@/lib/catalog';

/** სრული სერვის პაკეტი (lib/catalog.js) + აიკონები: [ტონი, id, ბმული, სათაური, ტექსტი, თეგები, აიკონი] */
const ICONS = {
  software: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="13" y1="4" x2="11" y2="20" /></>,
  ecommerce: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
  content: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  seo: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.7" y2="16.7" /></>,
  copywriting: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  graphic: <><circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.6-10-8.6z" /></>,
  advertising: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
  production: <><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
  ai: <><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  web: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  branding: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  devops: <><rect x="2" y="3" width="20" height="7" rx="1.5" /><rect x="2" y="14" width="20" height="7" rx="1.5" /><line x1="6" y1="6.5" x2="6.01" y2="6.5" /><line x1="6" y1="17.5" x2="6.01" y2="17.5" /></>,
};
const SERVICES = CATALOG.map((c) => [c.tone, c.id, c.href, c.title, c.desc, c.tags, ICONS[c.id]]);


const STEPS = [
  ['გაცნობა', 'გესაუბრებით ბიზნესზე, კლიენტებზე და კონკურენტებზე. ვუყურებთ, რა გაქვთ ახლა.'],
  ['დაგეგმვა', 'ვწერთ გეგმას, ვთანხმდებით ფასზე, ვადებზე და იმაზე, რას ჩავთვლით შედეგად.'],
  ['შექმნა', 'ვაწყობთ საიტს, ვწერთ ტექსტებს, ვუშვებთ რეკლამას. კვირაში ერთხელ გიგზავნით სტატუსს.'],
  ['გაშვება', 'საიტი ეშვება. მერე ვუყურებთ ციფრებს და ვასწორებთ იმას, რაც ცუდად მუშაობს.'],
];

function ld() {
  const email = opt('email', 'hello@webico.io');
  const phone = opt('phone', '+995 557 64 32 25').replace(/[^\d+]/g, '');
  const names = CATALOG.map((c) => c.title);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': 'https://webico.io/#org', name: 'Webico', alternateName: 'ვებიკო', url: 'https://webico.io/',
        logo: 'https://webico.io/assets/img/apple-touch-icon.png',
        description: 'Webico ციფრული სააგენტოა თბილისში: პროგრამული ინჟინერია, ვებ დეველოპმენტი, ელექტრონული კომერცია, SEO, ციფრული რეკლამა, კონტენტი, ბრენდინგი, პროდაქშენი, AI კონტენტი და DevOps ერთ გუნდში.',
        email, telephone: phone, foundingLocation: { '@type': 'Place', name: 'თბილისი, საქართველო' },
        address: { '@type': 'PostalAddress', addressLocality: 'თბილისი', addressCountry: 'GE' },
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email, telephone: phone, availableLanguage: ['ka', 'en'] },
        knowsAbout: names, sameAs: [SOCIAL.instagram, SOCIAL.facebook] },
      { '@type': 'WebSite', '@id': 'https://webico.io/#website', url: 'https://webico.io/', name: 'Webico', inLanguage: 'ka',
        publisher: { '@id': 'https://webico.io/#org' } },
      { '@type': 'ProfessionalService', '@id': 'https://webico.io/#service', name: 'Webico', url: 'https://webico.io/',
        description: 'Webico — სრული ციფრული სერვისი ერთ გუნდში: საიტები და აპლიკაციები, ონლაინ მაღაზიები და გადახდები, SEO და რეკლამა, კონტენტი და ქოფირაითინგი, ბრენდინგი და გრაფიკული დიზაინი, ფოტო-ვიდეო პროდაქშენი, AI კონტენტი და DevOps.',
        image: 'https://webico.io/assets/img/og-webico-3.jpg', email, telephone: phone,
        address: { '@type': 'PostalAddress', addressLocality: 'თბილისი', addressCountry: 'GE' },
        areaServed: [{ '@type': 'Country', name: 'Georgia' }, { '@type': 'Place', name: 'Worldwide' }],
        parentOrganization: { '@id': 'https://webico.io/#org' },
        knowsAbout: names,
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'სრული ციფრული სერვისი ერთ გუნდში',
          itemListElement: CATALOG.map((c) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: c.title, description: c.desc, url: 'https://webico.io' + c.href, provider: { '@id': 'https://webico.io/#org' } } })) } },
    ],
  };
}

export default function home() {
  const shots = showcase().filter((x) => String(x.shot ?? '').trim() !== '');
  const posts = allPosts().slice(0, 3);
  const meta = {
    title: 'საიტის დამზადება, SEO და ციფრული მარკეტინგი თბილისში | Webico',
    desc: 'Webico ციფრული სააგენტოა თბილისში: ვებ გვერდის დამზადება, ონლაინ მაღაზიები, SEO ოპტიმიზაცია, Facebook და Google რეკლამა, ლოგო და ბრენდინგი. ნახეთ ნამუშევრები და დაჯავშნეთ უფასო კონსულტაცია.',
    url: '/',
    imageAlt: 'ვებიკო — ციფრული სააგენტო',
  };
  const body = (
    <>
      <JsonLd data={ld()} />
      <HeroWall
        title={<>{txt('home.hero2.title_a', 'დიზაინი და კოდი,')} {txt('home.hero2.title_b', 'რომელიც')} <em>{txt('home.hero2.title_em', 'ბრენდს')}</em> {txt('home.hero2.title_c', 'აძლიერებს')}</>}
        text={txt('home.hero2.text', 'Webico დიზაინისა და დეველოპმენტის სტუდიაა თბილისში. ვქმნით ვებსაიტებს, ონლაინ მაღაზიებს და ციფრულ პროდუქტებს ქართული და საერთაშორისო კომპანიებისთვის.')}
        cta={[txt('home.hero2.cta', 'დაიწყეთ პროექტი'), '/contact']}
        work={['ნამუშევრები', '/work']}
        wall={shots.slice(0, 16)}
        altSuffix=" — Webico-ს ნამუშევარი"
        tags={['სტრატეგია', 'UI/UX დიზაინი', 'დეველოპმენტი', 'SEO და ზრდა']}
      />
      <StackStrip label="პლატფორმები, რომლებზეც ვმუშაობთ" />

      <section className="section" id="services">
        <div className="container ab-carousel carousel" data-carousel="">
          <div className="section-head section-head--split" data-reveal="">
            <div><span className="eyebrow">სერვისები</span><h2>საიტი, SEO, რეკლამა და დიზაინი ერთ გუნდში</h2></div>
            <div className="ab-carousel__nav">
              <a className="btn btn--ghost" href="/services">ყველა სერვისი</a>
              <div className="carousel__controls">
                <button className="carousel__btn" type="button" data-carousel-prev="" aria-label="წინა"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg></button>
                <button className="carousel__btn" type="button" data-carousel-next="" aria-label="შემდეგი"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
              </div>
            </div>
          </div>
          <div className="ab-caps carousel__viewport" data-carousel-track="">
            {SERVICES.map(([tone, id, href, title, desc, items, icon]) => (
              <div className="carousel__slide" key={id}>
                <a className={'ab-cap ab-cap--' + tone} href={href}>
                  <span className="ab-cap__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg></span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
                  <span className="ab-cap__go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg></span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkBento shots={shots} total={projects().length} />

      <section className="section section--soft" id="process">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">როგორ ვმუშაობთ</span>
            <h2>როგორ მიმდინარეობს მუშაობა</h2>
            <p>ყოველთვის იცით, რა ეტაპზეა პროექტი და რა იქნება შემდეგ.</p>
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

      <CtaGrow />

      {posts.length ? (
        <section className="section" id="blog">
          <div className="container">
            <div className="section-head section-head--split" data-reveal="">
              <div>
                <span className="eyebrow">ბლოგი</span>
                <h2>რჩევები ბიზნესისთვის</h2>
              </div>
              <a className="btn btn--ghost" href="/blog">ყველა სტატია</a>
            </div>
            <div className="post-grid" data-reveal="">
              {posts.map((p) => <PostCard p={p} key={p.slug} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--soft" id="lead">
        <div className="container">
          <div className="faq-split">
            <div className="faq-split__head" data-reveal="">
              <span className="eyebrow">დაგვიკავშირდით</span>
              <h2>მოგვიყევით თქვენს პროექტზე</h2>
              <p>დაგვიტოვეთ სახელი და ტელეფონი. ერთ სამუშაო დღეში დაგიკავშირდებით და გეტყვით სავარაუდო ფასს და ვადას.</p>
            </div>
            <div data-reveal="" data-reveal-delay="90">
              <form className="lead-form" data-lead-form="home" method="post" action="#">
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="home-name">სახელი <span className="req">*</span></label>
                    <input type="text" id="home-name" name="name" autoComplete="name" placeholder="თქვენი სახელი" required />
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="home-phone">ტელეფონი <span className="req">*</span></label>
                    <input type="tel" id="home-phone" name="phone" autoComplete="tel" inputMode="tel" placeholder="+995 5XX XX XX XX" required />
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="home-email">ელფოსტა</label>
                    <input type="email" id="home-email" name="email" autoComplete="email" placeholder="name@company.ge" />
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="home-service">რომელი სერვისი გაინტერესებთ?</label>
                    <select id="home-service" name="service" defaultValue="">
                      <option value="">აირჩიეთ სერვისი</option>
                      {SERVICES.map(([, id, , title]) => <option value={id} key={id}>{title}</option>)}
                      <option value="other">სხვა / ჯერ არ ვიცი</option>
                    </select>
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="home-message">მოკლედ პროექტზე</label>
                  <textarea id="home-message" name="message" rows="4" placeholder="მაგალითად: მჭირდება საიტი სალონისთვის ონლაინ ჯავშნით…" />
                  <span className="field__error" />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="home-hp">არ შეავსოთ</label>
                  <input type="text" id="home-hp" name="company_website" tabIndex="-1" autoComplete="off" />
                </div>
                <button className="btn btn--primary btn--block" type="submit">განაცხადის გაგზავნა</button>
                <p className="form-note"><span>თქვენს მონაცემებს არავის გადავცემთ.</span></p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
