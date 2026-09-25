<?php
/** ადმინის ინტერფეისი */
declare(strict_types=1);

$site = cms_read('site');
$texts = $site['texts'] ?? [];
$settings = $site['settings'] ?? [];
$projects = cms_read('projects', ['projects' => []])['projects'] ?? [];
$leads = array_reverse(cms_read('leads', ['leads' => []])['leads'] ?? []);
$posts = cms_posts(true);
$bookings = cms_bookings();
usort($bookings, static fn($a, $b) => strcmp(($a['date'] ?? '') . ($a['time'] ?? ''), ($b['date'] ?? '') . ($b['time'] ?? '')));
$today = date('Y-m-d');
$upcoming = array_values(array_filter($bookings, static fn($b) => ($b['date'] ?? '') >= $today && ($b['status'] ?? 'new') !== 'cancelled'));
$pastBookings = array_reverse(array_values(array_filter($bookings, static fn($b) => !(($b['date'] ?? '') >= $today && ($b['status'] ?? 'new') !== 'cancelled'))));
$bcfg = cms_booking_config();

/** რედაქტირებადი ტექსტების რეესტრი: გასაღები => [ლეიბლი, ტიპი, ნაგულისხმევი] */
$TEXT_FIELDS = [
    'home.hero.proof'   => ['მთავარი — ზედა „ჩიპი“', 'input', '24 ბრენდმა უკვე გვენდო'],
    'home.hero.lead'    => ['მთავარი — სათაურის დასაწყისი', 'input', 'ვქმნით'],
    'home.hero.words'   => ['მთავარი — მბრუნავი სიტყვები (გამოყავით | ნიშნით)', 'input', 'ვებსაიტებს|ბრენდებს|კამპანიებს|აპლიკაციებს'],
    'home.hero.tail'    => ['მთავარი — სათაურის დასასრული', 'input', 'რომლებიც ყიდის.'],
    'home.hero.text'    => ['მთავარი — ტექსტი', 'area', 'ვებსაიტები, ბრენდინგი და ციფრული მარკეტინგი ქართული ბიზნესისთვის.'],
    'home.hero.cta'     => ['მთავარი — ღილაკი', 'input', 'დავიწყოთ პროექტი'],
    'home.tools.label'  => ['მთავარი — ინსტრუმენტების სათაური', 'input', 'ინსტრუმენტები, რომლებზეც ვმუშაობთ'],
    'blog.title'   => ['ბლოგი — სათაური', 'input', 'რჩევები ქართული ბიზნესისთვის'],
    'blog.text'    => ['ბლოგი — ტექსტი', 'area', ''],
    'home.clients.label' => ['მთავარი — კლიენტების წარწერა', 'input', 'გვენდობიან'],
    'work.title'   => ['ნამუშევრები — სათაური', 'input', 'შესრულებული პროექტები'],
    'work.text'    => ['ნამუშევრები — ტექსტი', 'area', ''],
    'contact.title' => ['კონტაქტი — სათაური', 'input', 'მოდით, ვისაუბროთ თქვენს პროექტზე'],
    'contact.text'  => ['კონტაქტი — ტექსტი', 'area', ''],
];

$SETTING_FIELDS = [
    'phone'   => ['ტელეფონი', '+995 32 2 00 00 00'],
    'mobile'  => ['მობილური / WhatsApp', '+995 555 10 20 30'],
    'email'   => ['ელფოსტა', 'hello@webico.io'],
    'address' => ['მისამართი', 'ჭავჭავაძის გამზირი 45, თბილისი 0179'],
    'hours'   => ['სამუშაო საათები', 'ორშაბათი–პარასკევი, 10:00–19:00'],
    'facebook'  => ['Facebook', ''],
    'instagram' => ['Instagram', ''],
    'linkedin'  => ['LinkedIn', ''],
];

$editPost = null;
if ($page === 'post' && isset($_GET['slug'])) {
    foreach ($posts as $p) {
        if (($p['slug'] ?? '') === $_GET['slug']) {
            $editPost = $p;
            break;
        }
    }
}
// შენახვისას შეცდომა — ფორმაში შეყვანილი მონაცემები არ იკარგება
if ($page === 'post' && $err && ($_POST['action'] ?? '') === 'save_post') {
    $editPost = array_map(static fn($v) => is_string($v) ? $v : '', $_POST) + ['_new' => empty($_POST['orig_slug'])];
}

$edit = null;
if ($page === 'project' && isset($_GET['slug'])) {
    foreach ($projects as $p) {
        if (($p['slug'] ?? '') === $_GET['slug']) {
            $edit = $p;
            break;
        }
    }
}
$nav = [
    'dashboard' => 'მთავარი',
    'projects'  => 'პროექტები',
    'posts'     => 'ბლოგი',
    'media'     => 'ფოტოები',
    'texts'     => 'ტექსტები',
    'bookings'  => 'შეხვედრები',
    'settings'  => 'კონტაქტები',
    'leads'     => 'განაცხადები',
];
?>
<!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Webico — მართვის პანელი</title>
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="admin.css">
</head>
<body>

<?php if ($page === 'setup'): ?>
  <main class="auth">
    <form method="post" class="card">
      <h1>პირველი გაშვება</h1>
      <p class="muted">შექმენით ადმინისტრატორის ანგარიში. პაროლი ინახება მხოლოდ ჰეშის სახით.</p>
      <?php if ($err): ?><p class="alert alert--err"><?= cms_e($err) ?></p><?php endif; ?>
      <label>მომხმარებელი<input name="user" required autocomplete="username"></label>
      <label>პაროლი (მინ. 10 სიმბოლო)<input type="password" name="password" required minlength="10" autocomplete="new-password"></label>
      <label>გაიმეორეთ პაროლი<input type="password" name="password2" required minlength="10" autocomplete="new-password"></label>
      <button class="btn" type="submit">ანგარიშის შექმნა</button>
    </form>
  </main>

<?php elseif ($page === 'login'): ?>
  <main class="auth">
    <form method="post" class="card">
      <h1>შესვლა</h1>
      <?php if (isset($_GET['setup'])): ?><p class="alert alert--ok">ანგარიში შეიქმნა — შედით.</p><?php endif; ?>
      <?php if ($err): ?><p class="alert alert--err"><?= cms_e($err) ?></p><?php endif; ?>
      <?= cms_csrf_field() ?>
      <label>მომხმარებელი<input name="user" required autocomplete="username"></label>
      <label>პაროლი<input type="password" name="password" required autocomplete="current-password"></label>
      <button class="btn" type="submit">შესვლა</button>
    </form>
  </main>

<?php else: ?>
  <div class="shell">
    <aside class="side">
      <div class="side__brand">Webico <span>CMS</span></div>
      <nav>
        <?php foreach ($nav as $k => $label): ?>
          <a href="index.php?p=<?= $k ?>" class="<?= $page === $k || ($k === 'projects' && $page === 'project') || ($k === 'posts' && $page === 'post') ? 'on' : '' ?>"><?= cms_e($label) ?></a>
        <?php endforeach; ?>
      </nav>
      <div class="side__foot">
        <a href="../" target="_blank" rel="noopener">საიტის ნახვა ↗</a>
        <a href="logout.php">გასვლა</a>
      </div>
    </aside>

    <main class="main">
      <?php if ($msg): ?><p class="alert alert--ok"><?= cms_e($msg) ?></p><?php endif; ?>
      <?php if ($err): ?><p class="alert alert--err"><?= cms_e($err) ?></p><?php endif; ?>

      <?php if ($page === 'dashboard'): ?>
        <h1>მართვის პანელი</h1>
        <div class="tiles">
          <a class="tile" href="index.php?p=projects"><b><?= count($projects) ?></b><span>პროექტი</span></a>
          <a class="tile" href="index.php?p=posts"><b><?= count($posts) ?></b><span>სტატია</span></a>
          <a class="tile" href="index.php?p=media"><b><?= count(cms_media_list()) ?></b><span>ფოტო</span></a>
          <a class="tile" href="index.php?p=bookings"><b><?= count($upcoming) ?></b><span>მომავალი შეხვედრა</span></a>
          <a class="tile" href="index.php?p=leads"><b><?= count($leads) ?></b><span>განაცხადი</span></a>
        </div>
        <p class="muted" style="margin-top:22px">ცვლილებები საიტზე მაშინვე აისახება — გადაშენება არ სჭირდება.</p>

      <?php elseif ($page === 'projects'): ?>
        <div class="head">
          <h1>პროექტები</h1>
          <a class="btn" href="index.php?p=project">+ ახალი</a>
        </div>
        <table class="table">
          <thead><tr><th>სახელი</th><th>დომენი</th><th>სტატუსი</th><th></th></tr></thead>
          <tbody>
          <?php foreach ($projects as $p): ?>
            <tr>
              <td><b><?= cms_e($p['name'] ?? '') ?></b><br><small class="muted"><?= cms_e($p['slug'] ?? '') ?></small></td>
              <td><?= cms_e($p['domain'] ?? '') ?></td>
              <td><?= !empty($p['hidden']) ? '<span class="pill pill--off">დამალული</span>' : '<span class="pill">გამოქვეყნებული</span>' ?></td>
              <td class="right">
                <a class="link" href="index.php?p=project&amp;slug=<?= urlencode($p['slug'] ?? '') ?>">რედაქტირება</a>
                <form method="post" class="inline" onsubmit="return confirm('წავშალოთ ეს პროექტი?')">
                  <?= cms_csrf_field() ?>
                  <input type="hidden" name="action" value="delete_project">
                  <input type="hidden" name="slug" value="<?= cms_e($p['slug'] ?? '') ?>">
                  <button class="link link--danger" type="submit">წაშლა</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>

      <?php elseif ($page === 'project'): ?>
        <h1><?= $edit ? 'პროექტის რედაქტირება' : 'ახალი პროექტი' ?></h1>
        <form method="post" class="card form">
          <?= cms_csrf_field() ?>
          <input type="hidden" name="action" value="save_project">
          <div class="row">
            <label>სახელი<input name="name" required value="<?= cms_e($edit['name'] ?? '') ?>"></label>
            <label>Slug (URL)<input name="slug" required value="<?= cms_e($edit['slug'] ?? '') ?>" <?= $edit ? 'readonly' : '' ?>></label>
          </div>
          <div class="row">
            <label>დომენი<input name="domain" placeholder="example.ge" value="<?= cms_e($edit['domain'] ?? '') ?>"></label>
            <label>წელი<input name="year" value="<?= cms_e($edit['year'] ?? '') ?>"></label>
          </div>
          <div class="row">
            <label>ფერი
              <select name="tone">
                <?php foreach (['lilac' => 'იისფერი', 'lime' => 'ლაიმი', 'pink' => 'ვარდისფერი', 'soft' => 'ნაცრისფერი'] as $v => $l): ?>
                  <option value="<?= $v ?>" <?= ($edit['tone'] ?? 'lilac') === $v ? 'selected' : '' ?>><?= $l ?></option>
                <?php endforeach; ?>
              </select>
            </label>
            <label>თანამშრომლობა<input name="partner" value="<?= cms_e($edit['partner'] ?? '') ?>"></label>
          </div>
          <div class="row">
            <label>სქრინშოტი
              <input name="shot" placeholder="assets/img/uploads/…" value="<?= cms_e($edit['shot'] ?? '') ?>">
              <small class="muted">მოკაპის სურათი, 3:2 (მაგ. 1536×1024)</small>
            </label>
            <label>ლოგო
              <input name="logo" placeholder="assets/img/uploads/…" value="<?= cms_e($edit['logo'] ?? '') ?>">
              <small class="muted">კლიენტების კარუსელში; PNG/SVG გამჭვირვალე ფონით</small>
            </label>
          </div>
          <label>მოკლე აღწერა<textarea name="summary" rows="2"><?= cms_e($edit['summary'] ?? '') ?></textarea></label>
          <label>გამოწვევა<textarea name="challenge" rows="3"><?= cms_e($edit['challenge'] ?? '') ?></textarea></label>
          <label>რა გავაკეთეთ<textarea name="solution" rows="3"><?= cms_e($edit['solution'] ?? '') ?></textarea></label>
          <label>შედეგი<textarea name="result" rows="2"><?= cms_e($edit['result'] ?? '') ?></textarea></label>
          <div class="row">
            <label>თეგები (მძიმით)<input name="tags" value="<?= cms_e(implode(', ', $edit['tags'] ?? [])) ?>"></label>
            <label>ინსტრუმენტები (მძიმით)<input name="stack" value="<?= cms_e(implode(', ', $edit['stack'] ?? [])) ?>"></label>
          </div>
          <label>სამუშაოს მოცულობა (თითო ხაზზე)<textarea name="scope" rows="4"><?= cms_e(implode("\n", $edit['scope'] ?? [])) ?></textarea></label>
          <label class="check"><input type="checkbox" name="hidden" <?= !empty($edit['hidden']) ? 'checked' : '' ?>> დამალული (საიტზე არ გამოჩნდება)</label>
          <div class="actions">
            <button class="btn" type="submit">შენახვა</button>
            <a class="link" href="index.php?p=projects">გაუქმება</a>
          </div>
        </form>

      <?php elseif ($page === 'posts'): ?>
        <div class="head">
          <h1>ბლოგი</h1>
          <a class="btn" href="index.php?p=post">+ ახალი სტატია</a>
        </div>
        <table class="table">
          <thead><tr><th>სათაური</th><th>კატეგორია</th><th>თარიღი</th><th>სტატუსი</th><th></th></tr></thead>
          <tbody>
          <?php foreach ($posts as $p): ?>
            <tr>
              <td><b><?= cms_e($p['title'] ?? '') ?></b><br><small class="muted">/blog/<?= cms_e($p['slug'] ?? '') ?></small></td>
              <td><?= cms_e(cms_post_cat($p)) ?></td>
              <td><?= cms_e($p['date'] ?? '') ?></td>
              <td><?php if (!empty($p['hidden'])): ?><span class="pill pill--off">დამალული</span><?php elseif (($p['date'] ?? '') > date('Y-m-d')): ?><span class="pill pill--off">დაგეგმილი</span><?php else: ?><span class="pill">გამოქვეყნებული</span><?php endif; ?></td>
              <td class="right">
                <a class="link" href="../blog/<?= cms_e($p['slug'] ?? '') ?>" target="_blank" rel="noopener">ნახვა</a>
                <a class="link" href="index.php?p=post&amp;slug=<?= urlencode($p['slug'] ?? '') ?>">რედაქტირება</a>
                <form method="post" class="inline" onsubmit="return confirm('წავშალოთ ეს სტატია?')">
                  <?= cms_csrf_field() ?>
                  <input type="hidden" name="action" value="delete_post">
                  <input type="hidden" name="slug" value="<?= cms_e($p['slug'] ?? '') ?>">
                  <button class="link link--danger" type="submit">წაშლა</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>

      <?php elseif ($page === 'post'): $isNew = !$editPost || !empty($editPost['_new']); ?>
        <h1><?= $isNew ? 'ახალი სტატია' : 'სტატიის რედაქტირება' ?></h1>
        <form method="post" class="card form" action="index.php?p=post<?= !$isNew ? '&amp;slug=' . urlencode((string) ($editPost['slug'] ?? '')) : '' ?>">
          <?= cms_csrf_field() ?>
          <input type="hidden" name="action" value="save_post">
          <input type="hidden" name="orig_slug" value="<?= $isNew ? '' : cms_e($editPost['orig_slug'] ?? $editPost['slug'] ?? '') ?>">
          <label>სათაური<input name="title" required value="<?= cms_e($editPost['title'] ?? '') ?>"></label>
          <div class="row">
            <label>Slug (URL — ლათინურად)<input name="slug" required pattern="[a-z0-9-]+" placeholder="google-maps-guide" value="<?= cms_e($editPost['slug'] ?? '') ?>"></label>
            <label>თარიღი<input type="date" name="date" required value="<?= cms_e($editPost['date'] ?? date('Y-m-d')) ?>">
              <small class="muted">მომავალი თარიღი = დაგეგმილი გამოქვეყნება</small></label>
          </div>
          <div class="row">
            <label>კატეგორია
              <select name="category">
                <?php foreach (CMS_BLOG_CATS as $v => $l): ?>
                  <option value="<?= $v ?>" <?= ($editPost['category'] ?? '') === $v ? 'selected' : '' ?>><?= cms_e($l) ?></option>
                <?php endforeach; ?>
              </select>
            </label>
            <label>ყდის ფერი
              <select name="tone">
                <?php foreach (['lilac' => 'იისფერი', 'lime' => 'ლაიმი', 'pink' => 'ვარდისფერი', 'soft' => 'ნაცრისფერი', 'dark' => 'მუქი'] as $v => $l): ?>
                  <option value="<?= $v ?>" <?= ($editPost['tone'] ?? 'lilac') === $v ? 'selected' : '' ?>><?= $l ?></option>
                <?php endforeach; ?>
              </select>
            </label>
          </div>
          <label>მოკლე აღწერა (ჩანს ბარათზე და Google-ში)<textarea name="excerpt" rows="2" maxlength="300"><?= cms_e($editPost['excerpt'] ?? '') ?></textarea></label>
          <div class="row">
            <label>ყდის ფოტო (არასავალდებულო)<input name="cover" placeholder="assets/img/uploads/…" value="<?= cms_e($editPost['cover'] ?? '') ?>">
              <small class="muted">თუ ცარიელია, ყდა ავტომატურად დაიხატება</small></label>
            <label>ყდის ტექსტი (არასავალდებულო)<input name="cover_text" placeholder="მოკლე ფრაზა ყდისთვის" value="<?= cms_e($editPost['cover_text'] ?? '') ?>"></label>
          </div>
          <label>ავტორი<input name="author" placeholder="<?= cms_e(CMS_BLOG_AUTHOR) ?>" value="<?= cms_e($editPost['author'] ?? '') ?>"></label>
          <label>ტექსტი
            <textarea name="body" rows="22" class="mono"><?= cms_e($editPost['body'] ?? '') ?></textarea>
            <small class="muted">შეგიძლიათ დაწეროთ უბრალო ტექსტი — ცარიელი ხაზი ახალ აბზაცს ნიშნავს. ან HTML: &lt;h2&gt; ქვესათაური (სარჩევში გამოჩნდება), &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;a href&gt;, &lt;blockquote&gt;, &lt;img src&gt;.</small>
          </label>
          <label class="check"><input type="checkbox" name="hidden" <?= !empty($editPost['hidden']) ? 'checked' : '' ?>> დამალული (მონახაზი)</label>
          <div class="actions">
            <button class="btn" type="submit">შენახვა</button>
            <a class="link" href="index.php?p=posts">გაუქმება</a>
          </div>
        </form>

      <?php elseif ($page === 'media'): ?>
        <h1>ფოტოები</h1>
        <form method="post" enctype="multipart/form-data" class="card upload">
          <?= cms_csrf_field() ?>
          <input type="hidden" name="action" value="upload">
          <label>ფაილი<input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" required></label>
          <label>სახელის პრეფიქსი<input name="prefix" placeholder="oribu"></label>
          <button class="btn" type="submit">ატვირთვა</button>
          <small class="muted">JPG, PNG, WebP, SVG — მაქსიმუმ 6 MB</small>
        </form>
        <div class="grid">
          <?php foreach (cms_media_list() as $m): ?>
            <figure class="shot">
              <img src="../<?= cms_e($m['url']) ?>" alt="" loading="lazy">
              <figcaption>
                <input class="copy" value="<?= cms_e($m['url']) ?>" readonly onclick="this.select()">
                <form method="post" onsubmit="return confirm('წავშალოთ?')">
                  <?= cms_csrf_field() ?>
                  <input type="hidden" name="action" value="delete_media">
                  <input type="hidden" name="name" value="<?= cms_e($m['name']) ?>">
                  <button class="link link--danger" type="submit">წაშლა</button>
                </form>
              </figcaption>
            </figure>
          <?php endforeach; ?>
        </div>

      <?php elseif ($page === 'texts'): ?>
        <h1>გვერდების ტექსტები</h1>
        <p class="muted">ცარიელი ველი ნიშნავს, რომ საიტზე საწყისი ტექსტი დარჩება.</p>
        <form method="post" class="card form">
          <?= cms_csrf_field() ?>
          <input type="hidden" name="action" value="save_texts">
          <?php foreach ($TEXT_FIELDS as $key => [$label, $type, $default]): ?>
            <label><?= cms_e($label) ?>
              <?php if ($type === 'area'): ?>
                <textarea name="texts[<?= cms_e($key) ?>]" rows="3" placeholder="<?= cms_e($default) ?>"><?= cms_e($texts[$key] ?? '') ?></textarea>
              <?php else: ?>
                <input name="texts[<?= cms_e($key) ?>]" placeholder="<?= cms_e($default) ?>" value="<?= cms_e($texts[$key] ?? '') ?>">
              <?php endif; ?>
            </label>
          <?php endforeach; ?>
          <div class="actions"><button class="btn" type="submit">შენახვა</button></div>
        </form>

      <?php elseif ($page === 'settings'): ?>
        <h1>კონტაქტები</h1>
        <form method="post" class="card form">
          <?= cms_csrf_field() ?>
          <input type="hidden" name="action" value="save_settings">
          <?php foreach ($SETTING_FIELDS as $key => [$label, $default]): ?>
            <label><?= cms_e($label) ?>
              <input name="settings[<?= cms_e($key) ?>]" placeholder="<?= cms_e($default) ?>" value="<?= cms_e($settings[$key] ?? '') ?>">
            </label>
          <?php endforeach; ?>
          <div class="actions"><button class="btn" type="submit">შენახვა</button></div>
        </form>

      <?php elseif ($page === 'bookings'): ?>
        <h1>შეხვედრები</h1>
        <p class="muted">საიტიდან დაჯავშნილი კონსულტაციები (თბილისის დროით). გაუქმებისას დრო ისევ თავისუფლდება. კლიენტს გაუქმების შესახებ თავად აცნობეთ.</p>
        <?php
          $renderB = static function (array $list, bool $actions): void {
            if (!$list) { echo '<p class="muted">არაფერია.</p>'; return; }
            echo '<table class="table"><thead><tr><th>დრო</th><th>კლიენტი</th><th>თემა</th><th>სტატუსი</th><th></th></tr></thead><tbody>';
            foreach ($list as $b) {
              $st = $b['status'] ?? 'new';
              echo '<tr><td><b>' . cms_e(cms_booking_label((string) $b['date'], (string) $b['time'])) . '</b></td>'
                 . '<td><b>' . cms_e($b['name'] ?? '') . '</b>' . (!empty($b['company']) ? ' · ' . cms_e($b['company']) : '')
                 . '<br><small><a href="mailto:' . cms_e($b['email'] ?? '') . '">' . cms_e($b['email'] ?? '') . '</a> · <a href="tel:' . cms_e($b['phone'] ?? '') . '">' . cms_e($b['phone'] ?? '') . '</a></small>'
                 . (!empty($b['message']) ? '<br><small class="muted">' . cms_e($b['message']) . '</small>' : '') . '</td>'
                 . '<td>' . cms_e($b['topic'] ?? '') . (!empty($b['format']) ? '<br><small class="muted">' . cms_e($b['format']) . '</small>' : '') . '</td>'
                 . '<td>' . ['new' => '<span class="pill">ახალი</span>', 'done' => '<span class="pill">ჩატარდა</span>', 'cancelled' => '<span class="pill pill--off">გაუქმდა</span>'][$st] . '</td><td class="right">';
              if ($actions) {
                foreach (['done' => 'ჩატარდა', 'cancelled' => 'გაუქმება'] as $k => $lbl) {
                  if ($k === $st) continue;
                  echo '<form method="post" class="inline"' . ($k === 'cancelled' ? ' onsubmit="return confirm(\'გავაუქმოთ შეხვედრა?\')"' : '') . '>' . cms_csrf_field()
                     . '<input type="hidden" name="action" value="booking_status"><input type="hidden" name="id" value="' . cms_e($b['id'] ?? '') . '">'
                     . '<input type="hidden" name="status" value="' . $k . '"><button class="link' . ($k === 'cancelled' ? ' link--danger' : '') . '" type="submit">' . $lbl . '</button></form> ';
                }
              }
              echo '</td></tr>';
            }
            echo '</tbody></table>';
          };
        ?>
        <h2>მომავალი (<?= count($upcoming) ?>)</h2>
        <?php $renderB($upcoming, true); ?>

        <h2 style="margin-top:34px">განრიგი</h2>
        <form method="post" class="card form">
          <?= cms_csrf_field() ?>
          <input type="hidden" name="action" value="save_booking_settings">
          <label>სამუშაო დღეები</label>
          <div class="row" style="flex-wrap:wrap;gap:14px">
            <?php foreach (CMS_WEEKDAYS_FULL as $n => $l): ?>
              <label class="check"><input type="checkbox" name="days[]" value="<?= $n ?>" <?= in_array($n, $bcfg['days'], true) ? 'checked' : '' ?>> <?= $l ?></label>
            <?php endforeach; ?>
          </div>
          <div class="row">
            <label>დაწყება<input type="time" name="start" value="<?= cms_e($bcfg['start']) ?>"></label>
            <label>დასრულება<input type="time" name="end" value="<?= cms_e($bcfg['end']) ?>"></label>
            <label>ხანგრძლივობა (წთ)
              <select name="slot"><?php foreach ([15, 20, 30, 45, 60] as $m): ?><option <?= $bcfg['slot'] === $m ? 'selected' : '' ?>><?= $m ?></option><?php endforeach; ?></select></label>
          </div>
          <div class="row">
            <label>მინიმუმ რამდენი საათით ადრე<input type="number" min="0" max="72" name="notice" value="<?= (int) $bcfg['notice'] ?>"></label>
            <label>რამდენი დღით წინ შეიძლება დაჯავშნა<input type="number" min="1" max="90" name="ahead" value="<?= (int) $bcfg['ahead'] ?>"></label>
          </div>
          <label>დაკეტილი დღეები (დღესასწაულები, შვებულება)
            <textarea name="blocked" rows="2" placeholder="2026-10-14, 2026-11-23"><?= cms_e(implode(', ', $bcfg['blocked'])) ?></textarea>
            <small class="muted">ფორმატი: წელი-თვე-დღე, მძიმით გამოყოფილი</small></label>
          <div class="actions"><button class="btn" type="submit">შენახვა</button></div>
        </form>

        <h2 style="margin-top:34px">წარსული და გაუქმებული</h2>
        <?php $renderB(array_slice($pastBookings, 0, 50), false); ?>

      <?php elseif ($page === 'leads'): ?>
        <h1>განაცხადები <small class="muted">(<?= count($leads) ?>)</small></h1>
        <?php if (!$leads): ?>
          <p class="muted">ჯერ არცერთი განაცხადი არ მოსულა.</p>
        <?php endif; ?>
        <?php foreach ($leads as $l): ?>
          <article class="card lead">
            <div class="lead__top">
              <b><?= cms_e($l['name'] ?? '') ?></b>
              <time class="muted"><?= cms_e($l['date'] ?? '') ?></time>
            </div>
            <p class="muted">
              <a href="mailto:<?= cms_e($l['email'] ?? '') ?>"><?= cms_e($l['email'] ?? '') ?></a>
              <?php if (!empty($l['phone'])): ?> · <a href="tel:<?= cms_e($l['phone']) ?>"><?= cms_e($l['phone']) ?></a><?php endif; ?>
              <?php if (!empty($l['service'])): ?> · <?= cms_e($l['service']) ?><?php endif; ?>
              <?php if (!empty($l['budget'])): ?> · ბიუჯეტი: <?= cms_e($l['budget']) ?><?php endif; ?>
              <?php if (!empty($l['timeline'])): ?> · ვადა: <?= cms_e($l['timeline']) ?><?php endif; ?>
              <?php if (!empty($l['website'])): ?> · <?= cms_e($l['website']) ?><?php endif; ?>
              <?php if (!empty($l['source'])): ?> · <?= cms_e($l['source']) ?><?php endif; ?>
            </p>
            <?php if (!empty($l['message'])): ?><p><?= nl2br(cms_e($l['message'])) ?></p><?php endif; ?>
            <form method="post" onsubmit="return confirm('წავშალოთ?')">
              <?= cms_csrf_field() ?>
              <input type="hidden" name="action" value="delete_lead">
              <input type="hidden" name="id" value="<?= cms_e($l['id'] ?? '') ?>">
              <button class="link link--danger" type="submit">წაშლა</button>
            </form>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
    </main>
  </div>
<?php endif; ?>

</body>
</html>
