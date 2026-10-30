/** პროექტების ბარათები: მოკაპი, მთავარი გვერდის bento, სერვისის გვერდის ნამუშევრები */
import fs from 'fs';
import path from 'path';
import { url, PUBLIC } from '@/lib/core';
import { initials, tags, projects, serviceProjects, s, SERVICE_KEYS } from '@/lib/projects';
import { FEATURED } from '@/lib/blocks';
import { ArrowUpRight } from './icons';

/** პროექტის მოკაპის <img> — srcset-ით, თუ პატარა ვერსია (-sm.webp) არსებობს */
export function ShotImg({ p, sizes = '(max-width: 620px) 100vw, 50vw', eager = false }) {
  const shot = s(p.shot);
  if (shot === '') return null;
  const src = url(shot);
  const m = shot.match(/^(.+)\.webp$/);
  const small = m && fs.existsSync(path.join(PUBLIC, m[1].replace(/^\/+/, '') + '-sm.webp'));
  return (
    <img src={src} srcSet={small ? url(m[1] + '-sm.webp') + ' 720w, ' + src + ' 1400w' : undefined} sizes={small ? sizes : undefined}
      alt={(p.name || '') + ' — ვებსაიტი, შექმნილი Webico-ს მიერ'} width="1400" height="900" decoding="async" loading={eager ? undefined : 'lazy'} />
  );
}

/** რეალური სქრინშოტი ან გენერირებული „ბრაუზერის“ მოკაპი */
export function Mock({ p, sizes, eager }) {
  const tone = p.tone || 'lilac';
  if (s(p.shot) !== '') return <figure className="shot"><ShotImg p={p} sizes={sizes} eager={eager} /></figure>;
  return (
    <div className={'mock-site' + (tone === 'lilac' ? '' : ' mock-site--' + tone)}>
      <div className="mock-site__bar"><i /><i /><i /><span className="mock-site__url">{p.domain || ''}</span></div>
      <div className="mock-site__view">
        <div className="mock-site__page">
          <div className="mock-site__nav"><span className="mock-site__brand">{initials(p.name || '')}</span><i /><i /><i /></div>
          <div className="mock-site__hero"><span className="mock-site__h" /><span className="mock-site__h mock-site__h--sm" /><span className="mock-site__cta" /></div>
          <div className="mock-site__cols"><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

/** ნამუშევრების bento: ერთი დიდი და ოთხი პატარა ბარათი */
export function WorkBento({ shots, total }) {
  // რჩეული პროექტები წინ (პირველი დიდ ბარათში), მერე ვიდეოიანები, მერე დანარჩენი
  const rank = (w) => (FEATURED.includes(w.slug) ? FEATURED.indexOf(w.slug) : FEATURED.length + (s(w.video) ? 0 : 1));
  const list = shots.map((w, i) => [w, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map((x) => x[0]).slice(0, 5);
  return (
    <section className="section work-bento" id="work">
      <div className="container">
        <div className="work-bento__head">
          <h2>შერჩეული ნამუშევრები</h2>
          <a className="btn btn--ghost" href="/work">ყველა პროექტი ({total})</a>
        </div>
        <div className="work-bento__grid">
          {list.map((w, i) => (
            <a className={'work-tile work-tile--' + (i + 1)} href={'/work-' + w.slug} key={w.slug}>
              <span className="work-tile__img">
                {s(w.video)
                  ? (
                    <video poster={url(w.shot)} muted loop playsInline preload="metadata" aria-label={w.name} data-autoplay="">
                      <source src={url(w.video)} type="video/mp4" />
                      {/\.mp4$/i.test(w.video) ? <source src={url(String(w.video).replace(/\.mp4$/i, '.webm'))} type="video/webm" /> : null}
                    </video>
                  )
                  : <img src={url(s(w.tile) || w.shot)} className={s(w.tile) ? 'is-tile' : undefined} alt={w.name} loading="lazy" decoding="async" />}
              </span>
              <span className="work-tile__cap"><b>{w.name}</b><small>{tags(w)[0]}</small><i><ArrowUpRight size={18} width="2.2" /></i></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** პროექტის პატარა ბარათი (სერვისისა და ნიშის გვერდებზე) */
export function SvcWorkItem({ p, i }) {
  const shown = s(p.shot) === '' ? { ...p, shot: p.full } : p;
  return (
    <a className="svc-work__item" href={'/work-' + p.slug} data-reveal="" data-reveal-delay={Math.min(i, 5) * 50}>
      <Mock p={shown} sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px" />
      <span className="svc-work__body">
        <b>{p.name}</b>
        <small>{tags(p).slice(0, 2).join(' · ')}</small>
        <span className="svc-work__go" aria-hidden="true"><ArrowUpRight /></span>
      </span>
    </a>
  );
}

/** სერვისის გვერდის „შესრულებული პროექტები“ */
export function ServiceWork({ service }) {
  const [list, match] = serviceProjects(service);
  if (!list.length) return null;
  return (
    <section className="section svc-work" id="projects">
      <div className="container">
        <div className="section-head section-head--split" data-reveal="">
          <div>
            <span className="eyebrow">{match ? (SERVICE_KEYS[service] || 'ნამუშევრები') : 'ნამუშევრები'}</span>
            <h2>{match ? 'შესრულებული პროექტები' : 'ჩვენი ბოლო ნამუშევრები'}</h2>
          </div>
          <a className="btn btn--ghost" href="/work">ყველა ნამუშევარი ({projects().length})</a>
        </div>
        <div className="svc-work__grid">
          {list.map((p, i) => <SvcWorkItem p={p} i={i} key={p.slug} />)}
        </div>
      </div>
    </section>
  );
}
