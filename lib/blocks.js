'use strict';
/**
 * მთავარი გვერდის ბლოკები და საერთო ფუტერი (ქართული და ინგლისური).
 * დიზაინი: მუქი hero, დიდი სტეიტმენტი, გუნდის ზოლი, ნამუშევრების bento, „ვიზრდებით ერთად“ CTA, ფერადი ფუტერი.
 */
const { e, url, setting } = require('./core');
const { map } = require('./tpl');
const { TEAM } = require('./team');

const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
const T = (lang, ka, en) => (lang === 'en' ? en : ka);
const base = (lang) => (lang === 'en' ? '/en' : '');
/** მთავარ გვერდზე ნამუშევრების bento-ს პირველი ბარათები, ამ რიგით */
/** Webico-ს სოციალური ქსელები (ფუტერი და schema sameAs) */
const SOCIAL = { instagram: 'https://www.instagram.com/webico.io/', facebook: 'https://www.facebook.com/profile.php?id=61595680514356' };
const FEATURED = ['veloria', 'anapea', 'tamaras-collect', 'bitefit', 'wine-station'];

/** გუნდის ფოტოები ჰორიზონტალურ ზოლში */
function teamStrip(lang) {
  return `
    <section class="team-strip" aria-label="${T(lang, 'გუნდი', 'Team')}">
      <div class="container">
        <div class="team-strip__row">${map(TEAM, (m, i) => {
          const [name, role] = m[lang] || m.ka;
          return `
          <a class="team-strip__item team-strip__item--${i + 1}" href="${base(lang)}/about#team">
            <img src="/assets/img/team/${m.slug}-sm.webp" alt="${e(name)}" width="560" height="700" loading="lazy" decoding="async">
            <span class="team-strip__cap"><b>${e(name)}</b><small>${e(role)}</small></span>
          </a>`;
        })}
        </div>
      </div>
    </section>
`;
}

/** ნამუშევრების bento: ერთი დიდი და ოთხი პატარა ბარათი */
function workBento(lang, shots, total, tagOf) {
  // რჩეული პროექტები წინ (პირველი დიდ ბარათში), მერე ვიდეოიანები, მერე დანარჩენი
  const rank = (w) => (FEATURED.includes(w.slug) ? FEATURED.indexOf(w.slug) : FEATURED.length + (String(w.video ?? '').trim() ? 0 : 1));
  const list = shots.map((w, i) => [w, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map((x) => x[0]).slice(0, 5);
  return `
    <section class="section work-bento" id="work">
      <div class="container">
        <div class="work-bento__head">
          <h2>${T(lang, 'შერჩეული ნამუშევრები', 'Selected work')}</h2>
          <a class="btn btn--ghost" href="${base(lang)}/work">${T(lang, 'ყველა პროექტი', 'All projects')} (${total})</a>
        </div>
        <div class="work-bento__grid">${map(list, (w, i) => `
          <a class="work-tile work-tile--${i + 1}" href="${base(lang)}/work-${e(w.slug)}">
            <span class="work-tile__img">${String(w.video ?? '').trim()
              ? `<video poster="${e(url(w.shot))}" muted loop playsinline preload="metadata" aria-label="${e(w.name)}" data-autoplay><source src="${e(url(w.video))}" type="video/mp4">${/\.mp4$/i.test(w.video) ? `<source src="${e(url(String(w.video).replace(/\.mp4$/i, '.webm')))}" type="video/webm">` : ''}</video>`
              : `<img src="${e(url(String(w.tile ?? '').trim() || w.shot))}"${String(w.tile ?? '').trim() ? ' class="is-tile"' : ''} alt="${e(w.name)}" loading="lazy" decoding="async">`}</span>
            <span class="work-tile__cap"><b>${e(w.name)}</b><small>${e(tagOf(w))}</small><i>${ARROW}</i></span>
          </a>`)}
        </div>
      </div>
    </section>
`;
}

/** „ვიზრდებით ერთად“: მუქი ბარათი ღილაკით + დიდი ფოტო */
function ctaGrow(lang) {
  return `
    <section class="grow">
      <div class="container">
        <div class="grow__box">
          <div class="grow__card">
            <svg class="grow__curl" viewBox="0 0 220 120" aria-hidden="true"><path d="M-10 40 C 40 -10, 90 10, 70 45 C 55 72, 20 60, 34 34 C 50 6, 120 0, 230 30" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>
            <h2>${T(lang, 'მოდი, ერთად გავზარდოთ თქვენი ბრენდი', "Let's grow your brand together")}</h2>
            <p>${T(lang, 'მოგვიყევით, რას აკეთებთ და რა გსურთ. ერთ სამუშაო დღეში დაგიკავშირდებით და შემდეგ ნაბიჯებს ერთად დავგეგმავთ.',
              'Tell us what you do and what you need. We reply within one business day and plan the next steps together.')}</p>
            <a class="grow__btn" href="${base(lang)}/contact">${T(lang, 'დაიწყეთ პროექტი', 'Start a project')}<i>${ARROW}</i></a>
          </div>
          <div class="grow__photo">
            <img src="/assets/img/team/office-wide.webp" srcset="/assets/img/team/office-wide-sm.webp 960w, /assets/img/team/office-wide.webp 1536w"
                 sizes="(max-width: 900px) 100vw, 60vw" alt="${T(lang, 'Webico-ს ოფისი', 'The Webico office')}" width="1536" height="1024" loading="lazy" decoding="async">
          </div>
        </div>
      </div>
    </section>
`;
}

/** საერთო ფუტერი: ფერადი ბლოკი, ნავიგაცია „აბებად“, დიდი ლოგო ქვემოთ */
function footer(lang) {
  const b = base(lang);
  const email = setting('email', 'hello@webico.io');
  const phone = setting('phone', '+995 557 64 32 25');
  const nav = lang === 'en'
    ? [['/en', 'Home'], ['/en/about', 'About'], ['/en/services', 'Services'], ['/en/work', 'Work'], ['/en/pricing', 'Pricing'], ['/en/contact', 'Contact']]
    : [['/', 'მთავარი'], ['/about', 'ჩვენ შესახებ'], ['/services', 'სერვისები'], ['/work', 'ნამუშევრები'], ['/plans', 'ფასები'], ['/blog', 'ბლოგი'], ['/contact', 'კონტაქტი']];
  const svc = lang === 'en'
    ? [['/en/web-development', 'Websites'], ['/en/ecommerce-development', 'Online stores'], ['/en/wordpress-development', 'WordPress'], ['/en/ui-ux-design', 'UI/UX & branding'], ['/en/seo', 'SEO'], ['/en/digital-marketing', 'Marketing'], ['/en/website-maintenance', 'Maintenance']]
    : [['/service-web-development', 'ვებსაიტები'], ['/service-ecommerce', 'ონლაინ მაღაზიები'], ['/service-wordpress', 'WordPress'], ['/service-branding', 'UI/UX და ბრენდინგი'], ['/service-seo', 'SEO'], ['/service-marketing', 'მარკეტინგი'], ['/service-maintenance', 'მხარდაჭერა']];
  const legal = lang === 'en'
    ? [['/en/privacy', 'Privacy policy'], ['/en/terms', 'Terms of service']]
    : [['/terms', 'წესები და პირობები'], ['/privacy', 'კონფიდენციალურობა'], ['/refund', 'გაუქმება და დაბრუნება'], ['/delivery', 'მიწოდება']];
  const pills = (list) => `<ul class="foot__pills">${map(list, ([h, t]) => `<li><a href="${h}">${e(t)}</a></li>`)}</ul>`;
  const name = lang === 'en' ? setting('legal_name_en', 'Tamar Geliashvili') : setting('legal_name', 'თამარ გელიაშვილი');
  return `<footer class="site-footer foot">
    <div class="container">
      <div class="foot__box">
        <svg class="foot__curl" viewBox="0 0 400 400" aria-hidden="true"><path d="M420 60 C 300 40, 250 160, 320 210 C 380 255, 420 170, 350 150 C 260 125, 200 300, 300 420" fill="none" stroke="currentColor" stroke-width="34" stroke-linecap="round"/></svg>
        <div class="foot__top">
          <p class="foot__claim">${T(lang, 'ვებსაიტები, რომლებიც ბრენდს ზრდის.', 'Websites that grow your brand.')}</p>
          <div class="foot__col">
            <h4>${T(lang, 'ნავიგაცია', 'Navigation')}</h4>
            ${pills(nav)}
          </div>
          <div class="foot__col">
            <h4>${T(lang, 'სერვისები', 'Services')}</h4>
            ${pills(svc)}
          </div>
          <div class="foot__col foot__contact">
            <h4>${T(lang, 'კონტაქტი', 'Contact')}</h4>
            <a href="mailto:${email}">${email}</a>
            <a href="tel:${phone.replace(/[^\d+]/g, '')}">${phone}</a>
            <span>${T(lang, 'თბილისი, საქართველო', 'Tbilisi, Georgia')}</span>
            <div class="foot__social">
              <a href="${e(SOCIAL.instagram)}" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>
              <a href="${e(SOCIAL.facebook)}" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
            </div>
            <a class="foot__start" href="${b}/contact">${T(lang, 'დაიწყეთ პროექტი', 'Start a project')} ${ARROW}</a>
          </div>
        </div>
        <a class="foot__mark" href="${b || '/'}" aria-label="Webico">
          <img src="/assets/img/logo/webico-horizontal-ink.svg" alt="Webico" width="880" height="220" loading="lazy">
        </a>
        <div class="foot__bottom">
          <span>&copy; <span id="year">2026</span> Webico. ${name}, ${T(lang, 'ს/ნ', 'ID')} ${setting('legal_id', '01024088829')}</span>
          ${pills(legal)}
          <a class="foot__lang" href="${lang === 'en' ? '/' : '/en'}" hreflang="${lang === 'en' ? 'ka' : 'en'}">${lang === 'en' ? 'ქართული' : 'English'}</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/** ყველა HTML გვერდზე ძველი ფუტერის ჩანაცვლება ახლით */
function withFooter(body) {
  if (typeof body !== 'string' || !body.includes('<footer class="site-footer') || body.includes('site-footer foot"')) return body;
  const lang = body.startsWith('<!DOCTYPE html>\n<html lang="en"') ? 'en' : 'ka';
  return body.replace(/<footer class="site-footer[^"]*">[\s\S]*?<\/footer>/, () => footer(lang));
}

module.exports = { SOCIAL, teamStrip, workBento, ctaGrow, footer, withFooter };
