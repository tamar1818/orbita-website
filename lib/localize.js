'use strict';
/**
 * ინგლისური ვერსია React-ში: ქართული გვერდის ელემენტების ხე ითარგმნება data/en/i18n.json ლექსიკონით.
 * წესები იგივეა, რაც lib/i18n.js-ში (HTML-ის თარგმნა):
 *  - ელემენტი, რომელშიც მხოლოდ ტექსტი და მარტივი ტეგებია (b, a, em...), ითარგმნება მთლიანად (HTML სტრიქონით);
 *  - დანარჩენ შემთხვევაში — ცალკეული ტექსტი;
 *  - ატრიბუტები (alt, title, placeholder, aria-label...) და JSON-LD — იმავე ლექსიკონით;
 *  - შიდა ბმულები ინგლისურ მისამართებზე გადადის, „₾“ → „GEL“.
 * ამიტომ ინგლისურ გვერდს ყოველთვის იგივე სექციები აქვს, რაც ქართულს, და ტექსტების თარგმნა ისევ
 * `node tools/i18n.js scan/merge`-ით ხდება.
 */
const React = require('react');
const { look, mapHref, translateJson, translateHtml, mapLinks, gel, GE, ATTRS, JSON_ATTRS, INLINE } = require('./i18n');

const SKIP = new Set(['style', 'svg', 'template']);
const VOID = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'source', 'track', 'wbr']);
const CLIENT_REF = Symbol.for('react.client.reference');
/** ატრიბუტების სახელები React-ში */
const PROP_ATTRS = ATTRS.map((a) => [a === 'value' ? 'defaultValue' : a, a]).concat([['value', 'value']]);

const isEl = (n) => React.isValidElement(n);
const isPrim = (n) => typeof n === 'string' || typeof n === 'number';
const kidsOf = (n) => React.Children.toArray(n.props.children);
const inner = (n) => n.props.dangerouslySetInnerHTML && n.props.dangerouslySetInnerHTML.__html;

/* ---------------------------------------------- სერვერული კომპონენტების გაშლა */
/** ფუნქციური კომპონენტები სინქრონულად გამოიძახება, რომ ხეში მხოლოდ HTML ელემენტები დარჩეს */
function expand(node) {
  if (Array.isArray(node)) return node.map(expand);
  if (!isEl(node)) return node;
  const { type } = node;
  if (type === React.Fragment) return expand(kidsOf(node));
  if (typeof type === 'function' && type.$$typeof !== CLIENT_REF) return expand(type(node.props));
  if (typeof type !== 'string' || node.props.children === undefined) return node;
  return React.cloneElement(node, undefined, ...[].concat(expand(kidsOf(node))));
}

/* --------------------------------------------------------- HTML სერიალიზაცია */
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/ /g, '&nbsp;');
const ATTR_NAME = { className: 'class', htmlFor: 'for', hrefLang: 'hreflang', dateTime: 'datetime', tabIndex: 'tabindex' };

function toHtml(nodes) {
  return [].concat(nodes).map((n) => {
    if (n === null || n === undefined || typeof n === 'boolean') return '';
    if (isPrim(n)) return escText(n);
    if (Array.isArray(n)) return toHtml(n);
    if (!isEl(n) || typeof n.type !== 'string') return '';
    const attrs = Object.entries(n.props)
      .filter(([k, v]) => k !== 'children' && k !== 'dangerouslySetInnerHTML' && v !== false && v !== null && v !== undefined)
      .map(([k, v]) => ' ' + (ATTR_NAME[k] || k) + (v === true || v === '' ? '' : '="' + escAttr(v) + '"')).join(''); // dom-serializer: ცარიელი ატრიბუტი ="" -ის გარეშე
    if (VOID.has(n.type)) return '<' + n.type + attrs + '>';
    return '<' + n.type + attrs + '>' + (inner(n) || toHtml(kidsOf(n))) + '</' + n.type + '>';
  }).join('');
}

/* ------------------------------------------------------------------- თარგმნა */
function hasGe(n) {
  if (isPrim(n)) return GE.test(String(n));
  if (Array.isArray(n)) return n.some(hasGe);
  if (!isEl(n)) return false;
  for (const [k, v] of Object.entries(n.props)) {
    if (k === 'children') continue;
    if (typeof v === 'string' && GE.test(v)) return true;
  }
  if (inner(n) && GE.test(inner(n))) return true;
  return kidsOf(n).some(hasGe);
}

function richLeaf(n) {
  if (inner(n)) return false;
  return kidsOf(n).every((c) => isPrim(c) || (isEl(c) && typeof c.type === 'string' && INLINE.has(c.type) && richLeaf(c)));
}

/** მეზობელი ტექსტები ერთ სტრიქონად („ყველა პროექტი (“ + 12 + „)“ → ერთი ტექსტი, როგორც HTML-ში) */
function mergeText(kids) {
  const out = [];
  for (const k of kids) {
    if (isPrim(k) && out.length && isPrim(out[out.length - 1])) out[out.length - 1] = String(out[out.length - 1]) + k;
    else out.push(k);
  }
  return out;
}

function text(s, where) {
  s = String(s);
  if (GE.test(s)) {
    const t = look(s, where);
    if (t !== null) s = s.match(/^\s*/)[0] + t + s.match(/\s*$/)[0];
  }
  return gel(s);
}

function attrs(props, where, type) {
  const out = {};
  for (const [prop, attr] of PROP_ATTRS) {
    const v = props[prop];
    if (typeof v === 'string' && GE.test(v)) {
      const t = look(v, where);
      if (t !== null) out[prop] = t.replace(/<[^>]+>/g, '');
    }
    void attr;
  }
  for (const a of JSON_ATTRS) {
    const v = props[a];
    if (typeof v === 'string' && GE.test(v)) { try { out[a] = JSON.stringify(translateJson(JSON.parse(v), where)); } catch { /* */ } }
  }
  // ენის გადამრთველის ბმულები (hrefLang) უცვლელი რჩება
  if (type === 'a' && typeof props.href === 'string' && !props.hrefLang) out.href = mapHref(props.href);
  if (type === 'form' && typeof props.action === 'string') out.action = mapHref(props.action);
  return out;
}

function translate(node, where) {
  if (Array.isArray(node)) return mergeText(node).map((n) => translate(n, where));
  if (isPrim(node)) return text(node, where);
  if (!isEl(node) || typeof node.type !== 'string') return node;
  const { type, props } = node;
  if (props.lang === 'ka') return node; // ქართულად დატოვებული ელემენტი (მაგ. ენის გადამრთველი)

  if (type === 'script') {
    const src = inner(node);
    if (props.type === 'application/ld+json' && src) {
      try {
        const json = JSON.stringify(translateJson(JSON.parse(src), where), null, 4).replace(/</g, '\\u003c');
        return React.cloneElement(node, { dangerouslySetInnerHTML: { __html: json } });
      } catch { /* */ }
    }
    return node;
  }
  if (type === 'textarea') return React.cloneElement(node, attrs(props, where, type));
  if (SKIP.has(type)) return node;

  const own = attrs(props, where, type);
  const html = inner(node);
  if (html) {
    return React.cloneElement(node, { ...own, dangerouslySetInnerHTML: { __html: GE.test(html) || /href="\//.test(html) ? translateHtml(html, where) : gel(html) } });
  }
  const kids = mergeText(kidsOf(node));
  if (!hasGe(node)) {
    return kids.length ? React.cloneElement(node, own, ...kids.map((k) => (isPrim(k) ? gel(String(k)) : translate(k, where)))) : React.cloneElement(node, own);
  }
  if (richLeaf(node) && kids.some((k) => isPrim(k) && GE.test(String(k))) && kids.some(isEl)) {
    const t = look(toHtml(kids), where);
    if (t !== null) {
      const { children, ...rest } = { ...props, ...own }; // eslint-disable-line no-unused-vars
      return React.createElement(type, { ...rest, key: node.key, dangerouslySetInnerHTML: { __html: gel(mapLinks(t)) } });
    }
  }
  return React.cloneElement(node, own, ...kids.map((k) => translate(k, where)));
}

/** ქართული გვერდის ხე → ენის ვერსია (ka — უცვლელად) */
function localize(tree, lang, kaPath) {
  if (lang !== 'en') return tree;
  return translate(expand(tree), kaPath);
}

/** ტექსტის თარგმნა (მეტა-თეგებისთვის) */
const tr = (s, lang, where = '') => (lang === 'en' && GE.test(String(s || '')) ? (look(s, where) ?? String(s)) : String(s || ''));

module.exports = { localize, expand, tr, toHtml };
