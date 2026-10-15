<?php
declare(strict_types=1);

// Đặt biến môi trường để ghi đè khi deploy (APP_URL, APP_ENV).
return [
    'name'        => 'VieN Di sản Việt',
    'description' => 'Khám phá di sản lịch sử, văn hóa Việt qua hành trình tương tác, quét QR/NFC và trò chơi học.',
    'url'         => rtrim((string) (getenv('APP_URL') ?: ''), '/'),
    'env'         => (string) (getenv('APP_ENV') ?: 'production'),
    'lang'        => 'vi',
];
