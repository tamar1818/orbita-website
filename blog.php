<?php
declare(strict_types=1);
require_once __DIR__ . '/inc/blog.php';

$posts = cms_posts();
$cats  = [];
foreach ($posts as $p) {
    $c = (string) ($p['category'] ?? '');
    if (isset(CMS_BLOG_CATS[$c])) {
        $cats[$c] = CMS_BLOG_CATS[$c];
    }
}

$PAGE_TITLE = 'ბლოგი — რჩევები ვებსაიტებზე, SEO-სა და მარკეტინგზე | Webico';
$PAGE_DESC  = 'პრაქტიკული სტატიები ქართული ბიზნესისთვის: როგორ გამოჩნდეთ Google-ში, როგორ დახარჯოთ რეკლამის ბიუჯეტი გონივრულად და რა უნდა იცოდეთ ახალი ვებსაიტის აწყობამდე.';
$PAGE_URL   = '/blog';

$ld = [
    '@context' => 'https://schema.org',
    '@type'    => 'Blog',
    'name'     => 'ვებიკოს ბლოგი',
    'url'      => 'https://webico.io/blog',
    'inLanguage' => 'ka',
    'publisher' => ['@type' => 'Organization', 'name' => 'Webico', 'url' => 'https://webico.io/'],
    'blogPost' => array_map(static fn($p) => [
        '@type' => 'BlogPosting',
        'headline' => (string) ($p['title'] ?? ''),
        'url' => 'https://webico.io/blog/' . $p['slug'],
        'datePublished' => (string) ($p['date'] ?? ''),
    ], $posts),
];
$PAGE_LD = "\n  <script type=\"application/ld+json\">\n"
    . json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
    . "\n  </script>";

require __DIR__ . '/inc/head.php';
?>
    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ბლოგი</span></li>
          </ol>
          <span class="eyebrow">ბლოგი</span>
          <h1><?= T('blog.title', 'რჩევები ქართული ბიზნესისთვის') ?></h1>
          <p><?= T('blog.text', 'ვწერთ იმაზე, რასაც ყოველდღე ვხედავთ: რატომ ვერ პოულობენ კლიენტები საიტს, სად „იწვება“ რეკლამის ბიუჯეტი და რა ცვლის რეალურად შედეგს. მოკლედ, გასაგებად და ქართული ბაზრის კონტექსტით.') ?></p>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
<?php if (!$posts): ?>
        <div class="blog-empty">
          <h2>სტატიები მალე დაემატება</h2>
          <p>მანამდე, თუ კონკრეტული კითხვა გაქვთ, <a href="/contact">მოგვწერეთ</a>.</p>
        </div>
<?php else: $feat = array_shift($posts); ?>
        <div class="post-feature" data-reveal><?= cms_post_card($feat, true) ?></div>

  <?php if ($posts): ?>
        <div class="blog-bar" data-reveal>
          <h2 class="blog-bar__title">ყველა სტატია</h2>
          <?php if (count($cats) > 1): ?>
          <div class="filters" data-filter-group data-filter-noun="სტატია" role="group" aria-label="კატეგორიები">
            <button class="filter" type="button" data-filter="all" aria-pressed="true">ყველა<span class="filter__count"></span></button>
            <?php foreach ($cats as $k => $label): ?>
            <button class="filter" type="button" data-filter="<?= cms_e($k) ?>" aria-pressed="false"><?= cms_e($label) ?><span class="filter__count"></span></button>
            <?php endforeach; ?>
          </div>
          <?php endif; ?>
        </div>
        <p class="sr-only" aria-live="polite" data-filter-status></p>
        <div class="post-grid">
          <?php foreach ($posts as $i => $p): ?>
            <div class="post-grid__cell" data-category="<?= cms_e((string) ($p['category'] ?? '')) ?>" data-reveal data-reveal-delay="<?= min($i, 5) * 50 ?>"><?= cms_post_card($p) ?></div>
          <?php endforeach; ?>
        </div>
        <p class="blog-empty" data-filter-empty hidden>ამ კატეგორიაში სტატია ჯერ არ არის.</p>
  <?php endif; ?>
<?php endif; ?>

        <aside class="blog-ask" data-reveal>
          <div>
            <h2>გაქვთ კითხვა, რომელზეც აქ პასუხი ვერ იპოვეთ?</h2>
            <p>მოგვწერეთ — ან პირდაპირ გიპასუხებთ, ან შემდეგ სტატიას სწორედ ამ თემაზე დავწერთ.</p>
          </div>
          <a class="btn btn--primary" href="/contact">მოგვწერეთ</a>
        </aside>
      </div>
    </section>
<?php require __DIR__ . '/inc/foot.php';
