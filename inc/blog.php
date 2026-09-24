<?php
/** ბლოგი — სტატიების წაკითხვა, უსაფრთხო HTML და საერთო რენდერი */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_BLOG_CATS = [
    'seo'       => 'SEO',
    'marketing' => 'მარკეტინგი',
    'web'       => 'ვებსაიტები',
    'branding'  => 'ბრენდინგი',
    'business'  => 'ბიზნესი',
];
const CMS_BLOG_TONES = ['lilac', 'lime', 'pink', 'soft', 'dark'];
const CMS_BLOG_AUTHOR = 'ვებიკოს გუნდი';

/** გამოქვეყნებული სტატიები, ახლიდან ძველისკენ */
function cms_posts(bool $include_hidden = false): array
{
    $list = cms_read('posts', ['posts' => []])['posts'] ?? [];
    if (!$include_hidden) {
        $today = date('Y-m-d');
        $list = array_filter($list, static fn($p) =>
            empty($p['hidden']) && (string) ($p['date'] ?? '') <= $today);
    }
    $list = array_values($list);
    usort($list, static fn($a, $b) => strcmp((string) ($b['date'] ?? ''), (string) ($a['date'] ?? '')));
    return $list;
}

function cms_post(string $slug): ?array
{
    foreach (cms_posts() as $p) {
        if (($p['slug'] ?? '') === $slug) {
            return $p;
        }
    }
    return null;
}

function cms_post_cat(array $p): string
{
    return CMS_BLOG_CATS[$p['category'] ?? ''] ?? 'ბლოგი';
}

function cms_post_tone(array $p): string
{
    $t = (string) ($p['tone'] ?? '');
    return in_array($t, CMS_BLOG_TONES, true) ? $t : 'lilac';
}

/** კითხვის დრო — ქართული სიტყვები გრძელია, ვითვლით ~160 სიტყვას წუთში */
function cms_read_time(array $p): int
{
    $words = preg_split('~\s+~u', trim(strip_tags((string) ($p['body'] ?? '')))) ?: [];
    return max(1, (int) round(count($words) / 160));
}

function cms_date_ka(string $ymd): string
{
    static $m = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი',
                 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
    $t = strtotime($ymd);
    if ($t === false) {
        return '';
    }
    return (int) date('j', $t) . ' ' . $m[(int) date('n', $t) - 1] . ', ' . date('Y', $t);
}

/** შედარებითი მისამართი → ძირიდან (/blog/… გვერდებზე შედარებითი გზა ტყდება) */
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

/**
 * სტატიის ტექსტის გასუფთავება: მხოლოდ ტიპოგრაფიული ტეგები, ატრიბუტები — მხოლოდ
 * a[href] და img[src|alt]. h2-ებს ვაძლევთ id-ს სარჩევისთვის.
 *
 * @return array{0:string, 1:array<int,array{id:string,text:string}>}
 */
function cms_post_body(string $html): array
{
    static $allowed = ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a',
                       'blockquote', 'br', 'hr', 'figure', 'figcaption', 'img', 'code', 'mark'];
    $toc = [];
    if (trim($html) === '') {
        return ['', $toc];
    }

    // უბრალო ტექსტი (ბლოკური ტეგების გარეშე) — ცარიელი ხაზი = ახალი აბზაცი
    if (!preg_match('~<(p|h[2-4]|ul|ol|blockquote|figure)\b~i', $html)) {
        $paras = preg_split('~\R{2,}~u', trim($html)) ?: [];
        $html = implode('', array_map(static fn($t) => '<p>' . nl2br(trim($t), false) . '</p>', $paras));
    }

    $doc = new DOMDocument('1.0', 'UTF-8');
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="__root">' . $html . '</div>',
                   LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET);
    libxml_clear_errors();
    $root = $doc->getElementById('__root');
    if (!$root) {
        return [cms_e(strip_tags($html)), $toc];
    }

    $walk = static function (DOMNode $node) use (&$walk, $allowed, $doc, &$toc): void {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof DOMComment) {
                $node->removeChild($child);
                continue;
            }
            if (!$child instanceof DOMElement) {
                continue;
            }
            $tag = strtolower($child->tagName);
            if (in_array($tag, ['script', 'style', 'iframe', 'object', 'embed', 'form', 'svg', 'math'], true)) {
                $node->removeChild($child);
                continue;
            }
            $walk($child);
            if (!in_array($tag, $allowed, true)) {
                // უცნობი ტეგი იშლება, შიგთავსი რჩება
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }
            $keep = [];
            if ($tag === 'a') {
                $href = trim($child->getAttribute('href'));
                if (preg_match('~^(https?://|/|#|mailto:|tel:)~i', $href)) {
                    $keep['href'] = $href;
                    if (preg_match('~^https?://~i', $href) && !preg_match('~^https?://(www\.)?webico\.io~i', $href)) {
                        $keep['rel'] = 'noopener';
                        $keep['target'] = '_blank';
                    }
                }
            }
            if ($tag === 'img') {
                $src = trim($child->getAttribute('src'));
                if (!preg_match('~^(https?://|/|assets/)~i', $src)) {
                    $node->removeChild($child);
                    continue;
                }
                $keep = ['src' => cms_url($src), 'alt' => $child->getAttribute('alt'), 'loading' => 'lazy'];
            }
            foreach (iterator_to_array($child->attributes) as $attr) {
                $child->removeAttribute($attr->name);
            }
            foreach ($keep as $k => $v) {
                $child->setAttribute($k, $v);
            }
            if ($tag === 'h2') {
                $id = 's' . (count($toc) + 1);
                $child->setAttribute('id', $id);
                $toc[] = ['id' => $id, 'text' => trim($child->textContent)];
            }
        }
    };
    $walk($root);

    $out = '';
    foreach ($root->childNodes as $c) {
        $out .= $doc->saveHTML($c);
    }
    return [$out, $toc];
}

/** ქავერი: ატვირთული ფოტო ან გენერირებული „რედაქციული“ ყდა */
function cms_post_cover(array $p, string $size = ''): string
{
    $tone = cms_post_tone($p);
    $img = trim((string) ($p['cover'] ?? ''));
    $cls = 'post-cover post-cover--' . $tone . ($size ? ' post-cover--' . $size : '');
    if ($img !== '') {
        return '<div class="' . $cls . ' post-cover--img"><img src="' . cms_e(cms_url($img)) . '" alt="" loading="lazy"></div>';
    }
    $icon = [
        'seo'       => '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/>',
        'marketing' => '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
        'web'       => '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
        'branding'  => '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
        'business'  => '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    ][$p['category'] ?? ''] ?? '<circle cx="12" cy="12" r="9"/>';
    return '<div class="' . $cls . '" aria-hidden="true">'
         . '<span class="post-cover__cat">' . cms_e(cms_post_cat($p)) . '</span>'
         . '<span class="post-cover__icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' . $icon . '</svg></span>'
         . '<span class="post-cover__title">' . cms_e((string) ($p['cover_text'] ?? $p['title'] ?? '')) . '</span>'
         . '</div>';
}

/** სტატიის ბარათი (ბლოგის სია, მთავარი გვერდი, მსგავსი სტატიები) */
function cms_post_card(array $p, bool $big = false): string
{
    $url = '/blog/' . cms_e((string) $p['slug']);
    return '<article class="post-card' . ($big ? ' post-card--big' : '') . '">'
         . '<a class="post-card__media" href="' . $url . '" tabindex="-1" aria-hidden="true">' . cms_post_cover($p, $big ? 'big' : '') . '</a>'
         . '<div class="post-card__body">'
         . '<p class="post-card__meta"><span class="post-card__cat">' . cms_e(cms_post_cat($p)) . '</span>'
         . '<span>' . cms_e(cms_date_ka((string) ($p['date'] ?? ''))) . '</span>'
         . '<span>' . cms_read_time($p) . ' წთ</span></p>'
         . '<h3 class="post-card__title"><a href="' . $url . '">' . cms_e((string) ($p['title'] ?? '')) . '</a></h3>'
         . ($big || !empty($p['excerpt']) ? '<p class="post-card__excerpt">' . cms_e((string) ($p['excerpt'] ?? '')) . '</p>' : '')
         . '<span class="post-card__more">წაიკითხე <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>'
         . '</div></article>';
}
