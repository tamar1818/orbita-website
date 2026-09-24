<?php
declare(strict_types=1);
require_once __DIR__ . '/inc/projects.php';

$list = cms_projects_showcase();
$PAGE_TITLE = 'ნამუშევრები — Webico';
$PAGE_DESC = 'Webico-ს პორტფოლიო: ' . count($list) . ' შესრულებული ვებსაიტი.';
$PAGE_URL = '/work';

$items = [];
foreach ($list as $i => $p) {
    $items[] = '{ "@type": "ListItem", "position": ' . ($i + 1)
        . ', "url": "https://webico.io/work-' . rawurlencode((string) $p['slug'])
        . '", "name": ' . json_encode($p['name'] ?? '', JSON_UNESCAPED_UNICODE) . ' }';
}
$PAGE_LD = "\n  <script type=\"application/ld+json\">\n{\n"
    . '  "@context": "https://schema.org", "@type": "ItemList", "itemListElement": ['
    . implode(',', $items) . "]\n}\n  </script>";

require __DIR__ . '/inc/head.php';
?>
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ნამუშევრები</span></li>
          </ol>
          <span class="eyebrow">ჩვენი ნამუშევრები</span>
          <h1><?= T('work.title', 'შესრულებული პროექტები') ?></h1>
          <p><?= T('work.text', count($list) . ' ვებსაიტი — ბიზნესი, ორგანიზაციები, ონლაინ მაღაზიები და სერვისები საქართველოსა და მის ფარგლებს გარეთ.') ?></p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="work-grid">
<?php foreach ($list as $i => $p):
    $slug = cms_e((string) ($p['slug'] ?? ''));
    $stack = array_values(array_filter(array_map('trim', $p['stack'] ?? [])));
?>
          <article class="work" data-category="web" data-reveal data-reveal-delay="<?= min($i, 6) * 40 ?>">
            <a class="work__cover-link" href="/work-<?= $slug ?>" tabindex="-1" aria-hidden="true">
              <div class="work__cover work__cover--mock"><?= cms_mock($p, "(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 600px") ?></div>
            </a>
            <div class="work__body">
              <div class="work__head">
                <h3><a href="/work-<?= $slug ?>"><?= cms_e((string) ($p['name'] ?? '')) ?></a></h3>
                <span class="work__go" aria-hidden="true"><?= CMS_ARROW ?></span>
              </div>
              <?php if (!empty($p['summary'])): ?><p><?= cms_e((string) $p['summary']) ?></p><?php endif; ?>
              <div class="work__meta">
                <?php foreach (cms_tags($p) as $t): ?><span class="tag"><?= cms_e($t) ?></span><?php endforeach; ?>
                <?php if (!empty($p['partner'])): ?><span class="tag tag--partner"><?= cms_e((string) $p['partner']) ?></span><?php endif; ?>
              </div>
              <?php if ($stack): ?>
                <div class="work__tools"><b>ინსტრუმენტები</b><?php foreach ($stack as $s): ?><span class="tag tag--tool"><?= cms_e($s) ?></span><?php endforeach; ?></div>
              <?php endif; ?>
              <div class="work__actions">
                <a class="btn btn--primary btn--sm" href="/work-<?= $slug ?>">ნახე მეტი</a>
                <?php if (!empty($p['domain'])): ?>
                  <a class="work__site" href="https://<?= cms_e((string) $p['domain']) ?>/" target="_blank" rel="noopener noreferrer"><?= cms_e((string) $p['domain']) ?> <?= CMS_EXT ?></a>
                <?php endif; ?>
              </div>
            </div>
          </article>
<?php endforeach; ?>
        </div>
      </div>
    </section>
<?php require __DIR__ . '/inc/foot.php';
