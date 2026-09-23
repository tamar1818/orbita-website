#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
პროექტების გვერდების გენერატორი.

  python3 tools/build-projects.py

კითხულობს tools/projects.json-ს და აგენერირებს:
  • work.html            — პროექტების ბადე
  • work-<slug>.html     — თითოეული პროექტის შიდა გვერდი
  • sitemap.xml          — განახლებული მისამართებით

ცარიელი ველი გვერდზე საერთოდ არ ჩნდება: სანამ summary/challenge/solution
არ შეგივსიათ, შესაბამისი სექცია უბრალოდ არ გენერირდება.
"""
import io, json, os, re, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://webico.io"
TODAY = datetime.date.today().isoformat()

with io.open(os.path.join(ROOT, "tools/projects.json"), encoding="utf-8") as fh:
    PROJECTS = json.load(fh)["projects"]

SHELL = os.path.join(ROOT, "about.html")   # header/footer-ის წყარო

ARROW = ('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
         'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>')

EXT = ('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
       'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
       '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
       '<polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>')


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


def initials(name):
    parts = [p for p in re.split(r"[\s'.-]+", name) if p]
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[1][0]).upper()


def tone_cls(p):
    t = p.get("tone", "lilac")
    return "" if t == "lilac" else " mock-site--" + t


def mock(p, big=False):
    shot = p.get("shot", "").strip()
    style = ' style="--shot:url(%s)"' % esc(shot) if shot else ""
    return """<div class="mock-site%s"%s>
              <div class="mock-site__bar">
                <i></i><i></i><i></i>
                <span class="mock-site__url">%s</span>
              </div>
              <div class="mock-site__view">
                <div class="mock-site__ph">
                  <span class="mock-site__logo">%s</span>
                  <div class="mock-site__lines"><i></i><i></i><i></i></div>
                </div>
              </div>
            </div>""" % (tone_cls(p), style, esc(p["domain"]), initials(p["name"]))


def shell(title, desc, canonical, body, jsonld=""):
    src = io.open(SHELL, encoding="utf-8").read()
    out = re.sub(r'<main id="main">.*?\n  </main>',
                 '<main id="main">\n' + body + '\n  </main>', src, flags=re.DOTALL)
    if out == src:
        sys.exit("ვერ ვიპოვე <main> გარსში: " + SHELL)
    out = re.sub(r"<title>.*?</title>", "<title>%s</title>" % esc(title), out, flags=re.DOTALL)
    out = re.sub(r'<meta name="description" content="[^"]*">',
                 '<meta name="description" content="%s">' % esc(desc), out)
    out = re.sub(r'<link rel="canonical" href="[^"]*">',
                 '<link rel="canonical" href="%s%s">' % (SITE, canonical), out)
    out = re.sub(r'<meta property="og:url" content="[^"]*">',
                 '<meta property="og:url" content="%s%s">' % (SITE, canonical), out)
    out = re.sub(r'<meta property="og:title" content="[^"]*">',
                 '<meta property="og:title" content="%s">' % esc(title), out)
    out = re.sub(r'<meta property="og:description" content="[^"]*">',
                 '<meta property="og:description" content="%s">' % esc(desc), out)
    out = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", out, flags=re.DOTALL)
    if jsonld:
        out = out.replace("</head>", '  <script type="application/ld+json">\n%s\n  </script>\n</head>'
                          % jsonld, 1)
    return out


def bullets(items):
    return "\n".join("              <li>%s</li>" % esc(x) for x in items)



# ------------------------------------------------- საერთო: ფორმა და პროცესი
FORM_SRC = os.path.join(ROOT, "service-seo.html")


def lead_form(slug):
    """იგივე ფორმა, რაც სერვისების გვერდებზე — ID-ები პროექტზეა მორგებული."""
    src = io.open(FORM_SRC, encoding="utf-8").read()
    m = re.search(r'<form class="lead-form".*?</form>', src, re.DOTALL)
    if not m:
        sys.exit("ვერ ვიპოვე ლიდ-ფორმა: " + FORM_SRC)
    f = m.group(0)
    f = f.replace('data-lead-form="service-seo"', 'data-lead-form="project-%s"' % slug)
    f = f.replace("srv-seo-", "pr-%s-" % slug)
    f = f.replace('<option value="seo" selected>', '<option value="seo">')
    f = f.replace("<h3>განაცხადის ფორმა</h3>",
                  "<h3>მოგწონთ ეს პროექტი?</h3>")
    f = f.replace("<p class=\"lead-form__intro\">ველები ვარსკვლავით სავალდებულოა.</p>",
                  "<p class=\"lead-form__intro\">დაგვიტოვეთ განაცხადი და მსგავს პროექტზე "
                  "საორიენტაციო ღირებულებასა და ვადებს ერთ სამუშაო დღეში მიიღებთ.</p>")
    return f


# პროცესი და ტესტირება — აღწერს Webico-ს სტანდარტულ მეთოდს,
# და არა კონკრეტული კლიენტის შედეგებს
PROCESS = [
    ("გაცნობა", "ვსწავლობთ ბიზნესს, სამიზნე აუდიტორიასა და კონკურენტებს. "
                "ვთანხმდებით, რა მოქმედება უნდა შეასრულოს ვიზიტორმა საიტზე."),
    ("დაგეგმვა", "ვწერთ სტრუქტურას გვერდების დონეზე, ვათანხმებთ შინაარსსა "
                 "და დიზაინის მიმართულებას."),
    ("დიზაინი", "პროტოტიპი, შემდეგ კი მაკეტი Figma-ში — დესკტოპისა და "
                "მობილურის ვერსიებით. კოდი მხოლოდ დამტკიცების შემდეგ იწერება."),
    ("დეველოპმენტი", "ვაწყობთ საიტს, ვამაგრებთ კონტენტის მართვის სისტემას, "
                     "ფორმებსა და საჭირო ინტეგრაციებს."),
    ("ტესტირება", "ვამოწმებთ ყველა ბრაუზერსა და მოწყობილობაზე, ვზომავთ "
                  "სისწრაფეს და ვასწორებთ ნაპოვნ ხარვეზებს."),
    ("გაშვება", "ვამაგრებთ ანალიტიკას, ვუშვებთ საიტს და გადავცემთ "
                "წვდომებსა და ინსტრუქციას."),
]

QA = [
    "ბრაუზერები: Chrome, Safari, Firefox და Edge — ბოლო ვერსიები",
    "მოწყობილობები: მობილური, ტაბლეტი და დესკტოპი, სხვადასხვა ეკრანის ზომაზე",
    "სისწრაფე: PageSpeed Insights და Core Web Vitals",
    "ფორმები: ვალიდაცია, შეცდომების შეტყობინებები და წერილის მიღების შემოწმება",
    "ბმულები: ყველა შიდა და გარე ბმულის გადამოწმება, 404-ების გამორიცხვა",
    "წვდომადობა: კლავიატურით ნავიგაცია, კონტრასტი და ალტერნატიული ტექსტები",
    "SEO-ს საბაზისო შემოწმება: მეტა-ტეგები, სათაურების იერარქია, sitemap და robots.txt",
    "უსაფრთხოება: SSL, სარეზერვო ასლები და განახლებები",
]


def process_block():
    steps = "\n".join(
        """          <article class="step" data-reveal data-reveal-delay="%d">
            <h3>%s</h3>
            <p>%s</p>
          </article>""" % (i * 60, esc(t), esc(d))
        for i, (t, d) in enumerate(PROCESS))
    checks = "\n".join("              <li>%s</li>" % esc(x) for x in QA)
    return """
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">პროექტის შესახებ</span>
          <h2>როგორ მიმდინარეობდა მუშაობა</h2>
          <p>ყველა პროექტს ერთი და იგივე ეტაპებით ვატარებთ — პირველი შეხვედრიდან
            გაშვებამდე. ქვემოთ აღწერილია ჩვენი სტანდარტული მეთოდი.</p>
        </div>
        <div class="steps">
%s
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="feature-row">
          <div class="feature-row__body" data-reveal>
            <span class="eyebrow eyebrow--accent">ტესტირება</span>
            <h2>რას ვამოწმებთ გაშვებამდე</h2>
            <p>საიტი ეთერში მხოლოდ მაშინ გადის, როცა ქვემოთ ჩამოთვლილი ყველა
              პუნქტი შემოწმებულია. ხარვეზები ფიქსირდება და ხელახლა მოწმდება.</p>
            <ul class="checklist">
%s
            </ul>
          </div>
          <div class="feature-row__media" data-reveal data-reveal-delay="90">
            <div class="panel">
              <div class="mock__row"><span><b>ბრაუზერები</b><br><small>ბოლო ვერსიები</small></span><span class="mock__pill">4</span></div>
              <div class="mock__row"><span><b>ეკრანის ზომები</b><br><small>მობილური → დესკტოპი</small></span><span class="mock__pill">3+</span></div>
              <div class="mock__row"><span><b>ფორმების შემოწმება</b><br><small>ვალიდაცია და მიღება</small></span><span class="mock__pill mock__pill--brand">✓</span></div>
              <div class="mock__row"><span><b>გადაცემა</b><br><small>წვდომები და ინსტრუქცია</small></span><span class="mock__pill mock__pill--brand">✓</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
""" % (steps, checks)


def form_block(p):
    return """
    <section class="section" id="request">
      <div class="container">
        <div class="contact-grid">
          <div data-reveal>
            <span class="eyebrow">დაგვიკავშირდით</span>
            <h2>გინდათ მსგავსი პროექტი?</h2>
            <p class="lead">შეავსეთ ფორმა და ერთ სამუშაო დღეში მიიღებთ საორიენტაციო
              ღირებულებას, ვადებსა და სამოქმედო გეგმას.</p>
            <ul class="checklist">
              <li>უფასო კონსულტაცია</li>
              <li>პასუხი 24 საათის განმავლობაში</li>
              <li>ფიქსირებული ბიუჯეტი ხელშეკრულებით</li>
            </ul>
          </div>
          <div data-reveal data-reveal-delay="90">
            %s
          </div>
        </div>
      </div>
    </section>
""" % lead_form(p["slug"])

# ---------------------------------------------------------------- შიდა გვერდი
def build_project(p, prev_p, next_p):
    name, domain = p["name"], p["domain"]
    url = "https://%s/" % domain
    partner = p.get("partner", "").strip()
    summary = p.get("summary", "").strip()
    challenge = p.get("challenge", "").strip()
    solution = p.get("solution", "").strip()
    result = p.get("result", "").strip()
    scope = [s for s in p.get("scope", []) if s.strip()]
    stack = [s for s in p.get("stack", []) if s.strip()]
    year = p.get("year", "").strip()

    sections = []
    if challenge:
        sections.append("""        <div class="feature-row__body" data-reveal>
            <span class="eyebrow">ამოცანა</span>
            <h2>გამოწვევა</h2>
            <p>%s</p>
          </div>""" % esc(challenge))
    if solution:
        sections.append("""        <div class="feature-row__body" data-reveal>
            <span class="eyebrow eyebrow--accent">გადაწყვეტა</span>
            <h2>რა გავაკეთეთ</h2>
            <p>%s</p>
          </div>""" % esc(solution))

    blocks = ""
    if sections:
        blocks += """
    <section class="section">
      <div class="container">
%s
      </div>
    </section>
""" % "\n".join(sections)

    if scope or stack:
        cols = []
        if scope:
            cols.append("""          <div data-reveal>
            <h3>სამუშაოს მოცულობა</h3>
            <ul class="checklist">
%s
            </ul>
          </div>""" % bullets(scope))
        if stack:
            cols.append("""          <div data-reveal data-reveal-delay="80">
            <h3>ტექნოლოგიები</h3>
            <div class="case__tags" style="margin-top:18px">%s</div>
          </div>""" % "".join('<span class="tag">%s</span>' % esc(t) for t in stack))
        blocks += """
    <section class="section section--soft">
      <div class="container">
        <div class="grid grid--2">
%s
        </div>
      </div>
    </section>
""" % "\n".join(cols)

    if result:
        blocks += """
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" data-reveal>
          <span class="eyebrow">შედეგი</span>
          <h2>%s</h2>
        </div>
      </div>
    </section>
""" % esc(result)

    tags = [tg for tg in p.get("tags", []) if tg.strip()] or ["ვებსაიტი"]
    meta = ['<div><b>კლიენტი</b><span>%s</span></div>' % esc(name)]
    if year:
        meta.append('<div><b>წელი</b><span>%s</span></div>' % esc(year))
    meta.append('<div><b>ვებსაიტი</b><a href="%s" target="_blank" rel="noopener noreferrer">%s ↗</a></div>'
                % (url, esc(domain)))
    if partner:
        meta.append('<div><b>თანამშრომლობა</b><span>%s</span></div>' % esc(partner))
    meta.append('<div><b>კატეგორია</b><span>%s</span></div>' % esc(", ".join(tags)))

    intro = "<p>%s</p>" % esc(summary) if summary else ""
    badge = ('\n            <span class="partner-badge">%s-თან ერთად</span>' % esc(partner)) if partner else ""

    body = """
    <section class="page-hero">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><a href="/work">ნამუშევრები</a></li>
            <li><span aria-current="page">%s</span></li>
          </ol>
          <span class="eyebrow">პროექტი</span>%s
          <h1>%s</h1>
          %s
          <div class="case__tags" style="margin-top:18px">%s</div>
          <div class="btn-row">
            <a class="btn btn--primary" href="%s" target="_blank" rel="noopener noreferrer">საიტის ნახვა ↗</a>
            <a class="btn btn--ghost" href="/work">ყველა ნამუშევარი</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="project-shot" data-reveal>
            %s
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="project-meta">
          %s
        </div>
      </div>
    </section>
%s
%s
%s
    <section class="section section--tight">
      <div class="container">
        <div class="project-nav">
          <a href="/work-%s"><span><small>წინა</small>%s</span></a>
          <a href="/work-%s"><span><small>შემდეგი</small>%s</span></a>
        </div>
      </div>
    </section>
""" % (esc(name), badge, esc(name), intro,
       "".join('<span class="tag">%s</span>' % esc(tg) for tg in tags), url, mock(p, big=True),
       "\n          ".join(meta), blocks, process_block(), form_block(p),
       prev_p["slug"], esc(prev_p["name"]), next_p["slug"], esc(next_p["name"]))

    desc = summary or ("%s — ვებსაიტი, შექმნილი Webico-ს მიერ. იხილეთ პროექტი: %s" % (name, domain))
    ld = ('  {\n'
          '    "@context": "https://schema.org",\n'
          '    "@type": "CreativeWork",\n'
          '    "name": %s,\n'
          '    "url": "%s/work-%s",\n'
          '    "creator": { "@type": "Organization", "name": "Webico", "url": "https://webico.io/" }\n'
          '  }') % (json.dumps(name, ensure_ascii=False), SITE, p["slug"])

    html = shell("%s — ნამუშევრები | Webico" % name, desc, "/work-" + p["slug"], body, ld)
    path = os.path.join(ROOT, "work-%s.html" % p["slug"])
    io.open(path, "w", encoding="utf-8").write(html)
    return path


# ------------------------------------------------------------------- ბადე
def build_index():
    cards = []
    for i, p in enumerate(PROJECTS):
        partner = p.get("partner", "").strip()
        summary = p.get("summary", "").strip()
        tags = [tg for tg in p.get("tags", []) if tg.strip()] or ["ვებსაიტი"]
        stack = [s for s in p.get("stack", []) if s.strip()]
        chips = "".join('<span class="tag">%s</span>' % esc(tg) for tg in tags)
        if partner:
            chips += '<span class="tag tag--partner">%s</span>' % esc(partner)
        tools_html = ""
        if stack:
            tools_html = ('\n                <div class="work__tools">'
                          '<b>ინსტრუმენტები</b>%s</div>'
                          % "".join('<span class="tag tag--tool">%s</span>' % esc(s) for s in stack))
        cards.append("""          <article class="work" data-category="web" data-reveal data-reveal-delay="%d">
            <a class="work__cover-link" href="/work-%s" tabindex="-1" aria-hidden="true">
              <div class="work__cover work__cover--mock">
                %s
              </div>
            </a>
            <div class="work__body">
              <div class="work__head">
                <h3><a href="/work-%s">%s</a></h3>
                <span class="work__go" aria-hidden="true">%s</span>
              </div>%s
              <div class="work__meta">%s</div>%s
              <div class="work__actions">
                <a class="btn btn--primary btn--sm" href="/work-%s">ნახე მეტი</a>
                <a class="work__site" href="https://%s/" target="_blank" rel="noopener noreferrer">%s %s</a>
              </div>
            </div>
          </article>""" % (min(i, 6) * 40, p["slug"], mock(p), p["slug"], esc(p["name"]), ARROW,
                           ("\n              <p>%s</p>" % esc(summary)) if summary else "",
                           chips, tools_html, p["slug"],
                           esc(p["domain"]), esc(p["domain"]), EXT))

    body = """
    <section class="page-hero">
      <div class="container">
        <div class="page-hero__inner">
          <ol class="breadcrumb">
            <li><a href="/">მთავარი</a></li>
            <li><span aria-current="page">ნამუშევრები</span></li>
          </ol>
          <span class="eyebrow">ჩვენი ნამუშევრები</span>
          <h1>შესრულებული პროექტები</h1>
          <p>%d ვებსაიტი — ბიზნესი, ორგანიზაციები, ონლაინ მაღაზიები და
            სერვისები საქართველოსა და მის ფარგლებს გარეთ.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="work-grid">
%s
        </div>
      </div>
    </section>
""" % (len(PROJECTS), "\n".join(cards))

    ld_items = ",\n".join(
        '      { "@type": "ListItem", "position": %d, "url": "%s/work-%s", "name": %s }'
        % (i, SITE, p["slug"], json.dumps(p["name"], ensure_ascii=False))
        for i, p in enumerate(PROJECTS, 1))
    ld = ('  {\n    "@context": "https://schema.org",\n    "@type": "ItemList",\n'
          '    "name": "Webico — ნამუშევრები",\n    "itemListElement": [\n%s\n    ]\n  }' % ld_items)

    html = shell("ნამუშევრები — Webico",
                 "Webico-ს პორტფოლიო: %d შესრულებული ვებსაიტი. გაეცანით თითოეულ პროექტს." % len(PROJECTS),
                 "/work", body, ld)
    io.open(os.path.join(ROOT, "work.html"), "w", encoding="utf-8").write(html)


def build_sitemap():
    pages = [("/", "1.0"), ("/services", "0.9"), ("/work", "0.9"), ("/contact", "0.9"),
             ("/about", "0.8"), ("/service-web-development", "0.8"), ("/service-seo", "0.8"),
             ("/service-marketing", "0.8"), ("/service-branding", "0.8")]
    pages += [("/work-" + p["slug"], "0.7") for p in PROJECTS]
    urls = "\n".join(
        "  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n"
        "    <changefreq>monthly</changefreq>\n    <priority>%s</priority>\n  </url>"
        % (SITE, u, TODAY, pr) for u, pr in pages)
    io.open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % urls)
    return len(pages)


def bump_assets():
    """გენერირებულ გვერდებს ახალი CSS/JS ვერსია სჭირდებათ — თორემ ბრაუზერი
    ძველ სტილს ხატავს ახალ HTML-ზე (იხ. tools/bump-assets.py)."""
    path = os.path.join(ROOT, "tools/bump-assets.py")
    ns = {"__name__": "bump_assets_module", "__file__": path}
    exec(compile(io.open(path, encoding="utf-8").read(), path, "exec"), ns)
    return ns["bump"]()


if __name__ == "__main__":
    n = len(PROJECTS)
    for i, p in enumerate(PROJECTS):
        build_project(p, PROJECTS[(i - 1) % n], PROJECTS[(i + 1) % n])
    build_index()
    total = build_sitemap()
    ver, changed = bump_assets()
    filled = sum(1 for p in PROJECTS if p.get("summary", "").strip())
    print("  ✓ %d პროექტის გვერდი + work.html" % n)
    print("  ✓ sitemap.xml — %d მისამართი" % total)
    print("  ✓ CSS/JS ვერსია: %s (%d ფაილი)" % (ver, changed))
    print("  ℹ აღწერა შევსებულია: %d / %d" % (filled, n))
