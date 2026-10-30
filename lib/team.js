'use strict';
/** გუნდის წევრები (სექცია — components/blocks.jsx) */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { PUBLIC } = require('./core');

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
    try { v = '?v=' + crypto.createHash('md5').update(fs.readFileSync(path.join(PUBLIC, file))).digest('hex').slice(0, 8); } catch { /* */ }
    versions.set(file, v);
  }
  return versions.get(file);
}

module.exports = { TEAM, ver };
