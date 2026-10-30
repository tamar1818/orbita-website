/** მთავარი გვერდი */
import { txt, opt } from '@/lib/core';
import { projects, showcase, tags } from '@/lib/projects';
import { posts as allPosts } from '@/lib/blog';
import { SOCIAL } from '@/lib/blocks';
import HOME_FAQ from '@/data/home-faq.json';
import { HeroWall, StackStrip, CtaGrow, Faq, JsonLd } from '@/components/blocks';
import { WorkBento } from '@/components/work';
import { PostCard } from '@/components/posts';
import { ArrowUpRight } from '@/components/icons';

const SERVICES = [
  ['lilac', '/service-web-development', 'ვებსაიტის დამზადება', 'კომპანიის საიტი, ლენდინგი ან ვებ-აპლიკაცია. სწრაფი, მობილურზე მოხერხებული და გასაგები.', ['კორპორატიული', 'ლენდინგი', 'ვებ-აპლიკაცია']],
  ['lime', '/service-wordpress', 'WordPress დეველოპმენტი', 'საკუთარი თემა, Elementor და ACF. ტექსტებს და ფოტოებს თვითონ შეცვლით.', ['WordPress', 'Elementor', 'ACF']],
  ['pink', '/service-ecommerce', 'ონლაინ მაღაზიის შექმნა', 'WooCommerce ან Shopify, ბარათით გადახდით და მიწოდების პირობებით.', ['WooCommerce', 'Shopify', 'გადახდები']],
  ['soft', '/service-branding', 'UI/UX დიზაინი და ბრენდინგი', 'ინტერფეისის დიზაინი Figma-ში, ლოგო და ბრენდბუქი.', ['UI/UX', 'Figma', 'ბრენდბუქი']],
  ['lilac', '/service-seo', 'SEO ოპტიმიზაცია', 'ტექნიკური SEO, საძიებო სიტყვები და ქართული ტექსტები, რომ Google-ში გიპოვონ.', ['ტექნიკური SEO', 'სემანტიკა', 'ლოკალური SEO']],
  ['lime', '/service-maintenance', 'საიტის ტექნიკური მხარდაჭერა', 'განახლებები, უსაფრთხოება, ასლები და მცირე ცვლილებები ყოველთვე.', ['განახლებები', 'უსაფრთხოება', 'ასლები']],
  ['pink', '/service-marketing', 'ციფრული მარკეტინგი', 'რეკლამა Google-ში, Facebook-ზე, Instagram-ზე და TikTok-ზე. ხედავთ, რა მოიტანა თითოეულმა ლარმა.', ['Google Ads', 'Meta', 'TikTok']],
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
      { '@type': 'FAQPage', mainEntity: HOME_FAQ.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) },
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
          <div className="svc-list" data-reveal="">
            {SERVICES.map(([tone, href, title, desc, tg]) => (
              <a className={'svc svc--' + tone} href={href} key={href}>
                <div className="svc__main">
                  <h3 className="svc__title">{title}</h3>
                  <span className="svc__desc"><span>{desc}</span></span>
                </div>
                <span className="svc__tags">{tg.map((t) => <span key={t}>{t}</span>)}</span>
                <span className="svc__go"><ArrowUpRight /></span>
              </a>
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

      <section className="section section--soft" id="faq">
        <div className="container">
          <div className="faq-split">
            <div className="faq-split__head" data-reveal="">
              <span className="eyebrow">კითხვები</span>
              <h2>ხშირი კითხვები საიტის დამზადებაზე</h2>
              <p>პასუხი ვერ იპოვეთ? მოგვწერეთ და იმავე დღეს გიპასუხებთ.</p>
              <a className="btn btn--primary" href="/contact">დაგვიკავშირდით</a>
            </div>
            <Faq items={HOME_FAQ} id="home-a" />
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
