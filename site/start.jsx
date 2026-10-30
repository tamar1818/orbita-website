/** /start — უფასო ნიმუშის მოთხოვნა: ბიზნესი → პაკეტი → დამატებები → დიზაინი → კონტაქტი */
import * as P from '@/lib/pricing';
import D from '@/data/start.json';
import { PageHero } from '@/components/blocks';

const { fmt } = P;
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export default function start(search) {
  const pk = P.packages();
  const ad = P.addons();
  const want = String(search.get('pkg') || '');
  const chosen = pk.some((p) => p.id === want) ? want : 'business';
  const { types: TYPES, styles: STYLES, colors: COLORS } = D;
  const wantType = String(search.get('type') || '');
  const type = has(TYPES, wantType) ? wantType : 'service';
  const conf = {
    types: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, [v[0], v[1]]])),
    packages: Object.fromEntries(pk.map((p) => [p.id, { name: p.name, setup: p.setup, month: p.month }])),
    addons: Object.fromEntries(Object.entries(ad).map(([k, v]) => [k, [v[0], v[1]]])),
  };
  const min = Math.min(...pk.map((x) => x.setup));
  const meta = {
    title: 'უფასო ნიმუში: ნახეთ თქვენი საიტი 24 საათში | Webico',
    desc: `აირჩიეთ ბიზნესი, პაკეტი და სტილი. 24 საათში გამოგიგზავნით თქვენი საიტის ნიმუშს უფასოდ. საიტი 7 დღეში, ${min} ₾-დან.`,
    url: '/start',
  };

  const body = (
    <>
      <PageHero compact crumbs={[['/plans', 'ფასები'], [null, 'უფასო ნიმუში']]} eyebrow="უფასოდ, ვალდებულების გარეშე" title="ნახეთ თქვენი საიტი 24 საათში">
        <p>ოთხ მარტივ კითხვას უპასუხეთ და ჩვენ მოვამზადებთ ნიმუშს თქვენი სახელით. თუ მოგეწონებათ, საიტი 7 დღეში გაეშვება.</p>
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <noscript><p className="cfg__noscript">ამ ფორმას JavaScript სჭირდება. <a href="/contact#booking">დაჯავშნეთ ზარი</a> და ყველაფერს ტელეფონით გავივლით.</p></noscript>
          <form className="cfg" data-cfg="" data-cfg-conf={JSON.stringify(conf)} noValidate>
            <div className="cfg__progress" aria-hidden="true"><span data-cfg-bar="" /></div>
            <p className="cfg__count" data-cfg-count="">ნაბიჯი 1 / 5</p>

            <fieldset className="cfg__step" data-step="1">
              <legend className="cfg__title">რა ბიზნესი გაქვთ?</legend>
              <div className="cfg__tiles">
                {Object.entries(TYPES).map(([k, [label]]) => (
                  <label className="tile" key={k}><input type="radio" name="type" value={k} defaultChecked={k === type} /><span>{label}</span></label>
                ))}
              </div>
              <div className="field cfg__field">
                <label htmlFor="cfg-name">ბიზნესის სახელი</label>
                <input id="cfg-name" name="business" maxLength="40" placeholder="მაგალითად: სალონი ნინო" autoComplete="organization" />
                <small className="cfg__hint">ამ სახელს ნიმუშებში დაინახავთ.</small>
              </div>
            </fieldset>

            <fieldset className="cfg__step" data-step="2" hidden>
              <legend className="cfg__title">რომელი პაკეტი გჭირდებათ?</legend>
              <p className="cfg__sub">ჯერ არაფერს იხდით. პაკეტის შეცვლა მოგვიანებითაც შეიძლება.</p>
              <div className="cfg__pkgs">
                {pk.map((p) => (
                  <label className="pkg" key={p.id}>
                    <input type="radio" name="pkg" value={p.id} defaultChecked={p.id === chosen} />
                    <span className="pkg__body">
                      <b>{p.name}</b>
                      <small>{p.who}</small>
                      <span className="pkg__price">{fmt(p.setup)} ₾ ჩართვა · {fmt(p.month)} ₾ / თვე</span>
                      <span className="pkg__items">{p.items.slice(0, 3).join(' · ')}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="cfg__step" data-step="3" hidden>
              <legend className="cfg__title">გინდათ რამე დამატებით?</legend>
              <p className="cfg__sub">არასავალდებულოა, შეგიძლიათ გამოტოვოთ.</p>
              <div className="cfg__tiles cfg__tiles--sm">
                {Object.entries(ad).map(([k, [label, pr]]) => (
                  <label className="tile tile--check" key={k}><input type="checkbox" name="addons" value={k} /><span>{label} <b>+{pr} ₾</b></span></label>
                ))}
              </div>
            </fieldset>

            <fieldset className="cfg__step" data-step="4" hidden>
              <legend className="cfg__title">რომელი სტილი მოგწონთ?</legend>
              <p className="cfg__sub">ეს მხოლოდ მიმართულებაა. საბოლოო დიზაინს თქვენს ბიზნესზე მოვარგებთ.</p>
              <div className="cfg__colors" role="radiogroup" aria-label="მთავარი ფერი">
                <span>ფერი:</span>
                {COLORS.map((c, i) => (
                  <label className="swatch" style={{ '--c': c }} key={c}><input type="radio" name="color" value={c} defaultChecked={i === 0} /><span className="sr-only">{c}</span></label>
                ))}
              </div>
              <div className="cfg__designs">
                {Object.entries(STYLES).map(([k, [label, text]]) => (
                  <label className="design" key={k}>
                    <input type="radio" name="design" value={k} defaultChecked={k === 'clean'} />
                    <span className={'design__frame design--' + k} aria-hidden="true">
                      <span className="design__bar"><i /><i /><i /></span>
                      <span className="design__nav"><b data-cfg-brand="">Webico</b><span><i /><i /><i /></span></span>
                      <span className="design__hero">
                        <span className="design__h" data-cfg-headline="" />
                        <span className="design__p" /><span className="design__p design__p--short" />
                        <span className="design__btn">დაგვიკავშირდით</span>
                      </span>
                      <span className="design__img" />
                      <span className="design__cards"><i /><i /><i /></span>
                    </span>
                    <span className="design__label"><b>{label}</b><small>{text}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="cfg__step" data-step="5" hidden>
              <legend className="cfg__title">სად გამოგიგზავნოთ ნიმუში?</legend>
              <div className="cfg__final">
                <div className="cfg__summary">
                  <ul className="cfg__list" data-cfg-summary="" />
                  <div className="cfg__bill" role="group" aria-label="გადახდის პერიოდი">
                    <label><input type="radio" name="billing" value="month" defaultChecked /><span>თვიურად</span></label>
                    <label><input type="radio" name="billing" value="year" /><span>წლიურად <em>2 თვე უფასოდ</em></span></label>
                  </div>
                  <p className="cfg__setup">ჩართვა: <b data-cfg-setup="">—</b> ₾ ერთხელ</p>
                  <p className="cfg__total"><b data-cfg-total="">—</b> <span data-cfg-unit="">₾ / თვე</span></p>
                  <p className="cfg__note" data-cfg-note="" />
                  <ul className="cfg__perks">
                    <li>ნიმუში უფასოა</li>
                    <li>გადახდა მხოლოდ მაშინ, თუ მოგეწონებათ</li>
                    <li>გაშვება 7 დღეში</li>
                  </ul>
                </div>
                <div className="cfg__contact">
                  <div className="field"><label htmlFor="cfg-person">სახელი</label><input id="cfg-person" name="name" required maxLength="120" autoComplete="name" /></div>
                  <div className="field"><label htmlFor="cfg-phone">ტელეფონი ან WhatsApp</label><input id="cfg-phone" name="phone" type="tel" required maxLength="60" autoComplete="tel" inputMode="tel" placeholder="5XX XX XX XX" /></div>
                  <div className="field"><label htmlFor="cfg-email">ელფოსტა <small>(არასავალდებულო)</small></label><input id="cfg-email" name="email" type="email" maxLength="160" autoComplete="email" /></div>
                  <div className="field"><label htmlFor="cfg-msg">რამე, რაც უნდა ვიცოდეთ <small>(არასავალდებულო)</small></label><textarea id="cfg-msg" name="message" rows="3" maxLength="2000" placeholder="მაგალითად: ლოგო მაქვს, მომწონს ასეთი საიტი…" /></div>
                  <div className="hp-field" aria-hidden="true"><label htmlFor="cfg-hp">არ შეავსოთ</label><input type="text" id="cfg-hp" name="company_website" tabIndex="-1" autoComplete="off" /></div>
                  <p className="cfg__error" data-cfg-error="" role="alert" hidden />
                  <p className="cfg__consent">გაგზავნით ეთანხმებით <a href="/terms">წესებსა და პირობებს</a> და <a href="/privacy">კონფიდენციალურობის პოლიტიკას</a>.</p>
                </div>
              </div>
            </fieldset>

            <div className="cfg__nav">
              <button className="btn btn--ghost" type="button" data-cfg-back="" hidden>უკან</button>
              <button className="btn btn--primary" type="button" data-cfg-next="">შემდეგი</button>
              <button className="btn btn--primary" type="submit" data-cfg-submit="" hidden>ნიმუშის მიღება</button>
            </div>
          </form>

          <div className="cfg cfg--done" data-cfg-done="" hidden tabIndex="-1">
            <span className="cfg__check" aria-hidden="true" />
            <h2>მივიღეთ, მადლობა!</h2>
            <p>ერთ საათში დაგიკავშირდებით, ნიმუშს კი 24 საათში გამოგიგზავნით. სამუშაო დღეებში ვმუშაობთ 10:00-დან 19:00-მდე.</p>
            <a className="btn btn--ghost" href="/work">სანამ ელოდებით, ნახეთ ჩვენი ნამუშევრები</a>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
