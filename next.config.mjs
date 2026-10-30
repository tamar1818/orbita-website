/** Next.js-ის პარამეტრები: უსაფრთხოების ჰედერები, ასეტების ქეში */
const security = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
];

export default {
  poweredByHeader: false,
  // მეტა-თეგები ყოველთვის <head>-ში (და არა სტრიმინგით) — ყველა ბოტისთვის და სოციალური ქსელისთვის
  htmlLimitedBots: /.*/,
  // ბოლო სლეშს proxy.js ასწორებს (301), /admin/ კი სლეშით უნდა დარჩეს
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ['nodemailer', 'sanitize-html'],
  async headers() {
    return [
      { source: '/:path*', headers: security },
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] },
      { source: '/assets/:path*.:ext(svg|png|jpg|jpeg|webp|woff|woff2)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }] },
    ];
  },
};
