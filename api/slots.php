<?php
/** თავისუფალი დროები მომდევნო დღეებისთვის */
declare(strict_types=1);
require_once dirname(__DIR__) . '/inc/booking.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$cfg = cms_booking_config();
echo json_encode(['ok' => true, 'slot' => $cfg['slot'], 'days' => cms_booking_days()], JSON_UNESCAPED_UNICODE);
