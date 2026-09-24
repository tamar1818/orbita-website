<?php
declare(strict_types=1);
require_once __DIR__ . '/inc/projects.php';
require_once __DIR__ . '/inc/blog.php';
header('Content-Type: application/xml; charset=utf-8');

$today = date('Y-m-d');
$posts = cms_posts();
$blogMod = $posts ? (string) ($posts[0]['updated'] ?? $posts[0]['date'] ?? $today) : $today;

// [მისამართი, პრიორიტეტი, ბოლო ცვლილება]
$pages = [['/', '1.0', $today], ['/services', '0.9', $today], ['/work', '0.9', $today],
          ['/contact', '0.9', $today], ['/about', '0.8', $today], ['/blog', '0.8', $blogMod],
          ['/service-web-development', '0.8', $today], ['/service-seo', '0.8', $today],
          ['/service-marketing', '0.8', $today], ['/service-branding', '0.8', $today]];
foreach (cms_projects() as $p) {
    $pages[] = ['/work-' . $p['slug'], '0.7', $today];
}
foreach ($posts as $p) {
    $pages[] = ['/blog/' . $p['slug'], '0.7', (string) ($p['updated'] ?? $p['date'] ?? $today)];
}
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($pages as [$u, $pr, $mod]) {
    echo "  <url>\n    <loc>https://webico.io" . cms_e($u) . "</loc>\n"
       . "    <lastmod>" . cms_e($mod) . "</lastmod>\n    <changefreq>monthly</changefreq>\n"
       . "    <priority>$pr</priority>\n  </url>\n";
}
echo "</urlset>\n";
