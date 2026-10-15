<?php
/** /plans — საიტი და მოვლა ყოველთვიური გამოწერით */
declare(strict_types=1);
require_once __DIR__ . '/inc/init.php';

$e = 'cms_e';
/** ფასი ადმინიდან (ტექსტები) ან ნაგულისხმევი; მხოლოდ ციფრები */
$price = static fn(string $key, int $def): int =>
    (int) preg_replace('~\D~', '', html_entity_decode(T($key, (string) $def))) ?: $def;
$fmt = static fn(int $n): string => number_format($n, 0, '.', ' ');

$PLANS = [
    [
        'id' => 'care', 'name' => 'მოვლა', 'price' => $price('plans.care.price', 99),
        'desc' => 'არსებული საიტისთვის — ჩვენ ვუვლით, თქვენ ბიზნესს აკეთებთ.',
        'note' => 'მინიმალური ვადა — 3 თვე',
        'items' => ['ჰოსტინგი და SSL სერტიფიკატი', 'ყოველდღიური სარეზერვო ასლები', 'განახლებები და უსაფრთხოება', 'მუშაობის 24/7 მონიტორინგი', '30 წუთი ცვლილებებისთვის ყოველთვე'],
        'cta' => 'მოვლის დაწყება',
    ],
    [
        'id' => 'start', 'name' => 'საიტი გამოწერით', 'price' => $price('plans.start.price', 199), 'featured' => true,
        'desc' => 'ახალი საიტი წინასწარი გადახდის გარეშე — მცირე ბიზნესისთვის.',
        'note' => '0 ₾ წინასწარ · მინიმალური ვადა — 12 თვე',
        'items' => ['5-გვერდიანი საიტი თქვენი დიზაინით', 'მობილურზე ადაპტირებული, სწრაფი', 'საბაზისო SEO და Google Analytics', 'ჰოსტინგი, SSL და მოვლა შედის', '1 საათი ცვლილებებისთვის ყოველთვე'],
        'cta' => 'საიტის დაწყება',
    ],
    [
        'id' => 'business', 'name' => 'ბიზნესი', 'price' => $price('plans.business.price', 349),
        'desc' => 'მზარდი კომპანიისთვის, რომელსაც საიტისგან ლიდები სჭირდება.',
        'note' => '0 ₾ წინასწარ · მინიმალური ვადა — 12 თვე',
        'items' => ['10-მდე გვერდი და ბლოგი', 'ლიდების ჩატბოტი და ონლაინ ჯავშანი', 'Google Business Profile-ის მოწყობა', 'ჰოსტინგი, SSL და მოვლა შედის', '2 საათი ცვლილებებისთვის ყოველთვე', 'ყოველთვიური ანგარიში'],
        'cta' => 'ბიზნესის დაწყება',
    ],
];

$ADDONS = [
    ['ლიდების ჩატბოტი', $price('plans.addon.chat', 49), 'რამდენიმე კითხვით აგროვებს მოთხოვნებს და პირდაპირ ელფოსტაზე გიგზავნით.'],
    ['ონლაინ ჯავშანი', $price('plans.addon.booking', 39), 'კლიენტი თავად ირჩევს დღესა და საათს — ზარების გარეშე.'],
    ['SEO სტატიები', $price('plans.addon.seo', 149), 'თვეში 2 სტატია ქართულად, საძიებო სიტყვებზე მორგებული.'],
    ['მეორე ენა', $price('plans.addon.lang', 59), 'ინგლისური ან რუსული ვერსია და მისი განახლება.'],
];

$STEPS = [
    ['უფასო ზარი', '20 წუთში გავარკვევთ, რა გჭირდებათ და რომელი პაკეტი გერგებათ.'],
    ['დიზაინი და აწყობა', 'საიტს 2–3 კვირაში ვაწყობთ. თქვენ მხოლოდ ტექსტებსა და ფოტოებს გვიგზავნით.'],
    ['გაშვება', 'ვუშვებთ საიტს თქვენს დომენზე. პირველი თვის გადახდა — გაშვების დღეს.'],
    ['მოვლა და ცვლილებები', 'ყოველთვე ვანახლებთ, ვამოწმებთ და ვცვლით, რასაც მოგვწერთ.'],
];

$FAQ = [
    ['ვის ეკუთვნის საიტი?', 'დომენი თავიდანვე თქვენს სახელზე რეგისტრირდება. საიტი, ტექსტები და ფოტოები თქვენია. 12 თვის შემდეგ შეგიძლიათ გააგრძელოთ გამოწერა ან გამოისყიდოთ საიტის კოდი და სხვაგან გადაიტანოთ.'],
    ['ჰოსტინგი ცალკე უნდა ვიყიდო?', 'არა. ჰოსტინგი, SSL სერტიფიკატი, სარეზერვო ასლები და მონიტორინგი ყველა პაკეტშია. სერვერებზე, განახლებებსა და გადახდებზე ფიქრი არ მოგიწევთ.'],
    ['რა ხდება 12 თვის შემდეგ?', 'გამოწერა თვიურად გრძელდება, ნებისმიერ დროს შეწყვეტის უფლებით (30 დღით ადრე შეტყობინებით). თუ შეწყვეტთ, საიტის ფაილებს და მონაცემებს გადმოგცემთ.'],
    ['რა მოხდება, თუ თვიურ საათებზე მეტი ცვლილება დამჭირდება?', 'მცირე ცვლილებებს ჩვეულებრივ ვეტევით. დიდ ამოცანაზე (ახალი განყოფილება, ინტეგრაცია) ჯერ ფასს გეტყვით და მხოლოდ თქვენი თანხმობის შემდეგ დავიწყებთ.'],
    ['დომენის ფასი შედის?', 'დომენის წლიური საფასური (.ge ან .com) ცალკე იხდება და თქვენს სახელზეა. რეგისტრაციასა და ტექნიკურ მხარეს ჩვენ ვაგვარებთ.'],
    ['წლიურად გადახდა შეიძლება?', 'დიახ — წლიური გადახდისას 12 თვის ნაცვლად 10-ს იხდით, ანუ 2 თვე უფასოა.'],
    ['ფასში დღგ შედის?', 'ფასები მითითებულია დღგ-ს გარეშე.'],
];

$PAGE_TITLE = 'საიტი გამოწერით — ყოველთვიური პაკეტები | Webico';
$PAGE_DESC  = 'ახალი საიტი წინასწარი გადახდის გარეშე: ' . $PLANS[1]['price'] . ' ₾-დან თვეში. ჰოსტინგი, SSL, სარეზერვო ასლები, განახლებები და ყოველთვიური ცვლილებები ფასში შედის.';
$PAGE_URL   = '/plans';

$offers = [];
foreach ($PLANS as $p) {
    $offers[] = [
        '@type' => 'Offer', 'name' => $p['name'], 'description' => $p['desc'],
        'priceCurrency' => 'GEL', 'price' => $p['price'],
        'priceSpecification' => ['@type' => 'UnitPriceSpecification', 'price' => $p['price'], 'priceCurrency' => 'GEL',
            'unitCode' => 'MON', 'valueAddedTaxIncluded' => false],
        'url' => 'https://webico.io/plans#' . $p['id'],
    ];
}
$ld = ['@context' => 'https://schema.org', '@graph' => [
    ['@type' => 'Service', 'name' => 'საიტი გამოწერით', 'serviceType' => 'Website as a Service',
     'provider' => ['@type' => 'Organization', 'name' => 'Webico', 'url' => 'https://webico.io/'],
     'areaServed' => 'GE', 'url' => 'https://webico.io/plans',
     'hasOfferCatalog' => ['@type' => 'OfferCatalog', 'name' => 'ყოველთვიური პაკეტები', 'itemListElement' => $offers]],
    ['@type' => 'BreadcrumbList', 'itemListElement' => [
        ['@type' => 'ListItem', 'position' => 1, 'name' => 'მთავარი', 'item' => 'https://webico.io/'],
        ['@type' => 'ListItem', 'position' => 2, 'name' => 'ფასები', 'item' => 'https://webico.io/plans']]],
    ['@type' => 'FAQPage', 'mainEntity' => array_map(static fn($f) => ['@type' => 'Question', 'name' => $f[0],
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]]], $FAQ)],
]];
$PAGE_LD = "\n  <script type=\"application/ld+json\">" . json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "</script>";

require __DIR__ . '/inc/head.php';
?>
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ფასები</span></li>
          </ol>
          <span class="eyebrow">საიტი გამოწერით</span>
          <h1><?= T('plans.title', 'ახალი საიტი — წინასწარი გადახდის გარეშე') ?></h1>
          <p><?= T('plans.lead', 'იხდით თვიურად, როგორც ტელეფონის გეგმაში. საიტის აწყობა, ჰოსტინგი, უსაფრთხოება და ყოველთვიური ცვლილებები — ერთ ფასში.') ?></p>
          <ul class="hero__perks plans-perks">
            <li>0 ₾ წინასწარ</li>
            <li>ჰოსტინგი და SSL შედის</li>
            <li>დომენი თქვენს სახელზე</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="plans">
      <div class="container">
        <div class="bill-toggle" role="group" aria-label="გადახდის პერიოდი" data-bill>
          <button type="button" aria-pressed="true" data-bill-set="month">თვიურად</button>
          <button type="button" aria-pressed="false" data-bill-set="year">წლიურად <span>2 თვე უფასოდ</span></button>
        </div>
        <div class="grid grid--3 plans">
          <?php foreach ($PLANS as $i => $p): ?>
          <article class="price<?= !empty($p['featured']) ? ' price--featured' : '' ?>" id="<?= $p['id'] ?>" data-reveal data-reveal-delay="<?= $i * 80 ?>">
            <?php if (!empty($p['featured'])): ?><span class="price__badge">ყველაზე მომგებიანი</span><?php endif; ?>
            <h3><?= $e($p['name']) ?></h3>
            <p class="price__desc"><?= $e($p['desc']) ?></p>
            <p class="price__amount" data-month="<?= $fmt($p['price']) ?>" data-year="<?= $fmt($p['price'] * 10) ?>">
              <b><?= $fmt($p['price']) ?></b><span data-unit-month="₾ / თვე" data-unit-year="₾ / წელი">₾ / თვე</span>
            </p>
            <p class="price__note"><?= $e($p['note']) ?></p>
            <ul class="card__list">
              <?php foreach ($p['items'] as $li): ?><li><?= $e($li) ?></li><?php endforeach; ?>
            </ul>
            <a class="btn <?= !empty($p['featured']) ? 'btn--primary' : 'btn--ghost' ?> btn--block" href="/contact?plan=<?= $p['id'] ?>#booking"><?= $e($p['cta']) ?></a>
          </article>
          <?php endforeach; ?>
        </div>
        <p class="text-center muted" style="margin-top:28px;font-size:.92rem">ფასები მითითებულია დღგ-ს გარეშე. დომენის წლიური საფასური ცალკე იხდება.
          ერთჯერადი გადახდით საიტი გირჩევნიათ? <a class="link-arrow" href="/services">იხილეთ სერვისები</a></p>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">დამატებები</span>
          <h2>დაამატეთ ნებისმიერ პაკეტს</h2>
          <p>ჩართეთ, როცა დაგჭირდებათ, და გამორთეთ ნებისმიერ დროს.</p>
        </div>
        <div class="addons">
          <?php foreach ($ADDONS as $i => [$n, $pr, $t]): ?>
          <article class="addon" data-reveal data-reveal-delay="<?= $i * 60 ?>">
            <h3><?= $e($n) ?></h3>
            <p><?= $e($t) ?></p>
            <span class="addon__price">+<?= $fmt($pr) ?> ₾ / თვე</span>
          </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow eyebrow--accent">როგორ მუშაობს</span>
          <h2>ოთხი ნაბიჯი გაშვებამდე</h2>
        </div>
        <div class="steps">
          <?php foreach ($STEPS as $i => [$h, $t]): ?>
          <article class="step" data-reveal data-reveal-delay="<?= $i * 70 ?>">
            <h3><?= $e($h) ?></h3>
            <p><?= $e($t) ?></p>
          </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">შედარება</span>
          <h2>გამოწერა თუ ერთჯერადი გადახდა?</h2>
        </div>
        <div class="compare" data-reveal>
          <table>
            <thead><tr><th scope="col"></th><th scope="col">ერთჯერადი</th><th scope="col">გამოწერა</th></tr></thead>
            <tbody>
              <tr><th scope="row">წინასწარი გადახდა</th><td>სრული თანხა</td><td><b>0 ₾</b></td></tr>
              <tr><th scope="row">ჰოსტინგი და SSL</th><td>ცალკე იხდით</td><td><b>შედის</b></td></tr>
              <tr><th scope="row">განახლებები და უსაფრთხოება</th><td>3–6 თვე</td><td><b>მუდმივად</b></td></tr>
              <tr><th scope="row">ყოველთვიური ცვლილებები</th><td>ცალკე ანაზღაურებით</td><td><b>შედის</b></td></tr>
              <tr><th scope="row">საიტის საკუთრება</th><td>თქვენია</td><td>თქვენია; კოდის გამოსყიდვა 12 თვის შემდეგ</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <div class="faq-split">
          <div class="faq-split__head" data-reveal>
            <span class="eyebrow">კითხვები</span>
            <h2>ხშირად დასმული კითხვები გამოწერაზე</h2>
            <p>ვერ იპოვეთ პასუხი? დაჯავშნეთ უფასო ზარი ან მოგვწერეთ ჩატში.</p>
            <a class="btn btn--primary" href="/contact?plan=start#booking">შეხვედრის დაჯავშნა</a>
          </div>
          <div class="faq">
            <?php foreach ($FAQ as $i => [$q, $a]): $id = 'pf-' . ($i + 1); ?>
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

    <section class="cta cta--center">
      <div class="container">
        <div class="cta__inner" data-reveal>
          <h2>დაიწყეთ საიტი 0 ₾-ით</h2>
          <p>20-წუთიან უფასო ზარზე აგირჩევთ პაკეტს და გეტყვით, როდის შეგვიძლია საიტის გაშვება.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/contact?plan=start#booking">შეხვედრის დაჯავშნა</a>
            <button class="btn btn--light" type="button" data-open-chat>მოგვწერეთ ჩატში</button>
          </div>
        </div>
      </div>
    </section>
<?php require __DIR__ . '/inc/foot.php'; ?>
