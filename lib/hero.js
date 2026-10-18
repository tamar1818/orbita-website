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
      <div class="hx-b__inner container">
        <h1 class="hx-b__title">${o.title}</h1>
        <p>${e(o.text)}</p>
        <div class="btn-row">
          <a class="btn btn--white" href="${o.cta[1]}">${e(o.cta[0])}</a>
          <a class="btn btn--outline-light" href="${o.work[1]}">${e(o.work[0])}</a>
        </div>
      </div>
    </section>
`;
}

module.exports = { heroWall };
