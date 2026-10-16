'use strict';
/**
 * ელფოსტის გაგზავნა — გუნდის შეტყობინებები და კლიენტის დადასტურება.
 * SMTP-ის პარამეტრები გარემოს ცვლადებიდან (Hostinger → Environment variables):
 *   SMTP_HOST=smtp.hostinger.com  SMTP_PORT=465  SMTP_USER=hello@webico.io  SMTP_PASS=…  MAIL_FROM=hello@webico.io
 * თუ SMTP არ არის მითითებული, წერილი კონსოლში იწერება (ლიდი მაინც ინახება ადმინში).
 */
const nodemailer = require('nodemailer');
const { read, isEmail } = require('./core');

const TEAM_EMAIL = 'hello@webico.io';
let transport = null;

function getTransport() {
  if (transport !== null) return transport;
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const port = Number(process.env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' },
    });
  } else if (process.env.MAIL_SENDMAIL) {
    transport = nodemailer.createTransport({ sendmail: true, newline: 'unix', path: process.env.MAIL_SENDMAIL });
  } else {
    transport = false;
  }
  return transport;
}

/** სად მოდის ლიდები: ადმინის „პარამეტრები → ელფოსტა“, თუ არა — hello@webico.io */
function teamEmail() {
  const v = String((read('site').settings || {}).email || '').trim();
  return isEmail(v) ? v : TEAM_EMAIL;
}

async function send(to, subject, text, replyTo = '') {
  if (!isEmail(to)) return false;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@webico.io';
  const msg = { from: `Webico <${from}>`, to, subject, text };
  replyTo = String(replyTo || '').replace(/[\r\n]+/g, '');
  if (isEmail(replyTo)) msg.replyTo = replyTo;
  const t = getTransport();
  if (!t) {
    console.log('[mail — SMTP არ არის მითითებული]\nTo: %s\nSubject: %s\n\n%s\n', to, subject, text);
    return false;
  }
  try {
    await t.sendMail(msg);
    return true;
  } catch (err) {
    console.error('mail failed:', err.message);
    return false;
  }
}

/** ველების სია ტექსტად; ცარიელები გამოტოვებულია */
function lines(fields) {
  return Object.entries(fields).map(([k, v]) => [k, String(v ?? '').trim()]).filter(([, v]) => v !== '')
    .map(([k, v]) => k + ': ' + v + '\n').join('');
}

module.exports = { send, lines, teamEmail };
