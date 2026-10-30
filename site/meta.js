/** გვერდის მეტა-თეგები (Next.js Metadata API): title, description, canonical, hreflang, Open Graph */
import { enPath } from '@/lib/i18n';
import { tr } from '@/lib/localize';

const SITE = 'https://webico.io';

export function buildMeta(m, lang, kaPath) {
  const t = (s) => tr(s, lang, kaPath);
  const title = t(m.title || 'Webico');
  const description = t(m.desc || '');
  const en = enPath(kaPath);
  const url = lang === 'en' ? (en || '/en') : (m.url || kaPath);
  const image = m.image ? SITE + '/' + String(m.image).replace(/^\/+/, '') : SITE + '/assets/img/og-webico-3.jpg';
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: SITE + url,
      languages: en ? { ka: SITE + kaPath, en: SITE + en, 'x-default': SITE + kaPath } : undefined,
    },
    openGraph: {
      type: m.ogType || 'website',
      locale: lang === 'en' ? 'en_US' : 'ka_GE',
      siteName: t('ვებიკო'),
      title,
      description,
      url: SITE + url,
      images: [{ url: image, width: m.image ? (m.imageW || 1536) : 1200, height: m.image ? (m.imageH || 1024) : 630, alt: m.imageAlt ? t(m.imageAlt) : title }],
    },
    twitter: { card: 'summary_large_image', images: [image] },
    robots: m.robots || 'index, follow, max-image-preview:large',
  };
}
