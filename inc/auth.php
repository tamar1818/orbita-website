<?php
/** ავტორიზაცია — პაროლის ჰეში ინახება content/auth.php-ში */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_AUTH_FILE = CMS_CONTENT . '/auth.php';
const CMS_MAX_TRIES = 6;          // მცდელობა
const CMS_LOCK_SECONDS = 900;     // 15 წუთი

function cms_auth_config(): array
{
    if (!is_file(CMS_AUTH_FILE)) {
        return [];
    }
    $data = require CMS_AUTH_FILE;
    return is_array($data) ? $data : [];
}

function cms_is_installed(): bool
{
    $c = cms_auth_config();
    return !empty($c['hash']);
}

function cms_install(string $user, string $password): bool
{
    if (!is_dir(CMS_CONTENT)) {
        mkdir(CMS_CONTENT, 0775, true);
    }
    $payload = [
        'user' => $user,
        'hash' => password_hash($password, PASSWORD_DEFAULT),
    ];
    $php = "<?php\n// Webico CMS — ავტორიზაციის მონაცემები. ხელით ნუ შეცვლით.\nreturn "
         . var_export($payload, true) . ";\n";
    $ok = file_put_contents(CMS_AUTH_FILE, $php, LOCK_EX) !== false;
    if ($ok) {
        @chmod(CMS_AUTH_FILE, 0640);
    }
    return $ok;
}

function cms_login_locked(): int
{
    cms_session();
    $tries = (int) ($_SESSION['login_tries'] ?? 0);
    $last  = (int) ($_SESSION['login_last'] ?? 0);
    if ($tries >= CMS_MAX_TRIES) {
        $left = CMS_LOCK_SECONDS - (time() - $last);
        return $left > 0 ? $left : 0;
    }
    return 0;
}

function cms_login(string $user, string $password): bool
{
    cms_session();
    $c = cms_auth_config();
    $ok = !empty($c['hash'])
        && hash_equals((string) ($c['user'] ?? ''), $user)
        && password_verify($password, (string) $c['hash']);

    if (!$ok) {
        $_SESSION['login_tries'] = (int) ($_SESSION['login_tries'] ?? 0) + 1;
        $_SESSION['login_last']  = time();
        // დრო ისე რომ არ გაუშვას, თითქოს მომხმარებელი არსებობს თუ არა
        usleep(300000);
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['uid'] = $c['user'];
    $_SESSION['login_tries'] = 0;
    unset($_SESSION['login_last']);
    return true;
}

function cms_logout(): void
{
    cms_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function cms_user(): ?string
{
    cms_session();
    return isset($_SESSION['uid']) ? (string) $_SESSION['uid'] : null;
}

function cms_require_login(): void
{
    if (cms_user() === null) {
        cms_redirect('index.php?p=login');
    }
}
