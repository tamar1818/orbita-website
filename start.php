<?php
/** /start — საიტის კონფიგურატორი: ბიზნესი → მიზანი → გვერდები → დიზაინი → შეკვეთა */
declare(strict_types=1);
require_once __DIR__ . '/inc/init.php';

$price = static fn(string $key, int $def): int =>
    (int) preg_replace('~\D~', '', html_entity_decode(T($key, (string) $def))) ?: $def;

$CFG = [
    'month'     => $price('plans.start.price', 99),
    'year'      => $price('plans.start.year', 79),
    'included'  => 5,
    'extraPage' => $price('plans.extra_page', 15),
    'addons'    => [
        'chat'    => ['ლიდების ჩატბოტი', $price('plans.addon.chat', 49)],
        'booking' => ['ონლაინ ჯავშანი', $price('plans.addon.booking', 39)],
        'lang'    => ['მეორე ენა', $price('plans.addon.lang', 59)],
        'seo'     => ['SEO სტატიები (2/თვე)', $price('plans.addon.seo', 149)],
    ],
];

$TYPES = [
    'cafe'    => ['კაფე / რესტორანი', 'გემო, რომელსაც დაუბრუნდებით', ['about', 'menu', 'gallery', 'contact']],
    'beauty'  => ['სილამაზე / სალონი', 'თქვენი დრო, თქვენი სილამაზე', ['services', 'prices', 'gallery', 'contact']],
    'clinic'  => ['კლინიკა / ჯანმრთელობა', 'ზრუნვა, რომელსაც ენდობით', ['about', 'services', 'team', 'contact']],
    'shop'    => ['მაღაზია / პროდუქცია', 'ხარისხი, რომელიც ჩანს', ['about', 'menu', 'gallery', 'contact']],
    'service' => ['მომსახურება / კონსულტაცია', 'პროფესიონალები თქვენს გვერდით', ['about', 'services', 'reviews', 'contact']],
    'other'   => ['სხვა', 'ჩვენ ვქმნით შედეგს', ['about', 'services', 'contact']],
];
$GOALS = [
    'calls'  => 'მეტი ზარი და ჯავშანი',
    'leads'  => 'განაცხადების მიღება',
    'show'   => 'პროდუქციის ან მენიუს ჩვენება',
    'google' => 'Google-ში გამოჩენა',
    'trust'  => 'ბრენდის სანდო წარდგენა',
];
$PAGES = [
    'home'     => ['მთავარი', true],
    'about'    => ['ჩვენ შესახებ', false],
    'services' => ['სერვისები', false],
    'menu'     => ['მენიუ / კატალოგი', false],
    'prices'   => ['ფასები', false],
    'gallery'  => ['გალერეა', false],
    'team'     => ['გუნდი', false],
    'reviews'  => ['შეფასებები', false],
    'blog'     => ['ბლოგი', false],
    'contact'  => ['კონტაქტი', true],
];
$STYLES = [
    'clean' => ['სუფთა', 'თეთრი ფონი, ბევრი ჰაერი, მკაფიო ტიპოგრაფია'],
    'bold'  => ['თამამი', 'მუქი ფონი, დიდი სათაურები, ენერგიული'],
    'soft'  => ['რბილი', 'მომრგვალებული ფორმები, ნაზი ფერები'],
];
$COLORS = ['#7c5cff', '#0f766e', '#e11d48', '#ea580c', '#1d4ed8', '#181818'];

$PAGE_TITLE = 'საიტი ' . $CFG['year'] . ' ₾-დან თვეში — ააწყვეთ 2 წუთში | Webico';
$PAGE_DESC  = 'აირჩიეთ ბიზნესი, გვერდები და დიზაინი — და მიიღეთ საიტი ' . $CFG['year'] . ' ₾-დან თვეში. ჰოსტინგი, SSL და მოვლა შედის. გადახდა მხოლოდ დიზაინის დამტკიცების შემდეგ.';
$PAGE_URL   = '/start';

$e = 'cms_e';
require __DIR__ . '/inc/head.php';
?>
    <section class="page-hero page-hero--compact pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/plans">ფასები</a></li>
            <li><span aria-current="page">საიტის აწყობა</span></li>
          </ol>
          <span class="eyebrow">საიტი <?= $CFG['year'] ?> ₾-დან თვეში</span>
          <h1>ააწყვეთ თქვენი საიტი 2 წუთში</h1>
          <p>უპასუხეთ რამდენიმე კითხვას, აირჩიეთ დიზაინი და ფასს მაშინვე დაინახავთ. გადახდა — მხოლოდ მას შემდეგ, რაც დიზაინს დაამტკიცებთ.</p>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <noscript><p class="cfg__noscript">კონფიგურატორს JavaScript სჭირდება. <a href="/contact#booking">დაჯავშნეთ უფასო ზარი</a> და ყველაფერს ერთად გავივლით.</p></noscript>
        <form class="cfg" data-cfg data-cfg-conf='<?= $e(json_encode(['cfg' => $CFG, 'types' => $TYPES, 'pages' => $PAGES], JSON_UNESCAPED_UNICODE)) ?>' novalidate>
          <div class="cfg__progress" aria-hidden="true"><span data-cfg-bar></span></div>
          <p class="cfg__count" data-cfg-count>ნაბიჯი 1 / 5</p>

          <!-- 1. ბიზნესი -->
          <fieldset class="cfg__step" data-step="1">
            <legend class="cfg__title">რა ბიზნესი გაქვთ?</legend>
            <div class="cfg__tiles">
              <?php foreach ($TYPES as $k => [$label]): ?>
              <label class="tile"><input type="radio" name="type" value="<?= $k ?>"<?= $k === 'service' ? ' checked' : '' ?>><span><?= $e($label) ?></span></label>
              <?php endforeach; ?>
            </div>
            <div class="field cfg__field">
              <label for="cfg-name">ბიზნესის სახელი</label>
              <input id="cfg-name" name="business" maxlength="40" placeholder="მაგ.: კაფე ლილე" autocomplete="organization">
              <small class="cfg__hint">სახელს დიზაინის ნიმუშებში დაინახავთ.</small>
            </div>
          </fieldset>

          <!-- 2. მიზანი -->
          <fieldset class="cfg__step" data-step="2" hidden>
            <legend class="cfg__title">რისთვის გჭირდებათ საიტი?</legend>
            <p class="cfg__sub">შეგიძლიათ რამდენიმე აირჩიოთ.</p>
            <div class="cfg__tiles">
              <?php foreach ($GOALS as $k => $label): ?>
              <label class="tile"><input type="checkbox" name="goals" value="<?= $k ?>"<?= $k === 'calls' ? ' checked' : '' ?>><span><?= $e($label) ?></span></label>
              <?php endforeach; ?>
            </div>
          </fieldset>

          <!-- 3. გვერდები და დამატებები -->
          <fieldset class="cfg__step" data-step="3" hidden>
            <legend class="cfg__title">რა გვერდები გჭირდებათ?</legend>
            <p class="cfg__sub">ფასში შედის <?= $CFG['included'] ?> გვერდი. ყოველი დამატებითი — +<?= $CFG['extraPage'] ?> ₾ / თვე.</p>
            <div class="cfg__tiles cfg__tiles--sm">
              <?php foreach ($PAGES as $k => [$label, $locked]): ?>
              <label class="tile tile--check"><input type="checkbox" name="pages" value="<?= $k ?>"<?= $locked ? ' checked disabled data-locked' : '' ?>><span><?= $e($label) ?></span></label>
              <?php endforeach; ?>
            </div>
            <p class="cfg__title cfg__title--sm">დამატებები</p>
            <div class="cfg__tiles cfg__tiles--sm">
              <?php foreach ($CFG['addons'] as $k => [$label, $pr]): ?>
              <label class="tile tile--check"><input type="checkbox" name="addons" value="<?= $k ?>"><span><?= $e($label) ?> <b>+<?= $pr ?> ₾</b></span></label>
              <?php endforeach; ?>
            </div>
          </fieldset>

          <!-- 4. დიზაინი -->
          <fieldset class="cfg__step" data-step="4" hidden>
            <legend class="cfg__title">აირჩიეთ დიზაინის მიმართულება</legend>
            <p class="cfg__sub">ეს ნიმუშებია — საბოლოო დიზაინს თქვენი ბიზნესისთვის ინდივიდუალურად მოვამზადებთ.</p>
            <div class="cfg__colors" role="radiogroup" aria-label="მთავარი ფერი">
              <span>ფერი:</span>
              <?php foreach ($COLORS as $i => $c): ?>
              <label class="swatch" style="--c:<?= $c ?>"><input type="radio" name="color" value="<?= $c ?>"<?= $i === 0 ? ' checked' : '' ?>><span class="sr-only"><?= $c ?></span></label>
              <?php endforeach; ?>
            </div>
            <div class="cfg__designs">
              <?php foreach ($STYLES as $k => [$label, $txt]): ?>
              <label class="design">
                <input type="radio" name="design" value="<?= $k ?>"<?= $k === 'clean' ? ' checked' : '' ?>>
                <span class="design__frame design--<?= $k ?>" aria-hidden="true">
                  <span class="design__bar"><i></i><i></i><i></i></span>
                  <span class="design__nav"><b data-cfg-brand>Webico</b><span><i></i><i></i><i></i></span></span>
                  <span class="design__hero">
                    <span class="design__h" data-cfg-headline></span>
                    <span class="design__p"></span><span class="design__p design__p--short"></span>
                    <span class="design__btn">დაგვიკავშირდით</span>
                  </span>
                  <span class="design__img"></span>
                  <span class="design__cards"><i></i><i></i><i></i></span>
                </span>
                <span class="design__label"><b><?= $e($label) ?></b><small><?= $e($txt) ?></small></span>
              </label>
              <?php endforeach; ?>
            </div>
          </fieldset>

          <!-- 5. შეჯამება და შეკვეთა -->
          <fieldset class="cfg__step" data-step="5" hidden>
            <legend class="cfg__title">თქვენი საიტი</legend>
            <div class="cfg__final">
              <div class="cfg__summary">
                <ul class="cfg__list" data-cfg-summary></ul>
                <div class="cfg__bill" role="group" aria-label="გადახდის პერიოდი">
                  <label><input type="radio" name="billing" value="year" checked><span>წლიურად <em>იაფია</em></span></label>
                  <label><input type="radio" name="billing" value="month"><span>თვიურად</span></label>
                </div>
                <p class="cfg__total"><b data-cfg-total>—</b> <span>₾ / თვე</span></p>
                <p class="cfg__note" data-cfg-note></p>
                <ul class="cfg__perks">
                  <li>ჰოსტინგი, SSL და სარეზერვო ასლები შედის</li>
                  <li>დომენი თქვენს სახელზე</li>
                  <li>გადახდა — დიზაინის დამტკიცების შემდეგ</li>
                </ul>
              </div>
              <div class="cfg__contact">
                <div class="field"><label for="cfg-person">სახელი</label><input id="cfg-person" name="name" required maxlength="120" autocomplete="name"></div>
                <div class="field"><label for="cfg-phone">ტელეფონი</label><input id="cfg-phone" name="phone" type="tel" required maxlength="60" autocomplete="tel" inputmode="tel" placeholder="5XX XX XX XX"></div>
                <div class="field"><label for="cfg-email">ელფოსტა</label><input id="cfg-email" name="email" type="email" required maxlength="160" autocomplete="email"></div>
                <div class="field"><label for="cfg-msg">კომენტარი <small>(არასავალდებულო)</small></label><textarea id="cfg-msg" name="message" rows="3" maxlength="2000" placeholder="მაგ.: მაქვს ლოგო, მინდა მსგავსი საიტი, როგორიც…"></textarea></div>
                <div class="hp-field" aria-hidden="true"><label for="cfg-hp">არ შეავსოთ</label><input type="text" id="cfg-hp" name="company_website" tabindex="-1" autocomplete="off"></div>
                <p class="cfg__error" data-cfg-error role="alert" hidden></p>
              </div>
            </div>
          </fieldset>

          <div class="cfg__nav">
            <button class="btn btn--ghost" type="button" data-cfg-back hidden>უკან</button>
            <button class="btn btn--primary" type="button" data-cfg-next>შემდეგი</button>
            <button class="btn btn--primary" type="submit" data-cfg-submit hidden>შეკვეთის გაგზავნა</button>
          </div>
        </form>

        <div class="cfg cfg--done" data-cfg-done hidden tabindex="-1">
          <span class="cfg__check" aria-hidden="true"></span>
          <h2>მადლობა! შეკვეთა მიღებულია</h2>
          <p>1 სამუშაო დღეში დაგირეკავთ, დავაზუსტებთ დეტალებს და მოგიმზადებთ დიზაინს. გადახდა მხოლოდ მას შემდეგ, რაც დიზაინს დაამტკიცებთ.</p>
          <a class="btn btn--ghost" href="/work">ნახეთ ჩვენი ნამუშევრები</a>
        </div>
      </div>
    </section>
<?php require __DIR__ . '/inc/foot.php'; ?>
