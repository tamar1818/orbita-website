/** /404 — სტატიკური გვერდი (გადმოტანილია views/static/404.html-დან) */
import { JsonLd } from '@/components/blocks';

const LD = [];

export const meta = {
  "title": "გვერდი ვერ მოიძებნა (404) — ვებიკო",
  "desc": "მოთხოვნილი გვერდი ვერ მოიძებნა. დაბრუნდით მთავარ გვერდზე ან გაეცანით ჩვენს სერვისებს.",
  "url": "/404",
  "imageAlt": "ვებიკო — ციფრული სააგენტო",
  "robots": "noindex, follow"
};

export default function pageNotFound() {
  const body = (
    <>
      {LD.map((d, i) => <JsonLd data={d} key={i} />)}
      <section className="page-hero pattern-grid">
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">შეცდომა 404</span>
            <h1>გვერდი ვერ მოიძებნა</h1>
            <p>შესაძლოა მისამართი შეიცვალა, გვერდი წაიშალა, ან ბმულში დაიკარგა სიმბოლო. ქვემოთ მოცემული ბმულებით სწრაფად იპოვით საჭიროს.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/">მთავარ გვერდზე დაბრუნება</a>
              {" "}
              <a className="btn btn--ghost" href="/contact">დაგვიკავშირდით</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow eyebrow--accent">სავარაუდოდ ეძებთ</span>
            <h2>ჩვენი სერვისები</h2>
          </div>
          <div className="grid grid--2">
            <article className="card card--link">
              <h3>ვებსაიტების დიზაინი და შექმნა</h3>
              <p>კორპორატიული საიტები, ონლაინ მაღაზიები და ვებ-აპლიკაციები.</p>
              <a className="link-arrow" href="/service-web-development">დეტალურად</a>
            </article>
            <article className="card card--link">
              <h3>SEO ოპტიმიზაცია</h3>
              <p>ტექნიკური აუდიტი, საკვანძო სიტყვები და კონტენტ-სტრატეგია.</p>
              <a className="link-arrow" href="/service-seo">დეტალურად</a>
            </article>
            <article className="card card--link">
              <h3>ციფრული მარკეტინგი</h3>
              <p>Google Ads, Meta და TikTok კამპანიები გაზომვადი შედეგით.</p>
              <a className="link-arrow" href="/service-marketing">დეტალურად</a>
            </article>
            <article className="card card--link">
              <h3>ბრენდის ვიზუალური იდენტობა</h3>
              <p>ლოგო, ბრენდბუქი და ინტერფეისის დიზაინი.</p>
              <a className="link-arrow" href="/service-branding">დეტალურად</a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
