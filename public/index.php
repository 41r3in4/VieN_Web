<?php
declare(strict_types=1);

$config       = require __DIR__ . '/../src/config.php';
$destinations = require __DIR__ . '/../src/data/destinations.php';

if ($config['env'] !== 'production') {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
}

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

require __DIR__ . '/../src/views/layout.php';
