<?php
/**
 * Webico CMS — ბირთვი: გზები, სესია, JSON-საცავი, უსაფრთხოების დამხმარეები.
 * მონაცემები ინახება ფაილებში — ბაზა არ სჭირდება.
 */
declare(strict_types=1);

define('CMS_ROOT', dirname(__DIR__));
define('CMS_CONTENT', CMS_ROOT . '/content');
define('CMS_UPLOADS', CMS_ROOT . '/assets/img/uploads');
define('CMS_UPLOADS_URL', 'assets/img/uploads');

mb_internal_encoding('UTF-8');

/* ------------------------------------------------------------------ სესია */
function cms_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        // HTTPS-ზე cookie მხოლოდ დაცული კავშირით გადაიცემა
        'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                       || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'),
    ]);
    session_name('webico_cms');
    session_start();
}

/* ------------------------------------------------------------- JSON საცავი */
function cms_read(string $name, array $fallback = []): array
{
    $path = CMS_CONTENT . '/' . basename($name) . '.json';
    if (!is_file($path)) {
        return $fallback;
    }
    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return $fallback;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $fallback;
}

/** ატომური ჩაწერა: ჯერ დროებით ფაილში, მერე rename — ნახევრად ჩაწერილი JSON არ რჩება */
function cms_write(string $name, array $data): bool
{
    if (!is_dir(CMS_CONTENT)) {
        mkdir(CMS_CONTENT, 0775, true);
    }
    $path = CMS_CONTENT . '/' . basename($name) . '.json';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($json === false) {
        return false;
    }
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        return false;
    }
    @chmod($path, 0664);
    return true;
}

/* ------------------------------------------------------------------- CSRF */
function cms_csrf(): string
{
    cms_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function cms_csrf_check(?string $token): bool
{
    cms_session();
    return is_string($token)
        && !empty($_SESSION['csrf'])
        && hash_equals($_SESSION['csrf'], $token);
}

function cms_csrf_field(): string
{
    return '<input type="hidden" name="_csrf" value="' . cms_e(cms_csrf()) . '">';
}

/* -------------------------------------------------------------- დამხმარეები */
function cms_e(?string $v): string
{
    return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function cms_slug(string $v): string
{
    $v = mb_strtolower(trim($v));
    $v = preg_replace('~[^a-z0-9]+~u', '-', $v) ?? '';
    return trim($v, '-');
}

function cms_redirect(string $url): never
{
    header('Location: ' . $url);
    exit;
}

/** ტექსტი: ადმინის რედაქტირებული ვერსია, თუ არა — საწყისი მნიშვნელობა */
function T(string $key, string $default = ''): string
{
    static $texts = null;
    if ($texts === null) {
        $texts = cms_read('site')['texts'] ?? [];
    }
    $v = $texts[$key] ?? '';
    return cms_e($v !== '' ? $v : $default);
}

/** იგივე, ოღონდ დაუშვებს <br> და <em>-ს (სათაურებისთვის) */
function T_html(string $key, string $default = ''): string
{
    static $texts = null;
    if ($texts === null) {
        $texts = cms_read('site')['texts'] ?? [];
    }
    $v = $texts[$key] ?? '';
    $v = $v !== '' ? $v : $default;
    return strip_tags($v, '<br><em><strong><span>');
}

function cms_setting(string $key, string $default = ''): string
{
    static $s = null;
    if ($s === null) {
        $s = cms_read('site')['settings'] ?? [];
    }
    return cms_e($s[$key] ?? $default);
}
