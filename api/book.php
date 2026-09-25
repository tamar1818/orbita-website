<?php
/** შეხვედრის დაჯავშნა — ორმაგი ჯავშნისგან დაცული (flock) */
declare(strict_types=1);
require_once dirname(__DIR__) . '/inc/booking.php';
require_once dirname(__DIR__) . '/inc/mail.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$fail = static function (int $code, array $payload): never {
    http_response_code($code);
    echo json_encode(['ok' => false] + $payload, JSON_UNESCAPED_UNICODE);
    exit;
};

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $fail(405, ['error' => 'method not allowed']);
}
$in = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($in)) {
    $in = $_POST;
}
if (!empty($in['company_website'])) {          // honeypot
    echo json_encode(['ok' => true, 'label' => '']);
    exit;
}
$get = static fn(string $k, int $max = 300): string => mb_substr(trim((string) ($in[$k] ?? '')), 0, $max);

$name = $get('name', 120);
$email = $get('email', 160);
$phone = $get('phone', 60);
$date = $get('date', 10);
$time = $get('time', 5);
$errors = [];
if ($name === '') $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (mb_strlen(preg_replace('~\D~', '', $phone)) < 7) $errors[] = 'phone';
if (!preg_match('~^\d{4}-\d{2}-\d{2}$~', $date) || !preg_match('~^\d{2}:\d{2}$~', $time)) $errors[] = 'slot';
if ($errors) {
    $fail(422, ['fields' => $errors]);
}

// ერთდროული მოთხოვნები რიგში დგება — ერთ დროს მხოლოდ ერთი ჯავშანი
$lock = fopen(CMS_CONTENT . '/.bookings.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX)) {
    $fail(500, ['error' => 'lock']);
}

$store = cms_read('bookings', ['bookings' => []]);
$list = $store['bookings'] ?? [];

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$recent = count(array_filter($list, static fn($b) => ($b['ip'] ?? '') === $ip && time() - (int) ($b['ts'] ?? 0) < 3600));
if ($recent >= 3) {
    $fail(429, ['error' => 'too many requests']);
}

if (!in_array($time, cms_day_slots($date), true)) {
    $fail(409, ['error' => 'taken']);              // დრო უკვე დაიკავეს ან აღარ არის ხელმისაწვდომი
}

$item = [
    'id'      => bin2hex(random_bytes(8)),
    'ts'      => time(),
    'created' => date('Y-m-d H:i'),
    'date'    => $date,
    'time'    => $time,
    'name'    => $name,
    'email'   => $email,
    'phone'   => $phone,
    'company' => $get('company', 160),
    'topic'   => $get('topic', 80),
    'format'  => $get('format', 40),
    'message' => $get('message', 2000),
    'status'  => 'new',
    'ip'      => $ip,
];
$list[] = $item;
$store['bookings'] = array_slice($list, -3000);
if (!cms_write('bookings', $store)) {
    $fail(500, ['error' => 'storage']);
}
flock($lock, LOCK_UN);
fclose($lock);

$label = cms_booking_label($date, $time);
$slot = cms_booking_config()['slot'];

// გუნდს
cms_mail(cms_team_email(), 'ახალი შეხვედრა: ' . $label . ' — ' . $name,
    "ახალი ჯავშანი webico.io-დან\n\n"
    . cms_mail_lines([
        'დრო' => $label . ' (' . $slot . ' წთ, თბილისის დროით)',
        'სახელი' => $name, 'ელფოსტა' => $email, 'ტელეფონი' => $phone,
        'კომპანია' => $item['company'], 'თემა' => $item['topic'], 'ფორმატი' => $item['format'],
    ])
    . ($item['message'] !== '' ? "\n" . $item['message'] . "\n" : '')
    . "\nყველა ჯავშანი: https://webico.io/admin/index.php?p=bookings\n",
    $email);

// კლიენტს — დადასტურება და Google Calendar-ის ბმული
$start = new DateTimeImmutable("$date $time");
$end = $start->modify("+$slot minutes");
$utc = new DateTimeZone('UTC');
$gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      . '&text=' . rawurlencode('კონსულტაცია — Webico')
      . '&dates=' . $start->setTimezone($utc)->format('Ymd\THis\Z') . '/' . $end->setTimezone($utc)->format('Ymd\THis\Z')
      . '&details=' . rawurlencode('ვებიკოს გუნდი დაგიკავშირდებათ დათქმულ დროს. კითხვები: ' . cms_team_email());
cms_mail($email, 'შეხვედრა დაჯავშნილია — ' . $label,
    "გამარჯობა, $name!\n\n"
    . "მადლობა — შეხვედრა დაჯავშნილია:\n$label (თბილისის დროით, $slot წუთი).\n\n"
    . "ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ და შეხვედრის ბმულსაც გამოგიგზავნით.\n\n"
    . "კალენდარში დამატება: $gcal\n\n"
    . "თუ დრო შეგეცვალათ, უბრალოდ უპასუხეთ ამ წერილს.\n\n— ვებიკოს გუნდი\nhttps://webico.io\n",
    cms_team_email());

echo json_encode(['ok' => true, 'label' => $label, 'gcal' => $gcal], JSON_UNESCAPED_UNICODE);
