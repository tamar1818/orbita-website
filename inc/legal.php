<?php
/** სამართლებრივი გვერდების საერთო შაბლონი: /terms, /privacy, /refund, /delivery */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_LEGAL_PAGES = [
    '/terms'    => 'წესები და პირობები',
    '/privacy'  => 'კონფიდენციალურობის პოლიტიკა',
    '/refund'   => 'გაუქმება და თანხის დაბრუნება',
    '/delivery' => 'მომსახურების მიწოდება',
];

/** მომსახურების მიმწოდებლის მონაცემები — ადმინის „პარამეტრებიდან“ ან ნაგულისხმევი */
function cms_legal_owner(): array
{
    return [
        'name'  => cms_setting('legal_name', 'თამარ გელიაშვილი'),
        'id'    => cms_setting('legal_id', '01024088829'),
        'phone' => cms_setting('phone', '+995 557 64 32 25'),
        'email' => cms_setting('email', 'hello@webico.io'),
        'city'  => cms_setting('address', 'თბილისი, საქართველო'),
    ];
}

/** მიმწოდებლის ბლოკი (უკვე ესქეიპებული) */
function cms_legal_owner_html(): string
{
    $o = cms_legal_owner();
    return '<ul class="legal-owner">'
        . '<li><b>მომსახურების მიმწოდებელი</b><span>' . $o['name'] . ' (ბრენდი „Webico“)</span></li>'
        . '<li><b>საიდენტიფიკაციო ნომერი</b><span>' . $o['id'] . '</span></li>'
        . '<li><b>მისამართი</b><span>' . $o['city'] . '</span></li>'
        . '<li><b>ტელეფონი</b><span><a href="tel:' . preg_replace('~[^\d+]~', '', html_entity_decode($o['phone'])) . '">' . $o['phone'] . '</a></span></li>'
        . '<li><b>ელფოსტა</b><span><a href="mailto:' . $o['email'] . '">' . $o['email'] . '</a></span></li>'
        . '<li><b>ვებსაიტი</b><span><a href="https://webico.io/">webico.io</a></span></li>'
        . '</ul>';
}

/**
 * $L: path, title, desc, lead, updated (Y-m-d), body (სანდო HTML — მხოლოდ ამ საიტის ფაილებიდან)
 */
function cms_legal_page(array $L): void
{
    $PAGE_TITLE = $L['title'] . ' | Webico';
    $PAGE_DESC  = $L['desc'];
    $PAGE_URL   = $L['path'];
    $PAGE_LD = "\n  <script type=\"application/ld+json\">" . json_encode([
        '@context' => 'https://schema.org', '@type' => 'WebPage', 'name' => $L['title'],
        'url' => 'https://webico.io' . $L['path'], 'dateModified' => $L['updated'], 'inLanguage' => 'ka',
        'publisher' => ['@type' => 'Organization', 'name' => 'Webico', 'url' => 'https://webico.io/'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "</script>";

    require __DIR__ . '/head.php';
    ?>
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page"><?= cms_e($L['title']) ?></span></li>
          </ol>
          <span class="eyebrow">სამართლებრივი ინფორმაცია</span>
          <h1><?= cms_e($L['title']) ?></h1>
          <p><?= cms_e($L['lead']) ?></p>
          <p class="legal-updated">ბოლო განახლება: <?= cms_e(cms_date_ka_legal($L['updated'])) ?></p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container legal">
        <aside class="legal__nav" aria-label="სამართლებრივი დოკუმენტები">
          <p>დოკუმენტები</p>
          <ul>
            <?php foreach (CMS_LEGAL_PAGES as $href => $name): ?>
            <li><a href="<?= $href ?>"<?= $href === $L['path'] ? ' aria-current="page"' : '' ?>><?= cms_e($name) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </aside>
        <div class="legal__body prose">
          <?= cms_legal_owner_html() ?>
          <?= $L['body'] ?>
          <p class="legal__contact">კითხვების შემთხვევაში მოგვწერეთ <a href="mailto:<?= cms_setting('email', 'hello@webico.io') ?>"><?= cms_setting('email', 'hello@webico.io') ?></a>-ზე ან დაგვირეკეთ <?= cms_setting('phone', '+995 557 64 32 25') ?>.</p>
        </div>
      </div>
    </section>
<?php
    require __DIR__ . '/foot.php';
}

function cms_date_ka_legal(string $ymd): string
{
    $m = ['', 'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
    [$y, $mo, $d] = array_map('intval', explode('-', $ymd) + [0, 0, 0]);
    return $d . ' ' . ($m[$mo] ?? '') . ', ' . $y;
}
