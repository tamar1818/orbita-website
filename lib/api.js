'use strict';
/**
 * API: /api/lead.php, /api/slots.php, /api/book.php (ძველი მისამართები — client/interactions.js მათ იყენებს).
 * ყოველი ფუნქცია აბრუნებს { status, json, after } — after: ელფოსტა, რომელიც პასუხის შემდეგ იგზავნება.
 */
const crypto = require('crypto');
const { read, write, isEmail, nowStamp, ts } = require('./core');
const booking = require('./booking');
const mail = require('./mail');

const ip = (req) => String(req.ip || '');
const getter = (body) => (k, max = 500) => [...String(body?.[k] ?? '').trim()].slice(0, max).join('');
const id = () => crypto.randomBytes(8).toString('hex');

/* ------------------------------------------------------------- ლიდები */
function lead(req) {
  const b = req.body || {};
  if (b.company_website) return { status: 200, json: { ok: true } }; // honeypot
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
  if (errors.length) return { status: 422, json: { ok: false, fields: errors } };

  const store = read('leads', { leads: [] });
  let leads = store.leads || [];
  const now = ts();
  if (leads.filter((l) => (l.ip || '') === ip(req) && now - Number(l.ts || 0) < 600).length >= 5) {
    return { status: 429, json: { ok: false, error: 'too many requests' } };
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
  if (!write('leads', store)) return { status: 500, json: { ok: false, error: 'storage' } };

  // ელფოსტა — წარუმატებლობა განაცხადს არ აუქმებს
  return { status: 200, json: { ok: true }, after: async () => {
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
  if (src === 'configurator' && email && /^\/en(\/|$)/.test(get('page', 200))) {
    await mail.send(email, 'Webico: we have your request',
      `Hi ${name},\n\n`
      + 'Thank you. We\'ll get in touch within 24 hours and show you how your website could look.\n'
      + 'The sample is free. You only pay if you like it.\n\n'
      + `Your choices:\n${message}\n\n`
      + 'If you have a question, just reply to this email.\n\nWebico, webico.io', mail.teamEmail());
  } else if (src === 'configurator' && email) {
    await mail.send(email, 'Webico: თქვენი მოთხოვნა მივიღეთ',
      `გამარჯობა, ${name}!\n\n`
      + 'მადლობა. 24 საათში დაგიკავშირდებით და გაჩვენებთ, როგორ შეიძლება გამოიყურებოდეს თქვენი საიტი.\n'
      + 'ნიმუში უფასოა. თუ მოგეწონებათ, მხოლოდ მაშინ გადაიხდით.\n\n'
      + `თქვენი არჩევანი:\n${message}\n\n`
      + 'კითხვა თუ გაქვთ, უპასუხეთ ამ წერილს.\n\nWebico, webico.io', mail.teamEmail());
  }
  } };
}

/* -------------------------------------------------------------- ჯავშანი */
function slots(req) {
  const cfg = booking.config();
  return { status: 200, json: { ok: true, slot: cfg.slot, days: booking.days(req.query.lang) } };
}

function book(req) {
  const b = req.body || {};
  if (b.company_website) return { status: 200, json: { ok: true, label: '' } };
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
  if (errors.length) return { status: 422, json: { ok: false, fields: errors } };

  // Node ერთნაკადიანია: წაკითხვა → შემოწმება → ჩაწერა ერთ სინქრონულ ნაბიჯშია, ორმაგი ჯავშანი გამორიცხულია
  const store = read('bookings', { bookings: [] });
  const list = store.bookings || [];
  const now = ts();
  if (list.filter((x) => (x.ip || '') === ip(req) && now - Number(x.ts || 0) < 3600).length >= 3) {
    return { status: 429, json: { ok: false, error: 'too many requests' } };
  }
  if (!booking.daySlots(date).includes(time)) return { status: 409, json: { ok: false, error: 'taken' } };

  const item = {
    id: id(), ts: now, created: nowStamp(), date, time, name, email, phone,
    company: get('company', 160), topic: get('topic', 80), format: get('format', 40),
    message: get('message', 2000), status: 'new', ip: ip(req),
  };
  list.push(item);
  store.bookings = list.slice(-3000);
  if (!write('bookings', store)) return { status: 500, json: { ok: false, error: 'storage' } };

  const en = get('lang', 2) === 'en';
  const label = booking.label(date, time, en ? 'en' : 'ka');
  const kaLabel = booking.label(date, time);
  const slot = booking.config().slot;
  const start = booking.at(date, time);
  const end = new Date(start.getTime() + slot * 60000);
  const z = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const team = mail.teamEmail();
  const gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(en ? 'Consultation — Webico' : 'კონსულტაცია — Webico')
    + '&dates=' + z(start) + '/' + z(end)
    + '&details=' + encodeURIComponent((en ? 'The Webico team will contact you at the agreed time. Questions: ' : 'ვებიკოს გუნდი დაგიკავშირდებათ დათქმულ დროს. კითხვები: ') + team);

  return { status: 200, json: { ok: true, label, gcal }, after: async () => {
  await mail.send(team, 'ახალი შეხვედრა: ' + kaLabel + ' — ' + name + (en ? ' (EN)' : ''),
    'ახალი ჯავშანი webico.io-დან\n\n'
    + mail.lines({
      'დრო': kaLabel + ' (' + slot + ' წთ, თბილისის დროით)',
      'სახელი': name, 'ელფოსტა': email, 'ტელეფონი': phone,
      'კომპანია': item.company, 'თემა': item.topic, 'ფორმატი': item.format,
    })
    + (item.message !== '' ? '\n' + item.message + '\n' : '')
    + '\nყველა ჯავშანი: https://webico.io/admin?p=bookings\n', email);
  if (en) {
    await mail.send(email, 'Your meeting is booked — ' + label,
      `Hi ${name},\n\n`
      + `Thank you, your meeting is booked:\n${label} (Tbilisi time, ${slot} minutes).\n\n`
      + 'A member of our team will contact you at the agreed time and send you the meeting link.\n\n'
      + `Add to calendar: ${gcal}\n\n`
      + 'If you need a different time, just reply to this email.\n\n— The Webico team\nhttps://webico.io/en\n', team);
    return;
  }
  await mail.send(email, 'შეხვედრა დაჯავშნილია — ' + label,
    `გამარჯობა, ${name}!\n\n`
    + `მადლობა — შეხვედრა დაჯავშნილია:\n${label} (თბილისის დროით, ${slot} წუთი).\n\n`
    + 'ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ და შეხვედრის ბმულსაც გამოგიგზავნით.\n\n'
    + `კალენდარში დამატება: ${gcal}\n\n`
    + 'თუ დრო შეგეცვალათ, უბრალოდ უპასუხეთ ამ წერილს.\n\n— ვებიკოს გუნდი\nhttps://webico.io\n', team);
  } };
}

module.exports = { lead, slots, book };
