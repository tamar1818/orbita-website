/** მთავარი გვერდი */
import { txt, opt } from '@/lib/core';
import { projects, showcase, tags } from '@/lib/projects';
import { posts as allPosts } from '@/lib/blog';
import { SOCIAL } from '@/lib/blocks';
import { HeroWall, StackStrip, CtaGrow, JsonLd } from '@/components/blocks';
import { WorkBento } from '@/components/work';
import { PostCard } from '@/components/posts';
import { ArrowRight } from '@/components/icons';

const SERVICES = [
  ['lilac', '/service-web-development', 'ვებსაიტის დამზადება', 'კომპანიის საიტი, ლენდინგი ან ვებ-აპლიკაცია. სწრაფი, მობილურზე მოხერხებული და გასაგები.',
    <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="13" y1="4" x2="11" y2="20" /></>],
  ['lime', '/service-wordpress', 'WordPress დეველოპმენტი', 'საკუთარი თემა, Elementor და ACF. ტექსტებს და ფოტოებს თვითონ შეცვლით.',
    <><circle cx="12" cy="12" r="9" /><path d="M3.5 9h17M3.5 15h17" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>],
  ['pink', '/service-ecommerce', 'ონლაინ მაღაზიის შექმნა', 'WooCommerce ან Shopify, ბარათით გადახდით და მიწოდების პირობებით.',
    <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>],
  ['soft', '/service-branding', 'UI/UX დიზაინი და ბრენდინგი', 'ინტერფეისის დიზაინი Figma-ში, ლოგო და ბრენდბუქი.',
    <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>],
  ['lilac', '/service-seo', 'SEO ოპტიმიზაცია', 'ტექნიკური SEO, საძიებო სიტყვები და ქართული ტექსტები, რომ Google-ში გიპოვონ.',
    <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.7" y2="16.7" /></>],
  ['lime', '/service-maintenance', 'საიტის ტექნიკური მხარდაჭერა', 'განახლებები, უსაფრთხოება, ასლები და მცირე ცვლილებები ყოველთვე.',
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />],
  ['pink', '/service-marketing', 'ციფრული მარკეტინგი', 'რეკლამა Google-ში, Facebook-ზე, Instagram-ზე და TikTok-ზე. ხედავთ, რა მოიტანა თითოეულმა ლარმა.',
    <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>],
];

const STEPS = [
  ['გაცნობა', 'გესაუბრებით ბიზნესზე, კლიენტებზე და კონკურენტებზე. ვუყურებთ, რა გაქვთ ახლა.'],
  ['დაგეგმვა', 'ვწერთ გეგმას, ვთანხმდებით ფასზე, ვადებზე და იმაზე, რას ჩავთვლით შედეგად.'],
  ['შექმნა', 'ვაწყობთ საიტს, ვწერთ ტექსტებს, ვუშვებთ რეკლამას. კვირაში ერთხელ გიგზავნით სტატუსს.'],
  ['გაშვება', 'საიტი ეშვება. მერე ვუყურებთ ციფრებს და ვასწორებთ იმას, რაც ცუდად მუშაობს.'],
];

function ld() {
  const email = opt('email', 'hello@webico.io');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': 'https://webico.io/#org', name: 'Webico', alternateName: 'ვებიკო', url: 'https://webico.io/',
        logo: 'https://webico.io/assets/img/apple-touch-icon.png', email, sameAs: [SOCIAL.instagram, SOCIAL.facebook] },
      { '@type': 'WebSite', '@id': 'https://webico.io/#website', url: 'https://webico.io/', name: 'Webico', inLanguage: 'ka',
        publisher: { '@id': 'https://webico.io/#org' } },
      { '@type': 'ProfessionalService', '@id': 'https://webico.io/#service', name: 'Webico', url: 'https://webico.io/',
        description: 'Webico — ვებსაიტები, ონლაინ მაღაზიები და ციფრული პროდუქტები: საიტის დამზადება, WordPress და WooCommerce დეველოპმენტი, ონლაინ მაღაზიები, UI/UX დიზაინი, SEO და ტექნიკური მხარდაჭერა.',
        image: 'https://webico.io/assets/img/og-webico-3.jpg', email,
        address: { '@type': 'PostalAddress', addressLocality: 'თბილისი', addressCountry: 'GE' },
        areaServed: { '@type': 'Country', name: 'Georgia' },
        parentOrganization: { '@id': 'https://webico.io/#org' },
        knowsAbout: ['ვებ დეველოპმენტი', 'WordPress', 'WooCommerce', 'UI/UX დიზაინი', 'SEO', 'ონლაინ მაღაზია'] },
    ],
  };
}

export default function home() {
  const shots = showcase().filter((x) => String(x.shot ?? '').trim() !== '');
  const posts = allPosts().slice(0, 3);
  const meta = {
    title: 'Webico — ვებსაიტები, ონლაინ მაღაზიები და ციფრული პროდუქტები',
    desc: 'Webico — ვებსაიტები, ონლაინ მაღაზიები და ციფრული პროდუქტები. ვქმნით საიტებს, WordPress და WooCommerce პროექტებს, ონლაინ მაღაზიებს, UI/UX დიზაინს და ვაკეთებთ SEO-ს. ნახეთ ნამუშევრები და დაჯავშნეთ უფასო კონსულტაცია.',
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
        <div className="container">
          <div className="svc-grid" data-reveal="">
            {SERVICES.map(([tone, href, title, desc, icon]) => (
              <a className={'svc-cell svc-cell--' + tone} href={href} key={href}>
                <span className="svc-cell__body">
                  <span className="svc-cell__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </span>
                  <h3 className="svc-cell__title">{title}</h3>
                  <span className="svc-cell__desc">{desc}</span>
                  <span className="svc-cell__go">დეტალურად <ArrowRight /></span>
                </span>
              </a>
            ))}
            <a className="svc-cell svc-cell--all" href="/services">
              <span className="svc-cell__body">
                <span className="svc-cell__title">ყველა სერვისი</span>
                <span className="svc-cell__go">დეტალურად <ArrowRight /></span>
              </span>
            </a>
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
                      {SERVICES.map(([, href, title]) => <option value={href.replace('/service-', '')} key={href}>{title}</option>)}
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
