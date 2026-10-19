'use strict';
/** მთავარი გვერდის ბანერი: ნამუშევრების კედელი (ქართული და ინგლისური ვერსიისთვის) */
const { e, url } = require('./core');
const { map } = require('./tpl');

const shotUrl = (c) => e(url(c.shot));

/**
 * მუქი ბანერი, უკან მოძრავი ნამუშევრებით.
 * o: title (HTML), text, cta [text, href], work [text, href], wall [{shot}]
 */
function heroWall(o) {
  const cols = [0, 1, 2, 3].map((k) => o.wall.filter((_, i) => i % 4 === k));
  return `
    <section class="hx-b">
      <div class="hx-b__wall" aria-hidden="true">${map(cols, (col, k) => `
        <div class="hx-b__col hx-b__col--${k % 2 ? 'down' : 'up'}"><div class="hx-b__track">${map(col.concat(col), (c) => `<img src="${shotUrl(c)}" alt="" loading="lazy" width="480" height="320">`)}</div></div>`)}
      </div>
      <div class="hx-b__inner">
        <h1 class="hx-b__title">${o.title}</h1>
        <div class="hx-b__aside">
          <p>${e(o.text)}</p>
          <div class="btn-row">
            <a class="btn btn--white" href="${o.cta[1]}">${e(o.cta[0])}</a>
            <a class="btn btn--outline-light" href="${o.work[1]}">${e(o.work[0])}</a>
          </div>
        </div>
        ${o.tags ? `<ul class="hx-b__tags">${map(o.tags, (t) => `<li>${e(t)}</li>`)}</ul>` : ''}
      </div>
    </section>
`;
}

/** ბანერის ქვეშ: პლატფორმები, რომლებზეც ვმუშაობთ (მკრთალი ლოგოები, ნელა მოძრაობს) */
const STACK = [
  ['WordPress', 'wordpress'], ['WooCommerce', 'woocommerce'], ['Shopify', 'shopify'], ['Webflow', 'webflow'],
  ['Flitt', ''], ['Stripe', 'stripe'], ['Next.js', 'nextjs'], ['React', 'react'], ['Laravel', 'laravel'],
  ['Figma', 'figma'], ['Vercel', 'vercel'], ['AWS', 'aws'], ['Cloudflare', 'cloudflare'],
  ['Google Ads', 'googleads'], ['Meta', 'meta'], ['Lovable', 'lovable'],
];

function stackStrip(label) {
  const items = STACK.map(([name, icon]) => `<li>${icon ? `<img src="/assets/img/tech/${icon}.svg" alt="" width="22" height="22" loading="lazy">` : '<i class="stack__mark" aria-hidden="true">f</i>'}<span>${e(name)}</span></li>`).join('');
  return `
    <section class="stack" aria-label="${e(label)}">
      <div class="stack__viewport">
        <ul class="stack__track">${items}</ul>
        <ul class="stack__track" aria-hidden="true">${items}</ul>
      </div>
    </section>
`;
}

module.exports = { heroWall, stackStrip };
