'use strict';
/** /blog/<slug> — სტატია */
const { e, slug: toSlug, url: cu, stripTags } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const blog = require('../lib/blog');
const { map, truthy, empty, ldJson } = require('../lib/tpl');

/** შიდა ბმული: სტატია → შესაბამისი სერვისის გვერდი */
const SERVICE_FOR = {
  seo: ['/service-seo', 'SEO ოპტიმიზაცია'],
  marketing: ['/service-marketing', 'ციფრული მარკეტინგი'],
  web: ['/service-web-development', 'ვებსაიტის დამზადება'],
  business: ['/service-ecommerce', 'ონლაინ მაღაზიის შექმნა'],
  branding: ['/service-branding', 'UI/UX დიზაინი და ბრენდინგი'],
};

function render(rawSlug) {
  const slug = toSlug(rawSlug);
  const post = slug ? blog.post(slug) : null;
  if (!post) return null;

  const [body, toc] = blog.postBody(String(post.body ?? ''));
  const title = String(post.title ?? '');
  const excerpt = String(post.excerpt ?? '');
  const date = String(post.date ?? '');
  const updated = String(post.updated ?? date);
  const author = String(post.author ?? '').trim() || blog.AUTHOR;
  const url = 'https://webico.io/blog/' + slug;

  const cat = post.category ?? '';
  const related = blog.posts().filter((p) => (p.slug ?? '') !== slug)
    .map((p, i) => [p, i]).sort((a, b) => (((b[0].category ?? '') === cat) - ((a[0].category ?? '') === cat)) || a[1] - b[1])
    .map((x) => x[0]).slice(0, 3);

  const text = stripTags(body).trim();
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title, description: excerpt, inLanguage: 'ka',
      datePublished: date, dateModified: updated, mainEntityOfPage: url,
      author: { '@type': 'Organization', name: author, url: 'https://webico.io/about' },
      publisher: { '@type': 'Organization', name: 'Webico', logo: { '@type': 'ImageObject', url: 'https://webico.io/assets/img/apple-touch-icon.png' } },
      articleSection: blog.cat(post),
      wordCount: text === '' ? 1 : text.split(/\s+/u).length,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://webico.io/' },
        { '@type': 'ListItem', position: 2, name: 'ბლოგი', item: 'https://webico.io/blog' },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];
  const opts = { title: title + ' | Webico', desc: excerpt, url: '/blog/' + slug, ogType: 'article' };
  if (!empty(post.cover)) {
    ld[0].image = 'https://webico.io' + cu(String(post.cover));
    Object.assign(opts, { image: cu(String(post.cover)).replace(/^\/+/, ''), imageW: 1200, imageH: 630 });
  }
  const faq = blog.postFaq(post);
  if (faq.length) {
    ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  }
  opts.ld = ld.map((b) => '\n  <script type="application/ld+json">\n' + ldJson(b, 4) + '\n  </script>').join('');
  const share = encodeURIComponent(url);
  const svcLink = SERVICE_FOR[cat] || ['/services', 'ჩვენი სერვისები'];

  return head(opts) + `    <article class="article">
      <header class="article-hero pattern-grid">
        <div class="container">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/blog">ბლოგი</a></li>
            <li><span aria-current="page">${e(blog.cat(post))}</span></li>
          </ol>
          <a class="eyebrow" href="/blog">${e(blog.cat(post))}</a>
          <h1>${e(title)}</h1>
          ${truthy(excerpt !== '') ? `<p class="article-hero__lead">${e(excerpt)}</p>` : ''}          <p class="article-meta">
            <span class="article-meta__author"><span class="article-meta__avatar" aria-hidden="true">W</span>${e(author)}</span>
            <time datetime="${e(date)}">${e(blog.dateKa(date))}</time>
            <span>${blog.readTime(post)} წუთი საკითხავი</span>
          </p>
        </div>
      </header>

      <div class="container">
        <div class="article-cover" data-reveal>${blog.postCover(post, 'wide')}</div>

        <div class="article-layout">
          <aside class="article-side">
            ${truthy(toc.length > 1) ? `            <nav class="toc" aria-label="სტატიის შინაარსი">
              <p class="toc__title">შინაარსი</p>
              <ol>
                ${map(toc, (t) => { return `<li><a href="#${e(t.id)}">${e(t.text)}</a></li>`; })}              </ol>
            </nav>
            ` : ''}            <div class="share">
              <p class="toc__title">გააზიარე</p>
              <div class="share__row">
                <a class="share__btn" href="https://www.facebook.com/sharer/sharer.php?u=${share}" target="_blank" rel="noopener noreferrer" aria-label="Facebook-ზე გაზიარება"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
                <a class="share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${share}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn-ზე გაზიარება"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.9 8H4v12h2.9V8zM5.4 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 20h-2.9v-6.1c0-1.5-.6-2.4-1.8-2.4-1 0-1.5.6-1.8 1.3V20h-2.9V8h2.9v1.3c.6-.9 1.6-1.6 3.1-1.6 2.3 0 3.4 1.5 3.4 4.4V20z"/></svg></a>
                <button class="share__btn" type="button" data-copy-link="${e(url)}" aria-label="ბმულის კოპირება"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button>
              </div>
              <p class="share__done" role="status" aria-live="polite"></p>
            </div>
          </aside>

          <div class="prose" data-reveal>
            ${body}
            ${truthy(faq.length) ? `            <section class="article-faq" aria-labelledby="faq-title">
              <h2 id="faq-title">ხშირად დასმული კითხვები</h2>
              <div class="faq">
                ${map(faq, ([q, a], i) => { const fid = 'pf-' + (i + 1); return `                <div class="faq__item">
                  <h3 style="margin:0">
                    <button class="faq__q" type="button" aria-expanded="false" aria-controls="${fid}">
                      <span>${e(q)}</span><span class="faq__icon" aria-hidden="true"></span>
                    </button>
                  </h3>
                  <div class="faq__a" id="${fid}" data-open="false"><div><p>${e(a)}</p></div></div>
                </div>
                `; })}              </div>
            </section>
            ` : ''}
            <aside class="article-cta">
              <p class="article-cta__eyebrow">ვებიკო</p>
              <h2>გინდათ, ეს თქვენს ბიზნესზე ერთად შევხედოთ?</h2>
              <p>უფასო კონსულტაციაზე ვნახავთ თქვენს საიტს და ერთ სამუშაო დღეში გეტყვით, საიდან ღირს დაწყება.</p>
              <div class="btn-row">
                <a class="btn btn--primary" href="/contact#booking">უფასო კონსულტაცია</a>
                <a class="btn btn--ghost-light" href="${e(svcLink[0])}">${e(svcLink[1])} →</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>

${truthy(related.length) ? `    <section class="section">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div><span class="eyebrow">კიდევ წაიკითხეთ</span><h2>მსგავსი სტატიები</h2></div>
          <a class="btn btn--ghost" href="/blog">ყველა სტატია</a>
        </div>
        <div class="post-grid" data-reveal>
          ${related.map((r) => blog.postCard(r)).join('')}        </div>
      </div>
    </section>
` : ''}` + foot();
}

module.exports = { render };
