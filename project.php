<?php
declare(strict_types=1);
require_once __DIR__ . '/inc/projects.php';

$slug = cms_slug((string) ($_GET['slug'] ?? ''));
$p = $slug !== '' ? cms_project($slug) : null;

if ($p === null) {
    http_response_code(404);
    require __DIR__ . '/404.php';
    exit;
}

$all = cms_projects();
$idx = 0;
foreach ($all as $i => $x) {
    if (($x['slug'] ?? '') === $slug) { $idx = $i; break; }
}
$n = count($all);
$prev = $all[($idx - 1 + $n) % $n];
$next = $all[($idx + 1) % $n];

$name   = (string) ($p['name'] ?? '');
$domain = (string) ($p['domain'] ?? '');
$url    = $domain !== '' ? 'https://' . $domain . '/' : '';
$stack  = array_values(array_filter(array_map('trim', $p['stack'] ?? [])));
$scope  = array_values(array_filter(array_map('trim', $p['scope'] ?? [])));

$PAGE_TITLE = $name . ' — ნამუშევრები | Webico';
$PAGE_DESC  = $p['summary'] ?? ($name . ' — ვებსაიტი, შექმნილი Webico-ს მიერ.');
$PAGE_URL   = '/work-' . $slug;
$PAGE_IMAGE = is_file(__DIR__ . '/assets/img/work/' . $slug . '-og.jpg')
    ? 'assets/img/work/' . $slug . '-og.jpg' : null;
$PAGE_IMAGE_W = 1200;
$PAGE_IMAGE_H = $PAGE_IMAGE ? (getimagesize(__DIR__ . '/' . $PAGE_IMAGE)[1] ?? 770) : 630;
$PAGE_LD = "\n  <script type=\"application/ld+json\">\n"
    . json_encode([
        '@context' => 'https://schema.org', '@type' => 'CreativeWork',
        'name' => $name, 'url' => 'https://webico.io/work-' . $slug,
        'creator' => ['@type' => 'Organization', 'name' => 'Webico', 'url' => 'https://webico.io/'],
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n  </script>";

require __DIR__ . '/inc/head.php';
?>
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/work">ნამუშევრები</a></li>
            <li><span aria-current="page"><?= cms_e($name) ?></span></li>
          </ol>
          <span class="eyebrow">პროექტი</span>
          <?php if (!empty($p['partner'])): ?><span class="partner-badge"><?= cms_e((string) $p['partner']) ?>-თან ერთად</span><?php endif; ?>
          <h1><?= cms_e($name) ?></h1>
          <?php if (!empty($p['summary'])): ?><p><?= cms_e((string) $p['summary']) ?></p><?php endif; ?>
          <div class="case__tags" style="margin-top:18px">
            <?php foreach (cms_tags($p) as $t): ?><span class="tag"><?= cms_e($t) ?></span><?php endforeach; ?>
          </div>
          <div class="btn-row">
            <?php if ($url): ?><a class="btn btn--primary" href="<?= cms_e($url) ?>" target="_blank" rel="noopener noreferrer">საიტის ნახვა ↗</a><?php endif; ?>
            <a class="btn btn--ghost" href="/work">ყველა ნამუშევარი</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container"><div class="project-shot" data-reveal><?= cms_mock($p, "(max-width: 1280px) 100vw, 1232px", true) ?></div></div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="project-meta">
          <div><b>კლიენტი</b><span><?= cms_e($name) ?></span></div>
          <?php if (!empty($p['year'])): ?><div><b>წელი</b><span><?= cms_e((string) $p['year']) ?></span></div><?php endif; ?>
          <?php if ($url): ?><div><b>ვებსაიტი</b><a href="<?= cms_e($url) ?>" target="_blank" rel="noopener noreferrer"><?= cms_e($domain) ?> ↗</a></div><?php endif; ?>
          <?php if (!empty($p['partner'])): ?><div><b>თანამშრომლობა</b><span><?= cms_e((string) $p['partner']) ?></span></div><?php endif; ?>
          <div><b>კატეგორია</b><span><?= cms_e(implode(', ', cms_tags($p))) ?></span></div>
        </div>
      </div>
    </section>

<?php if (!empty($p['challenge']) || !empty($p['solution'])): ?>
    <section class="section">
      <div class="container">
        <?php if (!empty($p['challenge'])): ?>
        <div class="feature-row__body" data-reveal>
          <span class="eyebrow">ამოცანა</span><h2>გამოწვევა</h2>
          <p><?= nl2br(cms_e((string) $p['challenge'])) ?></p>
        </div>
        <?php endif; ?>
        <?php if (!empty($p['solution'])): ?>
        <div class="feature-row__body" data-reveal>
          <span class="eyebrow eyebrow--accent">გადაწყვეტა</span><h2>რა გავაკეთეთ</h2>
          <p><?= nl2br(cms_e((string) $p['solution'])) ?></p>
        </div>
        <?php endif; ?>
      </div>
    </section>
<?php endif; ?>

<?php if ($scope || $stack): ?>
    <section class="section section--soft">
      <div class="container">
        <div class="grid grid--2">
          <?php if ($scope): ?>
          <div data-reveal>
            <h3>სამუშაოს მოცულობა</h3>
            <ul class="checklist"><?php foreach ($scope as $s): ?><li><?= cms_e($s) ?></li><?php endforeach; ?></ul>
          </div>
          <?php endif; ?>
          <?php if ($stack): ?>
          <div data-reveal data-reveal-delay="80">
            <h3>ტექნოლოგიები</h3>
            <div class="case__tags" style="margin-top:18px"><?php foreach ($stack as $s): ?><span class="tag"><?= cms_e($s) ?></span><?php endforeach; ?></div>
          </div>
          <?php endif; ?>
        </div>
      </div>
    </section>
<?php endif; ?>

<?php if (!empty($p['result'])): ?>
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">შედეგი</span><h2><?= cms_e((string) $p['result']) ?></h2>
        </div>
      </div>
    </section>
<?php endif; ?>

    <section class="section section--tight">
      <div class="container">
        <div class="project-nav">
          <a href="/work-<?= cms_e((string) $prev['slug']) ?>"><span><small>წინა</small><?= cms_e((string) $prev['name']) ?></span></a>
          <a href="/work-<?= cms_e((string) $next['slug']) ?>"><span><small>შემდეგი</small><?= cms_e((string) $next['name']) ?></span></a>
        </div>
      </div>
    </section>
<?php require __DIR__ . '/inc/foot.php';
