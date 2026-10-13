<?php
/** პროექტების წაკითხვა და საერთო რენდერი */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

function cms_projects(bool $include_hidden = false): array
{
    $list = cms_read('projects', ['projects' => []])['projects'] ?? [];
    if (!$include_hidden) {
        $list = array_values(array_filter($list, static fn($p) => empty($p['hidden'])));
    }
    return $list;
}

function cms_project(string $slug): ?array
{
    foreach (cms_projects(true) as $p) {
        if (($p['slug'] ?? '') === $slug) {
            return empty($p['hidden']) ? $p : null;
        }
    }
    return null;
}

function cms_initials(string $name): string
{
    $parts = preg_split('~[\s\'.-]+~u', trim($name)) ?: [];
    $parts = array_values(array_filter($parts));
    if (!$parts) {
        return '—';
    }
    if (count($parts) === 1) {
        return mb_strtoupper(mb_substr($parts[0], 0, 2));
    }
    return mb_strtoupper(mb_substr($parts[0], 0, 1) . mb_substr($parts[1], 0, 1));
}

/** შედარებითი მისამართი → ძირიდან (/blog/… და მსგავს გვერდებზე შედარებითი გზა ტყდება) */
if (!function_exists('cms_url')) {
    function cms_url(string $path): string
    {
        $path = trim($path);
        if ($path === '' || preg_match('~^(https?:)?//~i', $path) || str_starts_with($path, '/')) {
            return $path;
        }
        return '/' . ltrim($path, './');
    }
}

/** პროექტის მოკაპის <img> — srcset-ით, თუ პატარა ვერსია (-sm.webp) არსებობს */
function cms_shot_img(array $p, string $sizes = '(max-width: 620px) 100vw, 50vw', bool $eager = false): string
{
    $shot = trim((string) ($p['shot'] ?? ''));
    if ($shot === '') {
        return '';
    }
    $src = cms_url($shot);
    $srcset = '';
    if (preg_match('~^(.+)\.webp$~', $shot, $m) && is_file(CMS_ROOT . '/' . ltrim($m[1], '/') . '-sm.webp')) {
        $srcset = ' srcset="' . cms_e(cms_url($m[1] . '-sm.webp')) . ' 720w, ' . cms_e($src) . ' 1400w"'
                . ' sizes="' . cms_e($sizes) . '"';
    }
    return '<img src="' . cms_e($src) . '"' . $srcset
         . ' alt="' . cms_e(($p['name'] ?? '') . ' — ვებსაიტი, შექმნილი Webico-ს მიერ') . '"'
         . ' width="1400" height="900" decoding="async"' . ($eager ? '' : ' loading="lazy"') . '>';
}

function cms_mock(array $p, string $sizes = '(max-width: 620px) 100vw, 50vw', bool $eager = false): string
{
    $tone = $p['tone'] ?? 'lilac';

    // რეალური მოკაპი — სუფთა ფოტო-ბარათი, ბრაუზერის ჩარჩოს გარეშე
    if (trim((string) ($p['shot'] ?? '')) !== '') {
        return '<figure class="shot">' . cms_shot_img($p, $sizes, $eager) . '</figure>';
    }

    $cls = $tone === 'lilac' ? '' : ' mock-site--' . cms_e($tone);

    // პლეისჰოლდერი საიტის მინიატურას ჰგავს
    $page = '<div class="mock-site__page">'
          . '<div class="mock-site__nav">'
          . '<span class="mock-site__brand">' . cms_e(cms_initials((string) ($p['name'] ?? ''))) . '</span>'
          . '<i></i><i></i><i></i></div>'
          . '<div class="mock-site__hero">'
          . '<span class="mock-site__h"></span>'
          . '<span class="mock-site__h mock-site__h--sm"></span>'
          . '<span class="mock-site__cta"></span></div>'
          . '<div class="mock-site__cols"><i></i><i></i><i></i></div>'
          . '</div>';

    return '<div class="mock-site' . $cls . '">'
         . '<div class="mock-site__bar"><i></i><i></i><i></i>'
         . '<span class="mock-site__url">' . cms_e($p['domain'] ?? '') . '</span></div>'
         . '<div class="mock-site__view">' . $page . '</div></div>';
}

/** პროექტები, რომლებსაც რეალური მოკაპი აქვს, წინ */
function cms_projects_showcase(): array
{
    $list = cms_projects();
    usort($list, static fn($a, $b) =>
        (int) (trim((string) ($b['shot'] ?? '')) !== '') <=> (int) (trim((string) ($a['shot'] ?? '')) !== ''));
    return $list;
}

function cms_tags(array $p): array
{
    $tags = array_values(array_filter(array_map('trim', $p['tags'] ?? [])));
    return $tags ?: ['ვებსაიტი'];
}

const CMS_ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
const CMS_EXT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

/* --------------------------------------------------- ინსტრუმენტების სია */
const CMS_TOOLS_DEFAULT = [
    ['WordPress',       'Wp',  '#21759b'],
    ['WooCommerce',     'Wc',  '#7f54b3'],
    ['Shopify',         'Sh',  '#5a8f3d'],
    ['Webflow',         'Wf',  '#4353ff'],
    ['Lovable',         'Lo',  '#d1443c'],
    ['Next.js / React', 'Ne',  '#0b7285'],
    ['Laravel',         'La',  '#c0392b'],
    ['PHP',             'Php', '#5b6398'],
    ['AWS',             'aws', '#b26a00'],
    ['Cloudflare',      'Cf',  '#c76a12'],
    ['Figma',           'Fi',  '#8b45d6'],
    ['Google Ads',      'Gg',  '#2f6fd0'],
    ['Meta Ads',        'Me',  '#1666c2'],
    ['Google Analytics','Ga',  '#c47b17'],
];

/** ინსტრუმენტები: content/site.json → tools, თუ არა — ნაგულისხმევი სია */
function cms_tools(): array
{
    $custom = cms_read('site')['tools'] ?? [];
    $out = [];
    foreach ($custom as $t) {
        $name = trim((string) ($t['name'] ?? ''));
        if ($name !== '') {
            $out[] = [$name, trim((string) ($t['mark'] ?? mb_substr($name, 0, 2))),
                      trim((string) ($t['color'] ?? '#181818'))];
        }
    }
    return $out ?: CMS_TOOLS_DEFAULT;
}

/* ------------------------------------------- პროექტები სერვისების მიხედვით */
const CMS_SERVICE_KEYS = [
    'web-development' => 'ვებსაიტის დამზადება',
    'wordpress'       => 'WordPress დეველოპმენტი',
    'ecommerce'       => 'ონლაინ მაღაზია',
    'branding'        => 'ბრენდინგი და UI/UX დიზაინი',
    'seo'             => 'SEO ოპტიმიზაცია',
    'marketing'       => 'ციფრული მარკეტინგი',
    'maintenance'     => 'ტექნიკური მხარდაჭერა',
];

/**
 * რომელ სერვისებს ეკუთვნის პროექტი.
 * ადმინში მონიშნული `services` უპირატესია; თუ არ არის მონიშნული,
 * გამოიყვანება თეგებიდან და ინსტრუმენტებიდან. თეგების გარეშე ძველი
 * პროექტები ვებსაიტებია, ამიტომ ისინი „ვებსაიტის დამზადებას“ ეკუთვნის.
 */
function cms_project_services(array $p): array
{
    $set = array_values(array_intersect(array_keys(CMS_SERVICE_KEYS), (array) ($p['services'] ?? [])));
    if ($set) {
        return $set;
    }
    $tags = array_map('trim', (array) ($p['tags'] ?? []));
    if (!$tags) {
        $set[] = 'web-development';
    }
    $hay = mb_strtolower(implode(' | ', array_merge($tags, (array) ($p['stack'] ?? []))));
    $rules = [
        'web-development' => ['ვებსაიტის დამზადება', 'ვებ-დეველოპმენტი', 'ვებსაიტი'],
        'wordpress'       => ['wordpress', 'woocommerce'],
        'ecommerce'       => ['მაღაზი', 'e-commerce', 'woocommerce', 'shopify'],
        'branding'        => ['ui/ux', 'ბრენდ', 'ლოგო'],
        'seo'             => ['seo'],
        'marketing'       => ['მარკეტინგ', 'რეკლამ', 'google ads', 'meta ads'],
        'maintenance'     => ['მხარდაჭერ'],
    ];
    foreach ($rules as $key => $needles) {
        foreach ($needles as $n) {
            if (str_contains($hay, $n)) {
                $set[] = $key;
                break;
            }
        }
    }
    return array_values(array_unique($set));
}

/**
 * სერვისის გვერდის პროექტები: [სია, ემთხვევა თუ არა სერვისს].
 * თუ სერვისზე ჯერ არცერთი პროექტი არ არის მონიშნული, ბრუნდება ბოლო
 * ნამუშევრები (false) — გვერდი მაშინ მათ ამ სერვისის პროექტებად არ აცხადებს.
 */
function cms_service_projects(string $key, int $limit = 6): array
{
    $all = array_values(array_filter(cms_projects(),
        static fn($p) => trim((string) ($p['shot'] ?? '')) !== '' || trim((string) ($p['full'] ?? '')) !== ''));
    $hit = array_values(array_filter($all, static fn($p) => in_array($key, cms_project_services($p), true)));
    return $hit ? [array_slice($hit, 0, $limit), true] : [array_slice($all, 0, $limit), false];
}

function cms_service_work_section(string $key): void
{
    [$list, $match] = cms_service_projects($key);
    if (!$list) {
        return;
    }
    $eyebrow = $match ? (CMS_SERVICE_KEYS[$key] ?? 'ნამუშევრები') : 'ნამუშევრები';
    $title   = $match ? 'შესრულებული პროექტები' : 'ჩვენი ბოლო ნამუშევრები';
    $total = count(cms_projects());
    ?>
    <section class="section svc-work" id="projects">
      <div class="container">
        <div class="section-head section-head--split" data-reveal>
          <div>
            <span class="eyebrow"><?= cms_e($eyebrow) ?></span>
            <h2><?= cms_e($title) ?></h2>
          </div>
          <a class="btn btn--ghost" href="/work">ყველა ნამუშევარი (<?= $total ?>)</a>
        </div>
        <div class="svc-work__grid">
          <?php foreach ($list as $i => $p):
              $slug = cms_e((string) $p['slug']);
              $shown = $p;
              if (trim((string) ($p['shot'] ?? '')) === '') { $shown['shot'] = $p['full']; } ?>
          <a class="svc-work__item" href="/work-<?= $slug ?>" data-reveal data-reveal-delay="<?= min($i, 5) * 50 ?>">
            <?= cms_mock($shown, '(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 400px') ?>
            <span class="svc-work__body">
              <b><?= cms_e((string) $p['name']) ?></b>
              <small><?= cms_e(implode(' · ', array_slice(cms_tags($p), 0, 2))) ?></small>
              <span class="svc-work__go" aria-hidden="true"><?= CMS_ARROW ?></span>
            </span>
          </a>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
<?php
}
