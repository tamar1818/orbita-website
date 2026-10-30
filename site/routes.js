/**
 * ქართული მისამართი → გვერდი ({ meta, body } ან null). რომელი გვერდი არსებობს — site/paths.js.
 * ინგლისური მისამართები იგივე გვერდებია (lib/i18n.js: enPath/kaPath).
 */
import home from './home';
import { work, project } from './work';
import { blogIndex, post } from './blog';
import plans from './plans';
import start from './start';
import legal from './legal';
import niche from './niche';
import service from './service';
import { match } from './paths';
import about from './static/about';
import contact from './static/contact';
import services from './static/services';
import serviceWebDevelopment from './static/service-web-development';
import serviceBranding from './static/service-branding';
import serviceMarketing from './static/service-marketing';
import serviceSeo from './static/service-seo';

const STATIC = {
  '/about': about, '/contact': contact, '/services': services,
  '/service-web-development': serviceWebDevelopment, '/service-branding': serviceBranding,
  '/service-marketing': serviceMarketing, '/service-seo': serviceSeo,
};

/** search — URLSearchParams; lang — 'ka' | 'en' (სადაც გვერდს ენა სჭირდება, მაგ. გაზიარების ბმული) */
export function resolve(p, search = new URLSearchParams(), lang = 'ka') {
  const m = match(p);
  if (!m) return null;
  const [kind, arg] = m;
  switch (kind) {
    case 'home': return home();
    case 'work': return work();
    case 'blog': return blogIndex();
    case 'plans': return plans();
    case 'start': return start(search);
    case 'static': return STATIC[arg]();
    case 'project': return project(arg);
    case 'post': return post(arg, lang);
    case 'legal': return legal(arg);
    case 'service': return service(arg);
    case 'niche': return niche(arg);
  }
  return null;
}
