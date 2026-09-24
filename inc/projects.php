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

function cms_mock(array $p): string
{
    $tone = $p['tone'] ?? 'lilac';
    $cls = $tone === 'lilac' ? '' : ' mock-site--' . cms_e($tone);
    $shot = trim((string) ($p['shot'] ?? ''));
    $style = $shot !== '' ? ' style="--shot:url(' . cms_e($shot) . ')"' : '';
    return '<div class="mock-site' . $cls . '"' . $style . '>'
         . '<div class="mock-site__bar"><i></i><i></i><i></i>'
         . '<span class="mock-site__url">' . cms_e($p['domain'] ?? '') . '</span></div>'
         . '<div class="mock-site__view"><div class="mock-site__ph">'
         . '<span class="mock-site__logo">' . cms_e(cms_initials((string) ($p['name'] ?? ''))) . '</span>'
         . '<div class="mock-site__lines"><i></i><i></i><i></i></div>'
         . '</div></div></div>';
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
