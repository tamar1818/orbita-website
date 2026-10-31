/** HTML დოკუმენტი: head (შრიფტები, სტილი) და body — ორივე ენისთვის */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PUBLIC } from '@/lib/core';

/** style.css-ის ვერსია ბრაუზერის ქეშისთვის */
const CSS_V = (() => {
  try { return crypto.createHash('md5').update(fs.readFileSync(path.join(PUBLIC, 'assets/css/style.css'))).digest('hex').slice(0, 8); } catch { return '1'; }
})();

export default function Document({ lang, children }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js");' }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* სათაურების შრიფტი წინასწარ, რომ სათაური სარეზერვო შრიფტით არ „აციმციმდეს“ */}
        <link rel="preload" href="/assets/fonts/dachi-the-lynx.woff2" as="font" type="font/woff2" crossOrigin="" />
        {/* ტექსტის შრიფტი */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href={'/assets/css/style.css?v=' + CSS_V} />
      </head>
      <body>{children}</body>
    </html>
  );
}

/** საერთო მეტა: Google-ის ვერიფიკაცია, ხატულები */
export const baseMetadata = {
  metadataBase: new URL('https://webico.io'),
  verification: { google: 'Zl7OvqIP-1s-wqbhxwTPnmISoEdJGMlH0hoNgwNrXHk' },
  icons: {
    icon: [{ url: '/assets/img/favicon.svg', type: 'image/svg+xml' }],
    other: [{ rel: 'alternate icon', url: '/favicon.ico', sizes: 'any' }],
    apple: '/assets/img/apple-touch-icon.png',
  },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0d0d0d' };
