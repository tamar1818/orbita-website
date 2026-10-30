/** /sitemap.xml — ყოველთვის აქტუალური (ქართული + /en) */
import { render } from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(render(), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' } });
}
