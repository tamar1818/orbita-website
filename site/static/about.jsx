/** /about — სტატიკური გვერდი (გადმოტანილია views/static/about.html-დან) */
import { JsonLd, TeamSection } from '@/components/blocks';
import { showcase } from '@/lib/projects';


/** ორბიტაზე მბრუნავი მიმართულებები */
const RING = ['ბრენდინგი', 'UI/UX დიზაინი', 'ვებსაიტები', 'ონლაინ მაღაზიები', 'SEO', 'მარკეტინგი', 'გადახდები', 'AI კონტენტი', 'DevOps', 'მხარდაჭერა'];

/** მიმართულებები: [ტონი, ბმული, სათაური, ტექსტი, ქვესერვისები, აიკონი] */
const CAPS = [
  ['pink', '/service-branding', 'დიზაინი და ბრენდინგი', 'ლოგო, ბრენდბუქი, შეფუთვა და ინტერფეისები, რომლებიც ბრენდს ცნობადს ხდის.',
    ['ბრენდინგი', 'UI/UX', 'შეფუთვა'], <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>],
  ['lilac', '/service-web-development', 'დეველოპმენტი', 'კორპორატიული საიტები, ონლაინ მაღაზიები, ვებ-აპლიკაციები და პლატფორმები.',
    ['Next.js', 'WordPress', 'Shopify'], <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="13" y1="4" x2="11" y2="20" /></>],
  ['lime', '/service-seo', 'ზრდა და მარკეტინგი', 'SEO, რეკლამა Google-ში და სოციალურ ქსელებში, AI კონტენტი და ანალიტიკა.',
    ['SEO', 'Google Ads', 'AI კონტენტი'], <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>],
  ['lilac', '/service-payments', 'გადახდები და ინტეგრაციები', 'ბარათით, Apple Pay-ით და განვადებით გადახდა, CRM და სხვა სისტემების დაკავშირება.',
    ['Flitt', 'UniPAY', 'BOG / TBC'], <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>],
  ['pink', '/service-devops', 'ინფრასტრუქტურა და მხარდაჭერა', 'ღრუბელი, CI/CD, მონიტორინგი, უსაფრთხოება და ყოველთვიური ტექნიკური მხარდაჭერა.',
    ['DevOps', 'Kubernetes', 'მხარდაჭერა'], <><rect x="2" y="3" width="20" height="7" rx="1.5" /><rect x="2" y="14" width="20" height="7" rx="1.5" /><line x1="6" y1="6.5" x2="6.01" y2="6.5" /><line x1="6" y1="17.5" x2="6.01" y2="17.5" /></>],
];

const VALUES = [
  ['შედეგზე ორიენტაცია', 'პროექტი მაშინ გამოგვივიდა, როცა თქვენი ბიზნესი იზრდება. გაშვება მხოლოდ დასაწყისია.',
    <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>],
  ['გამჭვირვალობა', 'ხედავთ, რაში იხარჯება ყოველი ლარი. ანგარიშები, დაფები და ვადები ყოველთვის ხელმისაწვდომია.',
    <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.7" y2="16.7" /></>],
  ['სისწრაფე', 'წერილზე პასუხს ერთ სამუშაო დღეში იღებთ, გადაუდებელ საკითხს კი იმავე დღეს ვწყვეტთ.',
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />],
  ['პარტნიორობა', 'არ ვართ „გარე შემსრულებელი“. ვმუშაობთ ისე, როგორც თქვენი გუნდის ნაწილი.',
    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>],
];


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
        "name": "ჩვენ შესახებ"
      }
    ]
  }
];

export const meta = {
  "title": "ჩვენ შესახებ | Webico",
  "desc": "Webico ციფრული სააგენტოა თბილისში: დიზაინი და ბრენდინგი, დეველოპმენტი, SEO და მარკეტინგი, გადახდები, AI კონტენტი და DevOps ერთ გუნდში.",
  "url": "/about",
  "imageAlt": "ვებიკო — ციფრული სააგენტო"
};

export default function pageAbout() {
  const body = (
    <>
      {LD.map((d, i) => <JsonLd data={d} key={i} />)}
      <section className="wk-hero ab-hero" data-wk-stage-wrap="">
        <div className="container">
          <div className="wk-hero__grid">
            <div className="wk-hero__text">
              <ol className="breadcrumb breadcrumb--light">
                <li><a href="/">მთავარი</a></li>
                <li><span aria-current="page">ჩვენ შესახებ</span></li>
              </ol>
              <h1>ბრენდი, ტექნოლოგია და ზრდა ერთ გუნდში</h1>
              <p>Webico ციფრული სააგენტოა თბილისში. ვქმნით ბრენდს და დიზაინს, ვაწყობთ საიტებს, მაღაზიებს და პლატფორმებს, ვაერთებთ გადახდებს, ვზრდით გაყიდვებს SEO-თი, მარკეტინგით და AI კონტენტით, და ვუვლით ინფრასტრუქტურას.</p>
              <dl className="wk-hero__stats">
                <div><dt>დასრულებული პროექტი</dt><dd>{showcase().length}</dd></div>
                <div><dt>მიმართულება ერთ გუნდში</dt><dd>{RING.length}</dd></div>
                <div><dt>სამუშაო დღე პასუხამდე</dt><dd>1</dd></div>
              </dl>
            </div>
            <div className="ab-orbit" aria-hidden="true">
              <div className="ab-orbit__scene" data-wk-stage="">
                <span className="ab-orbit__core"><b>W</b></span>
                <div className="ab-orbit__ring">
                  {RING.map((t, i) => (
                    <span className={'ab-orbit__chip ab-orbit__chip--' + ['lilac', 'lime', 'pink'][i % 3]} style={{ '--i': i, '--n': RING.length }} key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--split" data-reveal="">
            <div><span className="eyebrow">რას ვაკეთებთ</span><h2>ერთი პარტნიორი ყველაფრისთვის, რაც ციფრულ ბიზნესს სჭირდება</h2></div>
            <a className="btn btn--ghost" href="/services">ყველა სერვისი</a>
          </div>
          <div className="ab-caps">
            {CAPS.map(([tone, href, title, text, items, icon], i) => (
              <a className={'ab-cap ab-cap--' + tone} href={href} data-reveal="" data-reveal-delay={i * 60} key={href}>
                <span className="ab-cap__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="ab-cap__go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section ab-why">
        <div className="container">
          <div className="ab-why__grid">
            <div data-reveal="">
              <span className="eyebrow">რატომ ერთი გუნდი</span>
              <h2>როცა დიზაინი, კოდი და მარკეტინგი ერთმანეთს ესაუბრება</h2>
            </div>
            <div className="ab-why__text" data-reveal="" data-reveal-delay="90">
              <p>ხშირად ბრენდს ერთი სტუდია ხატავს, საიტს მეორე აწყობს, რეკლამას მესამე უშვებს, სერვერს კი ვიღაც მეოთხე უვლის. შედეგად ყველა თავის ნაწილზე პასუხობს და არავინ მთლიან შედეგზე.</p>
              <p>ჩვენთან ერთი გუნდი მუშაობს თავიდან ბოლომდე. ვინც ბრენდს ქმნის, ის ესაუბრება დეველოპერს, მარკეტოლოგს და DevOps ინჟინერს. ასე პროექტი თავიდანვე იმისთვის კეთდება, რომ ბიზნესი გაიზარდოს.</p>
            </div>
          </div>
          <div className="grid grid--4 ab-values">
            {VALUES.map(([title, text, icon], i) => (
              <article className="ab-value" data-reveal="" data-reveal-delay={i * 70} key={title}>
                <span className="ab-value__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <TeamSection />
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">მუშაობის წესი</span>
            <h2>რას მიიღებთ ჩვენთან</h2>
          </div>
          <div className="grid grid--3">
            <article className="card" data-reveal="">
              <h3>ერთი კონტაქტი</h3>
              <p>არ გჭირდებათ ხუთ ადამიანთან მიმოწერა. პირადი მენეჯერი აგროვებს ყველა საკითხს და ერთ დღეში გცემთ პასუხს.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="70">
              <h3>ფიქსირებული ბიუჯეტი</h3>
              <p>ხელშეკრულებაში გაწერილია სამუშაოს მოცულობა და ღირებულება. დამატებითი თანხა მხოლოდ თქვენი თანხმობით ჩნდება.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="140">
              <h3>თქვენი საკუთრება</h3>
              <p>დომენი, ჰოსტინგი, კოდი და სარეკლამო ანგარიშები რეგისტრირდება თქვენს სახელზე — ნებისმიერ დროს შეგიძლიათ წაიღოთ.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <div className="cta__inner">
            <div data-reveal="">
              <h2>გავიცნოთ ერთმანეთი</h2>
              <p>30 წუთიანი უფასო შეხვედრა. მოგვიყვებით ბიზნესზე, ჩვენ კი გეტყვით, რეალურად რისი გაკეთებაა შესაძლებელი და რა ვადაში.</p>
              <div className="btn-row" style={{ marginTop: "26px" }}>
                <a className="btn btn--white" href="tel:+995557643225">დარეკეთ: +995 557 64 32 25</a>
                {" "}
                <a className="btn btn--light" href="mailto:hello@webico.io">hello@webico.io</a>
              </div>
            </div>
            <div data-reveal="" data-reveal-delay="90">
              <form className="lead-form" data-lead-form="about-cta-band" method="post" action="#">
                <h3>მოგვიყევით პროექტზე</h3>
                <p className="lead-form__intro">რამდენიმე სიტყვაც საკმარისია.</p>
                <div className="form-status" role="alert" aria-live="polite" />
                <div className="field">
                  <label htmlFor="about-cta-name">
                    სახელი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="about-cta-name" name="name" autoComplete="name" placeholder="თქვენი სახელი" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="about-cta-email">
                    ელფოსტა{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="email" id="about-cta-email" name="email" autoComplete="email" placeholder="name@company.ge" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="field">
                  <label htmlFor="about-cta-website">
                    ვებსაიტი ან ტელეფონი{" "}
                    <span className="req">*</span>
                  </label>
                  {" "}
                  <input type="text" id="about-cta-website" name="website" placeholder="example.ge / +995 5XX XX XX XX" required />
                  {" "}
                  <span className="field__error" />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="about-cta-hp">არ შეავსოთ</label>
                  <input type="text" id="about-cta-hp" name="company_website" tabIndex="-1" autoComplete="off" />
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
