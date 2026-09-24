<?php require_once __DIR__ . "/init.php"; ?>
<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="utf-8">
  <meta name="google-site-verification" content="Zl7OvqIP-1s-wqbhxwTPnmISoEdJGMlH0hoNgwNrXHk">
  <script>document.documentElement.classList.add("js");</script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= cms_e($PAGE_TITLE ?? "Webico") ?></title>
  <meta name="description" content="<?= cms_e($PAGE_DESC ?? "") ?>">
  <meta name="theme-color" content="#0d0d0d">
  <link rel="canonical" href="https://webico.io<?= cms_e($PAGE_URL ?? "/") ?>">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="ka_GE">
  <meta property="og:site_name" content="ვებიკო">
  <meta property="og:title" content="<?= cms_e($PAGE_TITLE ?? "Webico") ?>">
  <meta property="og:description" content="<?= cms_e($PAGE_DESC ?? "") ?>">
  <meta property="og:url" content="https://webico.io<?= cms_e($PAGE_URL ?? "/") ?>">
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
  <link rel="stylesheet" href="assets/css/style.css?v=4c5a2405">
<?= $PAGE_LD ?? "" ?>
</head>
<body>
  <a class="skip-link" href="#main">გადასვლა მთავარ კონტენტზე</a>

  <header class="site-header">
    <div class="container">
      <nav class="nav" aria-label="მთავარი ნავიგაცია">
        <a class="brand" href="/">
          <img class="brand__logo" src="assets/img/logo/webico-horizontal-ink.svg"
               alt="Webico" width="152" height="38">
        </a>

        <ul class="nav__links" id="nav-links">
          <li><a href="/">მთავარი</a></li>
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
              <a class="mega__item" href="/service-seo">
                <span class="mega__icon mega__icon--lime"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/></svg></span>
                <span><b>SEO ოპტიმიზაცია</b><small>ტექნიკური აუდიტი, სემანტიკა და კონტენტი ქართულ ენაზე</small></span>
                <svg class="mega__go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="mega__item" href="/service-marketing">
                <span class="mega__icon mega__icon--pink"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
                <span><b>ციფრული მარკეტინგი</b><small>Google Ads, Meta და TikTok კამპანიები გაზომვადი შედეგით</small></span>
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
                <li><a href="/services"><span class="tool__mark" style="--tint:#21759b">Wp</span>WordPress</a></li>
                <li><a href="/services"><span class="tool__mark" style="--tint:#5a8f3d">Sh</span>Shopify</a></li>
                <li><a href="/services"><span class="tool__mark" style="--tint:#4353ff">Wf</span>Webflow</a></li>
                <li><a href="/services"><span class="tool__mark" style="--tint:#d1443c">Lo</span>Lovable</a></li>
                <li><a href="/services"><span class="tool__mark tool__mark--ink">&lt;/&gt;</span>Custom code</a></li>
                <li><a href="/services"><span class="tool__mark" style="--tint:#0b7285">Ne</span>Next.js / React</a></li>
                <li><a href="/services"><span class="tool__mark" style="--tint:#b26a00">aws</span>AWS</a></li>
                <li><a href="/services"><span class="tool__mark" style="--tint:#8b45d6">Fi</span>Figma</a></li>
                  </ul>
                </div>
                <div class="mega__foot">
                  <span>ვმუშაობთ სტანდარტულ ინსტრუმენტებზე — პროექტი არავის „დაბმული“ არ რჩება.</span>
                  <a class="link-arrow" href="/services">ყველა სერვისი და ფასები</a>
                </div>
              </div>
            </div></div>
          </li>
          <li><a href="/work">ნამუშევრები</a></li>
          <li><a href="/contact">კონტაქტი</a></li>
          <li><a class="btn btn--primary btn--sm" href="/contact">უფასო კონსულტაცია</a></li>
        </ul>

        <div class="nav__cta">
          <a class="nav__phone" href="tel:+99532200000"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg><span><?= cms_setting("phone", "+995 32 2 00 00 00") ?></span></a>
          <a class="btn btn--primary btn--sm" href="/contact">უფასო კონსულტაცია</a>
          <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links"
                  aria-label="მენიუს გახსნა"><span></span></button>
        </div>
      </nav>
    </div>
  </header>

  <main id="main">
