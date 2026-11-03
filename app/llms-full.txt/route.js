/** /llms-full.txt — AI საძიებოებისთვის (llmstxt.org), ყოველთვის აქტუალური */
import { render } from '@/lib/llms';

export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(render(true), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
