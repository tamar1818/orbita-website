/** /work — ნამუშევრები და /work-<slug> — პროექტის გვერდი */
import fs from 'fs';
import path from 'path';
import { txt, slug as toSlug, url as cu, PUBLIC } from '@/lib/core';
import { showcase, projects, project as findProject, tags, projectServices } from '@/lib/projects';
import { empty } from '@/lib/tpl';
import { Mock } from '@/components/work';
import { JsonLd, PageHero } from '@/components/blocks';
import { ArrowUpRight, External } from '@/components/icons';

const list = (v) => (v || []).map((x) => String(x).trim()).filter(Boolean);

/** ტექსტი ხაზების გადატანით */
const Lines = ({ text }) => String(text).split(/\r\n|\n|\r/).flatMap((l, i) => (i ? [<br key={i} />, '\n' + l] : [l]));

export function work() {
  const all = showcase();
  const meta = { title: 'ნამუშევრები — Webico', desc: 'Webico-ს პორტფოლიო: ' + all.length + ' შესრულებული ვებსაიტი.', url: '/work' };
  const ld = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: all.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: 'https://webico.io/work-' + encodeURIComponent(String(p.slug)), name: p.name ?? '' })),
  };
  const body = (
    <>
      <JsonLd data={ld} />
      <PageHero crumbs={[[null, 'ნამუშევრები']]} eyebrow="ჩვენი ნამუშევრები" title={txt('work.title', 'შესრულებული პროექტები')}>
        <p>{txt('work.text', all.length + ' ვებსაიტი ბიზნესებისთვის, ორგანიზაციებისთვის, ონლაინ მაღაზიები და სერვისები საქართველოსა და მის ფარგლებს გარეთ.')}</p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="work-grid">
            {all.map((p, i) => {
              const href = '/work-' + (p.slug ?? '');
              const stack = list(p.stack);
              return (
                <article className="work" data-category="web" data-reveal="" data-reveal-delay={Math.min(i, 6) * 40} key={p.slug}>
                  <a className="work__cover-link" href={href} tabIndex="-1" aria-hidden="true">
                    <div className="work__cover work__cover--mock"><Mock p={p} sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 600px" /></div>
                  </a>
                  <div className="work__body">
                    <div className="work__head">
                      <h3><a href={href}>{p.name ?? ''}</a></h3>
                      <span className="work__go" aria-hidden="true"><ArrowUpRight /></span>
                    </div>
                    {!empty(p.summary) ? <p>{p.summary}</p> : null}
                    <div className="work__meta">
                      {tags(p).map((t) => <span className="tag" key={t}>{t}</span>)}
                      {!empty(p.partner) ? <span className="tag tag--partner">{p.partner}</span> : null}
                    </div>
                    {stack.length ? <div className="work__tools"><b>ინსტრუმენტები</b>{stack.map((s) => <span className="tag tag--tool" key={s}>{s}</span>)}</div> : null}
                    <div className="work__actions">
                      <a className="btn btn--primary btn--sm" href={href}>ნახე მეტი</a>
                      {!empty(p.domain) ? <a className="work__site" href={'https://' + p.domain + '/'} target="_blank" rel="noopener noreferrer">{p.domain} <External /></a> : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}

/** JPEG-ის სიმაღლე (SOF მარკერიდან) */
function jpegHeight(file) {
  try {
    const b = fs.readFileSync(file);
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return null;
      const m = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return b.readUInt16BE(i + 5);
      i += 2 + len;
    }
  } catch { /* */ }
  return null;
}

export function project(rawSlug) {
  const slug = toSlug(rawSlug);
  const p = slug ? findProject(slug) : null;
  if (!p) return null;

  const all = projects();
  const idx = Math.max(0, all.findIndex((x) => (x.slug || '') === slug));
  const n = all.length;
  const prev = all[(idx - 1 + n) % n];
  const next = all[(idx + 1) % n];

  const name = String(p.name ?? '');
  const domain = String(p.domain ?? '');
  const site = domain !== '' ? 'https://' + domain + '/' : '';
  const stack = list(p.stack);
  const scope = list(p.scope);
  const full = String(p.full ?? '').trim();
  const caption = String(p.full_caption ?? '').trim();

  const svcs = projectServices(p);
  const isApp = (p.tags || []).join(' ').toLowerCase().includes('აპლიკაცი');
  const title = name + (isApp ? ' — აპლიკაციის დიზაინი და დეველოპმენტი'
    : (svcs.includes('web-development') || !svcs.includes('branding') ? ' — ვებსაიტის შექმნა' : ' — ვებსაიტის UI/UX დიზაინი')) + ' | Webico';
  const desc = !empty(p.summary) ? String(p.summary)
    : name + (domain !== '' ? ' (' + domain + ')' : '') + ' — ვებსაიტი, რომელიც შექმნა Webico-მ, ვებ დეველოპმენტის სააგენტომ თბილისში. ნახეთ პროექტის დეტალები.';
  const ogRel = 'assets/img/work/' + slug + '-website-og.jpg';
  const ogFile = path.join(PUBLIC, ogRel);
  const image = fs.existsSync(ogFile) ? ogRel : null;
  const meta = { title, desc, url: '/work-' + slug, image, imageW: 1200, imageH: image ? (jpegHeight(ogFile) || 770) : 630 };

  const body = (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name, url: 'https://webico.io/work-' + slug,
        creator: { '@type': 'Organization', name: 'Webico', url: 'https://webico.io/' } }} />
      <PageHero crumbs={[['/work', 'ნამუშევრები'], [null, name]]} eyebrow="პროექტი">
        {!empty(p.partner) ? <span className="partner-badge">{p.partner}-თან ერთად</span> : null}
        <h1>{name}</h1>
        {!empty(p.summary) ? <p>{p.summary}</p> : null}
        <div className="case__tags" style={{ marginTop: '18px' }}>
          {tags(p).map((t) => <span className="tag" key={t}>{t}</span>)}
        </div>
        <div className="btn-row">
          {site ? <a className="btn btn--primary" href={site} target="_blank" rel="noopener noreferrer">საიტის ნახვა ↗</a> : null}
          <a className="btn btn--ghost" href="/work">ყველა ნამუშევარი</a>
        </div>
      </PageHero>

      {empty(p.hide_shot) ? (
        <section className="section section--tight">
          <div className="container"><div className="project-shot" data-reveal=""><Mock p={p} sizes="(max-width: 1280px) 100vw, 1232px" eager /></div></div>
        </section>
      ) : null}
      {full !== '' ? (
        <section className="section section--tight">
          <div className="container">
            <figure className="project-full" data-reveal="">
              <img src={cu(full)} alt={name + ' — ' + (caption || 'ვებსაიტის სრული დიზაინი')} loading="lazy" decoding="async" />
              <figcaption>{caption || 'სრული გვერდის დიზაინი'}</figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      <section className="section section--tight">
        <div className="container">
          <div className="project-meta">
            <div><b>კლიენტი</b><span>{name}</span></div>
            {!empty(p.year) ? <div><b>წელი</b><span>{p.year}</span></div> : null}
            {site ? <div><b>ვებსაიტი</b><a href={site} target="_blank" rel="noopener noreferrer">{domain} ↗</a></div> : null}
            {!empty(p.partner) ? <div><b>თანამშრომლობა</b><span>{p.partner}</span></div> : null}
            <div><b>კატეგორია</b><span>{tags(p).join(', ')}</span></div>
          </div>
        </div>
      </section>

      {!empty(p.challenge) || !empty(p.solution) ? (
        <section className="section">
          <div className="container">
            {!empty(p.challenge) ? (
              <div className="feature-row__body" data-reveal="">
                <span className="eyebrow">ამოცანა</span><h2>გამოწვევა</h2>
                <p><Lines text={p.challenge} /></p>
              </div>
            ) : null}
            {!empty(p.solution) ? (
              <div className="feature-row__body" data-reveal="">
                <span className="eyebrow eyebrow--accent">გადაწყვეტა</span><h2>რა გავაკეთეთ</h2>
                <p><Lines text={p.solution} /></p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {scope.length || stack.length ? (
        <section className="section section--soft">
          <div className="container">
            <div className="grid grid--2">
              {scope.length ? (
                <div data-reveal="">
                  <h3>სამუშაოს მოცულობა</h3>
                  <ul className="checklist">{scope.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              ) : null}
              {stack.length ? (
                <div data-reveal="" data-reveal-delay="80">
                  <h3>ტექნოლოგიები</h3>
                  <div className="case__tags" style={{ marginTop: '18px' }}>{stack.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {!empty(p.result) ? (
        <section className="section">
          <div className="container">
            <div className="section-head section-head--center" data-reveal="">
              <span className="eyebrow">შედეგი</span><h2>{p.result}</h2>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--tight">
        <div className="container">
          <div className="project-nav">
            <a href={'/work-' + prev.slug}><span><small>წინა</small>{prev.name}</span></a>
            <a href={'/work-' + next.slug}><span><small>შემდეგი</small>{next.name}</span></a>
          </div>
        </div>
      </section>
    </>
  );
  return { meta, body };
}
