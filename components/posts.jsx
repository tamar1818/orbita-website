/** ბლოგის ბარათები და ყდები */
import { url } from '@/lib/core';
import { cat, tone, readTime, dateKa, ICONS } from '@/lib/blog';
import { ArrowRight } from './icons';

/** ქავერი: ატვირთული ფოტო ან გენერირებული ყდა */
export function PostCover({ p, size = '' }) {
  const cls = 'post-cover post-cover--' + tone(p) + (size ? ' post-cover--' + size : '');
  const img = String(p.cover || '').trim();
  if (img) return <div className={cls + ' post-cover--img'}><img src={url(img)} alt="" loading="lazy" /></div>;
  const icon = ICONS[p.category || ''] || '<circle cx="12" cy="12" r="9"/>';
  return (
    <div className={cls} aria-hidden="true">
      <span className="post-cover__cat">{cat(p)}</span>
      <span className="post-cover__icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon }} />
      </span>
      <span className="post-cover__title">{p.cover_text ?? p.title ?? ''}</span>
    </div>
  );
}

export function PostCard({ p, big = false }) {
  const u = '/blog/' + p.slug;
  return (
    <article className={'post-card' + (big ? ' post-card--big' : '')}>
      <a className="post-card__media" href={u} tabIndex="-1" aria-hidden="true"><PostCover p={p} size={big ? 'big' : ''} /></a>
      <div className="post-card__body">
        <p className="post-card__meta"><span className="post-card__cat">{cat(p)}</span><span>{dateKa(p.date || '')}</span><span>{readTime(p)} წთ</span></p>
        <h3 className="post-card__title"><a href={u}>{p.title || ''}</a></h3>
        {big || p.excerpt ? <p className="post-card__excerpt">{p.excerpt || ''}</p> : null}
        <span className="post-card__more">წაიკითხე <ArrowRight size={16} /></span>
      </div>
    </article>
  );
}
