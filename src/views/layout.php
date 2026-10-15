<?php
/** @var array $config */
/** @var array $destinations */
$e = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$asset = static function (string $path): string {
    $file = __DIR__ . '/../../public' . $path;
    return $path . (is_file($file) ? '?v=' . filemtime($file) : '');
};
$canonical = $config['url'] !== '' ? $config['url'] . '/' : '';
?>
<!doctype html>
<html lang="<?= $e($config['lang']) ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?= $e($config['name']) ?></title>
<meta name="description" content="<?= $e($config['description']) ?>">
<meta name="theme-color" content="#1E1410">
<meta property="og:type" content="website">
<meta property="og:title" content="<?= $e($config['name']) ?>">
<meta property="og:description" content="<?= $e($config['description']) ?>">
<?php if ($canonical !== ''): ?>
<link rel="canonical" href="<?= $e($canonical) ?>">
<meta property="og:url" content="<?= $e($canonical) ?>">
<?php endif; ?>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23CC4B34'/%3E%3Ctext x='16' y='22' font-size='16' font-weight='800' text-anchor='middle' fill='white' font-family='sans-serif'%3EV%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="<?= $e($asset('/assets/css/style.css')) ?>">
<script>try{var t=localStorage.getItem('vien-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
</head>
<body>
<?php require __DIR__ . '/home.php'; ?>
<script>window.VIEN_DATA = <?= json_encode($destinations, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?>;</script>
<script src="<?= $e($asset('/assets/js/app.js')) ?>" defer></script>
</body>
</html>
