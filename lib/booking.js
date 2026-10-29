'use strict';
/** შეხვედრების დაჯავშნა — სამუშაო საათები, თავისუფალი დროები, ჯავშნები (თბილისის დროით) */
const { read, today, pad } = require('./core');

const DEFAULTS = { days: [1, 2, 3, 4, 5], start: '10:00', end: '18:00', slot: 30, notice: 3, ahead: 21, blocked: [] };
const WEEKDAYS = { 1: 'ორშ', 2: 'სამ', 3: 'ოთხ', 4: 'ხუთ', 5: 'პარ', 6: 'შაბ', 7: 'კვი' };
const WEEKDAYS_FULL = { 1: 'ორშაბათი', 2: 'სამშაბათი', 3: 'ოთხშაბათი', 4: 'ხუთშაბათი', 5: 'პარასკევი', 6: 'შაბათი', 7: 'კვირა' };
const EN_DAYS = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' };
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_GEN = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const toInt = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };

function config() {
  const c = read('site').booking || {};
  const cfg = { ...DEFAULTS };
  for (const [k, v] of Object.entries(c)) if (v !== '' && v !== null && v !== undefined) cfg[k] = v;
  cfg.days = [].concat(cfg.days || []).map(toInt).filter((d) => d >= 1 && d <= 7);
  cfg.slot = clamp(toInt(cfg.slot), 15, 120);
  cfg.notice = clamp(toInt(cfg.notice), 0, 72);
  cfg.ahead = clamp(toInt(cfg.ahead), 1, 90);
  for (const k of ['start', 'end']) if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(cfg[k]))) cfg[k] = DEFAULTS[k];
  cfg.blocked = [].concat(cfg.blocked || []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d)));
  return cfg;
}

function bookings() { return read('bookings', { bookings: [] }).bookings || []; }

/** დაკავებული დროები: Set('Y-m-d H:i') — გაუქმებულის გარდა */
function bookedSet() {
  const s = new Set();
  for (const b of bookings()) if ((b.status || 'new') !== 'cancelled') s.add((b.date || '') + ' ' + (b.time || ''));
  return s;
}

/** ლოკალური Date Y-m-d H:i-დან (სერვერის TZ = Asia/Tbilisi) */
function at(date, hm) {
  const [y, m, d] = date.split('-').map(Number);
  const [h, mi] = hm.split(':').map(Number);
  return new Date(y, m - 1, d, h, mi, 0, 0);
}
function isoDow(d) { return d.getDay() === 0 ? 7 : d.getDay(); }
function validDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const d = at(date, '00:00');
  return today(d) === date ? d : null;
}

function daySlots(date, cfg = config(), booked = bookedSet()) {
  const day = validDate(date);
  if (!day || cfg.blocked.includes(date) || !cfg.days.includes(isoDow(day))) return [];
  const earliest = Date.now() + cfg.notice * 3600 * 1000;
  let t = at(date, cfg.start);
  const end = at(date, cfg.end).getTime();
  const step = cfg.slot * 60 * 1000;
  const out = [];
  while (t.getTime() + step <= end) {
    const hm = pad(t.getHours()) + ':' + pad(t.getMinutes());
    if (t.getTime() >= earliest && !booked.has(date + ' ' + hm)) out.push(hm);
    t = new Date(t.getTime() + step);
  }
  return out;
}

function days(lang) {
  const en = lang === 'en';
  const cfg = config();
  const booked = bookedSet();
  const out = [];
  const now = new Date();
  for (let i = 0; i < cfg.ahead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const date = today(d);
    out.push({
      date,
      dow: en ? EN_DAYS[isoDow(d)].slice(0, 3) : WEEKDAYS[isoDow(d)],
      day: d.getDate(),
      month: en ? EN_MONTHS[d.getMonth()].slice(0, 3) : [...MONTHS_GEN[d.getMonth()]].slice(0, 3).join(''),
      slots: daySlots(date, cfg, booked),
    });
  }
  return out;
}

/** „ხუთშაბათი, 2 ოქტომბერი, 11:30“ (lang 'en' — „Thursday, 2 October, 11:30“) */
function label(date, time, lang) {
  const d = validDate(date);
  if (!d) return date + ' ' + time;
  if (lang === 'en') return EN_DAYS[isoDow(d)] + ', ' + d.getDate() + ' ' + EN_MONTHS[d.getMonth()] + ', ' + time;
  return WEEKDAYS_FULL[isoDow(d)] + ', ' + d.getDate() + ' ' + MONTHS_GEN[d.getMonth()] + ', ' + time;
}

module.exports = { DEFAULTS, WEEKDAYS, WEEKDAYS_FULL, MONTHS_GEN, config, bookings, bookedSet, daySlots, days, label, at };
