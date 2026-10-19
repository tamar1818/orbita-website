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
                   sizes="${i ? '(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 320px' : '(max-width: 1100px) 100vw, 640px'}" alt="${e(name)}" width="1100" height="1375" loading="lazy" decoding="async">
            </div>
            <figcaption><b>${e(name)}</b><span>${e(role)}</span></figcaption>
          </figure>`;
        })}
        </div>
      </div>
    </section>
`;
}

module.exports = { TEAM, teamSection };
