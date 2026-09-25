<?php
/**
 * სერვისის გვერდის შაბლონი. გვერდი აწყობს $S მასივს და იძახებს cms_service_page($S).
 * სქემა: Service + BreadcrumbList + FAQPage (FAQ გვერდზე ხილულია).
 */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_SVG_ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

/** ყველა სერვისი — ნავიგაციისა და „სხვა სერვისების“ ბლოკისთვის */
const CMS_SERVICES = [
    '/service-web-development' => ['ვებსაიტის დამზადება', 'კორპორატიული საიტები, ლენდინგები და ვებ-აპლიკაციები.'],
    '/service-wordpress'       => ['WordPress დეველოპმენტი', 'WordPress საიტები, საკუთარი თემები და პლაგინები.'],
    '/service-ecommerce'       => ['ონლაინ მაღაზიის შექმნა', 'WooCommerce და Shopify მაღაზიები ქართული გადახდებით.'],
    '/service-seo'             => ['SEO ოპტიმიზაცია', 'ტექნიკური SEO, სემანტიკა და კონტენტი ქართულად.'],
    '/service-maintenance'     => ['საიტის ტექნიკური მხარდაჭერა', 'განახლებები, უსაფრთხოება, სარეზერვო ასლები.'],
    '/service-branding'        => ['ბრენდინგი და UI/UX დიზაინი', 'ლოგო, ბრენდბუქი და ინტერფეისის დიზაინი.'],
    '/service-marketing'       => ['ციფრული მარკეტინგი', 'Google Ads, Meta და TikTok კამპანიები.'],
];

function cms_service_page(array $S): void
{
    $url = 'https://webico.io' . $S['path'];
    $PAGE_TITLE = $S['title'];
    $PAGE_DESC  = $S['desc'];
    $PAGE_URL   = $S['path'];

    $ld = [
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'Service',
                'name' => $S['service_name'],
                'serviceType' => $S['service_type'],
                'description' => $S['desc'],
                'url' => $url,
                'areaServed' => ['@type' => 'Country', 'name' => 'Georgia'],
                'provider' => ['@type' => 'ProfessionalService', 'name' => 'Webico', 'url' => 'https://webico.io/'],
            ],
            [
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'მთავარი', 'item' => 'https://webico.io/'],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'სერვისები', 'item' => 'https://webico.io/services'],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $S['crumb'], 'item' => $url],
                ],
            ],
            [
                '@type' => 'FAQPage',
                'mainEntity' => array_map(static fn($f) => [
                    '@type' => 'Question', 'name' => $f[0],
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]],
                ], $S['faq']),
            ],
        ],
    ];
    $PAGE_LD = "\n  <script type=\"application/ld+json\">\n"
        . json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
        . "\n  </script>";

    require __DIR__ . '/head.php';
    $e = 'cms_e';
    ?>
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/services">სერვისები</a></li>
            <li><span aria-current="page"><?= $e($S['crumb']) ?></span></li>
          </ol>
          <span class="eyebrow"><?= $e($S['eyebrow']) ?></span>
          <h1><?= $e($S['h1']) ?></h1>
          <p><?= $e($S['lead']) ?></p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/contact#booking">უფასო კონსულტაცია</a>
            <a class="btn btn--ghost" href="/work">ნამუშევრები</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="svc-intro" data-reveal>
          <?php foreach ($S['intro'] as $p): ?><p><?= $e($p) ?></p><?php endforeach; ?>
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">რას მოიცავს</span>
          <h2><?= $e($S['features_title']) ?></h2>
        </div>
        <div class="grid grid--3">
          <?php foreach ($S['features'] as $i => [$h, $t]): ?>
          <article class="card" data-reveal data-reveal-delay="<?= min($i, 5) * 50 ?>">
            <h3><?= $e($h) ?></h3>
            <p><?= $e($t) ?></p>
          </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <?php if (!empty($S['for'])): ?>
    <section class="section">
      <div class="container">
        <div class="feature-row">
          <div class="feature-row__body" data-reveal>
            <span class="eyebrow">ვისთვის</span>
            <h2><?= $e($S['for_title']) ?></h2>
            <?php if (!empty($S['for_text'])): ?><p><?= $e($S['for_text']) ?></p><?php endif; ?>
            <ul class="checklist">
              <?php foreach ($S['for'] as $li): ?><li><?= $e($li) ?></li><?php endforeach; ?>
            </ul>
          </div>
          <div class="feature-row__media" data-reveal data-reveal-delay="90">
            <div class="panel panel--brand">
              <h3>რას იღებთ</h3>
              <ul class="checklist">
                <?php foreach ($S['deliver'] as $li): ?><li><?= $e($li) ?></li><?php endforeach; ?>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">პროცესი</span>
          <h2><?= $e($S['process_title']) ?></h2>
        </div>
        <div class="steps">
          <?php foreach ($S['process'] as $i => [$h, $t]): ?>
          <article class="step" data-reveal data-reveal-delay="<?= $i * 70 ?>">
            <h3><?= $e($h) ?></h3>
            <p><?= $e($t) ?></p>
          </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <span class="eyebrow">კითხვები</span>
            <h2><?= $e($S['faq_title']) ?></h2>
            <p>ვერ იპოვეთ პასუხი? დაჯავშნეთ უფასო ზარი ან მოგვწერეთ ჩატში.</p>
            <a class="btn btn--primary" href="/contact#booking">შეხვედრის დაჯავშნა</a>
          </div>
          <div class="faq">
            <?php foreach ($S['faq'] as $i => [$q, $a]): $id = 'sf-' . ($i + 1); ?>
            <div class="faq__item">
              <h3 style="margin:0">
                <button class="faq__q" type="button" aria-expanded="false" aria-controls="<?= $id ?>">
                  <span><?= $e($q) ?></span><span class="faq__icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__a" id="<?= $id ?>" data-open="false"><div><p><?= $e($a) ?></p></div></div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">სხვა სერვისები</span>
          <h2>რითი შეგვიძლია კიდევ დაგეხმაროთ</h2>
        </div>
        <div class="grid grid--3">
          <?php $rel = array_slice(array_filter(CMS_SERVICES, static fn($k) => $k !== $S['path'] && in_array($k, $S['related'], true), ARRAY_FILTER_USE_KEY), 0, 3, true);
          foreach ($rel as $href => [$name, $txt]): ?>
          <article class="card card--link" data-reveal>
            <h3><?= $e($name) ?></h3>
            <p><?= $e($txt) ?></p>
            <a class="link-arrow" href="<?= $e($href) ?>">დეტალურად <?= CMS_SVG_ARROW ?><span class="sr-only"> — <?= $e($name) ?></span></a>
          </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <section class="cta cta--center">
      <div class="container">
        <div class="cta__inner" data-reveal>
          <h2><?= $e($S['cta_title']) ?></h2>
          <p>უფასო კონსულტაციაზე მოვისმენთ თქვენს ამოცანას და ერთ სამუშაო დღეში გამოგიგზავნით
            საორიენტაციო გეგმას, ვადებსა და ღირებულებას.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/contact#booking">შეხვედრის დაჯავშნა</a>
            <a class="btn btn--light" href="/contact#contact-form">განაცხადის გაგზავნა</a>
          </div>
        </div>
      </div>
    </section>
<?php
    require __DIR__ . '/foot.php';
}
