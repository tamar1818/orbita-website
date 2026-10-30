/** /admin — მართვის პანელი: Next.js-ის მოთხოვნა → lib/admin.js (req/res-ის მარტივი ადაპტერით) */
import fs from 'fs';
import path from 'path';
import qs from 'qs';
import { main } from '@/lib/admin';
import { clearSession } from '@/lib/auth';
import { ROOT } from '@/lib/core';
import { MAX_UPLOAD } from '@/lib/media';
import { clientIp } from '@/lib/http';

export const dynamic = 'force-dynamic';

const BASE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };

/** Express-ის მსგავსი პასუხის ობიექტი — ადმინის კოდი უცვლელად მუშაობს */
function makeRes() {
  const headers = new Headers(BASE);
  let out = null;
  const res = {
    append: (k, v) => headers.append(k, v),
    set: (k, v) => headers.set(k, v),
    type: () => res,
    redirect: (a, b) => { const [status, to] = b === undefined ? [302, a] : [a, b]; headers.set('Location', to); out = new Response(null, { status, headers }); },
    send: (body) => { headers.set('Content-Type', 'text/html; charset=utf-8'); out = new Response(body, { status: 200, headers }); },
  };
  return [res, () => out || new Response('', { status: 204, headers })];
}

/** ფორმის ველები qs-ის სინტაქსით (texts[key], services[] ...), როგორც express.urlencoded({ extended: true }) */
async function parseBody(request, req) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('multipart/form-data')) {
    const form = await request.formData();
    const pairs = [];
    for (const [k, v] of form.entries()) {
      if (typeof v === 'string') { pairs.push([k, v]); continue; }
      if (k !== 'file' || !v.size) continue;
      if (v.size > MAX_UPLOAD) { req.uploadError = 'ფაილი 25 MB-ზე დიდია'; continue; }
      req.file = { buffer: Buffer.from(await v.arrayBuffer()), size: v.size, originalname: v.name, mimetype: v.type };
    }
    return qs.parse(new URLSearchParams(pairs).toString(), { parameterLimit: 2000 });
  }
  return qs.parse(await request.text(), { parameterLimit: 2000 });
}

async function handle(request, { params }) {
  const parts = (await params).path || [];
  const url = new URL(request.url);
  const sub = parts.join('/');

  if (sub === 'admin.css') {
    return new Response(fs.readFileSync(path.join(ROOT, 'views/admin/admin.css')), { headers: { ...BASE, 'Content-Type': 'text/css; charset=utf-8' } });
  }
  if (sub === 'logout.php') {
    const [res, done] = makeRes();
    clearSession(res);
    res.redirect('/admin/index.php?p=login');
    return done();
  }
  // /admin → /admin/ (შედარებითი ბმულები index.php?p=… სწორად რომ მუშაობდეს)
  if (sub === '' && !url.pathname.endsWith('/')) {
    return new Response(null, { status: 301, headers: { ...BASE, Location: '/admin/' + url.search } });
  }
  if (sub !== '' && sub !== 'index.php') return new Response('Not found', { status: 404, headers: BASE });

  const req = {
    method: request.method,
    query: qs.parse(url.search.slice(1)),
    headers: { cookie: request.headers.get('cookie') || '', 'x-forwarded-proto': request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '') },
    secure: url.protocol === 'https:',
    ip: clientIp(request),
    body: {},
  };
  if (request.method === 'POST') req.body = await parseBody(request, req);
  const [res, done] = makeRes();
  main(req, res);
  return done();
}

export { handle as GET, handle as POST };
