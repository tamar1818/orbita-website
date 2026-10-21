'use strict';
/** English shell (head, navigation, footer) for /en pages */
const { e, setting } = require('./core');
const { ASSET_V } = require('./layout');

const ICON_PHONE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';

/**
 * o: title, desc, url (/en/...), alt (Georgian counterpart), image, ld
 */
function head(o = {}) {
  const url = o.url || '/en';
  const alt = o.alt || '/';
  const ogImg = o.image ? 'https://webico.io/' + String(o.image).replace(/^\/+/, '') : 'https://webico.io/assets/img/og-webico-en-2.jpg';
  const phone = setting('phone', '+995 557 64 32 25');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script>document.documentElement.classList.add("js");</script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(o.title || 'Webico')}</title>
  <meta name="description" content="${e(o.desc || '')}">
  <meta name="theme-color" content="#0d0d0d">
  <link rel="canonical" href="https://webico.io${e(url)}">
  <link rel="alternate" hreflang="en" href="https://webico.io${e(url)}">
  <link rel="alternate" hreflang="ka" href="https://webico.io${e(alt)}">
  <link rel="alternate" hreflang="x-default" href="https://webico.io${e(alt)}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="ka_GE">
  <meta property="og:site_name" content="Webico">
  <meta property="og:title" content="${e(o.title || 'Webico')}">
  <meta property="og:description" content="${e(o.desc || '')}">
  <meta property="og:url" content="https://webico.io${e(url)}">
  <meta property="og:image" content="${e(ogImg)}">
  <meta property="og:image:width" content="${o.image ? 1536 : 1200}">
  <meta property="og:image:height" content="${o.image ? 1024 : 630}">
  <meta property="og:image:alt" content="${e(o.title || 'Webico')}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${e(ogImg)}">
  <meta name="robots" content="index, follow, max-image-preview:large">

  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="alternate icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="/assets/css/style.css?v=${ASSET_V}">
${o.ld || ''}</head>
<body class="lang-en">
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="scroll-progress" aria-hidden="true"></div>

  <aside class="sticky-cta" aria-label="Quick contact">
    <span class="sticky-cta__text">Have a project?<small>We reply within one business day</small></span>
    <a class="sticky-cta__call" href="tel:+995557643225" aria-label="Call ${e(phone)}">${ICON_PHONE.replace('width="16" height="16"', 'width="17" height="17"')}</a>
    <a class="btn btn--primary" href="/en/contact">Contact us</a>
  </aside>

  <header class="site-header">
    <div class="container">
      <nav class="nav" aria-label="Main navigation">
        <a class="brand" href="/en">
          <img class="brand__logo" src="/assets/img/logo/webico-horizontal-ink.svg" alt="Webico" width="152" height="38">
        </a>

        <ul class="nav__links" id="nav-links">
          <li><a href="/en/about">About</a></li>
          <li><a href="/en/services">Services</a></li>
          <li><a href="/en/work">Work</a></li>
          <li><a href="/en/pricing">Pricing</a></li>
          <li><a href="/en/contact">Contact</a></li>
          <li><a class="lang-switch" href="${e(alt)}" hreflang="ka" lang="ka" aria-label="ქართული ვერსია">ქარ</a></li>
          <li><a class="btn btn--primary btn--sm" href="/en/contact">Start a project</a></li>
        </ul>

        <div class="nav__cta">
          <a class="nav__phone" href="tel:+995557643225">${ICON_PHONE}<span>${phone}</span></a>
          <a class="btn btn--primary btn--sm" href="/en/contact">Start a project</a>
          <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu"><span></span></button>
        </div>
      </nav>
    </div>
  </header>

  <main id="main">
`;
}

function foot() {
  const email = setting('email', 'hello@webico.io');
  return `  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <a class="brand" href="/en"><img class="brand__logo" src="/assets/img/logo/webico-horizontal-white.svg" alt="Webico" width="152" height="38"></a>
          <p class="footer__about">A design and development studio in Tbilisi, Georgia. Websites, online stores and digital products.</p>
        </div>

        <div>
          <h4>Services</h4>
          <ul class="footer__list">
            <li><a href="/en/web-development">Website development</a></li>
            <li><a href="/en/ecommerce-development">Online stores</a></li>
            <li><a href="/en/wordpress-development">WordPress</a></li>
            <li><a href="/en/ui-ux-design">UI/UX &amp; branding</a></li>
            <li><a href="/en/seo">SEO</a></li>
            <li><a href="/en/digital-marketing">Digital marketing</a></li>
            <li><a href="/en/website-maintenance">Maintenance</a></li>
          </ul>
        </div>

        <div>
          <h4>Studio</h4>
          <ul class="footer__list">
            <li><a href="/en/about">About</a></li>
            <li><a href="/en/work">Work</a></li>
            <li><a href="/en/pricing">Pricing</a></li>
            <li><a href="/en/contact">Contact</a></li>
            <li><a href="/" hreflang="ka" lang="ka">ქართული</a></li>
          </ul>
        </div>

        <div class="footer__contact">
          <h4>Contact</h4>
          <p><a href="tel:+995557643225">${setting('phone', '+995 557 64 32 25')}</a></p>
          <p><a href="mailto:${email}">${email}</a></p>
          <p>Tbilisi, Georgia</p>
          <p>Mon–Fri, 10:00–19:00 (GMT+4)</p>
        </div>
      </div>

      <div class="footer__bottom">
        <span>&copy; <span id="year">2026</span> Webico. ${setting('legal_name_en', 'Tamar Geliashvili')}, ID ${setting('legal_id', '01024088829')}.</span>
        <span class="footer__credit">
          <a href="/en/privacy">Privacy policy</a>
          <a href="/en/terms">Terms of service</a>
        </span>
      </div>
    </div>
  </footer>

  <script src="/assets/js/main.js?v=${ASSET_V}"></script>
</body>
</html>
`;
}

module.exports = { head, foot };
