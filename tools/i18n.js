'use strict';
/**
 * ინგლისური ვერსიის ლექსიკონი (data/en/i18n.json).
 *   node tools/i18n.js scan [http://localhost:3000]  — ყველა ქართული გვერდიდან უთარგმნელი ტექსტი → data/en/i18n-todo.json ({id: ქართული})
 *   node tools/i18n.js merge file.json             — თარგმანები ({id: English}) ლექსიკონში
 * სერვერი უნდა იყოს გაშვებული (npm start).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { units, untranslated } = require('../lib/i18n');

const ROOT = path.join(__dirname, '..');
const DICT = path.join(ROOT, 'data/en/i18n.json');
const TODO = path.join(ROOT, 'data/en/i18n-todo.json');
const id = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const writeJson = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 1) + '\n');

async function scan(base) {
  const sm = await (await fetch(base + '/sitemap.xml')).text();
  const urls = [...sm.matchAll(/<loc>https:\/\/webico\.io([^<]*)<\/loc>/g)].map((m) => m[1] || '/').filter((u) => !u.startsWith('/en'));
  urls.push('/404');
  const dict = readJson(DICT, {});
  const todo = {};
  const where = {};
  for (const u of urls) {
    const html = await (await fetch(base + u)).text();
    for (const k of units(html)) if (untranslated(k)) { todo[id(k)] = k; where[id(k)] = where[id(k)] || u; }
  }
  writeJson(TODO, todo);
  const chars = Object.values(todo).reduce((a, s) => a + s.length, 0);
  console.log(`${urls.length} გვერდი, უთარგმნელი: ${Object.keys(todo).length} (${chars} სიმბოლო) → ${path.relative(ROOT, TODO)}`);
  return { todo, where };
}

function merge(file) {
  const todo = readJson(TODO, {});
  const add = readJson(file, {});
  const dict = readJson(DICT, {});
  let n = 0;
  for (const [k, en] of Object.entries(add)) {
    const ka = todo[k] || (k.length > 8 ? k : null);
    if (!ka) { console.warn('უცნობი id:', k); continue; }
    dict[ka] = en; n++;
  }
  writeJson(DICT, dict);
  console.log(`დაემატა ${n}, სულ ${Object.keys(dict).length}`);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'scan') scan(arg || 'http://localhost:3000');
else if (cmd === 'merge') merge(arg);
else console.log('node tools/i18n.js scan|merge');

module.exports = { scan, id };
