<?php
/** ადმინის ინტერფეისი */
declare(strict_types=1);

$site = cms_read('site');
$texts = $site['texts'] ?? [];
$settings = $site['settings'] ?? [];
$projects = cms_read('projects', ['projects' => []])['projects'] ?? [];
$leads = array_reverse(cms_read('leads', ['leads' => []])['leads'] ?? []);

/** რედაქტირებადი ტექსტების რეესტრი: გასაღები => [ლეიბლი, ტიპი, ნაგულისხმევი] */
$TEXT_FIELDS = [
    'home.hero.eyebrow' => ['მთავარი — ზედა წარწერა', 'input', 'ციფრული სააგენტო თბილისში'],
    'home.hero.title'   => ['მთავარი — სათაური', 'input', 'შენი ბრენდის <em>შემდეგი ნაბიჯი.</em>'],
    'home.hero.text'    => ['მთავარი — ტექსტი', 'area', 'შენი ბიზნესის საჭიროებებზე მორგებული ვებსაიტები, ბრენდინგი და ციფრული მარკეტინგი.'],
    'home.hero.cta'     => ['მთავარი — ღილაკი', 'input', 'დავიწყოთ შენი პროექტი'],
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
    'media'     => 'ფოტოები',
    'texts'     => 'ტექსტები',
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
          <a href="index.php?p=<?= $k ?>" class="<?= $page === $k || ($k === 'projects' && $page === 'project') ? 'on' : '' ?>"><?= cms_e($label) ?></a>
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
          <a class="tile" href="index.php?p=media"><b><?= count(cms_media_list()) ?></b><span>ფოტო</span></a>
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
          <label>სქრინშოტი
            <input name="shot" placeholder="assets/img/uploads/…" value="<?= cms_e($edit['shot'] ?? '') ?>">
            <small class="muted">ატვირთეთ „ფოტოები“ განყოფილებაში და ჩასვით მისამართი</small>
          </label>
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
