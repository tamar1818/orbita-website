/** /api/lead(.php), /api/slots(.php), /api/book(.php) — ლიდები და შეხვედრების დაჯავშნა */
import { after } from 'next/server';
import { lead, slots, book } from '@/lib/api';
import { clientIp } from '@/lib/http';

export const dynamic = 'force-dynamic';

const POST_HANDLERS = { lead, book };
const GET_HANDLERS = { slots };
const nameOf = async (params) => String((await params).name || '').replace(/\.php$/, '');
const json = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

async function handle(fn, request, body) {
  try {
    const url = new URL(request.url);
    const r = fn({ body, query: Object.fromEntries(url.searchParams), ip: clientIp(request) });
    if (r.after) after(r.after);
    return json(r.status, r.json);
  } catch (err) {
    console.error(err);
    return json(500, { ok: false, error: 'server' });
  }
}

async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  const raw = await request.text();
  if (raw.length > 64 * 1024) throw Object.assign(new Error('too large'), { status: 413 });
  if (type.includes('application/json')) return raw ? JSON.parse(raw) : {};
  return Object.fromEntries(new URLSearchParams(raw));
}

const wrong = (name) => json(GET_HANDLERS[name] || POST_HANDLERS[name] ? 405 : 404, { ok: false, error: GET_HANDLERS[name] || POST_HANDLERS[name] ? 'method not allowed' : 'not found' });

export async function GET(request, { params }) {
  const name = await nameOf(params);
  return GET_HANDLERS[name] ? handle(GET_HANDLERS[name], request, {}) : wrong(name);
}

export async function POST(request, { params }) {
  const name = await nameOf(params);
  if (!POST_HANDLERS[name]) return wrong(name);
  let body;
  try { body = await readBody(request); } catch (err) { return json(err.status || 400, { ok: false, error: err.status ? 'too large' : 'bad json' }); }
  return handle(POST_HANDLERS[name], request, body);
}
