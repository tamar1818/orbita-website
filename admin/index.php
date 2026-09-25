<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/inc/auth.php';
require_once dirname(__DIR__) . '/inc/media.php';
require_once dirname(__DIR__) . '/inc/blog.php';
require_once dirname(__DIR__) . '/inc/booking.php';

$page = $_GET['p'] ?? 'dashboard';
$msg = '';
$err = '';

/* ---------------------------------------------------------------- Setup */
if (!cms_is_installed()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $u = trim((string) ($_POST['user'] ?? ''));
        $p = (string) ($_POST['password'] ?? '');
        $p2 = (string) ($_POST['password2'] ?? '');
        if (mb_strlen($u) < 3) {
            $err = 'მომხმარებლის სახელი მინიმუმ 3 სიმბოლო';
        } elseif (mb_strlen($p) < 10) {
            $err = 'პაროლი მინიმუმ 10 სიმბოლო უნდა იყოს';
        } elseif ($p !== $p2) {
            $err = 'პაროლები არ ემთხვევა';
        } elseif (cms_install($u, $p)) {
            cms_redirect('index.php?p=login&setup=1');
        } else {
            $err = 'ჩაწერა ვერ მოხერხდა — შეამოწმეთ content/ დირექტორიის უფლებები';
        }
    }
    $page = 'setup';
} elseif ($page === 'login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!cms_csrf_check($_POST['_csrf'] ?? null)) {
            $err = 'სესია ამოიწურა — სცადეთ თავიდან';
        } elseif (($left = cms_login_locked()) > 0) {
            $err = 'ბევრი მცდელობა. სცადეთ ' . ceil($left / 60) . ' წუთში';
        } elseif (cms_login(trim((string) ($_POST['user'] ?? '')), (string) ($_POST['password'] ?? ''))) {
            cms_redirect('index.php');
        } else {
            $err = 'მომხმარებელი ან პაროლი არასწორია';
        }
    }
} else {
    cms_require_login();
}

/* ------------------------------------------------------------- Actions */
if (cms_user() !== null && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!cms_csrf_check($_POST['_csrf'] ?? null)) {
        $err = 'უსაფრთხოების შემოწმება ვერ გაიარა — გვერდი განაახლეთ';
    } else {
        $action = (string) ($_POST['action'] ?? '');

        if ($action === 'save_texts') {
            $site = cms_read('site');
            $site['texts'] = array_map(
                static fn($v) => trim((string) $v),
                (array) ($_POST['texts'] ?? [])
            );
            $msg = cms_write('site', $site) ? 'ტექსტები შენახულია' : 'შენახვა ვერ მოხერხდა';
        }

        if ($action === 'save_settings') {
            $site = cms_read('site');
            $site['settings'] = array_map(
                static fn($v) => trim((string) $v),
                (array) ($_POST['settings'] ?? [])
            );
            $msg = cms_write('site', $site) ? 'კონტაქტები შენახულია' : 'შენახვა ვერ მოხერხდა';
        }

        if ($action === 'save_project') {
            $all = cms_read('projects', ['projects' => []]);
            $list = $all['projects'] ?? [];
            $slug = cms_slug((string) ($_POST['slug'] ?? ''));
            if ($slug === '') {
                $err = 'slug სავალდებულოა';
            } else {
                $item = [
                    'slug'    => $slug,
                    'name'    => trim((string) ($_POST['name'] ?? '')),
                    'domain'  => trim((string) ($_POST['domain'] ?? '')),
                    'tone'    => in_array($_POST['tone'] ?? '', ['lilac', 'lime', 'pink', 'soft'], true)
                                 ? $_POST['tone'] : 'lilac',
                    'year'    => trim((string) ($_POST['year'] ?? '')),
                    'partner' => trim((string) ($_POST['partner'] ?? '')),
                    'summary' => trim((string) ($_POST['summary'] ?? '')),
                    'challenge' => trim((string) ($_POST['challenge'] ?? '')),
                    'solution'  => trim((string) ($_POST['solution'] ?? '')),
                    'result'    => trim((string) ($_POST['result'] ?? '')),
                    'shot'      => trim((string) ($_POST['shot'] ?? '')),
                    'logo'      => trim((string) ($_POST['logo'] ?? '')),
                    'hidden'    => !empty($_POST['hidden']),
                    'tags'  => array_values(array_filter(array_map('trim',
                                explode(',', (string) ($_POST['tags'] ?? ''))))),
                    'stack' => array_values(array_filter(array_map('trim',
                                explode(',', (string) ($_POST['stack'] ?? ''))))),
                    'scope' => array_values(array_filter(array_map('trim',
                                explode("\n", (string) ($_POST['scope'] ?? ''))))),
                ];
                $found = false;
                foreach ($list as $i => $p) {
                    if (($p['slug'] ?? '') === $slug) {
                        $list[$i] = $item + $p;
                        $list[$i] = $item;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $list[] = $item;
                }
                $all['projects'] = array_values($list);
                $msg = cms_write('projects', $all) ? 'პროექტი შენახულია' : 'შენახვა ვერ მოხერხდა';
            }
        }

        if ($action === 'delete_project') {
            $all = cms_read('projects', ['projects' => []]);
            $slug = cms_slug((string) ($_POST['slug'] ?? ''));
            $all['projects'] = array_values(array_filter(
                $all['projects'] ?? [],
                static fn($p) => ($p['slug'] ?? '') !== $slug
            ));
            $msg = cms_write('projects', $all) ? 'პროექტი წაიშალა' : 'წაშლა ვერ მოხერხდა';
        }

        if ($action === 'reorder') {
            $order = (array) ($_POST['order'] ?? []);
            $all = cms_read('projects', ['projects' => []]);
            $byslug = [];
            foreach ($all['projects'] ?? [] as $p) {
                $byslug[$p['slug'] ?? ''] = $p;
            }
            $sorted = [];
            foreach ($order as $s) {
                if (isset($byslug[$s])) {
                    $sorted[] = $byslug[$s];
                    unset($byslug[$s]);
                }
            }
            $all['projects'] = array_merge($sorted, array_values($byslug));
            $msg = cms_write('projects', $all) ? 'რიგი განახლდა' : 'ვერ განახლდა';
        }

        if ($action === 'save_post') {
            $all = cms_read('posts', ['posts' => []]);
            $list = $all['posts'] ?? [];
            $slug = cms_slug((string) ($_POST['slug'] ?? ''));
            $date = (string) ($_POST['date'] ?? '');
            if ($slug === '') {
                $err = 'slug სავალდებულოა (ლათინური ასოები, ციფრები და ტირე)';
            } elseif (trim((string) ($_POST['title'] ?? '')) === '') {
                $err = 'სათაური სავალდებულოა';
            } elseif (!preg_match('~^\d{4}-\d{2}-\d{2}$~', $date)) {
                $err = 'თარიღი არასწორია';
            } else {
                $item = [
                    'slug'     => $slug,
                    'title'    => trim((string) ($_POST['title'] ?? '')),
                    'excerpt'  => trim((string) ($_POST['excerpt'] ?? '')),
                    'category' => array_key_exists($_POST['category'] ?? '', CMS_BLOG_CATS) ? $_POST['category'] : 'business',
                    'tone'     => in_array($_POST['tone'] ?? '', CMS_BLOG_TONES, true) ? $_POST['tone'] : 'lilac',
                    'date'     => $date,
                    'updated'  => date('Y-m-d'),
                    'author'   => trim((string) ($_POST['author'] ?? '')),
                    'cover'    => trim((string) ($_POST['cover'] ?? '')),
                    'cover_text' => trim((string) ($_POST['cover_text'] ?? '')),
                    'body'     => (string) ($_POST['body'] ?? ''),
                    'hidden'   => !empty($_POST['hidden']),
                ];
                if ($item['cover_text'] === '') {
                    unset($item['cover_text']);
                }
                $orig = cms_slug((string) ($_POST['orig_slug'] ?? ''));
                $found = false;
                foreach ($list as $i => $p) {
                    if (($p['slug'] ?? '') === ($orig !== '' ? $orig : $slug)) {
                        $list[$i] = $item;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    foreach ($list as $p) {
                        if (($p['slug'] ?? '') === $slug) {
                            $err = 'ასეთი slug უკვე არსებობს';
                            break;
                        }
                    }
                    if (!$err) {
                        $list[] = $item;
                    }
                }
                if (!$err) {
                    $all['posts'] = array_values($list);
                    if (cms_write('posts', $all)) {
                        $msg = 'სტატია შენახულია';
                        $page = 'posts';
                    } else {
                        $err = 'შენახვა ვერ მოხერხდა';
                    }
                }
            }
        }

        if ($action === 'delete_post') {
            $all = cms_read('posts', ['posts' => []]);
            $slug = cms_slug((string) ($_POST['slug'] ?? ''));
            $all['posts'] = array_values(array_filter(
                $all['posts'] ?? [],
                static fn($p) => ($p['slug'] ?? '') !== $slug
            ));
            $msg = cms_write('posts', $all) ? 'სტატია წაიშალა' : 'წაშლა ვერ მოხერხდა';
        }

        if ($action === 'upload') {
            $res = cms_upload($_FILES['file'] ?? [], (string) ($_POST['prefix'] ?? 'img'));
            if ($res['ok']) {
                $msg = 'ატვირთულია: ' . $res['file'];
            } else {
                $err = $res['error'];
            }
        }

        if ($action === 'delete_media') {
            $msg = cms_media_delete((string) ($_POST['name'] ?? ''))
                ? 'ფაილი წაიშალა' : 'წაშლა ვერ მოხერხდა';
        }

        if ($action === 'booking_status') {
            $store = cms_read('bookings', ['bookings' => []]);
            $id = (string) ($_POST['id'] ?? '');
            $st = in_array($_POST['status'] ?? '', ['new', 'done', 'cancelled'], true) ? $_POST['status'] : 'new';
            foreach ($store['bookings'] as &$b) {
                if (($b['id'] ?? '') === $id) {
                    $b['status'] = $st;
                }
            }
            unset($b);
            $msg = cms_write('bookings', $store)
                ? ($st === 'cancelled' ? 'შეხვედრა გაუქმდა — დრო ისევ თავისუფალია' : 'სტატუსი განახლდა')
                : 'შენახვა ვერ მოხერხდა';
        }

        if ($action === 'save_booking_settings') {
            $site = cms_read('site');
            $blocked = array_values(array_filter(array_map('trim',
                preg_split('~[\s,]+~', (string) ($_POST['blocked'] ?? '')) ?: []),
                static fn($d) => (bool) preg_match('~^\d{4}-\d{2}-\d{2}$~', $d)));
            $site['booking'] = [
                'days'    => array_values(array_map('intval', (array) ($_POST['days'] ?? []))),
                'start'   => (string) ($_POST['start'] ?? '10:00'),
                'end'     => (string) ($_POST['end'] ?? '18:00'),
                'slot'    => (int) ($_POST['slot'] ?? 30),
                'notice'  => (int) ($_POST['notice'] ?? 3),
                'ahead'   => (int) ($_POST['ahead'] ?? 21),
                'blocked' => $blocked,
            ];
            $msg = cms_write('site', $site) ? 'განრიგი შენახულია' : 'შენახვა ვერ მოხერხდა';
        }

        if ($action === 'delete_lead') {
            $leads = cms_read('leads', ['leads' => []]);
            $id = (string) ($_POST['id'] ?? '');
            $leads['leads'] = array_values(array_filter(
                $leads['leads'] ?? [],
                static fn($l) => ($l['id'] ?? '') !== $id
            ));
            $msg = cms_write('leads', $leads) ? 'განაცხადი წაიშალა' : 'წაშლა ვერ მოხერხდა';
        }
    }
}

require __DIR__ . '/view.php';
