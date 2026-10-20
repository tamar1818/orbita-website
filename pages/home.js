'use strict';
/** მთავარი გვერდი */
const { e, T, setting, url } = require('../lib/core');
const { ASSET_V } = require('../lib/layout');
const { projects, showcase, mock, tools, tags, ARROW } = require('../lib/projects');
const { posts: allPosts, postCard } = require('../lib/blog');
const HOME_FAQ = require('../data/home-faq.json');

const { map, truthy, empty } = require('../lib/tpl');
const { packages, fmt } = require('../lib/pricing');
const { heroWall, stackStrip } = require('../lib/hero');
const { statement, workBento, ctaGrow } = require('../lib/blocks');
const decode = (s) => String(s).replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function homeLd() {
  const email = decode(setting('email', 'hello@webico.io'));
  return '\n  <script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': 'https://webico.io/#org', name: 'Webico', alternateName: 'ვებიკო', url: 'https://webico.io/',
        logo: 'https://webico.io/assets/img/apple-touch-icon.png', email },
      { '@type': 'WebSite', '@id': 'https://webico.io/#website', url: 'https://webico.io/', name: 'Webico', inLanguage: 'ka',
        publisher: { '@id': 'https://webico.io/#org' } },
      { '@type': 'ProfessionalService', '@id': 'https://webico.io/#service', name: 'Webico', url: 'https://webico.io/',
        description: 'Webico — ვებ დეველოპმენტის სააგენტო თბილისში: საიტის დამზადება, WordPress და WooCommerce დეველოპმენტი, ონლაინ მაღაზიები, UI/UX დიზაინი, SEO და ტექნიკური მხარდაჭერა.',
        image: 'https://webico.io/assets/img/og-image.png', email,
        address: { '@type': 'PostalAddress', addressLocality: 'თბილისი', addressCountry: 'GE' },
        areaServed: { '@type': 'Country', name: 'Georgia' },
        parentOrganization: { '@id': 'https://webico.io/#org' },
        knowsAbout: ['ვებ დეველოპმენტი', 'WordPress', 'WooCommerce', 'UI/UX დიზაინი', 'SEO', 'ონლაინ მაღაზია'] },
      { '@type': 'FAQPage', mainEntity: HOME_FAQ.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) },
    ],
  }, null, 4).replace(/</g, '\\u003c') + '\n  </script>';
}

function render() {
  const HOME_LD = homeLd();
  const allp = projects();
  const shots = showcase().filter((x) => String(x.shot ?? '').trim() !== '');
  const pk = packages();
  const prev = (sl) => { const f = shots.find((x) => x.slug === sl) || shots[0]; return f ? e(url(f.shot)) : ''; };
  const PICK = ['arlo-funding', 'gcci-germany', 'linden-spa', 'outsourcify'];
  const heroCases = PICK.map((sl) => shots.find((x) => x.slug === sl)).filter(Boolean).concat(shots.filter((x) => !PICK.includes(x.slug))).slice(0, 4);
  const toolsList = tools();
  const posts = allPosts().slice(0, 3);
  return `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="utf-8">
  <meta name="google-site-verification" content="Zl7OvqIP-1s-wqbhxwTPnmISoEdJGMlH0hoNgwNrXHk">
  <script>document.documentElement.classList.add("js");</script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Webico — ვებ დეველოპმენტის სააგენტო თბილისში | საიტის დამზადება, WordPress, SEO</title>
  <meta name="description" content="Webico — ვებ დეველოპმენტის სააგენტო თბილისში. ვქმნით საიტებს, WordPress და WooCommerce პროექტებს, ონლაინ მაღაზიებს, UI/UX დიზაინს და ვაკეთებთ SEO-ს. ნახეთ ნამუშევრები და დაჯავშნეთ უფასო კონსულტაცია.">
  <meta name="theme-color" content="#0d0d0d">
  <link rel="canonical" href="https://webico.io/">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="ka_GE">
  <meta property="og:site_name" content="ვებიკო">
  <meta property="og:title" content="Webico — ვებ დეველოპმენტის სააგენტო თბილისში">
  <meta property="og:description" content="Webico — ვებ დეველოპმენტის სააგენტო თბილისში. ვქმნით საიტებს, WordPress და WooCommerce პროექტებს, ონლაინ მაღაზიებს, UI/UX დიზაინს და ვაკეთებთ SEO-ს. ნახეთ ნამუშევრები და დაჯავშნეთ უფასო კონსულტაცია.">
  <meta property="og:url" content="https://webico.io/">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="og:image" content="https://webico.io/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="ვებიკო — ციფრული სააგენტო">
  <meta name="twitter:image" content="https://webico.io/assets/img/og-image.png">
  <meta name="robots" content="index, follow, max-image-preview:large">

  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="alternate icon" href="favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- სარეზერვო ქართული შრიფტი — მთავარი შრიფტია LGV Anastasia 2025 Geo (იხ. assets/fonts/) -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="assets/css/style.css?v=${ASSET_V}">
${HOME_LD}
</head>
<body>
  <a class="skip-link" href="#main">გადასვლა მთავარ კონტენტზე</a>

  <div class="scroll-progress" aria-hidden="true"></div>

  <aside class="sticky-cta" aria-label="სწრაფი კონტაქტი">
    <span class="sticky-cta__text">გაქვთ პროექტი?<small>გიპასუხებთ 24 საათში</small></span>
    <a class="sticky-cta__call" href="tel:+995557643225" aria-label="დარეკვა: ${e(setting("phone", "+995 557 64 32 25"))}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a>
    <a class="btn btn--primary" href="/contact">მოგვწერეთ</a>
  </aside>

  <header class="site-header">
    <div class="container">
      <nav class="nav" aria-label="მთავარი ნავიგაცია">
        <a class="brand" href="/">
          <img class="brand__logo" src="assets/img/logo/webico-horizontal-ink.svg"
               alt="Webico" width="152" height="38">
        </a>

        <ul class="nav__links" id="nav-links">
          <li><a href="/about">ჩვენ შესახებ</a></li>
          <li class="nav__item">
            <button class="nav__trigger" type="button" data-mega-trigger
                    aria-expanded="false" aria-controls="mega-services" data-nav-match="services">
              სერვისები <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="mega" id="mega-services"><div>
              <div class="mega__inner">
                <div class="mega__col">
                  <p class="mega__label">რას ვაკეთებთ</p>
              <a class="mega__item" href="/service-web-development">
                <span class="mega__icon mega__icon--lilac"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="13" y1="4" x2="11" y2="20"/></svg></span>
                <span><b>ვებსაიტების დიზაინი და შექმნა</b><small>კორპორატიული საიტები, ონლაინ მაღაზიები და ვებ-აპლიკაციები</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-wordpress">
                <span class="mega__icon mega__icon--lilac"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg></span>
                <span><b>WordPress დეველოპმენტი</b><small>თემები, პლაგინები, WooCommerce და მრავალენოვანი საიტები</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-ecommerce">
                <span class="mega__icon mega__icon--lime"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg></span>
                <span><b>ონლაინ მაღაზიის შექმნა</b><small>ქართული გადახდები, მიწოდება და მოსახერხებელი კალათა</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-seo">
                <span class="mega__icon mega__icon--lime"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/></svg></span>
                <span><b>SEO ოპტიმიზაცია</b><small>ტექნიკური აუდიტი, სემანტიკა და კონტენტი ქართულ ენაზე</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-maintenance">
                <span class="mega__icon mega__icon--pink"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg></span>
                <span><b>ტექნიკური მხარდაჭერა</b><small>განახლებები, უსაფრთხოება და სარეზერვო ასლები</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-marketing">
                <span class="mega__icon mega__icon--pink"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
                <span><b>ციფრული მარკეტინგი</b><small>რეკლამა Google-ში, Facebook-ზე და TikTok-ზე</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-branding">
                <span class="mega__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
                <span><b>ბრენდის ვიზუალური იდენტობა</b><small>ლოგო, ბრენდბუქი და UI/UX დიზაინი</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
                </div>
                <div class="mega__col mega__col--tools">
                  <p class="mega__label">ტექნოლოგიები</p>
                  <ul class="tools">
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/wordpress.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>WordPress</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/shopify.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>Shopify</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/webflow.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>Webflow</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/lovable.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>Lovable</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--ink">&lt;/&gt;</span>Custom code</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/nextjs.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>Next.js / React</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/aws.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>AWS</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--logo"><img src="/assets/img/tech/figma.svg" alt="" width="18" height="18" loading="lazy" decoding="async"></span>Figma</a></li>
                  </ul>
                </div>
                <div class="mega__foot">
                  <span>ვმუშაობთ ცნობილ ინსტრუმენტებზე, ამიტომ საიტი ჩვენზე მიბმული არ რჩება.</span>
                  <a class="link-arrow" href="/services">ყველა სერვისი და ფასები</a>
                </div>
              </div>
            </div></div>
          </li>
          <li><a href="/work">ნამუშევრები</a></li>
          <li><a href="/plans">ფასები</a></li>
          <li><a href="/blog">ბლოგი</a></li>
          <li><a href="/contact">კონტაქტი</a></li>
          <li><a class="btn btn--primary btn--sm" href="/contact#booking">დაიწყეთ პროექტი</a></li>
        </ul>

        <div class="nav__cta">
          <a class="nav__phone" href="tel:+995557643225"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg><span>${setting("phone", "+995 557 64 32 25")}</span></a>
          <a class="btn btn--primary btn--sm" href="/contact#booking">დაიწყეთ პროექტი</a>
          <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links"
                  aria-label="მენიუს გახსნა"><span></span></button>
        </div>
      </nav>
    </div>
  </header>

  <main id="main">

    <!-- ============================ HERO ============================ -->
${(() => {
    const H = {
      base: '',
      title: `${T('home.hero2.title_a', 'დიზაინი და კოდი,')} ${T('home.hero2.title_b', 'რომელიც')} <em>${T('home.hero2.title_em', 'ბრენდს')}</em> ${T('home.hero2.title_c', 'აძლიერებს')}`,
      text: decode(T('home.hero2.text', 'Webico დიზაინისა და დეველოპმენტის სტუდიაა თბილისში. ვქმნით ვებსაიტებს, ონლაინ მაღაზიებს და ციფრულ პროდუქტებს ქართული და საერთაშორისო კომპანიებისთვის.')),
      cta: [decode(T('home.hero2.cta', 'დაიწყეთ პროექტი')), '/contact'],
      work: ['ნამუშევრები', '/work'],
      wall: shots.slice(0, 16).map((f) => ({ name: f.name, slug: f.slug, shot: f.shot })),
      tags: ['სტრატეგია', 'UI/UX დიზაინი', 'დეველოპმენტი', 'SEO და ზრდა'],
    };
    return heroWall(H);
  })()}
    ${stackStrip('პლატფორმები, რომლებზეც ვმუშაობთ')}
    ${statement('ka')}
    <!-- ========================= სერვისები ========================== -->
    <section class="section" id="services">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">რას ვაკეთებთ</span>
          <h2>რას ვაკეთებთ</h2>
          <p>დიზაინს, კოდს და რეკლამას ერთი გუნდი აკეთებს. ასე არაფერი იკარგება
            და ყოველთვის იცით, ვის ჰკითხოთ.</p>
        </div>
        <div class="svc-list" data-reveal>
          <a class="svc svc--lilac" href="/service-web-development" data-preview="${prev('arlo-funding')}">
            <div class="svc__main">
              <h3 class="svc__title">ვებსაიტის დამზადება</h3>
              <span class="svc__desc"><span>კომპანიის საიტი, ლენდინგი ან ვებ-აპლიკაცია. სწრაფი, მობილურზე მოხერხებული და გასაგები.</span></span>
            </div>
            <span class="svc__tags"><span>კორპორატიული</span><span>ლენდინგი</span><span>ვებ-აპლიკაცია</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
          <a class="svc svc--lime" href="/service-wordpress" data-preview="${prev('outsourcify')}">
            <div class="svc__main">
              <h3 class="svc__title">WordPress დეველოპმენტი</h3>
              <span class="svc__desc"><span>საკუთარი თემა, Elementor და ACF. ტექსტებს და ფოტოებს თვითონ შეცვლით.</span></span>
            </div>
            <span class="svc__tags"><span>WordPress</span><span>Elementor</span><span>ACF</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
          <a class="svc svc--pink" href="/service-ecommerce" data-preview="${prev('tamaras-collect')}">
            <div class="svc__main">
              <h3 class="svc__title">ონლაინ მაღაზიის შექმნა</h3>
              <span class="svc__desc"><span>WooCommerce ან Shopify, ბარათით გადახდით და მიწოდების პირობებით.</span></span>
            </div>
            <span class="svc__tags"><span>WooCommerce</span><span>Shopify</span><span>გადახდები</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
          <a class="svc svc--soft" href="/service-branding" data-preview="${prev('linden-spa')}">
            <div class="svc__main">
              <h3 class="svc__title">UI/UX დიზაინი და ბრენდინგი</h3>
              <span class="svc__desc"><span>ინტერფეისის დიზაინი Figma-ში, ლოგო და ბრენდბუქი.</span></span>
            </div>
            <span class="svc__tags"><span>UI/UX</span><span>Figma</span><span>ბრენდბუქი</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
          <a class="svc svc--lilac" href="/service-seo" data-preview="${prev('gcci-germany')}">
            <div class="svc__main">
              <h3 class="svc__title">SEO ოპტიმიზაცია</h3>
              <span class="svc__desc"><span>ტექნიკური SEO, საძიებო სიტყვები და ქართული ტექსტები, რომ Google-ში გიპოვონ.</span></span>
            </div>
            <span class="svc__tags"><span>ტექნიკური SEO</span><span>სემანტიკა</span><span>ლოკალური SEO</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
          <a class="svc svc--lime" href="/service-maintenance" data-preview="${prev('bitefit')}">
            <div class="svc__main">
              <h3 class="svc__title">საიტის ტექნიკური მხარდაჭერა</h3>
              <span class="svc__desc"><span>განახლებები, უსაფრთხოება, ასლები და მცირე ცვლილებები ყოველთვე.</span></span>
            </div>
            <span class="svc__tags"><span>განახლებები</span><span>უსაფრთხოება</span><span>ასლები</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
          <a class="svc svc--pink" href="/service-marketing" data-preview="${prev('marketing-agency')}">
            <div class="svc__main">
              <h3 class="svc__title">ციფრული მარკეტინგი</h3>
              <span class="svc__desc"><span>რეკლამა Google-ში, Facebook-ზე, Instagram-ზე და TikTok-ზე. ხედავთ, რა მოიტანა თითოეულმა ლარმა.</span></span>
            </div>
            <span class="svc__tags"><span>Google Ads</span><span>Meta</span><span>TikTok</span></span>
            <span class="svc__go">${ARROW}</span>
          </a>
        </div>
      </div>
    </section>

    ${workBento('ka', shots, allp.length, (w) => tags(w)[0])}
    <!-- ========================== პროცესი =========================== -->
    <section class="section section--soft" id="process">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">როგორ ვმუშაობთ</span>
          <h2>როგორ მიმდინარეობს მუშაობა</h2>
          <p>ყოველთვის იცით, რა ეტაპზეა პროექტი და რა იქნება შემდეგ.</p>
        </div>
        <div class="steps">
          <article class="step" data-reveal data-reveal-delay="0">
            <h3>გაცნობა</h3>
            <p>გესაუბრებით ბიზნესზე, კლიენტებზე და კონკურენტებზე. ვუყურებთ, რა გაქვთ ახლა.</p>
          </article>
          <article class="step" data-reveal data-reveal-delay="70">
            <h3>დაგეგმვა</h3>
            <p>ვწერთ გეგმას, ვთანხმდებით ფასზე, ვადებზე და იმაზე, რას ჩავთვლით შედეგად.</p>
          </article>
          <article class="step" data-reveal data-reveal-delay="140">
            <h3>შექმნა</h3>
            <p>ვაწყობთ საიტს, ვწერთ ტექსტებს, ვუშვებთ რეკლამას. კვირაში ერთხელ გიგზავნით სტატუსს.</p>
          </article>
          <article class="step" data-reveal data-reveal-delay="210">
            <h3>გაშვება</h3>
            <p>საიტი ეშვება. მერე ვუყურებთ ციფრებს და ვასწორებთ იმას, რაც ცუდად მუშაობს.</p>
          </article>
        </div>
      </div>
    </section>

    ${ctaGrow('ka')}

    <!-- ============================ ბლოგი ============================ -->
    ${truthy(posts.length) ? `    <section class="section" id="blog">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div>
            <span class="eyebrow">ბლოგი</span>
            <h2>რჩევები ბიზნესისთვის</h2>
          </div>
          <a class="btn btn--ghost" href="/blog">ყველა სტატია</a>
        </div>
        <div class="post-grid" data-reveal>
          ${posts.map((bp) => postCard(bp)).join('')}        </div>
      </div>
    </section>
    ` : ''}
    <!-- ============================ FAQ ============================= -->
    <section class="section section--soft" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <span class="eyebrow">კითხვები</span>
            <h2>ხშირი კითხვები საიტის დამზადებაზე</h2>
            <p>პასუხი ვერ იპოვეთ? მოგვწერეთ და იმავე დღეს გიპასუხებთ.</p>
            <a class="btn btn--primary" href="/contact">დაგვიკავშირდით</a>
          </div>
          <div class="faq">
            ${map(HOME_FAQ, ([q, a], i) => { const fid = 'home-a' + (i + 1); return `            <div class="faq__item">
              <h3 style="margin:0">
                <button class="faq__q" type="button" aria-expanded="false" aria-controls="${fid}">
                  <span>${e(q)}</span><span class="faq__icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__a" id="${fid}" data-open="false"><div><p>${e(a)}</p></div></div>
            </div>
            `; })}          </div>
        </div>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <a class="brand" href="/"><img class="brand__logo" src="assets/img/logo/webico-horizontal-white.svg" alt="Webico" width="152" height="38"></a>
          <p class="footer__about">ვებ სააგენტო თბილისში. ვაწყობთ საიტებს და ონლაინ მაღაზიებს,
            ვაკეთებთ SEO-ს და რეკლამას.</p>
          <div class="socials">
            <a href="https://facebook.com" aria-label="Facebook" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
            <a href="https://instagram.com" aria-label="Instagram" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.9 8H4v12h2.9V8zM5.4 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 20h-2.9v-6.1c0-1.5-.6-2.4-1.8-2.4-1 0-1.5.6-1.8 1.3V20h-2.9V8h2.9v1.3c.6-.9 1.6-1.6 3.1-1.6 2.3 0 3.4 1.5 3.4 4.4V20z"/></svg></a>
            <a href="https://youtube.com" aria-label="YouTube" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C18.4 5 12 5 12 5s-6.4 0-7.9.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8c1.5.5 7.9.5 7.9.5s6.4 0 7.9-.5a2.5 2.5 0 0 0 1.7-1.8C22 15.2 22 12 22 12zM10 15.2V8.8l5.3 3.2-5.3 3.2z"/></svg></a>
          </div>
        </div>

        <div>
          <h4>სერვისები</h4>
          <ul class="footer__list">
            <li><a href="/service-web-development">ვებსაიტების დიზაინი და შექმნა</a></li>
            <li><a href="/service-wordpress">WordPress დეველოპმენტი</a></li>
            <li><a href="/service-ecommerce">ონლაინ მაღაზიის შექმნა</a></li>
            <li><a href="/service-seo">SEO ოპტიმიზაცია</a></li>
            <li><a href="/service-maintenance">ტექნიკური მხარდაჭერა</a></li>
            <li><a href="/service-marketing">ციფრული მარკეტინგი</a></li>
            <li><a href="/service-branding">ბრენდის ვიზუალური იდენტობა</a></li>
            <li><a href="/saiti-salonistvis">საიტი სალონისთვის</a></li>
            <li><a href="/saiti-kafestvis">საიტი კაფესთვის</a></li>
            <li><a href="/onlain-magazia">ონლაინ მაღაზია</a></li>
          </ul>
        </div>

        <div>
          <h4>კომპანია</h4>
          <ul class="footer__list">
            <li><a href="/about">ჩვენ შესახებ</a></li>
            <li><a href="/services">ყველა სერვისი</a></li>
            <li><a href="/work">ნამუშევრები</a></li>
            <li><a href="/plans">ფასები</a></li>
            <li><a href="/blog">ბლოგი</a></li>
            <li><a href="/#faq">კითხვები</a></li>
            <li><a href="/contact">კონტაქტი</a></li>
          </ul>
        </div>

        <div class="footer__contact">
          <h4>კონტაქტი</h4>
          <p><a href="tel:+995557643225">${setting("phone", "+995 557 64 32 25")}</a></p>
          <p><a href="mailto:${setting("email", "hello@webico.io")}">${setting("email", "hello@webico.io")}</a></p>
          <p>${setting("address", "თბილისი, საქართველო")}</p>
          <p>ორშ–პარ, 10:00–19:00</p>
        </div>
      </div>

      <div class="footer__bottom">
        <span>&copy; <span id="year">2026</span> Webico — თამარ გელიაშვილი, ს/ნ 01024088829. ყველა უფლება დაცულია.</span>
        <span class="footer__credit">
          <a href="/terms">წესები და პირობები</a>
          <a href="/privacy">კონფიდენციალურობა</a>
          <a href="/refund">გაუქმება და დაბრუნება</a>
          <a href="/delivery">მიწოდება</a>
        </span>
      </div>
    </div>
  </footer>

  <script src="assets/js/main.js?v=${ASSET_V}"></script>
</body>
</html>
`;
}

module.exports = { render };
