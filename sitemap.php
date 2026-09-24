<?php
declare(strict_types=1);
require_once __DIR__ . '/inc/projects.php';
header('Content-Type: application/xml; charset=utf-8');

$today = date('Y-m-d');
$pages = [['/', '1.0'], ['/services', '0.9'], ['/work', '0.9'], ['/contact', '0.9'],
          ['/about', '0.8'], ['/service-web-development', '0.8'], ['/service-seo', '0.8'],
          ['/service-marketing', '0.8'], ['/service-branding', '0.8']];
foreach (cms_projects() as $p) {
    $pages[] = ['/work-' . $p['slug'], '0.7'];
}
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($pages as [$u, $pr]) {
    echo "  <url>\n    <loc>https://webico.io" . cms_e($u) . "</loc>\n"
       . "    <lastmod>$today</lastmod>\n    <changefreq>monthly</changefreq>\n"
       . "    <priority>$pr</priority>\n  </url>\n";
}
echo "</urlset>\n";
