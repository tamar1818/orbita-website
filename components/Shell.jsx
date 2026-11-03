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
/** სერვისების მეგა-მენიუ — იგივე 12 სერვისი, რაც მთავარი გვერდის კარუსელში (site/home.jsx SERVICES) */
const MEGA = [
  ['software', '/service-web-development', 'lilac', 'პროგრამული ინჟინერია',
    <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="13" y1="4" x2="11" y2="20" /></>,
    [['/service-web-development', 'ვებ აპლიკაციები'], ['/service-web-development', 'მობილური აპლიკაციები'], ['/service-wordpress', 'CMS დეველოპმენტი'], ['/service-web-development', 'პლატფორმები და პორტალები'], ['/service-maintenance', 'ტექნიკური მხარდაჭერა']]],
  ['ecommerce', '/service-ecommerce', 'pink', 'ელექტრონული კომერცია',
    <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
    [['/service-ecommerce', 'ონლაინ მაღაზიის შექმნა'], ['/service-ecommerce', 'Shopify'], ['/service-ecommerce', 'WooCommerce'], ['/onlain-magazia', 'მაღაზია მცირე ბიზნესისთვის'], ['/service-payments', 'გადახდების ინტეგრაცია'], ['/service-payments', 'Flitt და Plug and Pay'], ['/service-payments', 'საქართველოს ბანკი და TBC']]],
  ['content', '/service-marketing', 'lime', 'კონტენტ სტრატეგია',
    <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    [['/service-marketing', 'კონტენტ გეგმა და კალენდარი'], ['/service-marketing', 'ბრენდის ტონი'], ['/service-marketing', 'სოციალური ქსელების სტრატეგია'], ['/service-marketing', 'ბლოგი და სტატიები']]],
  ['seo', '/service-seo', 'lilac', 'SEO',
    <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.7" y2="16.7" /></>,
    [['/service-seo', 'ტექნიკური SEO'], ['/service-seo', 'On-page SEO'], ['/service-seo', 'Off-page SEO და ბმულები'], ['/service-seo', 'საძიებო სიტყვების კვლევა'], ['/service-seo', 'ანგარიშები Semrush-ით']]],
  ['copywriting', '/service-marketing', 'pink', 'ქოფირაითინგი',
    <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
    [['/service-marketing', 'საიტის ტექსტები'], ['/service-marketing', 'სარეკლამო ტექსტები'], ['/service-marketing', 'სოციალური ქსელის პოსტები'], ['/service-marketing', 'პროდუქტის აღწერები']]],
  ['graphic', '/service-branding', 'lime', 'გრაფიკული დიზაინი',
    <><circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.6-10-8.6z" /></>,
    [['/service-branding', 'სოციალური ქსელის დიზაინი'], ['/service-branding', 'ბანერები და რეკლამა'], ['/service-branding', 'პრეზენტაციები'], ['/service-branding', 'ბეჭდური მასალა']]],
  ['advertising', '/service-marketing', 'lilac', 'ციფრული რეკლამა',
    <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    [['/service-marketing', 'Facebook და Instagram რეკლამა'], ['/service-marketing', 'Google Ads'], ['/service-marketing', 'Ads Manager-ის მართვა'], ['/service-marketing', 'ანალიტიკა და ანგარიშები']]],
  ['production', '/contact', 'pink', 'პროდაქშენი',
    <><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
    [['/contact', 'ვიდეო გადაღება'], ['/contact', 'ფოტო გადაღება'], ['/contact', 'სარეკლამო გადაღება'], ['/contact', 'პროდუქტის ფოტოები']]],
  ['ai', '/service-ai', 'lime', 'AI კონტენტის შექმნა',
    <><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
    [['/service-ai', 'AI კამპანიები'], ['/service-ai', 'ბრენდის ვიზუალები'], ['/service-ai', 'AI პროდუქტის ფოტოები'], ['/service-ai', 'პერსონალური AI სურათები'], ['/service-ai', 'AI ვიდეო და ავატარები'], ['/service-ai', 'AI ჩატბოტი საიტზე']]],
  ['web', '/service-web-development', 'lilac', 'ვებ დეველოპმენტი',
    <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
    [['/service-web-development', 'კორპორატიული საიტი'], ['/service-web-development', 'ლენდინგი'], ['/service-wordpress', 'WordPress ვებსაიტი'], ['/service-web-development', 'Next.js და Custom'], ['/service-web-development', 'Wix და Webflow']]],
  ['branding', '/service-branding', 'pink', 'ბრენდინგი',
    <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    [['/service-branding', 'ბრენდის იდენტობა'], ['/service-branding', 'ლოგო და ბრენდბუქი'], ['/service-branding', 'სოციალური ქსელის ბადეები'], ['/service-branding', 'შეფუთვის დიზაინი'], ['/service-branding', 'UI/UX დიზაინი'], ['/service-branding', 'რებრენდინგი']]],
  ['devops', '/service-devops', 'lime', 'DevOps სერვისები',
    <><rect x="2" y="3" width="20" height="7" rx="1.5" /><rect x="2" y="14" width="20" height="7" rx="1.5" /><line x1="6" y1="6.5" x2="6.01" y2="6.5" /><line x1="6" y1="17.5" x2="6.01" y2="17.5" /></>,
    [['/service-devops', 'ღრუბლოვანი ინფრასტრუქტურა'], ['/service-devops', 'CI/CD და ავტომატიზაცია'], ['/service-devops', 'Docker და Kubernetes'], ['/service-devops', 'მონიტორინგი და უსაფრთხოება'], ['/service-devops', 'iGaming DevOps — RealOps']]],
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
            <img className="brand__logo" src="/assets/img/logo/webico-horizontal-ink.svg" alt="Webico" width="152" height="38" /><span className="brand__dot" aria-hidden="true" />
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
            <li className="nav__lang-li"><LangSwitch lang={lang} kaPath={kaPath} /></li>
            <li><a className="btn btn--primary btn--sm nav__btn" href="/contact#booking">დაგვიკავშირდით <ArrowUpRight size={16} width="2.2" /></a></li>
          </ul>
          <div className="nav__cta">
            <span className="nav__lang"><LangSwitch lang={lang} kaPath={kaPath} /></span>
            <a className="btn btn--primary btn--sm nav__btn" href="/contact#booking">დაგვიკავშირდით <ArrowUpRight size={16} width="2.2" /></a>{' '}
            <button className="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="მენიუს გახსნა"><span /></button>
          </div>
        </nav>
      </div>
    </header>
  );
}

const FOOT_NAV = [['/', 'მთავარი'], ['/about', 'ჩვენ შესახებ'], ['/services', 'სერვისები'], ['/work', 'ნამუშევრები'], ['/blog', 'ბლოგი'], ['/contact', 'კონტაქტი']];
const FOOT_SVC = [['/service-web-development', 'ვებსაიტები'], ['/service-ecommerce', 'ონლაინ მაღაზიები'], ['/service-wordpress', 'WordPress'], ['/service-branding', 'UI/UX და ბრენდინგი'], ['/service-seo', 'SEO'], ['/service-marketing', 'მარკეტინგი'], ['/service-maintenance', 'მხარდაჭერა'], ['/service-payments', 'ონლაინ გადახდები'], ['/service-ai', 'AI კონტენტი'], ['/service-devops', 'DevOps']];
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
