/** სამართლებრივი გვერდები: /terms, /privacy, /refund, /delivery (ტექსტები — data/legal/) */
import fs from 'fs';
import path from 'path';
import { opt, ROOT } from '@/lib/core';
import { dateKa } from '@/lib/blog';
import { JsonLd, PageHero } from '@/components/blocks';

export const PAGES = {
  '/terms': 'წესები და პირობები',
  '/privacy': 'კონფიდენციალურობის პოლიტიკა',
  '/refund': 'გაუქმება და თანხის დაბრუნება',
  '/delivery': 'მომსახურების მიწოდება',
};

function Owner() {
  const phone = opt('phone', '+995 557 64 32 25');
  const email = opt('email', 'hello@webico.io');
  return (
    <ul className="legal-owner">
      <li><b>მომსახურების მიმწოდებელი</b><span>{opt('legal_name', 'თამარ გელიაშვილი')} (ბრენდი „Webico“)</span></li>
      <li><b>საიდენტიფიკაციო ნომერი</b><span>{opt('legal_id', '01024088829')}</span></li>
      <li><b>მისამართი</b><span>{opt('address', 'თბილისი, საქართველო')}</span></li>
      <li><b>ტელეფონი</b><span><a href={'tel:' + phone.replace(/[^\d+]/g, '')}>{phone}</a></span></li>
      <li><b>ელფოსტა</b><span><a href={'mailto:' + email}>{email}</a></span></li>
      <li><b>ვებსაიტი</b><span><a href="https://webico.io/">webico.io</a></span></li>
    </ul>
  );
}

export default function legal(name) {
  const dir = path.join(ROOT, 'data/legal');
  const L = JSON.parse(fs.readFileSync(path.join(dir, name + '.json'), 'utf8'));
  const html = fs.readFileSync(path.join(dir, name + '.html'), 'utf8');
  const email = opt('email', 'hello@webico.io');
  const meta = { title: L.title + ' | Webico', desc: L.desc, url: L.path };
  const body = (
    <>
      <JsonLd indent={0} data={{
        '@context': 'https://schema.org', '@type': 'WebPage', name: L.title,
        url: 'https://webico.io' + L.path, dateModified: L.updated, inLanguage: 'ka',
        publisher: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' },
      }} />
      <PageHero crumbs={[[null, L.title]]} eyebrow="სამართლებრივი ინფორმაცია" title={L.title}>
        <p>{L.lead}</p>
        <p className="legal-updated">ბოლო განახლება: {dateKa(L.updated)}</p>
      </PageHero>

      <section className="section">
        <div className="container legal">
          <aside className="legal__nav" aria-label="სამართლებრივი დოკუმენტები">
            <p>დოკუმენტები</p>
            <ul>
              {Object.entries(PAGES).map(([href, n]) => (
                <li key={href}><a href={href} aria-current={href === L.path ? 'page' : undefined}>{n}</a></li>
              ))}
            </ul>
          </aside>
          <div className="legal__body prose">
            <Owner />
            <div className="prose__body" dangerouslySetInnerHTML={{ __html: html }} />
            <p className="legal__contact">კითხვების შემთხვევაში მოგვწერეთ <a href={'mailto:' + email}>{email}</a>-ზე ან დაგვირეკეთ {opt('phone', '+995 557 64 32 25')}.</p>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
