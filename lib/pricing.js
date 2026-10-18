'use strict';
/**
 * ფასები ერთ ადგილას — /plans, კონფიგურატორი, მთავარი და ნიშის გვერდები ამას კითხულობს.
 * ყველა რიცხვი ადმინიდან იცვლება („ტექსტები“ → ფასები).
 */
const { T } = require('./core');
const { decode } = require('./tpl');

function price(key, def) {
  const n = parseInt(decode(T(key, String(def))).replace(/\D/g, ''), 10);
  return n || def;
}
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function packages() {
  return [
    {
      id: 'start', name: 'სტარტი', who: 'ხელოსნისთვის, ფოტოგრაფისთვის, კონსულტანტისთვის',
      setup: price('pkg.start.setup', 290), month: price('pkg.start.month', 59), buy: price('pkg.start.buy', 1490),
      pages: 1,
      items: ['ერთგვერდიანი საიტი', 'მოთხოვნის ფორმა და WhatsApp ღილაკი', 'Google Maps და კონტაქტები', 'ჰოსტინგი, SSL და ასლები'],
    },
    {
      id: 'business', name: 'ბიზნესი', who: 'კაფესთვის, სალონისთვის, კლინიკისთვის', featured: true,
      setup: price('pkg.business.setup', 490), month: price('pkg.business.month', 99), buy: price('pkg.business.buy', 2490),
      pages: 5,
      items: ['5 გვერდამდე', 'ონლაინ ჯავშანი ან მენიუ', 'Google-ში გამოჩენის საფუძვლები', 'ჰოსტინგი, SSL და ასლები', 'თვეში 30 წუთი ცვლილებებისთვის'],
    },
    {
      id: 'shop', name: 'მაღაზია', who: 'მცირე ონლაინ მაღაზიისთვის',
      setup: price('pkg.shop.setup', 990), month: price('pkg.shop.month', 149), buy: price('pkg.shop.buy', 3990),
      pages: 10,
      items: ['კატალოგი და კალათა', 'ბარათით გადახდა (BOG, TBC ან Flitt)', 'მიწოდების პირობები', 'ჰოსტინგი, SSL და ასლები', 'თვეში 1 საათი ცვლილებებისთვის'],
    },
  ];
}

function maintenance() {
  return [
    { id: 'wordpress', name: 'WordPress-ის მოვლა', price: price('plans.wp.price', 500),
      desc: 'WordPress-ზე აწყობილი საიტისთვის.',
      items: ['ბირთვის, თემისა და პლაგინების განახლება', 'ვირუსებისა და მავნე კოდის შემოწმება', 'ყოველდღიური ასლები', 'სისწრაფის კონტროლი', 'ტექსტისა და ფოტოების შეცვლა'] },
    { id: 'custom', name: 'ინდივიდუალური საიტის მოვლა', price: price('plans.custom.price', 1000),
      desc: 'საკუთარ კოდზე აწყობილი საიტისთვის ან ვებ-აპლიკაციისთვის.',
      items: ['კოდისა და სერვერის მხარდაჭერა', 'ხარვეზების გასწორება', 'უსაფრთხოების განახლებები', 'ყოველდღიური ასლები', 'მცირე ახალი ფუნქციები'] },
    { id: 'seo', name: 'SEO და მოვლა', price: price('plans.seo.price', 1500), featured: true,
      desc: 'საიტის მოვლა და ზრდა Google-ში.',
      items: ['WordPress-ის მოვლის ყველაფერი', 'ტექნიკური SEO', 'საძიებო სიტყვების კვლევა', 'ყოველთვიური ტექსტები და გვერდების გაუმჯობესება', 'ანგარიში თვის ბოლოს'] },
  ];
}

function addons() {
  return {
    chat: ['ჩატბოტი მოთხოვნებისთვის', price('plans.addon.chat', 49), 'რამდენიმე კითხვას უსვამს ვიზიტორს და პასუხებს ელფოსტაზე გიგზავნით.'],
    booking: ['ონლაინ ჯავშანი', price('plans.addon.booking', 39), 'კლიენტი თვითონ ირჩევს დღესა და საათს, დარეკვა არ სჭირდება.'],
    lang: ['მეორე ენა', price('plans.addon.lang', 59), 'ინგლისური ან რუსული ვერსია.'],
    seo: ['SEO სტატიები', price('plans.addon.seo', 149), 'თვეში ორი სტატია ქართულად.'],
  };
}

/** წლიური გადახდა: 12 თვის ნაცვლად 10 */
const yearly = (month) => month * 10;

module.exports = { price, fmt, packages, maintenance, addons, yearly };
