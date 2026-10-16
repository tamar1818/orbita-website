'use strict';
/** ბლოგი — სტატიების წაკითხვა, უსაფრთხო HTML და საერთო რენდერი */
const sanitizeHtml = require('sanitize-html');
const { read, e, url, today, stripTags } = require('./core');

const CATS = { seo: 'SEO', marketing: 'მარკეტინგი', web: 'ვებსაიტები', branding: 'ბრენდინგი', business: 'ბიზნესი' };
const TONES = ['lilac', 'lime', 'pink', 'soft', 'dark'];
const AUTHOR = 'ვებიკოს გუნდი';
const MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

/** გამოქვეყნებული სტატიები, ახლიდან ძველისკენ */
function posts(includeHidden = false) {
  let list = read('posts', { posts: [] }).posts || [];
  if (!includeHidden) {
    const t = today();
    list = list.filter((p) => !p.hidden && String(p.date || '') <= t);
  }
  return list.map((p, i) => [p, i])
    .sort((a, b) => (String(b[0].date || '') < String(a[0].date || '') ? -1 : String(b[0].date || '') > String(a[0].date || '') ? 1 : a[1] - b[1]))
    .map((x) => x[0]);
}

function post(slug) { return posts().find((p) => (p.slug || '') === slug) || null; }
function cat(p) { return CATS[p.category || ''] || 'ბლოგი'; }
function tone(p) { return TONES.includes(String(p.tone || '')) ? p.tone : 'lilac'; }

/** კითხვის დრო — ~160 სიტყვა წუთში */
function readTime(p) {
  const text = stripTags(String(p.body || '')).trim();
  const words = text === '' ? 1 : text.split(/\s+/u).length;
  return Math.max(1, Math.round(words / 160));
}

function dateKa(ymd) {
  const m = String(ymd || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return '';
  return Number(m[3]) + ' ' + MONTHS[Number(m[2]) - 1] + ', ' + m[1];
}

/**
 * სტატიის ტექსტის გასუფთავება: მხოლოდ ტიპოგრაფიული ტეგები; ატრიბუტები — a[href] და img[src|alt].
 * h2-ებს ვაძლევთ id-ს სარჩევისთვის. აბრუნებს [html, toc].
 */
function postBody(html) {
  const toc = [];
  html = String(html || '');
  if (html.trim() === '') return ['', toc];

  // უბრალო ტექსტი — ცარიელი ხაზი = ახალი აბზაცი
  if (!/<(p|h[2-4]|ul|ol|blockquote|figure)\b/i.test(html)) {
    html = html.trim().split(/(?:\r\n|\r|\n){2,}/u).map((t) => '<p>' + t.trim().replace(/\r\n|\r|\n/g, '<br>\n') + '</p>').join('');
  }

  let n = 0;
  const out = sanitizeHtml(html, {
    allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'blockquote', 'br', 'hr', 'figure', 'figcaption', 'img', 'code', 'mark'],
    disallowedTagsMode: 'discard',
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'iframe', 'object', 'embed', 'form', 'svg', 'math'],
    allowedAttributes: { a: ['href', 'rel', 'target'], img: ['src', 'alt', 'loading'], h2: ['id'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tag, attribs) => {
        const href = String(attribs.href || '').trim();
        const a = {};
        if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href)) {
          a.href = href;
          if (/^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?webico\.io/i.test(href)) { a.rel = 'noopener'; a.target = '_blank'; }
        }
        return { tagName: 'a', attribs: a };
      },
      img: (tag, attribs) => {
        const src = String(attribs.src || '').trim();
        if (!/^(https?:\/\/|\/|assets\/)/i.test(src)) return { tagName: 'img', attribs: {} };
        return { tagName: 'img', attribs: { src: url(src), alt: attribs.alt || '', loading: 'lazy' } };
      },
      h2: () => ({ tagName: 'h2', attribs: { id: 's' + (++n) } }),
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
  });
  // სარჩევი: h2-ების ტექსტი
  const re = /<h2 id="(s\d+)">([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = re.exec(out))) toc.push({ id: m[1], text: decode(stripTags(m[2])).trim() });
  return [out, toc];
}

function decode(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
}

function postFaq(p) {
  const out = [];
  for (const f of p.faq || []) {
    const q = String((f || [])[0] ?? '').trim();
    const a = String((f || [])[1] ?? '').trim();
    if (q && a) out.push([q, a]);
  }
  return out;
}

/** ადმინის ტექსტი → FAQ: ბლოკები ცარიელი ხაზით, პირველი ხაზი კითხვაა */
function parseFaq(raw) {
  const out = [];
  for (const block of String(raw || '').trim().split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/u)) {
    const lines = block.trim().split(/\r\n|\r|\n/u);
    const q = String(lines.shift() || '').trim();
    const a = lines.map((l) => l.trim()).join(' ').trim();
    if (q && a) out.push([q, a]);
  }
  return out;
}

const ICONS = {
  seo: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/>',
  marketing: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  web: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  branding: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  business: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
};

/** ქავერი: ატვირთული ფოტო ან გენერირებული ყდა */
function postCover(p, size = '') {
  const t = tone(p);
  const img = String(p.cover || '').trim();
  const cls = 'post-cover post-cover--' + t + (size ? ' post-cover--' + size : '');
  if (img) return '<div class="' + cls + ' post-cover--img"><img src="' + e(url(img)) + '" alt="" loading="lazy"></div>';
  const icon = ICONS[p.category || ''] || '<circle cx="12" cy="12" r="9"/>';
  return '<div class="' + cls + '" aria-hidden="true">'
    + '<span class="post-cover__cat">' + e(cat(p)) + '</span>'
    + '<span class="post-cover__icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg></span>'
    + '<span class="post-cover__title">' + e(p.cover_text ?? p.title ?? '') + '</span>'
    + '</div>';
}

function postCard(p, big = false) {
  const u = '/blog/' + e(p.slug);
  return '<article class="post-card' + (big ? ' post-card--big' : '') + '">'
    + '<a class="post-card__media" href="' + u + '" tabindex="-1" aria-hidden="true">' + postCover(p, big ? 'big' : '') + '</a>'
    + '<div class="post-card__body">'
    + '<p class="post-card__meta"><span class="post-card__cat">' + e(cat(p)) + '</span>'
    + '<span>' + e(dateKa(p.date || '')) + '</span>'
    + '<span>' + readTime(p) + ' წთ</span></p>'
    + '<h3 class="post-card__title"><a href="' + u + '">' + e(p.title || '') + '</a></h3>'
    + (big || p.excerpt ? '<p class="post-card__excerpt">' + e(p.excerpt || '') + '</p>' : '')
    + '<span class="post-card__more">წაიკითხე <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>'
    + '</div></article>';
}

module.exports = { CATS, TONES, AUTHOR, posts, post, cat, tone, readTime, dateKa, postBody, postFaq, parseFaq, postCover, postCard };
