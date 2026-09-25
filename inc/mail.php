<?php
/** ელფოსტის გაგზავნა — გუნდის შეტყობინებები და კლიენტის დადასტურება */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_TEAM_EMAIL = 'hello@webico.io';

/** სად მოდის ლიდები: ადმინის „კონტაქტები → ელფოსტა“, თუ არა — hello@webico.io */
function cms_team_email(): string
{
    $e = trim((string) (cms_read('site')['settings']['email'] ?? ''));
    return filter_var($e, FILTER_VALIDATE_EMAIL) ? $e : CMS_TEAM_EMAIL;
}

function cms_mail(string $to, string $subject, string $body, string $replyTo = ''): bool
{
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    // ჰედერში ხაზის გადატანით ინექცია რომ ვერ მოხდეს
    $replyTo = preg_replace('~[\r\n]+~', '', $replyTo) ?? '';
    $headers = "From: Webico <no-reply@webico.io>\r\n"
             . ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL) ? "Reply-To: $replyTo\r\n" : '')
             . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
    return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);
}

/** ველების სია ტექსტად: [ლეიბლი => მნიშვნელობა], ცარიელები გამოტოვებულია */
function cms_mail_lines(array $fields): string
{
    $out = '';
    foreach ($fields as $label => $value) {
        $value = trim((string) $value);
        if ($value !== '') {
            $out .= $label . ': ' . $value . "\n";
        }
    }
    return $out;
}
