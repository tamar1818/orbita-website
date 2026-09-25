<?php
/** შეხვედრების დაჯავშნა — სამუშაო საათები, თავისუფალი დროები, ჯავშნები */
declare(strict_types=1);
require_once __DIR__ . '/init.php';

const CMS_BOOKING_DEFAULTS = [
    'days'      => [1, 2, 3, 4, 5],   // ორშ–პარ (ISO: 1 = ორშაბათი)
    'start'     => '10:00',
    'end'       => '18:00',
    'slot'      => 30,                // წუთი
    'notice'    => 3,                 // მინ. საათი ჯავშნამდე
    'ahead'     => 21,                // რამდენი დღით წინ
    'blocked'   => [],                // დაკეტილი თარიღები Y-m-d
];

const CMS_WEEKDAYS = [1 => 'ორშ', 2 => 'სამ', 3 => 'ოთხ', 4 => 'ხუთ', 5 => 'პარ', 6 => 'შაბ', 7 => 'კვი'];
const CMS_WEEKDAYS_FULL = [1 => 'ორშაბათი', 2 => 'სამშაბათი', 3 => 'ოთხშაბათი', 4 => 'ხუთშაბათი',
                           5 => 'პარასკევი', 6 => 'შაბათი', 7 => 'კვირა'];
const CMS_MONTHS_GEN = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი',
                        'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

function cms_booking_config(): array
{
    $c = (array) (cms_read('site')['booking'] ?? []);
    $cfg = array_merge(CMS_BOOKING_DEFAULTS, array_filter($c, static fn($v) => $v !== '' && $v !== null));
    $cfg['days'] = array_values(array_filter(array_map('intval', (array) $cfg['days']), static fn($d) => $d >= 1 && $d <= 7));
    $cfg['slot'] = max(15, min(120, (int) $cfg['slot']));
    $cfg['notice'] = max(0, min(72, (int) $cfg['notice']));
    $cfg['ahead'] = max(1, min(90, (int) $cfg['ahead']));
    foreach (['start', 'end'] as $k) {
        if (!preg_match('~^([01]\d|2[0-3]):[0-5]\d$~', (string) $cfg[$k])) {
            $cfg[$k] = CMS_BOOKING_DEFAULTS[$k];
        }
    }
    $cfg['blocked'] = array_values(array_filter((array) $cfg['blocked'], static fn($d) => preg_match('~^\d{4}-\d{2}-\d{2}$~', (string) $d)));
    return $cfg;
}

function cms_bookings(): array
{
    return cms_read('bookings', ['bookings' => []])['bookings'] ?? [];
}

/** დაკავებული დროები: ['Y-m-d H:i' => true] (გაუქმებულის გარდა) */
function cms_booked_map(): array
{
    $map = [];
    foreach (cms_bookings() as $b) {
        if (($b['status'] ?? 'new') !== 'cancelled') {
            $map[($b['date'] ?? '') . ' ' . ($b['time'] ?? '')] = true;
        }
    }
    return $map;
}

/** თავისუფალი დროები ერთი დღისთვის */
function cms_day_slots(string $date, ?array $cfg = null, ?array $booked = null): array
{
    $cfg ??= cms_booking_config();
    $booked ??= cms_booked_map();
    $day = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if (!$day || in_array($date, $cfg['blocked'], true) || !in_array((int) $day->format('N'), $cfg['days'], true)) {
        return [];
    }
    $earliest = (new DateTimeImmutable())->modify('+' . $cfg['notice'] . ' hours');
    $t = new DateTimeImmutable($date . ' ' . $cfg['start']);
    $end = new DateTimeImmutable($date . ' ' . $cfg['end']);
    $out = [];
    while ($t->modify('+' . $cfg['slot'] . ' minutes') <= $end) {
        $hm = $t->format('H:i');
        if ($t >= $earliest && empty($booked[$date . ' ' . $hm])) {
            $out[] = $hm;
        }
        $t = $t->modify('+' . $cfg['slot'] . ' minutes');
    }
    return $out;
}

/** მომდევნო დღეები თავისუფალი დროებით (ცარიელი დღეებიც, რომ კალენდარი მთლიანი იყოს) */
function cms_booking_days(): array
{
    $cfg = cms_booking_config();
    $booked = cms_booked_map();
    $out = [];
    $d = new DateTimeImmutable('today');
    for ($i = 0; $i < $cfg['ahead']; $i++, $d = $d->modify('+1 day')) {
        $date = $d->format('Y-m-d');
        $out[] = [
            'date'  => $date,
            'dow'   => CMS_WEEKDAYS[(int) $d->format('N')],
            'day'   => (int) $d->format('j'),
            'month' => mb_substr(CMS_MONTHS_GEN[(int) $d->format('n') - 1], 0, 3),
            'slots' => cms_day_slots($date, $cfg, $booked),
        ];
    }
    return $out;
}

/** „ხუთშაბათი, 2 ოქტომბერი, 11:30“ */
function cms_booking_label(string $date, string $time): string
{
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if (!$d) {
        return $date . ' ' . $time;
    }
    return CMS_WEEKDAYS_FULL[(int) $d->format('N')] . ', ' . (int) $d->format('j') . ' '
         . CMS_MONTHS_GEN[(int) $d->format('n') - 1] . ', ' . $time;
}
