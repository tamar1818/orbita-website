/**
 * საერთო ჩარჩო ყველა გვერდისთვის: სწრაფი კონტაქტი, ჰედერი (mega menu), ფუტერი, WhatsApp და ენის გადამრთველი.
 * ტექსტები ქართულადაა — ინგლისურ ვერსიას lib/localize.js თარგმნის.
 */
import { opt } from '@/lib/core';
import { decode } from '@/lib/tpl';
import { enPath } from '@/lib/i18n';
import { SOCIAL } from '@/lib/blocks';
import Interactions from './Interactions';
import { ArrowRight, ArrowUpRight, Chevron, Phone, WhatsApp, Facebook, Instagram } from './icons';

/** სერვისების მენიუ: მარცხნივ კატეგორიები (hover/ფოკუსით ირჩევა), მარჯვნივ არჩეული კატეგორიის ბმულები */
const MEGA = [
  ['web', '/service-web-development', 'lilac', 'ვებსაიტები',
    <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="13" y1="4" x2="11" y2="20" /></>,
    [['/service-web-development', 'ვებ-დეველოპმენტი'], ['/service-wordpress', 'WordPress ვებსაიტის დამზადება'],
      ['/service-web-development', 'Wix'], ['/service-web-development', 'Replit'], ['/service-ecommerce', 'Shopify'],
      ['/service-web-development', 'Custom ვებ-დეველოპმენტი']]],
  ['shop', '/service-ecommerce', 'lime', 'ონლაინ მაღაზიები',
    <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
    [['/service-ecommerce', 'ონლაინ მაღაზიის შექმნა'], ['/onlain-magazia', 'მაღაზია მცირე ბიზნესისთვის']]],
  ['design', '/service-branding', 'pink', 'დიზაინი და ბრენდინგი',
    <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    [['/service-branding', 'პროდუქტის დიზაინი'], ['/service-branding', 'ვებ-დიზაინი'], ['/service-branding', 'UI/UX დიზაინი'],
      ['/service-branding', 'შეფუთვის დიზაინი'], ['/service-branding', 'ლოგო და ბრენდბუქი'], ['/service-branding', 'ბრენდინგი'],
      ['/service-branding', 'რებრენდინგი']]],
  ['growth', '/service-seo', 'lilac', 'SEO და მარკეტინგი',
    <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    [['/service-seo', 'SEO ოპტიმიზაცია'], ['/service-marketing', 'ციფრული მარკეტინგი'], ['/service-marketing', 'Google Ads და Meta რეკლამა']]],
  ['care', '/service-maintenance', 'lime', 'მხარდაჭერა',
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />,
    [['/service-maintenance', 'საიტის ტექნიკური მხარდაჭერა'], ['/service-maintenance', 'განახლებები და სარეზერვო ასლები'], ['/contact#booking', 'უფასო კონსულტაცია']]],
];

const MegaIcon = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const NAV_AFTER = [['/work', 'ნამუშევრები'], ['/blog', 'ბლოგი'], ['/contact', 'კონტაქტი']];

/** WhatsApp-ის ბმული ადმინის ნომრით */
function waLink(lang) {
  const n = decode(opt('whatsapp', '') || opt('phone', '+995 557 64 32 25')).replace(/\D/g, '');
  const text = lang === 'en' ? 'Hello! I would like to discuss a website project.' : 'გამარჯობა! საიტი მაინტერესებს.';
  return 'https://wa.me/' + (n.length === 9 ? '995' + n : n) + '?text=' + encodeURIComponent(text);
}

/** ენის გადამრთველი „EN | KA“ — მიმდინარე ენა ხაზგასმულია */
function LangSwitch({ lang, kaPath }) {
  const href = { en: enPath(kaPath) || '/en', ka: kaPath };
  const a = (l) => <a href={href[l]} hrefLang={l} lang={l} aria-current={lang === l ? 'true' : undefined}>{l.toUpperCase()}</a>;
  return <span className="lang-switch" lang="ka" aria-label={lang === 'en' ? 'Language' : 'ენა'}>{a('en')}<span aria-hidden="true">|</span>{a('ka')}</span>;
}

function Header({ lang, kaPath }) {
  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav" aria-label="მთავარი ნავიგაცია">
          <a className="brand" href="/">
            <img className="brand__logo" src="/assets/img/logo/webico-horizontal-ink.svg" alt="Webico" width="152" height="38" />
          </a>
          <ul className="nav__links" id="nav-links">
            <li><a href="/about">ჩვენ შესახებ</a></li>
            <li className="nav__item">
              <button className="nav__trigger" type="button" data-mega-trigger="" aria-expanded="false" aria-controls="mega-services" data-nav-match="services">
                სერვისები <Chevron />
              </button>
              <div className="mega" id="mega-services"><div>
                <div className="mega__inner">
                  <div className="mega__side">
                    <ul className="mega__cats">
                      {MEGA.map(([id, href, tone, title, icon], i) => (
                        <li key={id}>
                          <a className={'mega__cat mega__cat--' + tone + (i === 0 ? ' is-active' : '')} href={href} data-mega-cat={id}>
                            <MegaIcon>{icon}</MegaIcon>{title}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a className="mega__all" href="/services">ყველა სერვისი <ArrowRight /></a>
                  </div>
                  <div className="mega__panels">
                    {MEGA.map(([id, href, , title, , items], i) => (
                      <div className={'mega__panel' + (i === 0 ? ' is-active' : '')} data-mega-panel={id} key={id}>
                        <a className="mega__panel-title" href={href}>{title}</a>
                        <ul>{items.map(([h, t]) => <li key={t}><a href={h}>{t}</a></li>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div></div>
            </li>
            {NAV_AFTER.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}
            <li><LangSwitch lang={lang} kaPath={kaPath} /></li>
            <li><a className="btn btn--primary btn--sm" href="/contact#booking">დაიწყეთ პროექტი</a></li>
          </ul>
          <div className="nav__cta">
            <a className="btn btn--primary btn--sm" href="/contact#booking">დაიწყეთ პროექტი</a>{' '}
            <button className="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="მენიუს გახსნა"><span /></button>
          </div>
        </nav>
      </div>
    </header>
  );
}

const FOOT_NAV = [['/', 'მთავარი'], ['/about', 'ჩვენ შესახებ'], ['/services', 'სერვისები'], ['/work', 'ნამუშევრები'], ['/blog', 'ბლოგი'], ['/contact', 'კონტაქტი']];
const FOOT_SVC = [['/service-web-development', 'ვებსაიტები'], ['/service-ecommerce', 'ონლაინ მაღაზიები'], ['/service-wordpress', 'WordPress'], ['/service-branding', 'UI/UX და ბრენდინგი'], ['/service-seo', 'SEO'], ['/service-marketing', 'მარკეტინგი'], ['/service-maintenance', 'მხარდაჭერა']];
const FOOT_LEGAL = [['/terms', 'წესები და პირობები'], ['/privacy', 'კონფიდენციალურობა']];

const Pills = ({ list }) => <ul className="foot__pills">{list.map(([h, t]) => <li key={h}><a href={h}>{t}</a></li>)}</ul>;

/** ფუტერი: ფერადი ბლოკი, ნავიგაცია „აბებად“, დიდი ლოგო ქვემოთ */
function Footer({ lang, kaPath }) {
  const email = opt('email', 'hello@webico.io');
  const phone = opt('phone', '+995 557 64 32 25');
  return (
    <footer className="site-footer foot">
      <div className="container">
        <div className="foot__box">
          <svg className="foot__curl" viewBox="0 0 400 400" aria-hidden="true"><path d="M420 60 C 300 40, 250 160, 320 210 C 380 255, 420 170, 350 150 C 260 125, 200 300, 300 420" fill="none" stroke="currentColor" strokeWidth="34" strokeLinecap="round" /></svg>
          <div className="foot__top">
            <p className="foot__claim">ვებსაიტები, რომლებიც ბრენდს ზრდის.</p>
            <div className="foot__col">
              <h4>ნავიგაცია</h4>
              <Pills list={FOOT_NAV} />
            </div>
            <div className="foot__col">
              <h4>სერვისები</h4>
              <Pills list={FOOT_SVC} />
            </div>
            <div className="foot__col foot__contact">
              <h4>კონტაქტი</h4>
              <a href={'mailto:' + email}>{email}</a>
              <a href={'tel:' + phone.replace(/[^\d+]/g, '')}>{phone}</a>
              <span>თბილისი, საქართველო</span>
              <div className="foot__social">
                <a href={SOCIAL.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram /></a>
                <a href={SOCIAL.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook /></a>
              </div>
              <a className="foot__start" href="/contact">დაიწყეთ პროექტი <ArrowUpRight size={18} width="2.2" /></a>
            </div>
          </div>
          <a className="foot__mark" href="/" aria-label="Webico">
            <img src="/assets/img/logo/webico-horizontal-ink.svg" alt="Webico" width="880" height="220" loading="lazy" />
          </a>
          <div className="foot__bottom">
            <span>© <span id="year">2026</span> Webico. {opt('legal_name', 'თამარ გელიაშვილი')}, ს/ნ {opt('legal_id', '01024088829')}</span>
            <Pills list={FOOT_LEGAL} />
            {lang === 'en'
              ? <a className="foot__lang" href={kaPath} hrefLang="ka" lang="ka">ქართული</a>
              : <a className="foot__lang" href={enPath(kaPath) || '/en'} hrefLang="en">English</a>}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Shell({ lang = 'ka', kaPath = '/', children }) {
  const wa = waLink(lang);
  const phone = opt('phone', '+995 557 64 32 25');
  return (
    <>
      <a className="skip-link" href="#main">გადასვლა მთავარ კონტენტზე</a>
      <div className="scroll-progress" aria-hidden="true" />
      <a className="wa-float" href={wa} target="_blank" rel="noopener" aria-label="მოგვწერეთ WhatsApp-ზე"><WhatsApp /><span>WhatsApp</span></a>
      <aside className="sticky-cta" aria-label="სწრაფი კონტაქტი">
        <span className="sticky-cta__text">გაქვთ პროექტი?<small>გიპასუხებთ 24 საათში</small></span>{' '}
        <a className="sticky-cta__call sticky-cta__wa" href={wa} target="_blank" rel="noopener" aria-label="WhatsApp"><WhatsApp /></a>
        <a className="sticky-cta__call" href="tel:+995557643225" aria-label={'დარეკვა: ' + phone}><Phone /></a>{' '}
        <a className="btn btn--primary" href="/contact">მოგვწერეთ</a>
      </aside>
      <Header lang={lang} kaPath={kaPath} />
      <main id="main">
        {children}
      </main>
      <Footer lang={lang} kaPath={kaPath} />
      <Interactions />
    </>
  );
}
