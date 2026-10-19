# Quản lý ảnh và video VieN

1. Đăng ký tài khoản bình thường trên web.
2. Trong terminal tại thư mục dự án chạy `npm.cmd run media:migrate`.
3. Cấp quyền cho đúng tài khoản: `npm.cmd run admin:grant -- --email EMAIL_DA_DANG_KY`.
4. Đăng nhập tài khoản đó, mở `/experience` và tải lại trang.
5. Ở trang chủ, bấm **Thay ảnh / tải video** trên thẻ điểm đến hoặc nút **Chỉnh media** trong khu vực quản trị. Chi tiết điểm đến và trailer cũng có nút quản lý.
6. Chọn file, xem trước rồi bấm **Tải lên & áp dụng** cho ảnh hoặc video. Chỉ chọn file chưa thay nội dung đang hiển thị.

Ảnh JPG/PNG/WebP tối đa 10 MB được cắt giữa theo tỷ lệ 16:9 và nén thành WebP. Video MP4/WebM tối đa 50 MB. Ảnh và video được lưu chung trên Neon, không mất khi Render khởi động lại. Video chia khối 1 MB và hỗ trợ tua bằng HTTP Range. Tải chưa xong không thay nội dung cũ. Các phiên bản đã xuất bản được giữ lại trong database.

Quyền quản trị nằm trong bảng `vien_admins`, không lấy từ trình duyệt hay trường gửi lên. Thành viên chỉ xem được; API tải lên kiểm tra cả phiên đăng nhập, quyền admin và Origin. Nội dung cập nhật khi tải lại trang hoặc trong vòng 20 giây khi tab đang mở.

Trên Render chạy migration media với cùng `DATABASE_URL` trước khi dùng tính năng. Không cần thêm biến môi trường cho file. Lệnh cấp admin phải chạy từ môi trường tin cậy, không đặt trong build/start command.

Kiểm tra bằng `npm.cmd run media:check` khi server đang chạy ở `BETTER_AUTH_URL`. Bài kiểm tra tạo tài khoản và media tạm riêng rồi xóa, không thay ảnh/video của điểm đến thật.
