'use strict';
/** მთავარი გვერდის bento ბანერი (ქართული და ინგლისური ვერსიისთვის) */
const { e, url } = require('./core');
const { map } = require('./tpl');

const ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
const CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

/**
 * o: label, title (HTML, already escaped), text, cta [text, href], work [text, href],
 *    cases [{name, slug, shot, tag}], base ('' | '/en'), stat [num, text], doTitle, doList
 */
function bentoHero(o) {
  const [a] = o.cases;
  const card = (c, cls) => c ? `
          <a class="bento-hero__shot ${cls}" href="${o.base}/work-${e(c.slug)}">
            <img src="${e(url(c.shot))}" alt="${e(c.name)}" width="720" height="900"${cls === 'bento-hero__shot--tall' ? ' fetchpriority="high"' : ' loading="lazy"'}>
            <span class="bento-hero__over">
              <b>${e(c.name)}</b>
              <span class="bento-hero__pill">${e(c.tag)} ${CHECK}</span>
            </span>
          </a>` : '';
  return `
    <section class="bento-hero">
      <div class="container">
        <div class="bento-hero__grid">
          <div class="bento-hero__main">
            <span class="bento-hero__label"><i></i>${e(o.label)}</span>
            <h1 class="bento-hero__title">${o.title}</h1>
            <p>${e(o.text)}</p>
            <div class="btn-row">
              <a class="btn btn--primary" href="${o.cta[1]}">${e(o.cta[0])}</a>
              <a class="btn btn--ghost" href="${o.work[1]}">${e(o.work[0])}</a>
            </div>
            <a class="bento-hero__round" href="${o.work[1]}" aria-label="${e(o.work[0])}">${ARROW}</a>
          </div>
          ${card(a, 'bento-hero__shot--tall')}
          <div class="bento-hero__stat">
            <a class="bento-hero__round bento-hero__round--light" href="${o.work[1]}" aria-label="${e(o.work[0])}">${ARROW}</a>
            <b>${e(o.stat[0])}</b>
            <span>${e(o.stat[1])}</span>
          </div>
          <div class="bento-hero__do">
            <b>${e(o.doTitle)}</b>
            <ul>${map(o.doList, (x) => `<li>${CHECK}${e(x)}</li>`)}</ul>
          </div>
        </div>
      </div>
    </section>
`;
}

module.exports = { bentoHero };
