'use strict';
/** გუნდის სექცია (ჩვენ შესახებ — ქართული და ინგლისური) */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { e, ROOT } = require('./core');
const { map } = require('./tpl');

const TEAM = [
  { slug: 'tamar-geliashvili', ka: ['თამარ გელიაშვილი', 'დამფუძნებელი, CEO და ტექნიკური ხელმძღვანელი'], en: ['Tamar Geliashvili', 'Founder, CEO & Tech Lead'] },
  { slug: 'kesaria-kobidze', ka: ['კესარია კობიძე', 'გაყიდვების ხელმძღვანელი'], en: ['Kesaria Kobidze', 'Head of Sales'] },
  { slug: 'giorgi-samunashvili', ka: ['გიორგი სამუნაშვილი', 'DevOps და ინფრასტრუქტურის ინჟინერი'], en: ['Giorgi Samunashvili', 'DevOps & Infrastructure Engineer'] },
  { slug: 'nanuka-matsaberidze', ka: ['ნანუკა მაცაბერიძე', 'სოციალური მედია და ციფრული მარკეტინგი'], en: ['Nanuka Matsaberidze', 'Social Media & Digital Marketing'] },
  { slug: 'elene-kituashvili', ka: ['ელენე კიტუაშვილი', 'გაყიდვების მენეჯერი'], en: ['Elene Kituashvili', 'Sales Manager'] },
];

/** ფაილის ვერსია ბრაუზერის ქეშისთვის: ფოტოს შეცვლისას ბმულიც იცვლება */
const versions = new Map();
function ver(file) {
  if (!versions.has(file)) {
    let v = '';
    try { v = '?v=' + crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, file))).digest('hex').slice(0, 8); } catch { /* */ }
    versions.set(file, v);
  }
  return versions.get(file);
}

function teamSection(lang = 'ka') {
  const t = lang === 'en'
    ? ['The team', 'The people you will work with, from the first call to launch and beyond.']
    : ['გუნდი', 'ადამიანები, ვისთანაც იმუშავებთ: პირველი ზარიდან გაშვებამდე და შემდეგაც.'];
  return `
    <section class="section team" id="team">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <h2>${t[0]}</h2>
          <p>${t[1]}</p>
        </div>
        <div class="team-grid">${map(TEAM, (m, i) => {
          const [name, role] = m[lang] || m.ka;
          return `
          <figure class="person" data-reveal data-reveal-delay="${i * 70}">
            <div class="person__photo">
              <img src="/assets/img/team/${m.slug}.webp${ver(`assets/img/team/${m.slug}.webp`)}" srcset="/assets/img/team/${m.slug}-sm.webp${ver(`assets/img/team/${m.slug}-sm.webp`)} 560w, /assets/img/team/${m.slug}.webp${ver(`assets/img/team/${m.slug}.webp`)} 1100w"
                   sizes="(max-width: 700px) ${i ? '50vw' : '100vw'}, (max-width: 1100px) 33vw, 260px" alt="${e(name)}" width="1100" height="1375" loading="lazy" decoding="async">
            </div>
            <figcaption><b>${e(name)}</b><span>${e(role)}</span></figcaption>
          </figure>`;
        })}
        </div>
      </div>
    </section>
`;
}

/** CTA ბლოკის საკონტაქტო ბარათი: გაყიდვების ხელმძღვანელი ფოტოთი */
function salesCard(lang = 'ka', phone = '+995 557 64 32 25', email = 'hello@webico.io') {
  const m = TEAM.find((x) => x.slug === 'kesaria-kobidze');
  const [name, role] = m[lang] || m.ka;
  const t = lang === 'en'
    ? { note: 'Your first point of contact. Replies within one business day.', call: 'Call', mail: 'Email' }
    : { note: 'პირველ საუბარს ის გაგიწევთ. გიპასუხებთ ერთ სამუშაო დღეში.', call: 'დარეკვა', mail: 'მიწერა' };
  const img = `/assets/img/team/${m.slug}-sm.webp${ver(`assets/img/team/${m.slug}-sm.webp`)}`;
  return `<div class="sales-card">
              <img class="sales-card__photo" src="${img}" alt="${e(name)}" width="560" height="700" loading="lazy" decoding="async">
              <div class="sales-card__body">
                <b>${e(name)}</b>
                <span>${e(role)}</span>
                <p>${e(t.note)}</p>
                <div class="sales-card__links">
                  <a href="tel:${e(phone.replace(/[^\d+]/g, ''))}"><small>${t.call}</small>${e(phone)}</a>
                  <a href="mailto:${e(email)}"><small>${t.mail}</small>${e(email)}</a>
                </div>
              </div>
            </div>`;
}

module.exports = { TEAM, teamSection, salesCard };
