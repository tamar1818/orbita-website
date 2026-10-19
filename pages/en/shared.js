'use strict';
/** Shared content and blocks for the English pages */
const { e, setting } = require('../../lib/core');
const { projects, showcase, tags } = require('../../lib/projects');
const { map } = require('../../lib/tpl');
const EN = require('../../data/en/projects.json');

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';

const SERVICES = [
  { id: 'websites', page: 'web-development', tone: 'lilac', title: 'Website design & development',
    text: 'Company websites, landing pages and web apps. Fast, clear and built to work on every screen.',
    tags: ['Corporate', 'Landing pages', 'Web apps'],
    items: ['Strategy, sitemap and content structure', 'UI/UX design in Figma', 'Custom front-end and CMS', 'Multilingual sites with correct hreflang', 'Analytics and conversion tracking'] },
  { id: 'ecommerce', page: 'ecommerce-development', tone: 'pink', title: 'Online stores',
    text: 'WooCommerce, Shopify or custom builds with card payments, delivery rules and a checkout people finish.',
    tags: ['WooCommerce', 'Shopify', 'Payments'],
    items: ['Catalogue, filters and search', 'Card payments and local gateways', 'Shipping zones and rates', 'Order management', 'GA4 e-commerce and Meta Pixel'] },
  { id: 'wordpress', page: 'wordpress-development', tone: 'lime', title: 'WordPress development',
    text: 'Lightweight custom themes, Elementor and ACF. Your team edits content without calling a developer.',
    tags: ['WordPress', 'Elementor', 'ACF'],
    items: ['Custom themes built from the approved design', 'Integrations with CRM, accounting and forms', 'Speed and Core Web Vitals work', 'Migrations and rebuilds'] },
  { id: 'design', page: 'ui-ux-design', tone: 'soft', title: 'UI/UX design & branding',
    text: 'Interfaces, design systems, logos and brand guidelines that hold together across every touchpoint.',
    tags: ['UI/UX', 'Figma', 'Brand identity'],
    items: ['Research and user flows', 'Wireframes and prototypes', 'Design systems', 'Logo and brand guidelines'] },
  { id: 'seo', page: 'seo', tone: 'lime', title: 'SEO',
    text: 'Technical SEO, keyword research and content that brings in the right visitors.',
    tags: ['Technical SEO', 'Content', 'Local SEO'],
    items: ['Technical audit', 'Keyword research', 'On-page optimisation', 'Content plan', 'Monthly reporting'] },
  { id: 'care', page: 'website-maintenance', tone: 'pink', title: 'Support & maintenance',
    text: 'Updates, security, backups and small changes every month, so the site keeps working while you run the business.',
    tags: ['Updates', 'Security', 'Backups'],
    items: ['Core, theme and plugin updates', 'Security monitoring', 'Daily backups', 'Speed checks', 'Content changes'] },
  { id: 'marketing', page: 'digital-marketing', tone: 'lilac', title: 'Digital marketing',
    text: 'Google, Facebook, Instagram and TikTok ads with clear reporting on what each campaign brought in.',
    tags: ['Google Ads', 'Meta', 'TikTok'],
    items: ['Campaign strategy', 'Ad creative', 'Conversion tracking', 'Weekly optimisation', 'Monthly report'] },
];

const tagEn = (t) => EN.tags[t] || t;
const projectTags = (p) => tags(p).map(tagEn);
const projectEn = (p) => EN.projects[p.slug] || {};

function withShots() {
  return showcase().filter((x) => String(x.shot ?? '').trim() !== '');
}

function faqBlock(list, idPrefix) {
  return `<div class="faq">${map(list, ([q, a], i) => `
            <div class="faq__item">
              <h3 style="margin:0">
                <button class="faq__q" type="button" aria-expanded="false" aria-controls="${idPrefix}${i + 1}">
                  <span>${e(q)}</span><span class="faq__icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__a" id="${idPrefix}${i + 1}" data-open="false"><div><p>${e(a)}</p></div></div>
            </div>`)}
          </div>`;
}

function leadForm(id, title = 'Tell us about your project') {
  return `<form class="lead-form" data-lead-form="${id}" method="post" action="#">
          <h3>${e(title)}</h3>
          <p class="lead-form__intro">A few sentences are enough.</p>
          <div class="form-status" role="alert" aria-live="polite"></div>
          <div class="field">
            <label for="${id}-name">Name <span class="req">*</span></label>
            <input type="text" id="${id}-name" name="name" autocomplete="name" required>
            <span class="field__error"></span>
          </div>
          <div class="field">
            <label for="${id}-email">Email <span class="req">*</span></label>
            <input type="email" id="${id}-email" name="email" autocomplete="email" placeholder="name@company.com" required>
            <span class="field__error"></span>
          </div>
          <div class="field">
            <label for="${id}-message">Project</label>
            <textarea id="${id}-message" name="message" rows="3" placeholder="What are you building, and by when?"></textarea>
            <span class="field__error"></span>
          </div>
          <div class="hp-field" aria-hidden="true"><label for="${id}-hp">Leave empty</label><input type="text" id="${id}-hp" name="company_website" tabindex="-1" autocomplete="off"></div>
          <button class="btn btn--primary btn--block" type="submit">Send</button>
        </form>`;
}

function ctaSection(id = 'en-cta') {
  const email = setting('email', 'hello@webico.io');
  return `
    <section class="cta">
      <div class="container">
        <div class="cta__inner">
          <div data-reveal>
            <h2>Let's talk about your project</h2>
            <p>Tell us what you do and what you need. We reply within one business day and plan the next steps together.</p>
            <div class="btn-row" style="margin-top:26px">
              <a class="btn btn--white" href="mailto:${email}">${email}</a>
              <a class="btn btn--light" href="tel:+995557643225">${setting('phone', '+995 557 64 32 25')}</a>
            </div>
          </div>
          <div data-reveal data-reveal-delay="90">
            ${leadForm(id)}
          </div>
        </div>
      </div>
    </section>
`;
}

module.exports = { ARROW, SERVICES, tagEn, projectTags, projectEn, withShots, faqBlock, leadForm, ctaSection, projects };
