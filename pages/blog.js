'use strict';
/** /blog — სტატიების სია */
const { e, T } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const blog = require('../lib/blog');
const { map, truthy, empty, ldJson } = require('../lib/tpl');

const postCard = blog.postCard;

function render() {
  const all = blog.posts();
  const cats = {};
  for (const p of all) { const c = String(p.category ?? ''); if (blog.CATS[c]) cats[c] = blog.CATS[c]; }
  const feat = all[0];
  const rest = all.slice(1);
  const ld = '\n  <script type="application/ld+json">\n' + ldJson({
    '@context': 'https://schema.org', '@type': 'Blog', name: 'ვებიკოს ბლოგი', url: 'https://webico.io/blog', inLanguage: 'ka',
    publisher: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
    blogPost: all.map((p) => ({ '@type': 'BlogPosting', headline: String(p.title ?? ''), url: 'https://webico.io/blog/' + p.slug, datePublished: String(p.date ?? '') })),
  }, 4) + '\n  </script>';
  return head({
    title: 'ბლოგი — რჩევები ვებსაიტებზე, SEO-სა და მარკეტინგზე | Webico',
    desc: 'პრაქტიკული სტატიები ქართული ბიზნესისთვის: როგორ გამოჩნდეთ Google-ში, როგორ დახარჯოთ რეკლამის ბიუჯეტი გონივრულად და რა უნდა იცოდეთ ახალი ვებსაიტის აწყობამდე.',
    url: '/blog', ld,
  }) + `    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ბლოგი</span></li>
          </ol>
          <span class="eyebrow">ბლოგი</span>
          <h1>${T('blog.title', 'რჩევები ქართული ბიზნესისთვის')}</h1>
          <p>${T('blog.text', 'ვწერთ იმაზე, რასაც ყოველდღე ვხედავთ: რატომ ვერ პოულობენ კლიენტები საიტს, სად „იწვება“ რეკლამის ბიუჯეტი და რა ცვლის რეალურად შედეგს. მოკლედ, გასაგებად და ქართული ბაზრის კონტექსტით.')}</p>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
${truthy(!all.length) ? `        <div class="blog-empty">
          <h2>სტატიები მალე დაემატება</h2>
          <p>მანამდე, თუ კონკრეტული კითხვა გაქვთ, <a href="/contact">მოგვწერეთ</a>.</p>
        </div>
` : `        <div class="post-feature" data-reveal>${postCard(feat, true)}</div>

  ${truthy(rest.length) ? `        <div class="blog-bar" data-reveal>
          <h2 class="blog-bar__title">ყველა სტატია</h2>
          ${truthy(Object.keys(cats).length > 1) ? `          <div class="filters" data-filter-group data-filter-noun="სტატია" role="group" aria-label="კატეგორიები">
            <button class="filter" type="button" data-filter="all" aria-pressed="true">ყველა<span class="filter__count"></span></button>
            ${map(Object.entries(cats), ([k, label]) => { return `            <button class="filter" type="button" data-filter="${e(k)}" aria-pressed="false">${e(label)}<span class="filter__count"></span></button>
            `; })}          </div>
          ` : ''}        </div>
        <p class="sr-only" aria-live="polite" data-filter-status></p>
        <div class="post-grid">
          ${map(rest, (p, i) => { return `            <div class="post-grid__cell" data-category="${e(p.category ?? '')}" data-reveal data-reveal-delay="${Math.min(i, 5) * 50}">${postCard(p)}</div>
          `; })}        </div>
        <p class="blog-empty" data-filter-empty hidden>ამ კატეგორიაში სტატია ჯერ არ არის.</p>
  ` : ''}`}
        <aside class="blog-ask" data-reveal>
          <div>
            <h2>გაქვთ კითხვა, რომელზეც აქ პასუხი ვერ იპოვეთ?</h2>
            <p>მოგვწერეთ — ან პირდაპირ გიპასუხებთ, ან შემდეგ სტატიას სწორედ ამ თემაზე დავწერთ.</p>
          </div>
          <a class="btn btn--primary" href="/contact">მოგვწერეთ</a>
        </aside>
      </div>
    </section>
` + foot();
}

module.exports = { render };
