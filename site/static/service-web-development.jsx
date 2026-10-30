/** /service-web-development — სტატიკური გვერდი (გადმოტანილია views/static/service-web-development.html-დან) */
import { ServiceWork } from '@/components/work';
import { JsonLd } from '@/components/blocks';

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "ვებსაიტების დიზაინი და შექმნა",
    "serviceType": "ვებსაიტების დიზაინი და შექმნა",
    "description": "კორპორატიული საიტები, ონლაინ მაღაზიები და ვებ-აპლიკაციები, რომლებიც სწრაფად იტვირთება და ვიზიტორს კლიენტად აქცევს.",
    "areaServed": "GE",
    "provider": {
      "@type": "Organization",
      "name": "ვებიკო",
      "url": "https://webico.io/"
    },
    "url": "https://webico.io/service-web-development"
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
        "name": "ვებსაიტების დიზაინი და შექმნა"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "რომელ პლატფორმაზე აწყობთ საიტს?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ვირჩევთ ამოცანის მიხედვით: კონტენტზე ორიენტირებული საიტებისთვის WordPress, ონლაინ მაღაზიისთვის WooCommerce, რთული ლოგიკისთვის კი Next.js-ზე დაფუძნებული ინდივიდუალური გადაწყვეტა."
        }
      },
      {
        "@type": "Question",
        "name": "შემიძლია კონტენტის დამოუკიდებლად რედაქტირება?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "დიახ. ყველა საიტი მოყვება ადმინ-პანელს, სადაც ტექსტს, ფოტოებსა და გვერდებს პროგრამირების ცოდნის გარეშე მართავთ. გადაცემისას გიტარებთ ვიდეო-ინსტრუქციას."
        }
      },
      {
        "@type": "Question",
        "name": "კონტენტი ვინ უნდა მოამზადოს?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "შეგვიძლია ჩვენ დავწეროთ. ტექსტებს ქართულ ენაზე ვწერთ SEO-ს გათვალისწინებით. თუ მზა მასალა გაქვთ, უბრალოდ დავამუშავებთ და განვათავსებთ."
        }
      },
      {
        "@type": "Question",
        "name": "რა ხდება, თუ საიტი გაფუჭდება?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "მხარდაჭერის პერიოდში ტექნიკურ ხარვეზს უფასოდ ვასწორებთ. ყოველდღიური სარეზერვო ასლების წყალობით საიტს ნებისმიერი დღის მდგომარეობაზე ვაბრუნებთ."
        }
      }
    ]
  }
];

export const meta = {
  "title": "ვებსაიტის დამზადება და დიზაინი | Webico",
  "desc": "საიტის დამზადება თბილისში: კორპორატიული საიტები, ლენდინგები და ვებ-აპლიკაციები. Webico ქმნის სწრაფ, ადაპტირებულ და SEO-ზე მორგებულ ვებსაიტებს თქვენი ბიზნესისთვის.",
  "url": "/service-web-development",
  "imageAlt": "ვებიკო — ციფრული სააგენტო"
};

export default function pageServiceWebDevelopment() {
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
                <span aria-current="page">ვებსაიტების დიზაინი და შექმნა</span>
              </li>
            </ol>
            <span className="eyebrow">ვებსაიტების დიზაინი და შექმნა</span>
            <h1>ვებსაიტის დამზადება</h1>
            <p>საიტს ნულიდან ვაწყობთ: ჯერ ვგეგმავთ, მერე ვხატავთ და ვწერთ კოდს. ყოველი პროექტი იწყება კითხვით: რა მოქმედება უნდა შეასრულოს ვიზიტორმა და რა უშლის მას ხელს?</p>
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
              <span className="stat__num" style={{ fontSize: "1.35rem" }}>3–8 კვირა</span>
              <span className="stat__label">საშუალო ვადა</span>
            </div>
            <div className="stat">
              <span className="stat__num" style={{ fontSize: "1.35rem" }}>1 900 ₾</span>
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
              <h3>კორპორატიული საიტები</h3>
              <p>კომპანიის საიტი სერვისებით, გუნდით და ნამუშევრებით.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="60">
              <h3>ონლაინ მაღაზიები</h3>
              <p>სრულფასოვანი E-commerce: კალათა, ონლაინ გადახდა, მიწოდება და საწყობის მართვა.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="120">
              <h3>სადესანტო გვერდები</h3>
              <p>ერთგვერდიანი Landing Page კამპანიებისთვის, A/B ტესტირების შესაძლებლობით.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="180">
              <h3>ვებ-აპლიკაციები</h3>
              <p>პორტალები, პირადი კაბინეტები და შიდა სისტემები ბიზნეს-პროცესებისთვის.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="240">
              <h3>ინტეგრაციები</h3>
              <p>CRM, ერთიანი ბუღალტერია, გადახდის სისტემები (TBC, BOG), SMS და ელფოსტის სერვისები.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="300">
              <h3>სისწრაფე და უსაფრთხოება</h3>
              <p>PageSpeed 90+ ქულა, SSL, სარეზერვო ასლები და დაცვა შეტევებისგან.</p>
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
              <h3>ტექნიკური დავალება</h3>
              <p>ვაანალიზებთ ბიზნესს, კონკურენტებს და ვწერთ სტრუქტურას გვერდების დონეზე.</p>
            </article>
            <article className="step" data-reveal="" data-reveal-delay="70">
              <h3>დიზაინი</h3>
              <p>პროტოტიპი, შემდეგ კი მაკეტი Figma-ში. ამტკიცებთ, სანამ კოდი დაიწერება.</p>
            </article>
            <article className="step" data-reveal="" data-reveal-delay="140">
              <h3>დეველოპმენტი</h3>
              <p>ვაწყობთ საიტს, ვავსებთ კონტენტით და ვაკეთებთ ინტეგრაციებს.</p>
            </article>
            <article className="step" data-reveal="" data-reveal-delay="210">
              <h3>ტესტირება და გაშვება</h3>
              <p>ვამოწმებთ ყველა ბრაუზერსა და მოწყობილობაზე, ვამაგრებთ ანალიტიკას და ვუშვებთ.</p>
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
                <li>ადაპტირებული საიტი კონტენტის მართვის სისტემით</li>
                <li>დომენისა და ჰოსტინგის კონფიგურაცია</li>
                <li>Google Analytics 4 და Search Console</li>
                <li>ვიდეო-ინსტრუქცია ადმინისტრირებაზე</li>
                <li>სრული კოდი და წვდომები თქვენს საკუთრებაში</li>
                <li>3–6 თვე უფასო ტექნიკური მხარდაჭერა</li>
              </ul>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
              <div className="panel panel--brand">
                <h3>ინსტრუმენტები</h3>
                <p className="muted" style={{ fontSize: ".95rem" }}>ვმუშაობთ სტანდარტულ, ფართოდ გავრცელებულ ინსტრუმენტებზე, ამიტომ პროექტი ჩვენზე მიბმული არ რჩება.</p>
                <div className="case__tags">
                  <span className="tag">WordPress</span>
                  <span className="tag">WooCommerce</span>
                  <span className="tag">Next.js</span>
                  <span className="tag">React</span>
                  <span className="tag">Figma</span>
                  <span className="tag">PHP</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">Cloudflare</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ServiceWork service="web-development" />
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
              <form className="lead-form" data-lead-form="service-web-development" method="post" action="#">
                <h3>განაცხადის ფორმა</h3>
                <p className="lead-form__intro">ველები ვარსკვლავით სავალდებულოა.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="srv-web-development-name">
                      სახელი და გვარი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="text" id="srv-web-development-name" name="name" autoComplete="name" placeholder="ნინო ბერიძე" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="srv-web-development-company">კომპანია</label>
                    {" "}
                    <input type="text" id="srv-web-development-company" name="company" autoComplete="organization" placeholder="შპს „მაგალითი“" />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="srv-web-development-email">
                      ელფოსტა{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="email" id="srv-web-development-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                  <div className="field">
                    <label htmlFor="srv-web-development-phone">
                      ტელეფონი{" "}
                      <span className="req">*</span>
                    </label>
                    {" "}
                    <input type="tel" id="srv-web-development-phone" name="phone" autoComplete="tel" placeholder="+995 5XX XX XX XX" required />
                    {" "}
                    <span className="field__error" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="srv-web-development-service">
                      რომელი სერვისი გაინტერესებთ?{" "}
                      <span className="req">*</span>
                    </label>
                    <select id="srv-web-development-service" name="service" required defaultValue="web">
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
                    <label htmlFor="srv-web-development-budget">სავარაუდო ბიუჯეტი</label>
                    <select id="srv-web-development-budget" name="budget">
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
                  <label htmlFor="srv-web-development-message">
                    მოგვიყევით პროექტის შესახებ{" "}
                    <span className="req">*</span>
                  </label>
                  <textarea id="srv-web-development-message" name="message" required placeholder="მოკლედ აღწერეთ თქვენი ბიზნესი, მიზნები და სასურველი ვადები…" />
                  <span className="field__error" />
                </div>
                <label className="checkbox">
                  <input type="checkbox" name="consent" value="yes" required />
                  {" "}
                  <span>თანახმა ვარ, რომ ჩემი მონაცემები დამუშავდეს განაცხადზე პასუხის გასაცემად.</span>
                </label>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="srv-web-development-hp">არ შეავსოთ</label>
                  <input type="text" id="srv-web-development-hp" name="company_website" tabIndex="-1" autoComplete="off" />
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
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="web-development-a1">
                  <span>რომელ პლატფორმაზე აწყობთ საიტს?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="web-development-a1" data-open="false">
                <div>
                  <p>ვირჩევთ ამოცანის მიხედვით: კონტენტზე ორიენტირებული საიტებისთვის WordPress, ონლაინ მაღაზიისთვის WooCommerce, რთული ლოგიკისთვის კი Next.js-ზე დაფუძნებული ინდივიდუალური გადაწყვეტა.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="web-development-a2">
                  <span>შემიძლია კონტენტის დამოუკიდებლად რედაქტირება?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="web-development-a2" data-open="false">
                <div>
                  <p>დიახ. ყველა საიტი მოყვება ადმინ-პანელს, სადაც ტექსტს, ფოტოებსა და გვერდებს პროგრამირების ცოდნის გარეშე მართავთ. გადაცემისას გიტარებთ ვიდეო-ინსტრუქციას.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="web-development-a3">
                  <span>კონტენტი ვინ უნდა მოამზადოს?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="web-development-a3" data-open="false">
                <div>
                  <p>შეგვიძლია ჩვენ დავწეროთ. ტექსტებს ქართულ ენაზე ვწერთ SEO-ს გათვალისწინებით. თუ მზა მასალა გაქვთ, უბრალოდ დავამუშავებთ და განვათავსებთ.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="web-development-a4">
                  <span>რა ხდება, თუ საიტი გაფუჭდება?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="web-development-a4" data-open="false">
                <div>
                  <p>მხარდაჭერის პერიოდში ტექნიკურ ხარვეზს უფასოდ ვასწორებთ. ყოველდღიური სარეზერვო ასლების წყალობით საიტს ნებისმიერი დღის მდგომარეობაზე ვაბრუნებთ.</p>
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
                <a href="/blog/vebsaitis-damzadeba-gzamkvlevi">
                  ვებსაიტის დამზადება ნაბიჯ-ნაბიჯ: რა უნდა იცოდეთ დაწყებამდე{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/blog/saitis-fasi">
                  რა ღირს საიტის დამზადება? 9 ფაქტორი, რომელიც ფასს განსაზღვრავს{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/blog/rogor-avirchiot-veb-saagento">
                  როგორ ავირჩიოთ ვებ სააგენტო: 12 კითხვა ხელშეკრულებამდე{" "}
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
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.7" y2="16.7" />
                  <line x1="8.5" y1="12.5" x2="8.5" y2="9.5" />
                  <line x1="11" y1="12.5" x2="11" y2="7.5" />
                  <line x1="13.5" y1="12.5" x2="13.5" y2="10.5" />
                </svg>
              </span>
              <h3>SEO ოპტიმიზაცია</h3>
              <p>ტექნიკური აუდიტი, საკვანძო სიტყვები და კონტენტი, რომელიც თქვენს ბიზნესს Google-ის პირველ გვერდზე გაიყვანს.</p>
              <a className="link-arrow" href="/service-seo">
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
              <form className="lead-form" data-lead-form="service-web-development-cta" method="post" action="#">
                <h3>მოგვიყევით პროექტზე</h3>
                <p className="lead-form__intro">რამდენიმე სიტყვაც საკმარისია.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field">
                  <label htmlFor="cta-web-development-name">
                    სახელი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="cta-web-development-name" name="name" autoComplete="name" placeholder="თქვენი სახელი" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="cta-web-development-email">
                    ელფოსტა{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="email" id="cta-web-development-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="cta-web-development-website">
                    ვებსაიტი ან ტელეფონი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="cta-web-development-website" name="website" placeholder="example.ge / +995 5XX XX XX XX" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="cta-web-development-hp">არ შეავსოთ</label>
                  <input type="text" id="cta-web-development-hp" name="company_website" tabIndex="-1" autoComplete="off" />
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
