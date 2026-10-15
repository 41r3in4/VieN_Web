<?php
declare(strict_types=1);

$destinations = require __DIR__ . '/../../src/data/destinations.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo json_encode(['data' => $destinations], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
