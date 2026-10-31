/**
 * ქართული მისამართი → [გვერდის ტიპი, არგუმენტი] ან null, თუ ასეთი გვერდი არ არსებობს.
 * JSX-ის გარეშე, რომ proxy.js-მაც გამოიყენოს (404 რენდერამდე უნდა ვიცოდეთ).
 */
import { slug as toSlug } from '@/lib/core';
import { project } from '@/lib/projects';
import { post } from '@/lib/blog';
import NICHES from '@/data/niches.json';

export const STATIC_PATHS = ['/about', '/contact', '/services', '/service-web-development', '/service-branding', '/service-marketing', '/service-seo'];
export const JSON_SERVICES = ['wordpress', 'ecommerce', 'maintenance'];
export const NICHE_SLUGS = Object.keys(NICHES);

const PAGES = { '/': 'home', '/work': 'work', '/blog': 'blog', '/start': 'start' };

export function match(p) {
  if (PAGES[p]) return [PAGES[p]];
  if (STATIC_PATHS.includes(p)) return ['static', p];
  let r = p.match(/^\/work-([a-z0-9-]+)$/);
  if (r) return toSlug(r[1]) && project(toSlug(r[1])) ? ['project', r[1]] : null;
  r = p.match(/^\/blog\/([^/]+)$/);
  if (r) return toSlug(r[1]) && post(toSlug(r[1])) ? ['post', r[1]] : null;
  r = p.match(/^\/(terms|privacy)$/);
  if (r) return ['legal', r[1]];
  r = p.match(/^\/service-([a-z]+)$/);
  if (r && JSON_SERVICES.includes(r[1])) return ['service', r[1]];
  if (NICHE_SLUGS.includes(p.slice(1))) return ['niche', p.slice(1)];
  return null;
}
