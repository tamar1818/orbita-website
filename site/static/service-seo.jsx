/** /service-seo — სტატიკური გვერდი (გადმოტანილია views/static/service-seo.html-დან) */
import { ServiceWork } from '@/components/work';
import { JsonLd } from '@/components/blocks';

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "SEO ოპტიმიზაცია",
    "serviceType": "SEO ოპტიმიზაცია",
    "description": "ტექნიკური აუდიტი, საკვანძო სიტყვები და კონტენტი, რომელიც თქვენს ბიზნესს Google-ის პირველ გვერდზე გაიყვანს.",
    "areaServed": "GE",
    "provider": {
      "@type": "Organization",
      "name": "ვებიკო",
      "url": "https://webico.io/"
    },
    "url": "https://webico.io/service-seo"
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
        "name": "სერვისები",
        "item": "https://webico.io/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "SEO ოპტიმიზაცია"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "როდის ვნახავ პირველ შედეგს?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ტექნიკური გასწორებების ეფექტი 4–8 კვირაში ჩანს. საშუალო სიხშირის მოთხოვნებზე პოზიციები 2–4 თვეში იზრდება, მაღალკონკურენტულ ნიშაში კი 6 თვე და მეტია საჭირო."
        }
      },
      {
        "@type": "Question",
        "name": "გარანტიას იძლევით პირველ ადგილზე?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "არა. არც ერთი პატიოსანი სააგენტო არ მოგცემთ ასეთ გარანტიას, რადგან Google-ის ალგორითმს ვერავინ აკონტროლებს. ჩვენ ვიღებთ ვალდებულებას სამუშაოს მოცულობასა და გასაგებ ანგარიშებაზე."
        }
      },
      {
        "@type": "Question",
        "name": "რა ხდება, თუ SEO-ს შევაჩერებ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "მიღწეული პოზიციები მაშინვე არ ქრება, მაგრამ დროთა განმავლობაში კონკურენტები გასწრებენ. ოპტიმალურია მინიმუმ 6-თვიანი უწყვეტი მუშაობა."
        }
      },
      {
        "@type": "Question",
        "name": "სჭირდება თუ არა საიტს გადაკეთება?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ყოველთვის არა. აუდიტის შემდეგ გეტყვით, საკმარისია თუ არა არსებული საიტის გაუმჯობესება. გადაკეთებას მხოლოდ მაშინ ვთავაზობთ, როცა ტექნიკური ბაზა ზრდას ზღუდავს."
        }
      }
    ]
  }
];

export const meta = {
  "title": "SEO ოპტიმიზაცია და ტექნიკური SEO | Webico",
  "desc": "საიტის SEO ოპტიმიზაცია: ტექნიკური აუდიტი, საკვანძო სიტყვების კვლევა, ინდექსაცია, სტრუქტურირებული მონაცემები, Core Web Vitals და ქართულენოვანი კონტენტი. Webico, თბილისი.",
  "url": "/service-seo",
  "imageAlt": "ვებიკო — ციფრული სააგენტო"
};

export default function pageServiceSeo() {
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
                <a href="/services">სერვისები</a>
              </li>
              <li>
                <span aria-current="page">SEO ოპტიმიზაცია</span>
              </li>
            </ol>
            <span className="eyebrow">SEO ოპტიმიზაცია</span>
            <h1>SEO: გამოჩნდით Google-ში</h1>
            <p>ვმუშაობთ იმაზე, რომ თქვენი პოტენციური კლიენტი Google-ში სწორედ თქვენ გიპოვოთ, რეკლამის გარეშე. ტექნიკიდან კონტენტამდე, ყოველი ნაბიჯი მონაცემებით მტკიცდება.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#request">
                განაცხადის გაგზავნა{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              {" "}
              <a className="btn btn--ghost" href="tel:+995557643225">დარეკვა: +995 557 64 32 25</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <div className="stats" data-reveal="">
            <div className="stat">
              <span className="stat__num" style={{ fontSize: "1.35rem" }}>3–6 თვე</span>
              <span className="stat__label">საშუალო ვადა</span>
            </div>
            <div className="stat">
              <span className="stat__num" style={{ fontSize: "1.35rem" }}>1 500 ₾/თვე</span>
              <span className="stat__label">ფასი იწყება</span>
            </div>
            <div className="stat">
              <span className="stat__num" style={{ fontSize: "1.35rem" }}>24 სთ</span>
              <span className="stat__label">პასუხის დრო</span>
            </div>
            <div className="stat">
              <span className="stat__num" style={{ fontSize: "1.35rem" }}>უფასო</span>
              <span className="stat__label">პირველი კონსულტაცია</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">რას მოიცავს</span>
            <h2>რა შედის</h2>
            <p>ყველა პროექტი განსხვავებულია. აქ ჩამოვთვალეთ, რასაც ყველაზე ხშირად ვაკეთებთ.</p>
          </div>
          <div className="grid grid--3">
            <article className="card" data-reveal="" data-reveal-delay="0">
              <h3>ტექნიკური აუდიტი</h3>
              <p>200-ზე მეტი პარამეტრის შემოწმება: ინდექსაცია, სისწრაფე, სტრუქტურა, დუბლიკატები.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="60">
              <h3>საკვანძო სიტყვები</h3>
              <p>სემანტიკური ბირთვი ქართულ და ინგლისურ ენებზე, ძიების განზრახვის მიხედვით დაჯგუფებული.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="120">
              <h3>კონტენტ-დაგეგმვა</h3>
              <p>სტატიები და სერვისის გვერდები, რომლებსაც ადამიანიც კითხულობს და Google-იც აფასებს.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="180">
              <h3>ლოკალური SEO</h3>
              <p>Google Business Profile, რუკები და ადგილობრივი კატალოგები, ყველა ფილიალისთვის.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="240">
              <h3>ლინკების მოპოვება</h3>
              <p>ხარისხიანი ბმულები ქართული და საერთაშორისო რესურსებიდან, სპამის გარეშე.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="300">
              <h3>ანალიტიკა და ანგარიში</h3>
              <p>პოზიციების ყოველკვირეული მონიტორინგი და ყოველთვიური ანგარიში ცოცხალი დაფით.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">პროცესი</span>
            <h2>როგორ მიმდინარეობს მუშაობა</h2>
          </div>
          <div className="steps">
            <article className="step" data-reveal="" data-reveal-delay="0">
              <h3>აუდიტი</h3>
              <p>ვპოულობთ ტექნიკურ ხარვეზებს და ვაფასებთ, რა გიშლით ხელს ზრდაში.</p>
            </article>
            <article className="step" data-reveal="" data-reveal-delay="70">
              <h3>სემანტიკა და გეგმა</h3>
              <p>ვაგროვებთ საკვანძო სიტყვებს, ვსწავლობთ კონკურენტებს და ვწერთ 6-თვიან გეგმას.</p>
            </article>
            <article className="step" data-reveal="" data-reveal-delay="140">
              <h3>დანერგვა</h3>
              <p>ვასწორებთ ტექნიკას, ვწერთ და ვაუმჯობესებთ კონტენტს, ვაშენებთ შიდა ბმულებს.</p>
            </article>
            <article className="step" data-reveal="" data-reveal-delay="210">
              <h3>ზრდა და მონიტორინგი</h3>
              <p>ყოველთვიურად ვზომავთ შედეგს და გეგმას მონაცემების მიხედვით ვასწორებთ.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__body" data-reveal="">
              <span className="eyebrow">შედეგი</span>
              <h2>რას იღებთ პროექტის ბოლოს</h2>
              <p>ყველა მასალა და წვდომა თქვენია. ნებისმიერ დროს შეგიძლიათ სხვა გუნდს გადასცეთ.</p>
              <ul className="checklist">
                <li>სრული ტექნიკური აუდიტი რეკომენდაციებით</li>
                <li>სემანტიკური ბირთვი და გვერდების რუკა</li>
                <li>ყოველთვიური კონტენტ-გეგმა</li>
                <li>ოპტიმიზებული ტექსტები და მეტა-მონაცემები</li>
                <li>პოზიციების ცოცხალი დაფა</li>
                <li>ყოველთვიური ანგარიში და სამუშაო შეხვედრა</li>
              </ul>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
              <div className="panel panel--brand">
                <h3>ინსტრუმენტები</h3>
                <p className="muted" style={{ fontSize: ".95rem" }}>ვმუშაობთ სტანდარტულ, ფართოდ გავრცელებულ ინსტრუმენტებზე, ამიტომ პროექტი ჩვენზე მიბმული არ რჩება.</p>
                <div className="case__tags">
                  <span className="tag">Google Search Console</span>
                  <span className="tag">Google Analytics 4</span>
                  <span className="tag">Ahrefs</span>
                  <span className="tag">Screaming Frog</span>
                  <span className="tag">Looker Studio</span>
                  <span className="tag">Google Business Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ServiceWork service="seo" />
      <section className="section section--soft" id="request">
        <div className="container">
          <div className="contact-grid">
            <div data-reveal="">
              <span className="eyebrow">დაგვიკავშირდით</span>
              <h2>რა ეღირება თქვენი პროექტი?</h2>
              <p className="lead">შეავსეთ ფორმა და ერთ სამუშაო დღეში მიიღებთ საორიენტაციო ღირებულებას, ვადებსა და სამოქმედო გეგმას.</p>
              <ul className="checklist">
                <li>უფასო კონსულტაცია და აუდიტი</li>
                <li>პასუხი 24 საათის განმავლობაში</li>
                <li>ფიქსირებული ბიუჯეტი ხელშეკრულებით</li>
              </ul>
              <div className="contact-item" style={{ marginTop: "22px" }}>
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
            </div>
            <div data-reveal="" data-reveal-delay="90">
              <form className="lead-form" data-lead-form="service-seo" method="post" action="#">
                <h3>განაცხადის ფორმა</h3>
                <p className="lead-form__intro">ველები ვარსკვლავით სავალდებულოა.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="srv-seo-name">
                      სახელი და გვარი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="text" id="srv-seo-name" name="name" autoComplete="name" placeholder="ნინო ბერიძე" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="srv-seo-company">კომპანია</label>
                    {" "}
                    <input type="text" id="srv-seo-company" name="company" autoComplete="organization" placeholder="შპს „მაგალითი“" />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="srv-seo-email">
                      ელფოსტა{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="email" id="srv-seo-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="srv-seo-phone">
                      ტელეფონი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="tel" id="srv-seo-phone" name="phone" autoComplete="tel" placeholder="+995 5XX XX XX XX" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="srv-seo-service">
                      რომელი სერვისი გაინტერესებთ?{" "}
                      <span className="req">*</span>
                    </label>
                    <select id="srv-seo-service" name="service" required defaultValue="seo">
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
                    <label htmlFor="srv-seo-budget">სავარაუდო ბიუჯეტი</label>
                    <select id="srv-seo-budget" name="budget">
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
                  <label htmlFor="srv-seo-message">
                    მოგვიყევით პროექტის შესახებ{" "}
                    <span className="req">*</span>
                  </label>
                  <textarea id="srv-seo-message" name="message" required placeholder="მოკლედ აღწერეთ თქვენი ბიზნესი, მიზნები და სასურველი ვადები…" />
                  <span className="field__error" />
                </div>
                <label className="checkbox">
                  <input type="checkbox" name="consent" value="yes" required />
                  {" "}
                  <span>თანახმა ვარ, რომ ჩემი მონაცემები დამუშავდეს განაცხადზე პასუხის გასაცემად.</span>
                </label>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="srv-seo-hp">არ შეავსოთ</label>
                  <input type="text" id="srv-seo-hp" name="company_website" tabIndex="-1" autoComplete="off" />
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
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">კითხვები</span>
            <h2>ხშირი კითხვები</h2>
          </div>
          <div className="faq">
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="seo-a1">
                  <span>როდის ვნახავ პირველ შედეგს?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="seo-a1" data-open="false">
                <div>
                  <p>ტექნიკური გასწორებების ეფექტი 4–8 კვირაში ჩანს. საშუალო სიხშირის მოთხოვნებზე პოზიციები 2–4 თვეში იზრდება, მაღალკონკურენტულ ნიშაში კი 6 თვე და მეტია საჭირო.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="seo-a2">
                  <span>გარანტიას იძლევით პირველ ადგილზე?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="seo-a2" data-open="false">
                <div>
                  <p>არა. არც ერთი პატიოსანი სააგენტო არ მოგცემთ ასეთ გარანტიას, რადგან Google-ის ალგორითმს ვერავინ აკონტროლებს. ჩვენ ვიღებთ ვალდებულებას სამუშაოს მოცულობასა და გასაგებ ანგარიშებაზე.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="seo-a3">
                  <span>რა ხდება, თუ SEO-ს შევაჩერებ?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="seo-a3" data-open="false">
                <div>
                  <p>მიღწეული პოზიციები მაშინვე არ ქრება, მაგრამ დროთა განმავლობაში კონკურენტები გასწრებენ. ოპტიმალურია მინიმუმ 6-თვიანი უწყვეტი მუშაობა.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="seo-a4">
                  <span>სჭირდება თუ არა საიტს გადაკეთება?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="seo-a4" data-open="false">
                <div>
                  <p>ყოველთვის არა. აუდიტის შემდეგ გეტყვით, საკმარისია თუ არა არსებული საიტის გაუმჯობესება. გადაკეთებას მხოლოდ მაშინ ვთავაზობთ, როცა ტექნიკური ბაზა ზრდას ზღუდავს.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <div className="read-more" data-reveal="">
            <h2>სასარგებლო სტატიები</h2>
            <ul>
              <li>
                <a href="/blog/seo-saagento">
                  SEO სააგენტო: რას აკეთებს და როდის ჩანს შედეგი{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/blog/qartulad-tu-latinurad">
                  ქართულად თუ ლათინურად? როგორ ეძებენ ქართველები Google-ში{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/blog/google-maps-business-profile">
                  როგორ გამოჩნდეთ Google Maps-ზე: Google Business Profile{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">სხვა სერვისები</span>
            <h2>კიდევ რაში დაგეხმარებით</h2>
          </div>
          <div className="grid grid--3">
            <article className="card card--link" data-reveal="" data-reveal-delay="0">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="13" y1="4" x2="11" y2="20" />
                </svg>
              </span>
              <h3>ვებსაიტების დიზაინი და შექმნა</h3>
              <p>კორპორატიული საიტები, ონლაინ მაღაზიები და ვებ-აპლიკაციები, რომლებიც სწრაფად იტვირთება და ვიზიტორს კლიენტად აქცევს.</p>
              <a className="link-arrow" href="/service-web-development">
                დეტალურად{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </article>
            <article className="card card--link" data-reveal="" data-reveal-delay="70">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </span>
              <h3>ციფრული მარკეტინგი</h3>
              <p>რეკლამა Google-ში, Facebook-ზე, Instagram-ზე და TikTok-ზე. ყოველთვე ხედავთ, რა მოიტანა.</p>
              <a className="link-arrow" href="/service-marketing">
                დეტალურად{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </article>
            <article className="card card--link" data-reveal="" data-reveal-delay="140">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              <h3>ბრენდის ვიზუალური იდენტობა</h3>
              <p>ლოგო, ბრენდბუქი და ინტერფეისის დიზაინი, რომელიც ნდობას აჩენს და კონკურენტებისგან გამოგარჩევთ.</p>
              <a className="link-arrow" href="/service-branding">
                დეტალურად{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </article>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <div className="cta__inner">
            <div data-reveal="">
              <h2>განვიხილოთ თქვენი პროექტი</h2>
              <p>მოგვწერეთ და უსასყიდლოდ შევაფასებთ თქვენს ამოცანას: რა არის საჭირო, რა თანმიმდევრობით და რა ბიუჯეტში ჯდება.</p>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--white" href="tel:+995557643225">დარეკეთ: +995 557 64 32 25</a>
                {" "}
                <a className="btn btn--light" href="mailto:hello@webico.io">hello@webico.io</a>
              </div>
            </div>
            <div data-reveal="" data-reveal-delay="90">
              <form className="lead-form" data-lead-form="service-seo-cta" method="post" action="#">
                <h3>მოგვიყევით პროექტზე</h3>
                <p className="lead-form__intro">რამდენიმე სიტყვაც საკმარისია.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field">
                  <label htmlFor="cta-seo-name">
                    სახელი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="cta-seo-name" name="name" autoComplete="name" placeholder="თქვენი სახელი" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="cta-seo-email">
                    ელფოსტა{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="email" id="cta-seo-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="cta-seo-website">
                    ვებსაიტი ან ტელეფონი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="cta-seo-website" name="website" placeholder="example.ge / +995 5XX XX XX XX" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="cta-seo-hp">არ შეავსოთ</label>
                  <input type="text" id="cta-seo-hp" name="company_website" tabIndex="-1" autoComplete="off" />
                </div>
                <button className="btn btn--primary btn--block" type="submit">გაგზავნა</button>
                <p className="form-note">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>თქვენს მონაცემებს არავის გადავცემთ.</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
