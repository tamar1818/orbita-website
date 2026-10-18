'use strict';
/** /start — უფასო ნიმუშის მოთხოვნა: ბიზნესი → პაკეტი → დამატებები → დიზაინი → კონტაქტი */
const { e } = require('../lib/core');
const { head, foot } = require('../lib/layout');
const { map } = require('../lib/tpl');
const P = require('../lib/pricing');
const D = require('../data/start.json');

const { fmt } = P;

function render(req) {
  const pk = P.packages();
  const ad = P.addons();
  const want = String((req && req.query && req.query.pkg) || '');
  const chosen = pk.some((p) => p.id === want) ? want : 'business';
  const { types: TYPES, styles: STYLES, colors: COLORS } = D;
  const conf = {
    types: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, [v[0], v[1]]])),
    packages: Object.fromEntries(pk.map((p) => [p.id, { name: p.name, setup: p.setup, month: p.month }])),
    addons: Object.fromEntries(Object.entries(ad).map(([k, v]) => [k, [v[0], v[1]]])),
  };
  const min = Math.min(...pk.map((x) => x.setup));

  return head({
    title: `უფასო ნიმუში: ნახეთ თქვენი საიტი 24 საათში | Webico`,
    desc: `აირჩიეთ ბიზნესი, პაკეტი და სტილი. 24 საათში გამოგიგზავნით თქვენი საიტის ნიმუშს უფასოდ. საიტი 7 დღეში, ${min} ₾-დან.`,
    url: '/start',
  }) + `
    <section class="page-hero page-hero--compact pattern-grid">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/plans">ფასები</a></li>
            <li><span aria-current="page">უფასო ნიმუში</span></li>
          </ol>
          <span class="eyebrow">უფასოდ, ვალდებულების გარეშე</span>
          <h1>ნახეთ თქვენი საიტი 24 საათში</h1>
          <p>ოთხ მარტივ კითხვას უპასუხეთ და ჩვენ მოვამზადებთ ნიმუშს თქვენი სახელით. თუ მოგეწონებათ, საიტი 7 დღეში გაეშვება.</p>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <noscript><p class="cfg__noscript">ამ ფორმას JavaScript სჭირდება. <a href="/contact#booking">დაჯავშნეთ ზარი</a> და ყველაფერს ტელეფონით გავივლით.</p></noscript>
        <form class="cfg" data-cfg data-cfg-conf='${e(JSON.stringify(conf))}' novalidate>
          <div class="cfg__progress" aria-hidden="true"><span data-cfg-bar></span></div>
          <p class="cfg__count" data-cfg-count>ნაბიჯი 1 / 5</p>

          <fieldset class="cfg__step" data-step="1">
            <legend class="cfg__title">რა ბიზნესი გაქვთ?</legend>
            <div class="cfg__tiles">
              ${map(Object.entries(TYPES), ([k, [label]]) => `<label class="tile"><input type="radio" name="type" value="${k}"${k === 'service' ? ' checked' : ''}><span>${e(label)}</span></label>`)}
            </div>
            <div class="field cfg__field">
              <label for="cfg-name">ბიზნესის სახელი</label>
              <input id="cfg-name" name="business" maxlength="40" placeholder="მაგალითად: სალონი ნინო" autocomplete="organization">
              <small class="cfg__hint">ამ სახელს ნიმუშებში დაინახავთ.</small>
            </div>
          </fieldset>

          <fieldset class="cfg__step" data-step="2" hidden>
            <legend class="cfg__title">რომელი პაკეტი გჭირდებათ?</legend>
            <p class="cfg__sub">ჯერ არაფერს იხდით. პაკეტის შეცვლა მოგვიანებითაც შეიძლება.</p>
            <div class="cfg__pkgs">
              ${map(pk, (p) => `<label class="pkg">
                <input type="radio" name="pkg" value="${p.id}"${p.id === chosen ? ' checked' : ''}>
                <span class="pkg__body">
                  <b>${e(p.name)}</b>
                  <small>${e(p.who)}</small>
                  <span class="pkg__price">${fmt(p.setup)} ₾ ჩართვა · ${fmt(p.month)} ₾ / თვე</span>
                  <span class="pkg__items">${e(p.items.slice(0, 3).join(' · '))}</span>
                </span>
              </label>`)}
            </div>
          </fieldset>

          <fieldset class="cfg__step" data-step="3" hidden>
            <legend class="cfg__title">გინდათ რამე დამატებით?</legend>
            <p class="cfg__sub">არასავალდებულოა, შეგიძლიათ გამოტოვოთ.</p>
            <div class="cfg__tiles cfg__tiles--sm">
              ${map(Object.entries(ad), ([k, [label, pr]]) => `<label class="tile tile--check"><input type="checkbox" name="addons" value="${k}"><span>${e(label)} <b>+${pr} ₾</b></span></label>`)}
            </div>
          </fieldset>

          <fieldset class="cfg__step" data-step="4" hidden>
            <legend class="cfg__title">რომელი სტილი მოგწონთ?</legend>
            <p class="cfg__sub">ეს მხოლოდ მიმართულებაა. საბოლოო დიზაინს თქვენს ბიზნესზე მოვარგებთ.</p>
            <div class="cfg__colors" role="radiogroup" aria-label="მთავარი ფერი">
              <span>ფერი:</span>
              ${map(COLORS, (c, i) => `<label class="swatch" style="--c:${c}"><input type="radio" name="color" value="${c}"${i === 0 ? ' checked' : ''}><span class="sr-only">${c}</span></label>`)}
            </div>
            <div class="cfg__designs">
              ${map(Object.entries(STYLES), ([k, [label, txt]]) => `<label class="design">
                <input type="radio" name="design" value="${k}"${k === 'clean' ? ' checked' : ''}>
                <span class="design__frame design--${k}" aria-hidden="true">
                  <span class="design__bar"><i></i><i></i><i></i></span>
                  <span class="design__nav"><b data-cfg-brand>Webico</b><span><i></i><i></i><i></i></span></span>
                  <span class="design__hero">
                    <span class="design__h" data-cfg-headline></span>
                    <span class="design__p"></span><span class="design__p design__p--short"></span>
                    <span class="design__btn">დაგვიკავშირდით</span>
                  </span>
                  <span class="design__img"></span>
                  <span class="design__cards"><i></i><i></i><i></i></span>
                </span>
                <span class="design__label"><b>${e(label)}</b><small>${e(txt)}</small></span>
              </label>`)}
            </div>
          </fieldset>

          <fieldset class="cfg__step" data-step="5" hidden>
            <legend class="cfg__title">სად გამოგიგზავნოთ ნიმუში?</legend>
            <div class="cfg__final">
              <div class="cfg__summary">
                <ul class="cfg__list" data-cfg-summary></ul>
                <div class="cfg__bill" role="group" aria-label="გადახდის პერიოდი">
                  <label><input type="radio" name="billing" value="month" checked><span>თვიურად</span></label>
                  <label><input type="radio" name="billing" value="year"><span>წლიურად <em>2 თვე უფასოდ</em></span></label>
                </div>
                <p class="cfg__setup">ჩართვა: <b data-cfg-setup>—</b> ₾ ერთხელ</p>
                <p class="cfg__total"><b data-cfg-total>—</b> <span data-cfg-unit>₾ / თვე</span></p>
                <p class="cfg__note" data-cfg-note></p>
                <ul class="cfg__perks">
                  <li>ნიმუში უფასოა</li>
                  <li>გადახდა მხოლოდ მაშინ, თუ მოგეწონებათ</li>
                  <li>გაშვება 7 დღეში</li>
                </ul>
              </div>
              <div class="cfg__contact">
                <div class="field"><label for="cfg-person">სახელი</label><input id="cfg-person" name="name" required maxlength="120" autocomplete="name"></div>
                <div class="field"><label for="cfg-phone">ტელეფონი ან WhatsApp</label><input id="cfg-phone" name="phone" type="tel" required maxlength="60" autocomplete="tel" inputmode="tel" placeholder="5XX XX XX XX"></div>
                <div class="field"><label for="cfg-email">ელფოსტა <small>(არასავალდებულო)</small></label><input id="cfg-email" name="email" type="email" maxlength="160" autocomplete="email"></div>
                <div class="field"><label for="cfg-msg">რამე, რაც უნდა ვიცოდეთ <small>(არასავალდებულო)</small></label><textarea id="cfg-msg" name="message" rows="3" maxlength="2000" placeholder="მაგალითად: ლოგო მაქვს, მომწონს ასეთი საიტი…"></textarea></div>
                <div class="hp-field" aria-hidden="true"><label for="cfg-hp">არ შეავსოთ</label><input type="text" id="cfg-hp" name="company_website" tabindex="-1" autocomplete="off"></div>
                <p class="cfg__error" data-cfg-error role="alert" hidden></p>
                <p class="cfg__consent">გაგზავნით ეთანხმებით <a href="/terms">წესებსა და პირობებს</a> და <a href="/privacy">კონფიდენციალურობის პოლიტიკას</a>.</p>
              </div>
            </div>
          </fieldset>

          <div class="cfg__nav">
            <button class="btn btn--ghost" type="button" data-cfg-back hidden>უკან</button>
            <button class="btn btn--primary" type="button" data-cfg-next>შემდეგი</button>
            <button class="btn btn--primary" type="submit" data-cfg-submit hidden>ნიმუშის მიღება</button>
          </div>
        </form>

        <div class="cfg cfg--done" data-cfg-done hidden tabindex="-1">
          <span class="cfg__check" aria-hidden="true"></span>
          <h2>მივიღეთ, მადლობა!</h2>
          <p>ერთ საათში დაგიკავშირდებით, ნიმუშს კი 24 საათში გამოგიგზავნით. სამუშაო დღეებში ვმუშაობთ 10:00-დან 19:00-მდე.</p>
          <a class="btn btn--ghost" href="/work">სანამ ელოდებით, ნახეთ ჩვენი ნამუშევრები</a>
        </div>
      </div>
    </section>
` + foot();
}

module.exports = { render };
