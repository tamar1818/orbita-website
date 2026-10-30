/** გადამისამართებები (301): www → non-www, /page.html|.php → /page, ბოლო სლეში */
import { NextResponse } from 'next/server';
import { match } from '@/site/paths';
import { kaPath } from '@/lib/i18n';

export function proxy(request) {
  const url = request.nextUrl;
  // გვერდის მისამართი layout-ისთვის (<html lang>) და 404-ისთვის
  const headers = new Headers(request.headers);
  headers.set('x-webico-path', url.pathname);
  const next = () => NextResponse.next({ request: { headers } });
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();
  const host = request.headers.get('host') || '';
  const q = url.search;
  const go = (to) => NextResponse.redirect(to, 301);
  if (/^www\./i.test(host)) return go('https://' + host.replace(/^www\./i, '') + url.pathname + q);
  // მხოლოდ ლოკალური მისამართები: „//evil.com“ სხვა საიტზე გადამისამართება არ უნდა გახდეს
  const local = (p) => new URL('/' + p.replace(/^[/\\]+/, '') + q, request.url);
  const p = url.pathname;
  if (/^\/index\.(html|php)$/i.test(p)) return go(local(''));
  const m = p.match(/^\/(.+?)\.(html|php)$/i);
  if (m) return go(local(m[1]));
  if (p.length > 1 && p.endsWith('/')) return go(local(p.replace(/\/+$/, '')));
  // ფაილები (favicon.ico, robots.txt, sitemap.xml) — როგორც არის
  if (/\.[a-z0-9]+$/i.test(p)) return next();
  // გვერდი, რომელიც არ არსებობს → Next-ის 404 მარშრუტი (app/not-found.jsx, სტატუსი 404).
  // გვერდიდან notFound() სერვერზე ცარიელ HTML-ს აბრუნებს, ამიტომ აქვე ვამოწმებთ.
  const ka = /^\/en(\/|$)/.test(p) ? kaPath(p) : p;
  if (ka === null || !match(ka)) return NextResponse.rewrite(new URL('/_not-found', request.url), { request: { headers } });
  return next();
}

export const config = {
  // API, ადმინი, Next-ის ფაილები და ასეტები — გადამისამართების გარეშე
  matcher: ['/((?!api(?:/|$)|admin(?:/|$)|_next/|assets/).*)'],
};
