<?php
/** ფოტოების ატვირთვა — მკაცრი ვალიდაციით */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_MAX_UPLOAD = 6291456; // 6 MB
const CMS_ALLOWED = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/svg+xml' => 'svg',
];

/**
 * @return array{ok:bool, file?:string, error?:string}
 */
function cms_upload(array $file, string $prefix = 'img'): array
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        $map = [
            UPLOAD_ERR_INI_SIZE  => 'ფაილი ძალიან დიდია (სერვერის ლიმიტი)',
            UPLOAD_ERR_FORM_SIZE => 'ფაილი ძალიან დიდია',
            UPLOAD_ERR_PARTIAL   => 'ფაილი ნაწილობრივ აიტვირთა',
            UPLOAD_ERR_NO_FILE   => 'ფაილი არ აირჩიეთ',
        ];
        return ['ok' => false, 'error' => $map[$file['error'] ?? 0] ?? 'ატვირთვის შეცდომა'];
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        return ['ok' => false, 'error' => 'არასწორი ატვირთვა'];
    }
    if (($file['size'] ?? 0) > CMS_MAX_UPLOAD) {
        return ['ok' => false, 'error' => 'ფაილი 6 MB-ზე დიდია'];
    }

    // ტიპს ვადგენთ შიგთავსით და არა გაფართოებით
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string) $finfo->file($file['tmp_name']);
    if (!isset(CMS_ALLOWED[$mime])) {
        return ['ok' => false, 'error' => 'დაშვებულია მხოლოდ JPG, PNG, WebP და SVG'];
    }
    $ext = CMS_ALLOWED[$mime];

    // რასტრული ფაილი ნამდვილად სურათი უნდა იყოს
    if ($mime !== 'image/svg+xml' && @getimagesize($file['tmp_name']) === false) {
        return ['ok' => false, 'error' => 'ფაილი დაზიანებულია'];
    }
    // SVG-ში სკრიპტი დაუშვებელია
    if ($mime === 'image/svg+xml') {
        $svg = (string) file_get_contents($file['tmp_name']);
        if (preg_match('~<script|javascript:|on\w+\s*=~i', $svg)) {
            return ['ok' => false, 'error' => 'SVG შეიცავს სკრიპტს — აიკრძალა'];
        }
    }

    if (!is_dir(CMS_UPLOADS)) {
        mkdir(CMS_UPLOADS, 0775, true);
    }
    $name = cms_slug($prefix) . '-' . bin2hex(random_bytes(5)) . '.' . $ext;
    $dest = CMS_UPLOADS . '/' . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        return ['ok' => false, 'error' => 'ფაილის შენახვა ვერ მოხერხდა'];
    }
    @chmod($dest, 0644);
    return ['ok' => true, 'file' => CMS_UPLOADS_URL . '/' . $name];
}

function cms_media_list(): array
{
    if (!is_dir(CMS_UPLOADS)) {
        return [];
    }
    $out = [];
    foreach (scandir(CMS_UPLOADS) ?: [] as $f) {
        if ($f === '.' || $f === '..' || $f === '.htaccess') {
            continue;
        }
        if (preg_match('~\.(jpe?g|png|webp|svg)$~i', $f)) {
            $out[] = ['name' => $f, 'url' => CMS_UPLOADS_URL . '/' . $f,
                      'time' => filemtime(CMS_UPLOADS . '/' . $f) ?: 0];
        }
    }
    usort($out, fn($a, $b) => $b['time'] <=> $a['time']);
    return $out;
}

function cms_media_delete(string $name): bool
{
    $name = basename($name);
    if (!preg_match('~^[\w.-]+\.(jpe?g|png|webp|svg)$~i', $name)) {
        return false;
    }
    $path = CMS_UPLOADS . '/' . $name;
    return is_file($path) && unlink($path);
}
