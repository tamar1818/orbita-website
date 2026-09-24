<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/inc/auth.php';
cms_logout();
cms_redirect('index.php?p=login');
