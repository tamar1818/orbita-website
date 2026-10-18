'use strict';
/** /work — ნამუშევრები */
const { e, T } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const { showcase, mock, tags, ARROW, EXT } = require('../lib/projects');
const { map, truthy, empty } = require('../lib/tpl');

function render() {
  const list = showcase();
  const items = list.map((p, i) => '{ "@type": "ListItem", "position": ' + (i + 1)
    + ', "url": "https://webico.io/work-' + encodeURIComponent(String(p.slug)) + '", "name": ' + JSON.stringify(p.name ?? '') + ' }');
  const ld = '\n  <script type="application/ld+json">\n{\n'
    + '  "@context": "https://schema.org", "@type": "ItemList", "itemListElement": [' + items.join(',') + ']\n}\n  </script>';
  return head({ title: 'ნამუშევრები — Webico', desc: 'Webico-ს პორტფოლიო: ' + list.length + ' შესრულებული ვებსაიტი.', url: '/work', ld })
    + `    <section class="page-hero pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ნამუშევრები</span></li>
          </ol>
          <span class="eyebrow">ჩვენი ნამუშევრები</span>
          <h1>${T('work.title', 'შესრულებული პროექტები')}</h1>
          <p>${T('work.text', list.length + ' ვებსაიტი ბიზნესებისთვის, ორგანიზაციებისთვის, ონლაინ მაღაზიები და სერვისები საქართველოსა და მის ფარგლებს გარეთ.')}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="work-grid">
${map(list, (p, i) => { const slug = e(p.slug ?? ''); const stack = (p.stack || []).map((x) => String(x).trim()).filter(Boolean); return `          <article class="work" data-category="web" data-reveal data-reveal-delay="${Math.min(i, 6) * 40}">
            <a class="work__cover-link" href="/work-${slug}" tabindex="-1" aria-hidden="true">
              <div class="work__cover work__cover--mock">${mock(p, '(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 600px')}</div>
            </a>
            <div class="work__body">
              <div class="work__head">
                <h3><a href="/work-${slug}">${e(p.name ?? '')}</a></h3>
                <span class="work__go" aria-hidden="true">${ARROW}</span>
              </div>
              ${truthy(!empty(p.summary)) ? `<p>${e(p.summary)}</p>` : ''}              <div class="work__meta">
                ${map(tags(p), (t) => { return `<span class="tag">${e(t)}</span>`; })}                ${truthy(!empty(p.partner)) ? `<span class="tag tag--partner">${e(p.partner)}</span>` : ''}              </div>
              ${truthy(stack) ? `                <div class="work__tools"><b>ინსტრუმენტები</b>${map(stack, (s) => { return `<span class="tag tag--tool">${e(s)}</span>`; })}</div>
              ` : ''}              <div class="work__actions">
                <a class="btn btn--primary btn--sm" href="/work-${slug}">ნახე მეტი</a>
                ${truthy(!empty(p.domain)) ? `                  <a class="work__site" href="https://${e(p.domain)}/" target="_blank" rel="noopener noreferrer">${e(p.domain)} ${EXT}</a>
                ` : ''}              </div>
            </div>
          </article>
`; })}        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render };
