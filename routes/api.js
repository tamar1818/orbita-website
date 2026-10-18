'use strict';
/** API: /api/lead.php, /api/slots.php, /api/book.php (ძველი მისამართები — main.js მათ იყენებს) */
const crypto = require('crypto');
const express = require('express');
const { read, write, isEmail, nowStamp, ts } = require('../lib/core');
const booking = require('../lib/booking');
const mail = require('../lib/mail');

const router = express.Router();
router.use(express.json({ limit: '64kb' }));
router.use(express.urlencoded({ extended: false, limit: '64kb' }));
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

const ip = (req) => String(req.ip || '');
const getter = (body) => (k, max = 500) => [...String(body?.[k] ?? '').trim()].slice(0, max).join('');
const id = () => crypto.randomBytes(8).toString('hex');

/* ------------------------------------------------------------- ლიდები */
async function lead(req, res) {
  const b = req.body || {};
  if (b.company_website) return res.json({ ok: true }); // honeypot
  const get = getter(b);
  const name = get('name', 120);
  const email = get('email', 160);
  const phone = get('phone', 60);
  const message = get('message', 4000);
  const errors = [];
  if (!name) errors.push('name');
  // საკმარისია ელფოსტა ან ტელეფონი (კონფიგურატორი მხოლოდ ტელეფონს ითხოვს)
  const phoneOk = phone.replace(/\D/g, '').length >= 7;
  if (email ? !isEmail(email) : !phoneOk) errors.push(email ? 'email' : 'phone');
  if (errors.length) return res.status(422).json({ ok: false, fields: errors });

  const store = read('leads', { leads: [] });
  let leads = store.leads || [];
  const now = ts();
  if (leads.filter((l) => (l.ip || '') === ip(req) && now - Number(l.ts || 0) < 600).length >= 5) {
    return res.status(429).json({ ok: false, error: 'too many requests' });
  }
  const src = get('source', 80);
  leads.push({
    id: id(), ts: now, date: nowStamp(), name, email, phone,
    company: get('company', 160), service: get('service', 60), budget: get('budget', 60),
    timeline: get('timeline', 60), website: get('website', 200), message, source: src,
    page: get('page', 200), ip: ip(req),
  });
  if (leads.length > 2000) leads = leads.slice(-2000);
  store.leads = leads;
  if (!write('leads', store)) return res.status(500).json({ ok: false, error: 'storage' });

  res.json({ ok: true });

  // ელფოსტა — წარუმატებლობა განაცხადს არ აუქმებს
  const subject = (src === 'chatbot' ? 'ახალი ლიდი ჩატბოტიდან — '
    : src === 'configurator' ? 'ნიმუშის მოთხოვნა — ' : 'ახალი განაცხადი — ') + name;
  await mail.send(mail.teamEmail(), subject,
    'ახალი განაცხადი webico.io-დან\n\n'
    + mail.lines({
      'სახელი': name, 'ელფოსტა': email, 'ტელეფონი': phone,
      'კომპანია': get('company', 160), 'ვებსაიტი': get('website', 200),
      'სერვისი': get('service', 60), 'ბიუჯეტი': get('budget', 60), 'ვადა': get('timeline', 60),
      'წყარო': src, 'გვერდი': get('page', 200),
    })
    + (message !== '' ? '\n' + message + '\n' : ''), email);
  if (src === 'configurator' && email) {
    await mail.send(email, 'Webico: თქვენი მოთხოვნა მივიღეთ',
      `გამარჯობა, ${name}!\n\n`
      + 'მადლობა. 24 საათში დაგიკავშირდებით და გაჩვენებთ, როგორ შეიძლება გამოიყურებოდეს თქვენი საიტი.\n'
      + 'ნიმუში უფასოა. თუ მოგეწონებათ, მხოლოდ მაშინ გადაიხდით.\n\n'
      + `თქვენი არჩევანი:\n${message}\n\n`
      + 'კითხვა თუ გაქვთ, უპასუხეთ ამ წერილს.\n\nWebico, webico.io', mail.teamEmail());
  }
}

/* -------------------------------------------------------------- ჯავშანი */
function slots(req, res) {
  const cfg = booking.config();
  res.json({ ok: true, slot: cfg.slot, days: booking.days() });
}

async function book(req, res) {
  const b = req.body || {};
  if (b.company_website) return res.json({ ok: true, label: '' });
  const get = getter(b);
  const name = get('name', 120);
  const email = get('email', 160);
  const phone = get('phone', 60);
  const date = get('date', 10);
  const time = get('time', 5);
  const errors = [];
  if (!name) errors.push('name');
  if (!isEmail(email)) errors.push('email');
  if (phone.replace(/\D/g, '').length < 7) errors.push('phone');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) errors.push('slot');
  if (errors.length) return res.status(422).json({ ok: false, fields: errors });

  // Node ერთნაკადიანია: წაკითხვა → შემოწმება → ჩაწერა ერთ სინქრონულ ნაბიჯშია, ორმაგი ჯავშანი გამორიცხულია
  const store = read('bookings', { bookings: [] });
  const list = store.bookings || [];
  const now = ts();
  if (list.filter((x) => (x.ip || '') === ip(req) && now - Number(x.ts || 0) < 3600).length >= 3) {
    return res.status(429).json({ ok: false, error: 'too many requests' });
  }
  if (!booking.daySlots(date).includes(time)) return res.status(409).json({ ok: false, error: 'taken' });

  const item = {
    id: id(), ts: now, created: nowStamp(), date, time, name, email, phone,
    company: get('company', 160), topic: get('topic', 80), format: get('format', 40),
    message: get('message', 2000), status: 'new', ip: ip(req),
  };
  list.push(item);
  store.bookings = list.slice(-3000);
  if (!write('bookings', store)) return res.status(500).json({ ok: false, error: 'storage' });

  const label = booking.label(date, time);
  const slot = booking.config().slot;
  const start = booking.at(date, time);
  const end = new Date(start.getTime() + slot * 60000);
  const z = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const team = mail.teamEmail();
  const gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('კონსულტაცია — Webico')
    + '&dates=' + z(start) + '/' + z(end)
    + '&details=' + encodeURIComponent('ვებიკოს გუნდი დაგიკავშირდებათ დათქმულ დროს. კითხვები: ' + team);

  res.json({ ok: true, label, gcal });

  await mail.send(team, 'ახალი შეხვედრა: ' + label + ' — ' + name,
    'ახალი ჯავშანი webico.io-დან\n\n'
    + mail.lines({
      'დრო': label + ' (' + slot + ' წთ, თბილისის დროით)',
      'სახელი': name, 'ელფოსტა': email, 'ტელეფონი': phone,
      'კომპანია': item.company, 'თემა': item.topic, 'ფორმატი': item.format,
    })
    + (item.message !== '' ? '\n' + item.message + '\n' : '')
    + '\nყველა ჯავშანი: https://webico.io/admin?p=bookings\n', email);
  await mail.send(email, 'შეხვედრა დაჯავშნილია — ' + label,
    `გამარჯობა, ${name}!\n\n`
    + `მადლობა — შეხვედრა დაჯავშნილია:\n${label} (თბილისის დროით, ${slot} წუთი).\n\n`
    + 'ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ და შეხვედრის ბმულსაც გამოგიგზავნით.\n\n'
    + `კალენდარში დამატება: ${gcal}\n\n`
    + 'თუ დრო შეგეცვალათ, უბრალოდ უპასუხეთ ამ წერილს.\n\n— ვებიკოს გუნდი\nhttps://webico.io\n', team);
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
router.post(['/lead.php', '/lead'], wrap(lead));
router.get(['/slots.php', '/slots'], slots);
router.post(['/book.php', '/book'], wrap(book));
router.all(['/lead.php', '/lead', '/book.php', '/book'], (req, res) => res.status(405).json({ ok: false, error: 'method not allowed' }));
router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.type === 'entity.parse.failed') return res.status(400).json({ ok: false, error: 'bad json' });
  console.error(err);
  res.status(500).json({ ok: false, error: 'server' });
});

module.exports = router;
