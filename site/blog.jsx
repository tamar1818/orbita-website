/** /blog — სტატიების სია და /blog/<slug> — სტატია */
import { txt, slug as toSlug, url as cu, stripTags } from '@/lib/core';
import * as blog from '@/lib/blog';
import { empty } from '@/lib/tpl';
import { enPath } from '@/lib/i18n';
import { PostCard, PostCover } from '@/components/posts';
import { Faq, JsonLd, PageHero } from '@/components/blocks';
import { Facebook, LinkedIn, LinkIcon } from '@/components/icons';

export function blogIndex() {
  const all = blog.posts();
  const cats = {};
  for (const p of all) { const c = String(p.category ?? ''); if (blog.CATS[c]) cats[c] = blog.CATS[c]; }
  const [feat, ...rest] = all;
  const meta = {
    title: 'ბლოგი — რჩევები ვებსაიტებზე, SEO-სა და მარკეტინგზე | Webico',
    desc: 'პრაქტიკული სტატიები ქართული ბიზნესისთვის: როგორ გამოჩნდეთ Google-ში, როგორ დახარჯოთ რეკლამის ბიუჯეტი გონივრულად და რა უნდა იცოდეთ ახალი ვებსაიტის აწყობამდე.',
    url: '/blog',
  };
  const body = (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Blog', name: 'ვებიკოს ბლოგი', url: 'https://webico.io/blog', inLanguage: 'ka',
        publisher: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
        blogPost: all.map((p) => ({ '@type': 'BlogPosting', headline: String(p.title ?? ''), url: 'https://webico.io/blog/' + p.slug, datePublished: String(p.date ?? '') })),
      }} />
      <PageHero crumbs={[[null, 'ბლოგი']]} eyebrow="ბლოგი" title={txt('blog.title', 'რჩევები ქართული ბიზნესისთვის')}>
        <p>{txt('blog.text', 'ვწერთ იმაზე, რასაც ყოველდღე ვხედავთ: რატომ ვერ პოულობენ კლიენტები საიტს, სად „იწვება“ რეკლამის ბიუჯეტი და რა ცვლის რეალურად შედეგს. მოკლედ, გასაგებად და ქართული ბაზრის კონტექსტით.')}</p>
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          {!all.length ? (
            <div className="blog-empty">
              <h2>სტატიები მალე დაემატება</h2>
              <p>მანამდე, თუ კონკრეტული კითხვა გაქვთ, <a href="/contact">მოგვწერეთ</a>.</p>
            </div>
          ) : (
            <>
              <div className="post-feature" data-reveal=""><PostCard p={feat} big /></div>
              {rest.length ? (
                <>
                  <div className="blog-bar" data-reveal="">
                    <h2 className="blog-bar__title">ყველა სტატია</h2>
                    {Object.keys(cats).length > 1 ? (
                      <div className="filters" data-filter-group="" data-filter-noun="სტატია" role="group" aria-label="კატეგორიები">
                        <button className="filter" type="button" data-filter="all" aria-pressed="true">ყველა<span className="filter__count" /></button>
                        {Object.entries(cats).map(([k, label]) => (
                          <button className="filter" type="button" data-filter={k} aria-pressed="false" key={k}>{label}<span className="filter__count" /></button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <p className="sr-only" aria-live="polite" data-filter-status="" />
                  <div className="post-grid">
                    {rest.map((p, i) => (
                      <div className="post-grid__cell" data-category={p.category ?? ''} data-reveal="" data-reveal-delay={Math.min(i, 5) * 50} key={p.slug}><PostCard p={p} /></div>
                    ))}
                  </div>
                  <p className="blog-empty" data-filter-empty="" hidden>ამ კატეგორიაში სტატია ჯერ არ არის.</p>
                </>
              ) : null}
            </>
          )}
          <aside className="blog-ask" data-reveal="">
            <div>
              <h2>გაქვთ კითხვა, რომელზეც აქ პასუხი ვერ იპოვეთ?</h2>
              <p>მოგვწერეთ — ან პირდაპირ გიპასუხებთ, ან შემდეგ სტატიას სწორედ ამ თემაზე დავწერთ.</p>
            </div>
            <a className="btn btn--primary" href="/contact">მოგვწერეთ</a>
          </aside>
        </div>
      </section>
    </>
  );
  return { meta, body };
}

/** შიდა ბმული: სტატია → შესაბამისი სერვისის გვერდი */
const SERVICE_FOR = {
  seo: ['/service-seo', 'SEO ოპტიმიზაცია'],
  marketing: ['/service-marketing', 'ციფრული მარკეტინგი'],
  web: ['/service-web-development', 'ვებსაიტის დამზადება'],
  business: ['/service-ecommerce', 'ონლაინ მაღაზიის შექმნა'],
  branding: ['/service-branding', 'UI/UX დიზაინი და ბრენდინგი'],
};

export function post(rawSlug, lang) {
  const slug = toSlug(rawSlug);
  const p = slug ? blog.post(slug) : null;
  if (!p) return null;

  const [html, toc] = blog.postBody(String(p.body ?? ''));
  const title = String(p.title ?? '');
  const excerpt = String(p.excerpt ?? '');
  const date = String(p.date ?? '');
  const updated = String(p.updated ?? date);
  const author = String(p.author ?? '').trim() || blog.AUTHOR;
  const url = 'https://webico.io/blog/' + slug;
  const cat = p.category ?? '';
  const related = blog.posts().filter((x) => (x.slug ?? '') !== slug)
    .map((x, i) => [x, i]).sort((a, b) => (((b[0].category ?? '') === cat) - ((a[0].category ?? '') === cat)) || a[1] - b[1])
    .map((x) => x[0]).slice(0, 3);

  const text = stripTags(html).trim();
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title, description: excerpt, inLanguage: 'ka',
      datePublished: date, dateModified: updated, mainEntityOfPage: url,
      author: { '@type': 'Organization', name: author, url: 'https://webico.io/about' },
      publisher: { '@type': 'Organization', name: 'Webico', logo: { '@type': 'ImageObject', url: 'https://webico.io/assets/img/apple-touch-icon.png' } },
      articleSection: blog.cat(p),
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
  const meta = { title: title + ' | Webico', desc: excerpt, url: '/blog/' + slug, ogType: 'article' };
  if (!empty(p.cover)) {
    ld[0].image = 'https://webico.io' + cu(String(p.cover));
    Object.assign(meta, { image: cu(String(p.cover)).replace(/^\/+/, ''), imageW: 1200, imageH: 630 });
  }
  const faq = blog.postFaq(p);
  if (faq.length) {
    ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  }
  const pageUrl = lang === 'en' ? 'https://webico.io' + enPath('/blog/' + slug) : url;
  const share = encodeURIComponent(pageUrl);
  const svcLink = SERVICE_FOR[cat] || ['/services', 'ჩვენი სერვისები'];

  const body = (
    <>
      {ld.map((b, i) => <JsonLd data={b} key={i} />)}
      <article className="article">
        <header className="article-hero pattern-grid">
          <div className="container">
            <ol className="breadcrumb">
              <li><a href="/">მთავარი</a></li>
              <li><a href="/blog">ბლოგი</a></li>
              <li><span aria-current="page">{blog.cat(p)}</span></li>
            </ol>
            <a className="eyebrow" href="/blog">{blog.cat(p)}</a>
            <h1>{title}</h1>
            {excerpt !== '' ? <p className="article-hero__lead">{excerpt}</p> : null}
            <p className="article-meta">
              <span className="article-meta__author"><span className="article-meta__avatar" aria-hidden="true">W</span>{author}</span>
              <time dateTime={date}>{blog.dateKa(date)}</time>
              <span>{blog.readTime(p)} წუთი საკითხავი</span>
            </p>
          </div>
        </header>

        <div className="container">
          <div className="article-cover" data-reveal=""><PostCover p={p} size="wide" /></div>

          <div className="article-layout">
            <aside className="article-side">
              {toc.length > 1 ? (
                <nav className="toc" aria-label="სტატიის შინაარსი">
                  <p className="toc__title">შინაარსი</p>
                  <ol>{toc.map((t) => <li key={t.id}><a href={'#' + t.id}>{t.text}</a></li>)}</ol>
                </nav>
              ) : null}
              <div className="share">
                <p className="toc__title">გააზიარე</p>
                <div className="share__row">
                  <a className="share__btn" href={'https://www.facebook.com/sharer/sharer.php?u=' + share} target="_blank" rel="noopener noreferrer" aria-label="Facebook-ზე გაზიარება"><Facebook /></a>
                  <a className="share__btn" href={'https://www.linkedin.com/sharing/share-offsite/?url=' + share} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn-ზე გაზიარება"><LinkedIn /></a>
                  <button className="share__btn" type="button" data-copy-link={pageUrl} aria-label="ბმულის კოპირება"><LinkIcon /></button>
                </div>
                <p className="share__done" role="status" aria-live="polite" />
              </div>
            </aside>

            <div className="prose" data-reveal="">
              <div className="prose__body" dangerouslySetInnerHTML={{ __html: html }} />
              {faq.length ? (
                <section className="article-faq" aria-labelledby="faq-title">
                  <h2 id="faq-title">ხშირად დასმული კითხვები</h2>
                  <Faq items={faq} id="pf-" />
                </section>
              ) : null}
              <aside className="article-cta">
                <p className="article-cta__eyebrow">ვებიკო</p>
                <h2>გინდათ, ეს თქვენს ბიზნესზე ერთად შევხედოთ?</h2>
                <p>უფასო კონსულტაციაზე ვნახავთ თქვენს საიტს და ერთ სამუშაო დღეში გეტყვით, საიდან ღირს დაწყება.</p>
                <div className="btn-row">
                  <a className="btn btn--primary" href="/contact#booking">დაიწყეთ პროექტი</a>{' '}
                  <a className="btn btn--ghost-light" href={svcLink[0]}>{svcLink[1]} →</a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head section-head--split" data-reveal="">
              <div><span className="eyebrow">კიდევ წაიკითხეთ</span><h2>მსგავსი სტატიები</h2></div>
              <a className="btn btn--ghost" href="/blog">ყველა სტატია</a>
            </div>
            <div className="post-grid" data-reveal="">
              {related.map((r) => <PostCard p={r} key={r.slug} />)}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
  return { meta, body };
}
