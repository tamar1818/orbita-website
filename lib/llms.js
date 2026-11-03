'use strict';
/** /llms.txt და /llms-full.txt — AI საძიებოებისთვის (llmstxt.org ფორმატი). ტექსტი ინგლისურადაა (data/en/i18n.json),
 *  ქართული ვერსიის ბმულებით. ყოველთვის აქტუალურია: სერვისები, პროექტები და სტატიები ცოცხლად იკითხება. */
const { opt } = require('./core');
const { projects } = require('./projects');
const { posts: allPosts } = require('./blog');
const { look, enPath } = require('./i18n');
const { CATALOG } = require('./catalog');

const SITE = 'https://webico.io';
const en = (ka) => { const t = look(String(ka ?? ''), ''); return (t === null ? String(ka ?? '') : t).replace(/<[^>]+>/g, '').trim(); };
const enUrl = (p) => SITE + (enPath(p) || '/en');
const kaUrl = (p) => SITE + p;
const strip = (h) => String(h ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function head() {
  const email = opt('email', 'hello@webico.io');
  const phone = opt('phone', '+995 557 64 32 25');
  return [
    '# Webico',
    '',
    '> Webico (ვებიკო) is a full-service digital agency in Tbilisi, Georgia. One team covers software engineering, web development, e-commerce and payment integrations, SEO, digital advertising, content strategy, copywriting, branding and graphic design, photo and video production, AI content creation and DevOps. The site is in Georgian (default) and English (/en).',
    '',
    `- Location: Tbilisi, Georgia; works with clients in Georgia and abroad`,
    `- Contact: ${email}, ${phone}`,
    `- Languages: Georgian, English`,
    `- Free consultation: ${SITE}/en/contact`,
    '',
  ];
}

function services(full) {
  const out = ['## Services', ''];
  for (const c of CATALOG) {
    out.push(`- [${en(c.title)}](${enUrl(c.href)}): ${en(c.desc)}` + (full ? ` Keywords: ${c.tags.map(en).join(', ')}. Georgian page: ${kaUrl(c.href)}` : ''));
  }
  out.push('');
  return out;
}

function pages() {
  return ['## Main pages', '',
    `- [Home](${SITE}/en): overview of the agency and its services`,
    `- [About](${SITE}/en/about): team, values and how we work`,
    `- [All services](${SITE}/en/services): full service list with FAQ`,
    `- [Portfolio](${SITE}/en/work): websites, online stores and platforms we built`,
    `- [Blog](${SITE}/en/blog): practical guides on websites, SEO, marketing and branding for businesses in Georgia`,
    `- [Free website preview](${SITE}/en/start): configure a site and get a free preview within 24 hours`,
    `- [Contact](${SITE}/en/contact): book a free 30-minute consultation`,
    ''];
}

function work(full) {
  const out = ['## Portfolio', ''];
  for (const p of projects()) {
    const url = enUrl('/work-' + p.slug);
    out.push(full ? `- [${p.name}](${url}): ${en(p.summary)}` + (p.domain ? ` (${p.domain})` : '') : `- [${p.name}](${url})`);
  }
  out.push('');
  return out;
}

function blog(full) {
  const out = ['## Blog', ''];
  for (const p of allPosts()) {
    const url = enUrl('/blog/' + p.slug);
    out.push(`- [${en(p.title)}](${url}): ${en(p.excerpt)}`);
    if (full) {
      const body = strip(p.body); const t = en(body);
      if (t !== body) out.push('', '  ' + t.slice(0, 1800) + (t.length > 1800 ? '…' : ''), '');
    }
  }
  out.push('');
  return out;
}

function render(full = false) {
  const lines = [...head(), ...services(full), ...pages(), ...work(full), ...blog(false)];
  if (!full) lines.push('## Optional', '', `- [Full context for LLMs](${SITE}/llms-full.txt): services, every portfolio project and blog summaries`, `- [Sitemap](${SITE}/sitemap.xml)`, '');
  else lines.push('## Notes', '', '- Prices are in Georgian lari (GEL); custom projects are quoted after a free consultation.', '- Payments: Flitt, UniPAY, Bank of Georgia, TBC, Apple Pay and Google Pay. Stripe does not onboard Georgian companies directly.', '- DevOps for iGaming is delivered together with partner RealOps (realops.tech).', '');
  return lines.join('\n');
}

module.exports = { render };
