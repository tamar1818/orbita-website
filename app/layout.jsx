/** HTML დოკუმენტი ორივე ენისთვის: <html lang> მისამართიდან (proxy.js აწვდის x-webico-path-ს) */
import { headers } from 'next/headers';
import Document, { baseMetadata, viewport } from '@/components/Document';

export const metadata = baseMetadata;
export { viewport };

export default async function RootLayout({ children }) {
  const p = (await headers()).get('x-webico-path') || '/';
  return <Document lang={/^\/en(\/|$)/.test(p) ? 'en' : 'ka'}>{children}</Document>;
}
