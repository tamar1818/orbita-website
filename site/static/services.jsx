/** /services — სტატიკური გვერდი (გადმოტანილია views/static/services.html-დან) */
import { JsonLd } from '@/components/blocks';

const LD = [
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
        "name": "სერვისები"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "როგორ ირჩევს კომპანია საჭირო სერვისს?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "პირველ შეხვედრაზე ვაანალიზებთ თქვენს არსებულ მდგომარეობას და მიზნებს. თუ საიტი კარგია, მაგრამ ვიზიტორი არ არის, ვიწყებთ SEO-თი და რეკლამით. თუ ტრაფიკია, კონვერსია კი დაბალი, ვიწყებთ UX-ითა და საიტის გაუმჯობესებით."
        }
      },
      {
        "@type": "Question",
        "name": "შეიძლება მხოლოდ ერთი სერვისის შეკვეთა?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "რა თქმა უნდა. ბევრი კლიენტი მხოლოდ საიტით ან მხოლოდ SEO-თი იწყებს. კომპლექსური პაკეტი უფრო ეფექტურია, მაგრამ სავალდებულო არასდროსაა."
        }
      },
      {
        "@type": "Question",
        "name": "რა ღირს ყოველთვიური მომსახურება?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SEO და რეკლამის მართვა იწყება 1 500 ₾-დან თვეში. საბოლოო თანხა დამოკიდებულია ნიშაზე, კონკურენციასა და სამუშაოს მოცულობაზე. ზუსტ შეთავაზებას აუდიტის შემდეგ მიიღებთ."
        }
      },
      {
        "@type": "Question",
        "name": "რეკლამის ბიუჯეტი ცალკე იხდება?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "დიახ. სარეკლამო ბიუჯეტს პირდაპირ Google-სა და Meta-ს უხდით თქვენივე ანგარიშიდან. ჩვენ მხოლოდ მართვის საფასურს ვიღებთ. ასე სრულად ხედავთ, რაში იხარჯება თანხა."
        }
      },
      {
        "@type": "Question",
        "name": "რა მოხდება პროექტის დასრულების შემდეგ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "საიტს გადმოგცემთ სრული დოკუმენტაციითა და ვიდეო-ინსტრუქციით. პირველი 3 თვე ტექნიკური მხარდაჭერა უფასოა, შემდეგ კი ხელმისაწვდომია ყოველთვიური პაკეტი."
        }
      }
    ]
  }
];

export const meta = {
  "title": "ვებ დიზაინისა და დეველოპმენტის სერვისები | Webico",
  "desc": "ვებსაიტების დამზადება, SEO ოპტიმიზაცია, Google Ads და სოციალური მედიის მართვა. გაეცანით სერვისებს, პაკეტებსა და საორიენტაციო ფასებს.",
  "url": "/services",
  "imageAlt": "ვებიკო — ციფრული სააგენტო"
};

export default function pageServices() {
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
                <span aria-current="page">სერვისები</span>
              </li>
            </ol>
            <span className="eyebrow">სერვისები</span>
            <h1>საიტი, SEO, რეკლამა და დიზაინი</h1>
            <p>შეგიძლიათ ერთით დაიწყოთ, მაგალითად საიტით, და დანარჩენი მერე დაამატოთ.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/contact">
                დაიწყეთ პროექტი{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              {" "}
              <a className="btn btn--ghost" href="#pricing">ფასების ნახვა</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="feature-row" id="web-development">
            <div className="feature-row__body" data-reveal="">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="13" y1="4" x2="11" y2="20" />
                </svg>
              </span>
              <h2>ვებსაიტების დიზაინი და შექმნა</h2>
              <p>კორპორატიული საიტები, ონლაინ მაღაზიები და ვებ-აპლიკაციები, რომლებიც სწრაფად იტვირთება და ვიზიტორს კლიენტად აქცევს.</p>
              <ul className="checklist">
                <li>კორპორატიული და სავიზიტო საიტები</li>
                <li>ონლაინ მაღაზიები (E-commerce)</li>
                <li>ვებ-აპლიკაციები და პორტალები</li>
                <li>ტექნიკური მხარდაჭერა</li>
              </ul>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--primary" href="/service-web-development">
                  სერვისის დეტალები{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--ghost" href="/contact?service=web">ფასის გაგება</a>
              </div>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
              <div className="panel">
                <div className="mock__row">
                  <span>
                    <b>საშუალო ვადა</b>
                  </span>
                  <span className="mock__pill mock__pill--brand">3–8 კვირა</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>ფასი იწყება</b>
                  </span>
                  <span className="mock__pill">1 900 ₾</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>შესაფერისია</b>
                    <br />
                    <small>მცირე და საშუალო ბიზნესი, ონლაინ მაღაზიები</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-row feature-row--flip" id="seo">
            <div className="feature-row__body" data-reveal="">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.7" y2="16.7" />
                  <line x1="8.5" y1="12.5" x2="8.5" y2="9.5" />
                  <line x1="11" y1="12.5" x2="11" y2="7.5" />
                  <line x1="13.5" y1="12.5" x2="13.5" y2="10.5" />
                </svg>
              </span>
              <h2>SEO ოპტიმიზაცია</h2>
              <p>ტექნიკური აუდიტი, საკვანძო სიტყვები და კონტენტი, რომელიც თქვენს ბიზნესს Google-ის პირველ გვერდზე გაიყვანს.</p>
              <ul className="checklist">
                <li>ტექნიკური SEO აუდიტი</li>
                <li>საკვანძო სიტყვების კვლევა</li>
                <li>კონტენტ-სტრატეგია ქართულ ენაზე</li>
                <li>ლინკების მოპოვება</li>
              </ul>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--primary" href="/service-seo">
                  სერვისის დეტალები{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--ghost" href="/contact?service=seo">ფასის გაგება</a>
              </div>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
              <div className="panel">
                <div className="mock__row">
                  <span>
                    <b>საშუალო ვადა</b>
                  </span>
                  <span className="mock__pill mock__pill--brand">3–6 თვე</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>ფასი იწყება</b>
                  </span>
                  <span className="mock__pill">1 500 ₾/თვე</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>შესაფერისია</b>
                    <br />
                    <small>კომპანიები, რომლებსაც ორგანული ნაკადი სჭირდებათ</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-row" id="marketing">
            <div className="feature-row__body" data-reveal="">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </span>
              <h2>ციფრული მარკეტინგი</h2>
              <p>რეკლამა Google-ში, Facebook-ზე, Instagram-ზე და TikTok-ზე. ყოველთვე ხედავთ, რა მოიტანა.</p>
              <ul className="checklist">
                <li>Google Ads და Performance Max</li>
                <li>Facebook და Instagram რეკლამა</li>
                <li>სოციალური მედიის მართვა</li>
                <li>ელფოსტის მარკეტინგი</li>
              </ul>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--primary" href="/service-marketing">
                  სერვისის დეტალები{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--ghost" href="/contact?service=marketing">ფასის გაგება</a>
              </div>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
              <div className="panel">
                <div className="mock__row">
                  <span>
                    <b>საშუალო ვადა</b>
                  </span>
                  <span className="mock__pill mock__pill--brand">2 კვირა გაშვებამდე</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>ფასი იწყება</b>
                  </span>
                  <span className="mock__pill">1 200 ₾/თვე</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>შესაფერისია</b>
                    <br />
                    <small>ბიზნესი, რომელსაც ლიდები სწრაფად სჭირდება</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-row feature-row--flip" id="branding">
            <div className="feature-row__body" data-reveal="">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              <h2>ბრენდის ვიზუალური იდენტობა</h2>
              <p>ლოგო, ბრენდბუქი და ინტერფეისის დიზაინი, რომელიც ნდობას აჩენს და კონკურენტებისგან გამოგარჩევთ.</p>
              <ul className="checklist">
                <li>ლოგო და ფირმის სტილი</li>
                <li>ბრენდბუქი და გაიდლაინები</li>
                <li>UI/UX დიზაინი და პროტოტიპი</li>
                <li>პრეზენტაციები და ბანერები</li>
              </ul>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--primary" href="/service-branding">
                  სერვისის დეტალები{" "}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                {" "}
                <a className="btn btn--ghost" href="/contact?service=branding">ფასის გაგება</a>
              </div>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
              <div className="panel">
                <div className="mock__row">
                  <span>
                    <b>საშუალო ვადა</b>
                  </span>
                  <span className="mock__pill mock__pill--brand">2–5 კვირა</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>ფასი იწყება</b>
                  </span>
                  <span className="mock__pill">2 400 ₾</span>
                </div>
                <div className="mock__row">
                  <span>
                    <b>შესაფერისია</b>
                    <br />
                    <small>ახალი ბრენდები და რებრენდინგის ეტაპზე მყოფი კომპანიები</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">კიდევ</span>
            <h2>WordPress, ონლაინ მაღაზიები და მხარდაჭერა</h2>
          </div>
          <div className="grid grid--3">
            <article className="card card--link" data-reveal="">
              <h3>WordPress დეველოპმენტი</h3>
              <p>საკუთარი თემები, Elementor, ACF და მრავალენოვანი საიტები. ტექსტებს თვითონ შეცვლით.</p>
              <a className="link-arrow" href="/service-wordpress">
                დეტალურად{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span className="sr-only">{" "}— WordPress დეველოპმენტი</span>
              </a>
            </article>
            <article className="card card--link" data-reveal="">
              <h3>ონლაინ მაღაზიის შექმნა</h3>
              <p>WooCommerce და Shopify მაღაზიები ქართული ბანკების გადახდით, მიწოდებითა და მოსახერხებელი კალათით.</p>
              <a className="link-arrow" href="/service-ecommerce">
                დეტალურად{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span className="sr-only">{" "}— ონლაინ მაღაზიის შექმნა</span>
              </a>
            </article>
            <article className="card card--link" data-reveal="">
              <h3>საიტის ტექნიკური მხარდაჭერა</h3>
              <p>განახლებები, უსაფრთხოება, სარეზერვო ასლები და მცირე ცვლილებები ყოველთვიური მომსახურებით.</p>
              <a className="link-arrow" href="/service-maintenance">
                დეტალურად{" "}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span className="sr-only">{" "}— საიტის ტექნიკური მხარდაჭერა</span>
              </a>
            </article>
          </div>
        </div>
      </section>
      <section className="section section--soft" id="pricing">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">ინდივიდუალური პროექტები</span>
            <h2>რა ღირს უფრო დიდი პროექტი</h2>
            <p>
              მცირე ბიზნესის მზა პაკეტები{" "}
              <a href="/plans">ფასების გვერდზეა</a>
              . აქ საორიენტაციო ფასებია ინდივიდუალური პროექტებისთვის. ზუსტ ფასს შეხვედრის შემდეგ გეტყვით.
            </p>
          </div>
          <div className="grid grid--3">
            <article className="price" data-reveal="" data-reveal-delay="0">
              <h3>ინდივიდუალური საიტი</h3>
              <p className="price__desc">საკუთარი დიზაინით, თუ მზა პაკეტი არ გყოფნით.</p>
              <p className="price__amount">
                <b>1 900</b>
                <span>₾-დან</span>
              </p>
              <p className="price__note">ერთჯერადი გადახდა</p>
              <ul className="card__list">
                <li>5-გვერდიანი სავიზიტო საიტი</li>
                <li>მობილურზე ადაპტირებული დიზაინი</li>
                <li>საბაზისო SEO და Google Analytics</li>
                <li>საკონტაქტო ფორმა</li>
                <li>3 თვე უფასო მხარდაჭერა</li>
              </ul>
              <a className="btn btn--ghost btn--block" href="/contact">შეთავაზების მიღება</a>
            </article>
            <article className="price price--featured" data-reveal="" data-reveal-delay="80">
              <span className="price__badge">ხშირად ირჩევენ</span>
              <h3>დიდი საიტი ან მაღაზია</h3>
              <p className="price__desc">მზარდი კომპანიისთვის, მეტი გვერდით და ინტეგრაციებით.</p>
              <p className="price__amount">
                <b>3 900</b>
                <span>₾-დან</span>
              </p>
              <p className="price__note">ერთჯერადი გადახდა</p>
              <ul className="card__list">
                <li>10–20 გვერდი ან ონლაინ მაღაზია</li>
                <li>ინდივიდუალური UI/UX დიზაინი</li>
                <li>ტექნიკური SEO და სისწრაფის ოპტიმიზაცია</li>
                <li>კონტენტი ქართულ ენაზე</li>
                <li>CRM-თან ინტეგრაცია</li>
                <li>6 თვე უფასო მხარდაჭერა</li>
              </ul>
              <a className="btn btn--primary btn--block" href="/contact">შეთავაზების მიღება</a>
            </article>
            <article className="price" data-reveal="" data-reveal-delay="160">
              <h3>SEO და რეკლამა</h3>
              <p className="price__desc">ყოველთვიური მუშაობა, თუ მეტი კლიენტი გჭირდებათ.</p>
              <p className="price__amount">
                <b>1 500</b>
                <span>₾/თვე-დან</span>
              </p>
              <p className="price__note">მინიმუმ 3 თვე</p>
              <ul className="card__list">
                <li>SEO სტრატეგია და ყოველთვიური კონტენტი</li>
                <li>Google Ads და Meta კამპანიების მართვა</li>
                <li>ყოველთვიური ანგარიში და ცოცხალი დაფა</li>
                <li>კონვერსიის ოპტიმიზაცია (CRO)</li>
                <li>პირადი მენეჯერი</li>
              </ul>
              <a className="btn btn--ghost btn--block" href="/contact">შეთავაზების მიღება</a>
            </article>
          </div>
          <p className="text-center muted" style={{ marginTop: "28px", fontSize: ".92rem" }}>{" "}ფასები მითითებულია დღგ-ს გარეშე. სარეკლამო ბიუჯეტი პაკეტში არ შედის.{" "}</p>
          <p className="text-center" style={{ marginTop: "12px" }}>
            <a className="link-arrow" href="/plans">მცირე ბიზნესისთვის: მზა პაკეტები თვიური გადახდით</a>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">კითხვები</span>
            <h2>სერვისებთან დაკავშირებული კითხვები</h2>
          </div>
          <div className="faq">
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="srv-a1">
                  <span>როგორ ირჩევს კომპანია საჭირო სერვისს?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="srv-a1" data-open="false">
                <div>
                  <p>პირველ შეხვედრაზე ვაანალიზებთ თქვენს არსებულ მდგომარეობას და მიზნებს. თუ საიტი კარგია, მაგრამ ვიზიტორი არ არის, ვიწყებთ SEO-თი და რეკლამით. თუ ტრაფიკია, კონვერსია კი დაბალი, ვიწყებთ UX-ითა და საიტის გაუმჯობესებით.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="srv-a2">
                  <span>შეიძლება მხოლოდ ერთი სერვისის შეკვეთა?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="srv-a2" data-open="false">
                <div>
                  <p>რა თქმა უნდა. ბევრი კლიენტი მხოლოდ საიტით ან მხოლოდ SEO-თი იწყებს. კომპლექსური პაკეტი უფრო ეფექტურია, მაგრამ სავალდებულო არასდროსაა.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="srv-a3">
                  <span>რა ღირს ყოველთვიური მომსახურება?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="srv-a3" data-open="false">
                <div>
                  <p>SEO და რეკლამის მართვა იწყება 1 500 ₾-დან თვეში. საბოლოო თანხა დამოკიდებულია ნიშაზე, კონკურენციასა და სამუშაოს მოცულობაზე. ზუსტ შეთავაზებას აუდიტის შემდეგ მიიღებთ.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="srv-a4">
                  <span>რეკლამის ბიუჯეტი ცალკე იხდება?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="srv-a4" data-open="false">
                <div>
                  <p>დიახ. სარეკლამო ბიუჯეტს პირდაპირ Google-სა და Meta-ს უხდით თქვენივე ანგარიშიდან. ჩვენ მხოლოდ მართვის საფასურს ვიღებთ. ასე სრულად ხედავთ, რაში იხარჯება თანხა.</p>
                </div>
              </div>
            </div>
            <div className="faq__item">
              <h3 style={{ margin: "0" }}>
                <button className="faq__q" type="button" aria-expanded="false" aria-controls="srv-a5">
                  <span>რა მოხდება პროექტის დასრულების შემდეგ?</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq__a" id="srv-a5" data-open="false">
                <div>
                  <p>საიტს გადმოგცემთ სრული დოკუმენტაციითა და ვიდეო-ინსტრუქციით. პირველი 3 თვე ტექნიკური მხარდაჭერა უფასოა, შემდეგ კი ხელმისაწვდომია ყოველთვიური პაკეტი.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <div className="cta__inner">
            <div data-reveal="">
              <h2>არ იცით, საიდან დაიწყოთ?</h2>
              <p>მოგვწერეთ და შევისწავლით თქვენს საიტსა და კონკურენტებს. მიიღებთ კონკრეტულ გეგმას: რა, რა თანმიმდევრობით და რა ბიუჯეტში.</p>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--white" href="tel:+995557643225">დარეკეთ: +995 557 64 32 25</a>
                {" "}
                <a className="btn btn--light" href="mailto:hello@webico.io">hello@webico.io</a>
              </div>
            </div>
            <div data-reveal="" data-reveal-delay="90">
              <form className="lead-form" data-lead-form="services-cta-band" method="post" action="#">
                <h3>მოგვიყევით პროექტზე</h3>
                <p className="lead-form__intro">რამდენიმე სიტყვაც საკმარისია.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field">
                  <label htmlFor="services-cta-name">
                    სახელი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="services-cta-name" name="name" autoComplete="name" placeholder="თქვენი სახელი" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="services-cta-email">
                    ელფოსტა{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="email" id="services-cta-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="services-cta-website">
                    ვებსაიტი ან ტელეფონი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="services-cta-website" name="website" placeholder="example.ge / +995 5XX XX XX XX" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="services-cta-hp">არ შეავსოთ</label>
                  <input type="text" id="services-cta-hp" name="company_website" tabIndex="-1" autoComplete="off" />
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
