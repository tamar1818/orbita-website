/** /work — ნამუშევრები და /work-<slug> — პროექტის გვერდი */
import fs from 'fs';
import path from 'path';
import { txt, slug as toSlug, url as cu, PUBLIC } from '@/lib/core';
import { showcase, projects, project as findProject, tags, projectServices } from '@/lib/projects';
import { empty } from '@/lib/tpl';
import { Mock } from '@/components/work';
import { FEATURED } from '@/lib/blocks';
import { JsonLd, PageHero } from '@/components/blocks';
import { ArrowUpRight } from '@/components/icons';

const list = (v) => (v || []).map((x) => String(x).trim()).filter(Boolean);

/** ტექსტი ხაზების გადატანით */
const Lines = ({ text }) => String(text).split(/\r\n|\n|\r/).flatMap((l, i) => (i ? [<br key={i} />, '\n' + l] : [l]));

/** პროექტის კატეგორიები ფილტრისთვის (მონაცემებიდან და აღწერიდან) */
const CATS = [['web', 'ვებსაიტები'], ['shop', 'ონლაინ მაღაზიები'], ['platform', 'პლატფორმები და აპები'], ['design', 'UI/UX დიზაინი']];
function cats(p) {
  const sum = String(p.summary ?? '');
  const tg = (p.tags || []).join(' ');
  const svc = projectServices(p);
  const out = [];
  const concept = sum.includes('კონცეფცია');
  if (sum.includes('ონლაინ მაღაზია') || svc.includes('ecommerce')) out.push('shop');
  if (sum.includes('პლატფორმ') || sum.includes('აპლიკაცი') || tg.includes('აპლიკაცი')) out.push('platform');
  if (!concept && !out.length) out.push('web');
  if (tg.includes('UI/UX') || svc.includes('branding')) out.push('design');
  return out;
}
const catLabel = (k) => (CATS.find((c) => c[0] === k) || CATS[0])[1];

export function work() {
  const all = showcase();
  const meta = { title: 'ნამუშევრები — Webico', desc: 'Webico-ს პორტფოლიო: ' + all.length + ' ვებსაიტი, ონლაინ მაღაზია, პლატფორმა და UI/UX დიზაინი.', url: '/work' };
  const ld = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: all.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: 'https://webico.io/work-' + encodeURIComponent(String(p.slug)), name: p.name ?? '' })),
  };
  const withShot = all.filter((p) => String(p.shot ?? '') !== '');
  const stage = FEATURED.map((k) => withShot.find((p) => p.slug === k)).filter(Boolean).slice(0, 3);
  while (stage.length < 3 && withShot[stage.length]) stage.push(withShot[stage.length]);
  const counts = Object.fromEntries(CATS.map(([k]) => [k, all.filter((p) => cats(p).includes(k)).length]));

  const body = (
    <>
      <JsonLd data={ld} />
      <section className="wk-hero" data-wk-stage-wrap="">
        <div className="container">
          <div className="wk-hero__grid">
            <div className="wk-hero__text">
              <ol className="breadcrumb breadcrumb--light">
                <li><a href="/">მთავარი</a></li>
                <li><span aria-current="page">ნამუშევრები</span></li>
              </ol>
              <h1>{txt('work.title', 'ნამუშევრები, რომლებითაც ვამაყობთ')}</h1>
              <p>{txt('work.text', 'ვებსაიტები, ონლაინ მაღაზიები, პლატფორმები და დიზაინი ბიზნესებისთვის საქართველოსა და მის ფარგლებს გარეთ.')}</p>
              <dl className="wk-hero__stats">
                <div><dt>დასრულებული პროექტი</dt><dd>{all.length}</dd></div>
                <div><dt>შექმნილი ონლაინ მაღაზია</dt><dd>{counts.shop}</dd></div>
                <div><dt>UI/UX დიზაინის პროექტი</dt><dd>{counts.design}</dd></div>
              </dl>
            </div>
            <div className="wk-stage" aria-hidden="true">
              <div className="wk-stage__scene" data-wk-stage="">
                {stage.map((p, i) => (
                  <div className={'wk-stage__card wk-stage__card--' + (i + 1)} key={p.slug}>
                    <span className="wk-stage__bar"><i /><i /><i /><b>{p.domain}</b></span>
                    <img src={cu(p.shot)} alt="" loading={i ? 'lazy' : undefined} decoding="async" width="1400" height="900" />
                  </div>
                ))}
                <span className="wk-stage__orb wk-stage__orb--1" />
                <span className="wk-stage__orb wk-stage__orb--2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section wk-list">
        <div className="container">
          <div className="wk-toolbar">
            <div className="filters" data-filter-group="" data-filter-noun="პროექტი" role="group" aria-label="კატეგორიები">
              <button className="filter" type="button" data-filter="all" aria-pressed="true">ყველა<span className="filter__count" /></button>
              {CATS.filter(([k]) => counts[k]).map(([k, label]) => (
                <button className="filter" type="button" data-filter={k} aria-pressed="false" key={k}>{label}<span className="filter__count" /></button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite" data-filter-status="" />
          </div>

          <div className="wk-grid">
            {all.map((p, i) => {
              const href = '/work-' + (p.slug ?? '');
              const c = cats(p);
              const tone = ['lilac', 'lime', 'pink', 'soft'].includes(p.tone) ? p.tone : ['lilac', 'lime', 'pink', 'soft'][i % 4];
              return (
                <a className={'wk-card wk-card--' + tone + (i % 7 === 0 ? ' wk-card--wide' : '')} href={href} data-category={c.join(' ')} data-wk-tilt="" key={p.slug}>
                  <span className="wk-card__media">
                    <span className="wk-card__frame">
                      <span className="wk-card__bar"><i /><i /><i /></span>
                      <Mock p={p} sizes={i % 7 === 0 ? '(max-width: 760px) 100vw, 1100px' : '(max-width: 760px) 100vw, 600px'} />
                    </span>
                  </span>
                  <span className="wk-card__info">
                    <span className="wk-card__text">
                      <b className="wk-card__name">{p.name ?? ''}</b>
                      <small><span>{c.map(catLabel).join(' · ')}</span>{!empty(p.domain) ? <span className="wk-card__domain"> · {p.domain}</span> : null}</small>
                    </span>
                    <span className="wk-card__go" aria-hidden="true"><ArrowUpRight /></span>
                  </span>
                  {!empty(p.summary) ? <span className="wk-card__sum">{p.summary}</span> : null}
                </a>
              );
            })}
          </div>
          <p className="blog-empty" data-filter-empty="" hidden>ამ კატეგორიაში პროექტი ჯერ არ არის.</p>
        </div>
      </section>

      <section className="cta cta--center">
        <div className="container">
          <div className="cta__inner" data-reveal="">
            <h2>შემდეგი პროექტი შეიძლება თქვენი იყოს</h2>
            <p>მოგვიყევით თქვენს იდეაზე. ერთ სამუშაო დღეში გამოგიგზავნით გეგმას, ვადებს და ღირებულებას.</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/start">დაიწყეთ პროექტი</a>{' '}
              <a className="btn btn--light" href="/contact#booking">უფასო კონსულტაცია</a>
            </div>
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
