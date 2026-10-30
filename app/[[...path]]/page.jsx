/** ქართული გვერდები: ყველა მისამართი site/routes.js-ით იხსნება */
import { notFound } from 'next/navigation';
import Shell from '@/components/Shell';
import { resolve } from '@/site/routes';
import { buildMeta } from '@/site/meta';

export const dynamic = 'force-dynamic';

const pathOf = async (params) => '/' + ((await params).path || []).join('/');
const searchOf = async (searchParams) => new URLSearchParams(Object.entries(await searchParams).flatMap(([k, v]) => [].concat(v).map((x) => [k, x])));

export async function generateMetadata({ params, searchParams }) {
  const p = await pathOf(params);
  const r = resolve(p, await searchOf(searchParams));
  return r ? buildMeta(r.meta, 'ka', p) : {};
}

export default async function Page({ params, searchParams }) {
  const p = await pathOf(params);
  const r = resolve(p, await searchOf(searchParams));
  if (!r) notFound();
  return <Shell lang="ka" kaPath={p}>{r.body}</Shell>;
}
