/**
 * სერვისის გვერდის შაბლონი (data/services/*.json-დან): WordPress, ონლაინ მაღაზია, მხარდაჭერა.
 * სქემა: Service + BreadcrumbList + FAQPage (FAQ გვერდზე ხილულია).
 */
import fs from 'fs';
import path from 'path';
import { ROOT } from '@/lib/core';
import * as blog from '@/lib/blog';
import { PostCard } from '@/components/posts';
import { ServiceWork } from '@/components/work';
import { Faq, JsonLd, PageHero } from '@/components/blocks';
import { ArrowRight } from '@/components/icons';

/** ყველა სერვისი — „სხვა სერვისების“ ბლოკისთვის */
const SERVICES = {
  '/service-web-development': ['ვებსაიტის დამზადება', 'კორპორატიული საიტები, ლენდინგები და ვებ-აპლიკაციები.'],
  '/service-wordpress': ['WordPress დეველოპმენტი', 'WordPress საიტები, საკუთარი თემები და პლაგინები.'],
  '/service-ecommerce': ['ონლაინ მაღაზიის შექმნა', 'WooCommerce და Shopify მაღაზიები ქართული გადახდებით.'],
  '/service-seo': ['SEO ოპტიმიზაცია', 'ტექნიკური SEO, სემანტიკა და კონტენტი ქართულად.'],
  '/service-maintenance': ['საიტის ტექნიკური მხარდაჭერა', 'განახლებები, უსაფრთხოება, სარეზერვო ასლები.'],
  '/service-branding': ['ბრენდინგი და UI/UX დიზაინი', 'ლოგო, ბრენდბუქი და ინტერფეისის დიზაინი.'],
  '/service-marketing': ['ციფრული მარკეტინგი', 'Google Ads, Meta და TikTok კამპანიები.'],
  '/service-payments': ['ონლაინ გადახდების ინტეგრაცია', 'Flitt, UniPAY, BOG, TBC, Apple Pay, Stripe და PayPal.'],
  '/service-ai': ['AI კონტენტის შექმნა', 'ტექსტები, ფოტოები და ვიდეოები საიტისა და რეკლამისთვის.'],
  '/service-devops': ['DevOps სერვისები', 'ღრუბელი, CI/CD, Kubernetes და iGaming DevOps.'],
};

export default function service(name) {
  const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services', name + '.json'), 'utf8'));
  const u = 'https://webico.io' + S.path;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service', name: S.service_name, serviceType: S.service_type, description: S.desc, url: u,
        areaServed: { '@type': 'Country', name: 'Georgia' },
        provider: { '@type': 'ProfessionalService', name: 'Webico', url: 'https://webico.io/' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://webico.io/' },
          { '@type': 'ListItem', position: 2, name: 'სერვისები', item: 'https://webico.io/services' },
          { '@type': 'ListItem', position: 3, name: S.crumb, item: u },
        ],
      },
      { '@type': 'FAQPage', mainEntity: S.faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) },
    ],
  };
  const arts = (S.posts || []).map(blog.post).filter(Boolean);
  const rel = Object.entries(SERVICES).filter(([k]) => k !== S.path && (S.related || []).includes(k)).slice(0, 3);
  const meta = { title: S.title, desc: S.desc, url: S.path };

  const body = (
    <>
      <JsonLd data={ld} />
      <PageHero crumbs={[['/services', 'სერვისები'], [null, S.crumb]]} eyebrow={S.eyebrow} title={S.h1}>
        <p>{S.lead}</p>
        {S.chips && S.chips.length ? <ul className="svc-chips" aria-label={S.chips_label || 'ინსტრუმენტები'}>{S.chips.map((c) => <li key={c}>{c}</li>)}</ul> : null}
        <div className="btn-row">
          <a className="btn btn--primary" href="/contact#booking">უფასო კონსულტაცია</a>{' '}
          <a className="btn btn--ghost" href="/work">ნამუშევრები</a>
        </div>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="svc-intro" data-reveal="">
            {S.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {S.partner ? (
            <aside className="svc-partner" data-reveal="">
              <div className="svc-partner__body">
                <span className="svc-partner__tag">{S.partner.eyebrow}</span>
                <h3>{S.partner.title}</h3>
                <p>{S.partner.text}</p>
              </div>
              <a className="btn svc-partner__btn" href={S.partner.url} target="_blank" rel="noopener">{S.partner.cta} <ArrowRight /></a>
            </aside>
          ) : null}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">რას მოიცავს</span>
            <h2>{S.features_title}</h2>
          </div>
          <div className="grid grid--3">
            {S.features.map(([h, t], i) => (
              <article className="card" data-reveal="" data-reveal-delay={Math.min(i, 5) * 50} key={i}>
                <h3>{h}</h3>
                <p>{t}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {S.for && S.for.length ? (
        <section className="section">
          <div className="container">
            <div className="feature-row">
              <div className="feature-row__body" data-reveal="">
                <span className="eyebrow">ვისთვის</span>
                <h2>{S.for_title}</h2>
                {S.for_text ? <p>{S.for_text}</p> : null}
                <ul className="checklist">{S.for.map((li, i) => <li key={i}>{li}</li>)}</ul>
              </div>
              <div className="feature-row__media" data-reveal="" data-reveal-delay="90">
                <div className="panel panel--brand">
                  <h3>რას იღებთ</h3>
                  <ul className="checklist">{S.deliver.map((li, i) => <li key={i}>{li}</li>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <ServiceWork service={S.path.slice('/service-'.length)} />

      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow eyebrow--accent">პროცესი</span>
            <h2>{S.process_title}</h2>
          </div>
          <div className="steps">
            {S.process.map(([h, t], i) => (
              <article className="step" data-reveal="" data-reveal-delay={i * 70} key={i}>
                <h3>{h}</h3>
                <p>{t}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="faq-split">
            <div className="faq-split__head" data-reveal="">
              <span className="eyebrow">კითხვები</span>
              <h2>{S.faq_title}</h2>
              <p>ვერ იპოვეთ პასუხი? დაჯავშნეთ უფასო ზარი ან მოგვწერეთ ჩატში.</p>
              <a className="btn btn--primary" href="/contact#booking">შეხვედრის დაჯავშნა</a>
            </div>
            <Faq items={S.faq} id="sf-" />
          </div>
        </div>
      </section>

      {arts.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head section-head--split" data-reveal="">
              <div><span className="eyebrow">ბლოგიდან</span><h2>სასარგებლო სტატიები</h2></div>
              <a className="btn btn--ghost" href="/blog">ყველა სტატია</a>
            </div>
            <div className="post-grid" data-reveal="">
              {arts.slice(0, 3).map((a) => <PostCard p={a} key={a.slug} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center" data-reveal="">
            <span className="eyebrow">სხვა სერვისები</span>
            <h2>კიდევ რაში დაგეხმარებით</h2>
          </div>
          <div className="grid grid--3">
            {rel.map(([href, [title, text]]) => (
              <article className="card card--link" data-reveal="" key={href}>
                <h3>{title}</h3>
                <p>{text}</p>
                <a className="link-arrow" href={href}>დეტალურად <ArrowRight /><span className="sr-only"> — {title}</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta cta--center">
        <div className="container">
          <div className="cta__inner" data-reveal="">
            <h2>{S.cta_title}</h2>
            <p>უფასო კონსულტაციაზე მოვისმენთ თქვენს ამოცანას და ერთ სამუშაო დღეში გამოგიგზავნით
              საორიენტაციო გეგმას, ვადებსა და ღირებულებას.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/contact#booking">შეხვედრის დაჯავშნა</a>{' '}
              <a className="btn btn--light" href="/contact#contact-form">განაცხადის გაგზავნა</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
