/** /about — სტატიკური გვერდი (გადმოტანილია views/static/about.html-დან) */
import { JsonLd, TeamSection } from '@/components/blocks';

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
  "desc": "Webico დიზაინისა და დეველოპმენტის სტუდიაა თბილისში. გაიცანით გუნდი და როგორ ვმუშაობთ.",
  "url": "/about",
  "imageAlt": "ვებიკო — ციფრული სააგენტო"
};

export default function pageAbout() {
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
                <span aria-current="page">ჩვენ შესახებ</span>
              </li>
            </ol>
            <span className="eyebrow">ჩვენ შესახებ</span>
            <h1>ვაკეთებთ საიტებს, რომლებიც კლიენტს მოიყვანს</h1>
            <p>Webico დიზაინისა და დეველოპმენტის სტუდიაა თბილისში. პატარა გუნდი ვართ და ყველა პროექტზე ერთად ვმუშაობთ: სტრატეგიიდან და დიზაინიდან კოდამდე, სერვერამდე და მარკეტინგამდე.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__body" data-reveal="">
              <h2>რატომ არ მუშაობს ბევრი ლამაზი საიტი?</h2>
              <p>ხშირად საიტი კარგად გამოიყურება, მაგრამ არც ვიზიტორს იზიდავს და არც გაყიდვებს ზრდის. მიზეზი მარტივია: დიზაინს, კოდს და მარკეტინგს სხვადასხვა ადამიანი აკეთებს, ერთმანეთისგან დამოუკიდებლად.</p>
              <p>ჩვენთან ერთი გუნდი მუშაობს. ვინც საიტს ხატავს, ის ესაუბრება მას, ვინც აწყობს და ვინც მერე რეკლამას უშვებს. ასე საიტი თავიდანვე იმისთვის კეთდება, რომ კლიენტი მოიყვანოს.</p>
            </div>
            <div className="feature-row__media" data-reveal="" data-reveal-delay="100">
              <div className="panel panel--brand">
                <h3>რას აკეთებს გუნდი</h3>
                <ul className="checklist">
                  <li>სტრატეგია, UI/UX დიზაინი და ბრენდინგი</li>
                  <li>ვებსაიტები, ონლაინ მაღაზიები და ვებ-აპლიკაციები</li>
                  <li>სერვერი, უსაფრთხოება და ყოველდღიური ასლები</li>
                  <li>სოციალური მედია, რეკლამა და SEO</li>
                  <li>გაყიდვები და კლიენტთან ურთიერთობა</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">ღირებულებები</span>
            <h2>როგორ ვმუშაობთ</h2>
          </div>
          <div className="grid grid--4">
            <article className="card" data-reveal="" data-reveal-delay="0">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </span>
              <h3>შედეგზე ორიენტაცია</h3>
              <p>პროექტი მაშინ გამოგვივიდა, როცა თქვენი გაყიდვები იზრდება. საიტის გაშვება ჯერ მხოლოდ დასაწყისია.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="70">
              <span className="card__icon card__icon--accent">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.7" y2="16.7" />
                  <line x1="8.5" y1="12.5" x2="8.5" y2="9.5" />
                  <line x1="11" y1="12.5" x2="11" y2="7.5" />
                  <line x1="13.5" y1="12.5" x2="13.5" y2="10.5" />
                </svg>
              </span>
              <h3>გამჭვირვალობა</h3>
              <p>ხედავთ, რაში იხარჯება ყოველი ლარი. ანგარიშები, დაფები და ვადები ყოველთვის ხელმისაწვდომია.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="140">
              <span className="card__icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="13" y1="4" x2="11" y2="20" />
                </svg>
              </span>
              <h3>სისწრაფე</h3>
              <p>წერილზე პასუხს ერთ სამუშაო დღეში იღებთ, გადაუდებელ საკითხს კი იმავე დღეს ვწყვეტთ.</p>
            </article>
            <article className="card" data-reveal="" data-reveal-delay="210">
              <span className="card__icon card__icon--accent">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              <h3>პარტნიორობა</h3>
              <p>არ ვართ „გარე შემსრულებელი“. ვმუშაობთ ისე, როგორც თქვენი გუნდის ნაწილი.</p>
            </article>
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
