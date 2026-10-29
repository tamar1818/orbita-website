'use strict';
/** /sitemap.xml — ყოველთვის აქტუალური */
const { e, today } = require('../lib/core');
const { projects } = require('../lib/projects');
const { posts: allPosts } = require('../lib/blog');
const { enPath } = require('../lib/i18n');

function render() {
  const t = today();
  const posts = allPosts();
  const blogMod = posts.length ? String(posts[0].updated ?? posts[0].date ?? t) : t;
  const pages = [['/', '1.0', t], ['/services', '0.9', t], ['/work', '0.9', t], ['/plans', '0.9', t], ['/start', '0.8', t],
    ['/terms', '0.3', t], ['/privacy', '0.3', t], ['/refund', '0.3', t], ['/delivery', '0.3', t],
    ['/contact', '0.9', t], ['/about', '0.8', t], ['/blog', '0.8', blogMod],
    ['/service-web-development', '0.9', t], ['/service-wordpress', '0.9', t],
    ['/service-ecommerce', '0.9', t], ['/service-maintenance', '0.8', t], ['/service-seo', '0.8', t],
    ['/service-marketing', '0.8', t], ['/service-branding', '0.8', t]];
  for (const n of require('./niche').SLUGS) pages.push(['/' + n, '0.8', t]);
  for (const p of projects()) pages.push(['/work-' + p.slug, '0.7', t]);
  for (const p of posts) pages.push(['/blog/' + p.slug, '0.7', String(p.updated ?? p.date ?? t)]);
  // ინგლისური ვერსია — ყველა ქართულ გვერდს აქვს შესატყვისი /en მისამართი
  for (const [u, pr, mod] of pages.slice()) { const en = enPath(u); if (en) pages.push([en, (Math.max(0.3, Number(pr) - 0.1)).toFixed(1), mod]); }
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + pages.map(([u, pr, mod]) => '  <url>\n    <loc>https://webico.io' + e(u) + '</loc>\n'
      + '    <lastmod>' + e(mod) + '</lastmod>\n    <changefreq>monthly</changefreq>\n'
      + '    <priority>' + pr + '</priority>\n  </url>\n').join('')
    + '</urlset>\n';
}

module.exports = { render };
