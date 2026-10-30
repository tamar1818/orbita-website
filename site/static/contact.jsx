/** /contact — სტატიკური გვერდი (გადმოტანილია views/static/contact.html-დან) */
import { JsonLd } from '@/components/blocks';

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "კონტაქტი — ვებიკო",
    "url": "https://webico.io/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "ვებიკო",
      "email": "hello@webico.io",
      "telephone": "+995557643225",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "თბილისი",
        "addressCountry": "GE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+995557643225",
        "email": "hello@webico.io",
        "availableLanguage": [
          "ka",
          "en",
          "ru"
        ]
      }
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "მთავარი",
        "item": "https://webico.io/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "კონტაქტი"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "რამდენ ხანში მიპასუხებთ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "განაცხადებს სამუშაო დღეებში ერთ საათში ვამუშავებთ, ყველა შემთხვევაში კი პასუხს 24 საათის განმავლობაში იღებთ. შაბათ-კვირას გამოგზავნილ წერილს ორშაბათს ვპასუხობთ."
        }
      },
      {
        "@type": "Question",
        "name": "აუცილებელია ოფისში მისვლა?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "არა. შეხვედრა ონლაინაც შეიძლება, Google Meet-ით ან Zoom-ით. თუ თბილისში ხართ, სიამოვნებით მოგიწვევთ ოფისში ყავაზე."
        }
      },
      {
        "@type": "Question",
        "name": "რა ინფორმაცია მოვამზადო შეხვედრისთვის?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "საკმარისია იცოდეთ, რისი მიღწევა გსურთ. სასარგებლო იქნება არსებული საიტის მისამართი, სავარაუდო ბიუჯეტი და ვადა, მაგრამ თუ ეს ჯერ არ გაქვთ განსაზღვრული, ერთად დავგეგმავთ."
        }
      },
      {
        "@type": "Question",
        "name": "მუშაობთ თბილისის გარეთ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "დიახ. კლიენტების ნაწილი ბათუმში, ქუთაისსა და საზღვარგარეთაა. მთელი პროცესი დისტანციურად, ონლაინ შეხვედრებითა და საერთო სამუშაო სივრცით მიმდინარეობს."
        }
      }
    ]
  }
];

export const meta = {
  "title": "კონტაქტი და უფასო კონსულტაციის დაჯავშნა | Webico",
  "desc": "დაჯავშნეთ უფასო კონსულტაცია Webico-სთან: აირჩიეთ დღე და საათი, მოგვწერეთ ან დაგვირეკეთ. ვებ დეველოპმენტის სააგენტო თბილისში.",
  "url": "/contact",
  "imageAlt": "ვებიკო — ციფრული სააგენტო"
};

export default function pageContact() {
  const body = (
    <>
      {LD.map((d, i) => <JsonLd data={d} key={i} />)}
      <section className="page-hero pattern-grid">
        <div className="container">
          <div className="page-hero__inner">
            <ol className="breadcrumb">
              <li>
                <a href="/">მთავარი</a>
              </li>
              <li>
                <span aria-current="page">კონტაქტი</span>
              </li>
            </ol>
            <span className="eyebrow">კონტაქტი</span>
            <h1>მოგვიყევით თქვენს პროექტზე</h1>
            <p>დაჯავშნეთ უფასო შეხვედრა თქვენთვის სასურველ დროს, შეავსეთ ფორმა ან უბრალოდ დაგვირეკეთ. პირველი კონსულტაცია თქვენს მონაცემებს არავის გადავცემთ.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#booking">შეხვედრის დაჯავშნა</a>
              {" "}
              <a className="btn btn--ghost" href="#contact-form">ფორმის შევსება</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tight" id="booking">
        <div className="container">
          <div className="booking" data-booking="">
            <div className="booking__intro" data-reveal="">
              <span className="eyebrow eyebrow--accent">უფასო კონსულტაცია</span>
              <h2>
                დაჯავშნეთ{" "}
                <span data-booking-mins="">30</span>
                ‑წუთიანი შეხვედრა
              </h2>
              <p>აირჩიეთ დღე და საათი. ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ, მოისმენს თქვენს ამოცანას და გეტყვით, საიდან ღირს დაწყება.</p>
              <ul className="checklist">
                <li>უფასოა და არაფრად გავალდებულებთ</li>
                <li>ონლაინ (Google Meet / Zoom) ან ჩვენს ოფისში</li>
                <li>დადასტურება მოგივათ ელფოსტაზე</li>
              </ul>
            </div>
            <div className="booking__panel" data-reveal="" data-reveal-delay="80">
              <div className="booking__step" data-booking-pick="">
                <p className="booking__label">
                  <span>1</span>
                  {" "}აირჩიეთ დღე
                </p>
                <div className="booking__days-wrap">
                  <button className="booking__nav" type="button" data-booking-prev="" aria-label="წინა დღეები">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <div className="booking__days" data-booking-days="" role="group" aria-label="დღეები">
                    <p className="booking__loading">იტვირთება…</p>
                  </div>
                  <button className="booking__nav" type="button" data-booking-next="" aria-label="შემდეგი დღეები">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
                <p className="booking__label">
                  <span>2</span>
                  {" "}აირჩიეთ საათი{" "}
                  <small>თბილისის დროით</small>
                </p>
                <div className="booking__times" data-booking-times="" role="group" aria-label="თავისუფალი დრო" />
              </div>
              <form className="booking__form" data-booking-form="" hidden noValidate>
                <div className="booking__chosen">
                  <span className="booking__chosen-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  {" "}
                  <span>
                    <small>არჩეული დრო</small>
                    <b data-booking-label="" />
                  </span>
                  {" "}
                  <button className="link-arrow" type="button" data-booking-change="">შეცვლა</button>
                </div>
                <p className="booking__label">
                  <span>3</span>
                  {" "}თქვენი მონაცემები
                </p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="bk-name">
                      სახელი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="text" id="bk-name" name="name" autoComplete="name" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-phone">
                      ტელეფონი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="tel" id="bk-phone" name="phone" autoComplete="tel" placeholder="+995 5XX XX XX XX" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="bk-email">
                      ელფოსტა{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="email" id="bk-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-company">კომპანია / ვებსაიტი</label>
                    {" "}
                    <input type="text" id="bk-company" name="company" autoComplete="organization" />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="bk-topic">რაზე ვისაუბროთ?</label>
                    <select id="bk-topic" name="topic">
                      <option>საიტი გამოწერით / მოვლა</option>
                      <option>ახალი ვებსაიტი</option>
                      <option>ონლაინ მაღაზია</option>
                      <option>SEO</option>
                      <option>ციფრული მარკეტინგი</option>
                      <option>ბრენდინგი</option>
                      <option>სხვა</option>
                    </select>
                  </div>
                  <div className="field">
                    <span className="field__legend">შეხვედრის ფორმატი</span>
                    <div className="seg">
                      <label>
                        <input type="radio" name="format" value="ონლაინ" defaultChecked />
                        <span>ონლაინ</span>
                      </label>
                      {" "}
                      <label>
                        <input type="radio" name="format" value="ოფისში" />
                        <span>ოფისში</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="bk-message">დამატებითი ინფორმაცია</label>
                  <textarea id="bk-message" name="message" rows="3" placeholder="მოკლედ დაწერეთ, რა გჭირდებათ" />
                  <span className="field__error" />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="bk-hp">არ შეავსოთ</label>
                  <input type="text" id="bk-hp" name="company_website" tabIndex="-1" autoComplete="off" />
                </div>
                <button className="btn btn--primary btn--block" type="submit">შეხვედრის დაჯავშნა</button>
              </form>
              <div className="booking__done" data-booking-done="" hidden tabIndex="-1" />
              <noscript>
                <p>დაჯავშნისთვის ჩართეთ JavaScript ან დაგვირეკეთ: +995 557 64 32 25</p>
              </noscript>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div data-reveal="">
              <h2>საკონტაქტო ინფორმაცია</h2>
              <p className="muted">სამუშაო საათებში ტელეფონს მაშინვე ვპასუხობთ, წერილს კი — ერთი საათის განმავლობაში.</p>
              <div className="contact-item">
                <span className="contact-item__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                </span>
                {" "}
                <span>
                  <b>ტელეფონი</b>
                  <a href="tel:+995557643225">+995 557 64 32 25</a>
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-item__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="22 6 12 13 2 6" />
                  </svg>
                </span>
                {" "}
                <span>
                  <b>ელფოსტა</b>
                  <a href="mailto:hello@webico.io">hello@webico.io</a>
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-item__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                {" "}
                <span>
                  <b>მდებარეობა</b>
                  <span>თბილისი. ვხვდებით ონლაინ ან თქვენთან</span>
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-item__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                {" "}
                <span>
                  <b>სამუშაო საათები</b>
                  <span>ორშაბათი–პარასკევი, 10:00–19:00</span>
                </span>
              </div>
              <div className="socials">
                <a href="https://www.facebook.com/profile.php?id=61595680514356" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
                  </svg>
                </a>
                {" "}
                <a href="https://www.instagram.com/webico.io/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>
            <div data-reveal="" data-reveal-delay="90">
              <form className="lead-form" id="contact-form" data-lead-form="contact-page" method="post" action="#">
                <h3>დაგვიტოვეთ განაცხადი</h3>
                <p className="lead-form__intro">შეავსეთ ფორმა და ერთ სამუშაო დღეში მოგწერთ სავარაუდო ფასს და ვადას.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="contact-name">
                      სახელი და გვარი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="text" id="contact-name" name="name" autoComplete="name" placeholder="ნინო ბერიძე" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-company">კომპანია</label>
                    {" "}
                    <input type="text" id="contact-company" name="company" autoComplete="organization" placeholder="შპს „მაგალითი“" />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="contact-email">
                      ელფოსტა{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="email" id="contact-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-phone">
                      ტელეფონი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="tel" id="contact-phone" name="phone" autoComplete="tel" placeholder="+995 5XX XX XX XX" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="contact-service">
                      რომელი სერვისი გაინტერესებთ?{" "}
                      <span className="req">*</span>
                    </label>
                    <select id="contact-service" name="service" required>
                      <option value="">აირჩიეთ სერვისი</option>
                      <option value="web">ვებსაიტების დიზაინი და შექმნა</option>
                      <option value="seo">SEO ოპტიმიზაცია</option>
                      <option value="marketing">ციფრული მარკეტინგი</option>
                      <option value="branding">ბრენდის ვიზუალური იდენტობა</option>
                      <option value="other">სხვა / ჯერ არ ვიცი</option>
                    </select>
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-budget">სავარაუდო ბიუჯეტი</label>
                    <select id="contact-budget" name="budget">
                      <option value="">აირჩიეთ დიაპაზონი</option>
                      <option value="under-2000">2 000 ₾-მდე</option>
                      <option value="2000-5000">2 000 – 5 000 ₾</option>
                      <option value="5000-12000">5 000 – 12 000 ₾</option>
                      <option value="over-12000">12 000 ₾-ზე მეტი</option>
                      <option value="monthly">ყოველთვიური მომსახურება</option>
                    </select>
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="contact-message">
                    მოგვიყევით პროექტის შესახებ{" "}
                    <span className="req">*</span>
                  </label>
                  <textarea id="contact-message" name="message" required placeholder="მოკლედ აღწერეთ თქვენი ბიზნესი, მიზნები და სასურველი ვადები…" />
                  <span className="field__error" />
                </div>
                <label className="checkbox">
                  <input type="checkbox" name="consent" value="yes" required />
                  {" "}
                  <span>თანახმა ვარ, რომ ჩემი მონაცემები დამუშავდეს განაცხადზე პასუხის გასაცემად.</span>
                </label>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="contact-hp">არ შეავსოთ</label>
                  <input type="text" id="contact-hp" name="company_website" tabIndex="-1" autoComplete="off" />
                </div>
                <button className="btn btn--primary btn--block" type="submit">განაცხადის გაგზავნა</button>
                <p className="form-note">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>თქვენი მონაცემები დაცულია და მესამე პირს არ გადაეცემა.</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">სასარგებლო</span>
            <h2>ხშირი კითხვები</h2>
          </div>
          <div className="faq">
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="contact-a1">
                  <span>რამდენ ხანში მიპასუხებთ?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="contact-a1" data-open="false">
                <div>
                  <p>განაცხადებს სამუშაო დღეებში ერთ საათში ვამუშავებთ, ყველა შემთხვევაში კი პასუხს 24 საათის განმავლობაში იღებთ. შაბათ-კვირას გამოგზავნილ წერილს ორშაბათს ვპასუხობთ.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="contact-a2">
                  <span>აუცილებელია ოფისში მისვლა?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="contact-a2" data-open="false">
                <div>
                  <p>არა. შეხვედრა ონლაინაც შეიძლება, Google Meet-ით ან Zoom-ით. თუ თბილისში ხართ, სიამოვნებით მოგიწვევთ ოფისში ყავაზე.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="contact-a3">
                  <span>რა ინფორმაცია მოვამზადო შეხვედრისთვის?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="contact-a3" data-open="false">
                <div>
                  <p>საკმარისია იცოდეთ, რისი მიღწევა გსურთ. სასარგებლო იქნება არსებული საიტის მისამართი, სავარაუდო ბიუჯეტი და ვადა, მაგრამ თუ ეს ჯერ არ გაქვთ განსაზღვრული, ერთად დავგეგმავთ.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="contact-a4">
                  <span>მუშაობთ თბილისის გარეთ?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="contact-a4" data-open="false">
                <div>
                  <p>დიახ. კლიენტების ნაწილი ბათუმში, ქუთაისსა და საზღვარგარეთაა. მთელი პროცესი დისტანციურად, ონლაინ შეხვედრებითა და საერთო სამუშაო სივრცით მიმდინარეობს.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta cta--center">
        <div className="container">
          <div className="cta__inner" data-reveal="">
            <h2>გირჩევნიათ ტელეფონით?</h2>
            <p>დაგვირეკეთ სამუშაო საათებში. 10 წუთში გავიგებთ, რა გჭირდებათ და რით შეგვიძლია დაგეხმაროთ.</p>
            <div className="btn-row btn-row--center">
              <a className="btn btn--white" href="tel:+995557643225">+995 557 64 32 25</a>
              {" "}
              <a className="btn btn--light" href="mailto:hello@webico.io">hello@webico.io</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
