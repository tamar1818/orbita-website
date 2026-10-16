'use strict';
/** შაბლონების დამხმარეები (PHP-ის სემანტიკით: ცარიელი მასივი/სტრიქონი/'0' = false) */
const map = (a, f) => (a || []).map(f).join('');
const empty = (v) => v === undefined || v === null || v === false || v === 0 || v === '' || v === '0'
  || (Array.isArray(v) && v.length === 0);
const truthy = (v) => !empty(v);
const decode = (s) => String(s ?? '').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
/** JSON <script>-ში ჩასასმელად (</script>-ის დაცვა) */
const ldJson = (v, indent) => JSON.stringify(v, null, indent).replace(/</g, '\\u003c');
module.exports = { map, empty, truthy, decode, ldJson };
