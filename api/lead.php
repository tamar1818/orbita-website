<?php
/** ლიდების მიმღები — ინახავს content/leads.json-ში და აგზავნის შეტყობინებას */
declare(strict_types=1);
require_once dirname(__DIR__) . '/inc/init.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method not allowed']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$in = json_decode($raw, true);
if (!is_array($in)) {
    $in = $_POST;
}

/* honeypot — ბოტები ავსებენ, ადამიანი ვერ ხედავს */
if (!empty($in['company_website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$get = static fn(string $k, int $max = 500): string
    => mb_substr(trim((string) ($in[$k] ?? '')), 0, $max);

$name    = $get('name', 120);
$email   = $get('email', 160);
$phone   = $get('phone', 60);
$message = $get('message', 4000);

$errors = [];
if ($name === '') {
    $errors[] = 'name';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'fields' => $errors], JSON_UNESCAPED_UNICODE);
    exit;
}

/* მარტივი შეზღუდვა: ერთი IP — მაქს. 5 განაცხადი 10 წუთში */
$store = cms_read('leads', ['leads' => []]);
$leads = $store['leads'] ?? [];
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$recent = 0;
foreach ($leads as $l) {
    if (($l['ip'] ?? '') === $ip && (time() - (int) ($l['ts'] ?? 0)) < 600) {
        $recent++;
    }
}
if ($recent >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'too many requests']);
    exit;
}

$leads[] = [
    'id'      => bin2hex(random_bytes(8)),
    'ts'      => time(),
    'date'    => date('Y-m-d H:i'),
    'name'    => $name,
    'email'   => $email,
    'phone'   => $phone,
    'company' => $get('company', 160),
    'service' => $get('service', 60),
    'budget'  => $get('budget', 60),
    'message' => $message,
    'source'  => $get('source', 80),
    'page'    => $get('page', 200),
    'ip'      => $ip,
];
if (count($leads) > 2000) {
    $leads = array_slice($leads, -2000);
}
$store['leads'] = $leads;

if (!cms_write('leads', $store)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'storage']);
    exit;
}

/* შეტყობინება ელფოსტაზე — წარუმატებლობა განაცხადს არ აუქმებს */
$to = (string) (cms_read('site')['settings']['email'] ?? '');
if ($to !== '' && filter_var($to, FILTER_VALIDATE_EMAIL)) {
    $body = "ახალი განაცხადი webico.io-დან\n\n"
          . "სახელი: $name\nელფოსტა: $email\nტელეფონი: $phone\n"
          . "სერვისი: " . $get('service', 60) . "\n\n$message\n";
    @mail($to, '=?UTF-8?B?' . base64_encode('ახალი განაცხადი — Webico') . '?=', $body,
          "From: webico <no-reply@webico.io>\r\nReply-To: $email\r\n"
          . "Content-Type: text/plain; charset=UTF-8\r\n");
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
