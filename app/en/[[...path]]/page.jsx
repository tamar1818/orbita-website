/** ინგლისური გვერდები: ქართული გვერდი, ნათარგმნი data/en/i18n.json-ით (lib/localize.js) */
import { notFound } from 'next/navigation';
import Shell from '@/components/Shell';
import { resolve } from '@/site/routes';
import { buildMeta } from '@/site/meta';
import { kaPath } from '@/lib/i18n';
import { localize } from '@/lib/localize';

export const dynamic = 'force-dynamic';

const kaOf = async (params) => kaPath('/en' + ((await params).path || []).map((s) => '/' + s).join(''));
const searchOf = async (searchParams) => new URLSearchParams(Object.entries(await searchParams).flatMap(([k, v]) => [].concat(v).map((x) => [k, x])));

export async function generateMetadata({ params, searchParams }) {
  const kp = await kaOf(params);
  const r = kp === null ? null : resolve(kp, await searchOf(searchParams), 'en');
  return r ? buildMeta(r.meta, 'en', kp) : {};
}

export default async function Page({ params, searchParams }) {
  const kp = await kaOf(params);
  const r = kp === null ? null : resolve(kp, await searchOf(searchParams), 'en');
  if (!r) notFound();
  return localize(<Shell lang="en" kaPath={kp}>{r.body}</Shell>, 'en', kp);
}
