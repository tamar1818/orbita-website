/** 404 — ქართულად ან ინგლისურად, მისამართის მიხედვით */
import { headers } from 'next/headers';
import Shell from '@/components/Shell';
import page404, { meta } from '@/site/static/404';
import { localize, tr } from '@/lib/localize';

const langOf = async () => (/^\/en(\/|$)/.test((await headers()).get('x-webico-path') || '') ? 'en' : 'ka');

export async function generateMetadata() {
  const lang = await langOf();
  return { title: { absolute: tr(meta.title, lang, '/404') }, description: tr(meta.desc, lang, '/404') }; // noindex Next-ი თვითონ ამატებს
}

export default async function NotFound() {
  const lang = await langOf();
  return localize(<Shell lang={lang} kaPath="/404">{page404().body}</Shell>, lang, '/404');
}
