'use strict';
/** კლიენტის IP (Hostinger-ის proxy-ს უკან — X-Forwarded-For-ის პირველი მისამართი) */
function clientIp(request) {
  const h = request.headers;
  return String((h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || '');
}

module.exports = { clientIp };
