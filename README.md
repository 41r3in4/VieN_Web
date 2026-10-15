# VieN Di sản Việt: web demo (PHP)

Trang web giới thiệu VieN, dựng theo thiết kế app. PHP thuần, không cần Composer hay database.

## Cấu trúc

```
public/                 ← thư mục gốc web (document root)
  index.php             ← trang chủ
  api/destinations.php  ← JSON danh sách điểm đến (/api/destinations)
  assets/css/style.css  ← màu, chữ, bố cục, chuyển động
  assets/js/app.js      ← hero điện thoại, lọc, câu đố, bản đồ, khung thiết kế
  .htaccess             ← cấu hình Apache
src/
  config.php            ← tên site, mô tả, APP_URL, APP_ENV
  data/destinations.php ← dữ liệu điểm đến (sửa ở đây)
  views/layout.php      ← khung HTML, meta, nạp CSS/JS
  views/home.php        ← nội dung trang
deploy/nginx.conf       ← mẫu cấu hình Nginx
Dockerfile              ← chạy bằng Docker (Apache + PHP 8.3)
```

Yêu cầu: PHP 8.1 trở lên.

## Chạy thử trên máy

```bash
php -S localhost:8000 -t public
```

Mở http://localhost:8000

## Deploy

**Hosting chia sẻ (cPanel, DirectAdmin):**
1. Tải toàn bộ project lên, ví dụ `~/vien-php`.
2. Đặt Document Root của domain trỏ vào `vien-php/public`. Nếu không đổi được, chép nội dung `public/` vào `public_html` và sửa hai đường dẫn `../src/` trong `index.php` và `api/destinations.php` cho đúng vị trí `src/`.
3. Để `.htaccess` đi kèm, mở site kiểm tra.

**VPS Apache:** trỏ `DocumentRoot` vào `public`, đặt `AllowOverride All`, bật `mod_rewrite`, `mod_headers`, `mod_deflate`.

**VPS Nginx:** dùng `deploy/nginx.conf`, đổi `server_name`, `root` và socket PHP-FPM, rồi `nginx -t && systemctl reload nginx`.

**Docker:**
```bash
docker build -t vien-web .
docker run -p 8080:80 -e APP_URL=https://vien.example.com vien-web
```

## Cấu hình

| Biến môi trường | Ý nghĩa |
|---|---|
| `APP_URL` | Địa chỉ site, dùng cho canonical và Open Graph (ví dụ `https://vien.example.com`) |
| `APP_ENV` | `production` (mặc định) hoặc `local` để hiện lỗi PHP |

## Chỉnh sửa

- **Thêm điểm đến:** thêm một mục vào `src/data/destinations.php`. Trường `k` chọn hình minh họa: `dinh`, `bridge`, `mountain`, `pagoda`, `house`, `museum`.
- **Đổi màu, chữ, chuyển động:** sửa các biến ở đầu `public/assets/css/style.css` (`--brand`, `--ease`, `--t-base`…).
- **Đổi nội dung trang:** sửa `src/views/home.php`.
- CSS và JS tự gắn số phiên bản theo thời gian sửa file, nên không bị kẹt cache khi cập nhật.
