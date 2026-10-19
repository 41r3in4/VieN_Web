# Triển khai VieN lên Render

1. Đưa mã nguồn và `render.yaml` lên GitHub. Không đưa `.env`, `node_modules`, `.next` hoặc file log lên repository.
2. Trên Render, chọn **New > Blueprint**, kết nối repository và chọn `render.yaml`.
3. Nhập các biến môi trường khi Render yêu cầu:
   - `DATABASE_URL`: chuỗi kết nối Neon hiện tại.
   - `BETTER_AUTH_SECRET`: dùng khóa hiện tại trong `.env` (không gửi vào chat).
   - `BETTER_AUTH_URL`: URL HTTPS của dịch vụ Render, ví dụ `https://vien-web.onrender.com`. Phải dùng đúng URL Render thực sự cấp; cập nhật và deploy lại nếu tên miền khác.
4. Triển khai dịch vụ. Cấu hình sử dụng Node 22.20.0, cài cả công cụ build, build Next.js và chạy migration trước khi khởi động trên cổng do Render cấp.
5. Sau khi dịch vụ live, kiểm tra trang chủ, đăng ký, đăng nhập và lưu tiến độ. Khi đổi tên miền, cập nhật `BETTER_AUTH_URL` rồi deploy lại.

Blueprint chọn gói Free. Database tiếp tục dùng Neon hiện tại. Các migration dùng lại script sẵn có của dự án và dừng khởi động nếu migration lỗi.

Tài liệu chính thức: https://render.com/docs/deploy-nextjs-app
