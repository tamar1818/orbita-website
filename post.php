<?php
declare(strict_types=1);
require_once __DIR__ . '/inc/blog.php';

$slug = cms_slug((string) ($_GET['slug'] ?? ''));
$post = $slug !== '' ? cms_post($slug) : null;

if ($post === null) {
    http_response_code(404);
    require __DIR__ . '/404.php';
    exit;
}

[$body, $toc] = cms_post_body((string) ($post['body'] ?? ''));
$title   = (string) ($post['title'] ?? '');
$excerpt = (string) ($post['excerpt'] ?? '');
$date    = (string) ($post['date'] ?? '');
$updated = (string) ($post['updated'] ?? $date);
$author  = trim((string) ($post['author'] ?? '')) ?: CMS_BLOG_AUTHOR;
$url     = 'https://webico.io/blog/' . $slug;

// მსგავსი სტატიები: ჯერ იგივე კატეგორია, შემდეგ დანარჩენი
$others  = array_values(array_filter(cms_posts(), static fn($p) => ($p['slug'] ?? '') !== $slug));
usort($others, static fn($a, $b) =>
    (int) (($b['category'] ?? '') === ($post['category'] ?? '')) <=> (int) (($a['category'] ?? '') === ($post['category'] ?? '')));
$related = array_slice($others, 0, 3);

$PAGE_TITLE   = $title . ' | ვებიკოს ბლოგი';
$PAGE_DESC    = $excerpt;
$PAGE_URL     = '/blog/' . $slug;
$PAGE_OG_TYPE = 'article';
if (!empty($post['cover'])) {
    $PAGE_IMAGE = ltrim(cms_url((string) $post['cover']), '/');
    $PAGE_IMAGE_W = 1200;
    $PAGE_IMAGE_H = 630;
}

$ld = [
    [
        '@context' => 'https://schema.org',
        '@type' => 'BlogPosting',
        'headline' => $title,
        'description' => $excerpt,
        'inLanguage' => 'ka',
        'datePublished' => $date,
        'dateModified' => $updated,
        'mainEntityOfPage' => $url,
        'author' => ['@type' => 'Organization', 'name' => $author, 'url' => 'https://webico.io/about'],
        'publisher' => [
            '@type' => 'Organization', 'name' => 'Webico',
            'logo' => ['@type' => 'ImageObject', 'url' => 'https://webico.io/assets/img/apple-touch-icon.png'],
        ],
        'articleSection' => cms_post_cat($post),
        'wordCount' => count(preg_split('~\s+~u', trim(strip_tags($body))) ?: []),
    ],
    [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'მთავარი', 'item' => 'https://webico.io/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'ბლოგი', 'item' => 'https://webico.io/blog'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $title, 'item' => $url],
        ],
    ],
];
if (!empty($post['cover'])) {
    $ld[0]['image'] = 'https://webico.io' . cms_url((string) $post['cover']);
}
$PAGE_LD = '';
foreach ($ld as $block) {
    $PAGE_LD .= "\n  <script type=\"application/ld+json\">\n"
        . json_encode($block, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
        . "\n  </script>";
}

$share = rawurlencode($url);

// შიდა ბმული: სტატია → შესაბამისი სერვისის გვერდი
$SERVICE_FOR = [
    'seo'       => ['/service-seo', 'SEO ოპტიმიზაცია'],
    'marketing' => ['/service-marketing', 'ციფრული მარკეტინგი'],
    'web'       => ['/service-web-development', 'ვებსაიტის დამზადება'],
    'business'  => ['/service-ecommerce', 'ონლაინ მაღაზიის შექმნა'],
    'branding'  => ['/service-branding', 'UI/UX დიზაინი და ბრენდინგი'],
];
$svcLink = $SERVICE_FOR[$post['category'] ?? ''] ?? ['/services', 'ჩვენი სერვისები'];
require __DIR__ . '/inc/head.php';
?>
    <article class="article">
      <header class="article-hero pattern-grid">
        <div class="container">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/blog">ბლოგი</a></li>
            <li><span aria-current="page"><?= cms_e(cms_post_cat($post)) ?></span></li>
          </ol>
          <a class="eyebrow" href="/blog"><?= cms_e(cms_post_cat($post)) ?></a>
          <h1><?= cms_e($title) ?></h1>
          <?php if ($excerpt !== ''): ?><p class="article-hero__lead"><?= cms_e($excerpt) ?></p><?php endif; ?>
          <p class="article-meta">
            <span class="article-meta__author"><span class="article-meta__avatar" aria-hidden="true">W</span><?= cms_e($author) ?></span>
            <time datetime="<?= cms_e($date) ?>"><?= cms_e(cms_date_ka($date)) ?></time>
            <span><?= cms_read_time($post) ?> წუთი საკითხავი</span>
          </p>
        </div>
      </header>

      <div class="container">
        <div class="article-cover" data-reveal><?= cms_post_cover($post, 'wide') ?></div>

        <div class="article-layout">
          <aside class="article-side">
            <?php if (count($toc) > 1): ?>
            <nav class="toc" aria-label="სტატიის შინაარსი">
              <p class="toc__title">შინაარსი</p>
              <ol>
                <?php foreach ($toc as $t): ?><li><a href="#<?= cms_e($t['id']) ?>"><?= cms_e($t['text']) ?></a></li><?php endforeach; ?>
              </ol>
            </nav>
            <?php endif; ?>
            <div class="share">
              <p class="toc__title">გააზიარე</p>
              <div class="share__row">
                <a class="share__btn" href="https://www.facebook.com/sharer/sharer.php?u=<?= $share ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook-ზე გაზიარება"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
                <a class="share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=<?= $share ?>" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn-ზე გაზიარება"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.9 8H4v12h2.9V8zM5.4 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 20h-2.9v-6.1c0-1.5-.6-2.4-1.8-2.4-1 0-1.5.6-1.8 1.3V20h-2.9V8h2.9v1.3c.6-.9 1.6-1.6 3.1-1.6 2.3 0 3.4 1.5 3.4 4.4V20z"/></svg></a>
                <button class="share__btn" type="button" data-copy-link="<?= cms_e($url) ?>" aria-label="ბმულის კოპირება"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button>
              </div>
              <p class="share__done" role="status" aria-live="polite"></p>
            </div>
          </aside>

          <div class="prose" data-reveal>
            <?= $body ?>

            <aside class="article-cta">
              <p class="article-cta__eyebrow">ვებიკო</p>
              <h2>გინდათ, ეს თქვენს ბიზნესზე ერთად შევხედოთ?</h2>
              <p>უფასო კონსულტაციაზე ვნახავთ თქვენს საიტს და ერთ სამუშაო დღეში გეტყვით, საიდან ღირს დაწყება.</p>
              <div class="btn-row">
                <a class="btn btn--primary" href="/contact#booking">უფასო კონსულტაცია</a>
                <a class="btn btn--ghost-light" href="<?= cms_e($svcLink[0]) ?>"><?= cms_e($svcLink[1]) ?> →</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>

<?php if ($related): ?>
    <section class="section">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div><span class="eyebrow">კიდევ წაიკითხეთ</span><h2>მსგავსი სტატიები</h2></div>
          <a class="btn btn--ghost" href="/blog">ყველა სტატია</a>
        </div>
        <div class="post-grid" data-reveal>
          <?php foreach ($related as $r) { echo cms_post_card($r); } ?>
        </div>
      </div>
    </section>
<?php endif; ?>
<?php require __DIR__ . '/inc/foot.php';
