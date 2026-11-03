'use strict';
/** სრული სერვის პაკეტი — ერთი წყარო: მთავარი გვერდის კარუსელი, JSON-LD (OfferCatalog) და /llms.txt */
const CATALOG = [
  { id: 'software', tone: 'lilac', href: '/service-web-development', title: 'პროგრამული ინჟინერია', desc: 'ვებ და მობილური აპლიკაციები, პლატფორმები და CMS სისტემები თქვენი ბიზნესის საჭიროებებზე.', tags: ['აპლიკაციები', 'პლატფორმები', 'CMS'] },
  { id: 'ecommerce', tone: 'pink', href: '/service-ecommerce', title: 'ელექტრონული კომერცია', desc: 'ონლაინ მაღაზიები Shopify-ზე და WooCommerce-ზე, გადახდებით Flitt-ით, Plug and Pay-ით და ქართული ბანკებით.', tags: ['Shopify', 'WooCommerce', 'Flitt'] },
  { id: 'content', tone: 'lime', href: '/service-marketing', title: 'კონტენტ სტრატეგია', desc: 'ვგეგმავთ, რა ვთქვათ, სად და როდის: თემები, კონტენტ კალენდარი და ტონი, რომელიც ბრენდს შეეფერება.', tags: ['კალენდარი', 'ტონი', 'თემები'] },
  { id: 'seo', tone: 'lilac', href: '/service-seo', title: 'SEO', desc: 'ტექნიკური, on-page და off-page SEO, საძიებო სიტყვების კვლევა და ყოველთვიური ანგარიშები Semrush-ით.', tags: ['ტექნიკური SEO', 'On/Off-page', 'Semrush'] },
  { id: 'copywriting', tone: 'pink', href: '/service-marketing', title: 'ქოფირაითინგი', desc: 'ტექსტები საიტისთვის, რეკლამისთვის და სოციალური ქსელებისთვის, რომლებიც იკითხება და ყიდის.', tags: ['საიტი', 'რეკლამა', 'სოციალური ქსელები'] },
  { id: 'graphic', tone: 'lime', href: '/service-branding', title: 'გრაფიკული დიზაინი', desc: 'სოციალური ქსელის პოსტები, ბანერები, პრეზენტაციები და ბეჭდური მასალა ერთ სტილში.', tags: ['პოსტები', 'ბანერები', 'ბეჭდვა'] },
  { id: 'advertising', tone: 'lilac', href: '/service-marketing', title: 'ციფრული რეკლამა', desc: 'კამპანიები Facebook-ზე, Instagram-ზე და Google-ში, Ads Manager-ის სრული მართვით და ანგარიშებით.', tags: ['Meta Ads', 'Google Ads', 'ანალიტიკა'] },
  { id: 'production', tone: 'pink', href: '/contact', title: 'პროდაქშენი', desc: 'ვიდეო და ფოტო გადაღება, სარეკლამო რგოლები და პროდუქტის ფოტოები თქვენი ბრენდისთვის.', tags: ['ვიდეო', 'ფოტო', 'სარეკლამო გადაღება'] },
  { id: 'ai', tone: 'lime', href: '/service-ai', title: 'AI კონტენტის შექმნა', desc: 'AI კამპანიები, ბრენდისა და პროდუქტის ვიზუალები, პერსონალური AI სურათები, ვიდეოები და ავატარები.', tags: ['კამპანიები', 'პროდუქტის ფოტო', 'AI ვიდეო'] },
  { id: 'web', tone: 'lilac', href: '/service-web-development', title: 'ვებ დეველოპმენტი', desc: 'კორპორატიული საიტები და ლენდინგები: სწრაფი, მობილურზე მოხერხებული და SEO-სთვის მომზადებული.', tags: ['Next.js', 'WordPress', 'ლენდინგი'] },
  { id: 'branding', tone: 'pink', href: '/service-branding', title: 'ბრენდინგი', desc: 'ბრენდის იდენტობა და ლოგო, სოციალური ქსელის პოსტები და ბადეები, შეფუთვის დიზაინი.', tags: ['იდენტობა', 'სოც. ბადეები', 'შეფუთვა'] },
  { id: 'devops', tone: 'lime', href: '/service-devops', title: 'DevOps სერვისები', desc: 'ღრუბლოვანი ინფრასტრუქტურა, CI/CD, Docker და Kubernetes, მონიტორინგი და უსაფრთხოება. iGaming DevOps პარტნიორ RealOps-თან ერთად.', tags: ['CI/CD', 'Kubernetes', 'მონიტორინგი'] },
];

module.exports = { CATALOG };
