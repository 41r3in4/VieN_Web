# VieN integrated

Trang chủ `/` giữ bố cục, màu sắc, chuyển động của VieN Web. `/experience` chạy toàn bộ chức năng React của vien-heritage-app, cùng máy chủ và cùng nguồn lưu tiến độ.

- `npm run dev -- --port 3100`: chạy tại http://localhost:3100
- `npm run build`: kiểm tra bản production.
- `npm start -- --port 3100`: chạy bản production sau khi build.

Điểm đến và checkpoint dùng chung `src/data/destinations.ts`; API `/api/destinations` trả cùng dữ liệu. Trang chủ chỉ hiển thị hai điểm đến có nội dung trong app. Nút bắt đầu mở đúng điểm đến. Các liên kết nhật ký, hồ sơ và bảng xếp hạng mở đúng tab. Có liên kết quay về trang chủ trong app.

Các chức năng giữ lại: chọn vai trò, nội dung theo vai trò, mô phỏng quét QR/NFC, câu đố/quiz, EXP/cấp độ, huy hiệu, bí mật di sản, nhật ký và cảm nhận, âm thanh, giao diện mobile/desktop, cộng đồng mẫu.

Tiến độ lưu localStorage trên trình duyệt, chưa có tài khoản hay đồng bộ máy chủ. Chat và bảng xếp hạng là demo, scanner là mô phỏng. Media và nội dung lịch sử lấy từ dự án gốc, cần rà soát trước phát hành. Không cần PHP khi chạy bản tích hợp.

Sửa lỗi lưu trước khi tải xong tiến độ; ngăn nhận EXP lặp khi chơi lại checkpoint. Không dùng next/font tải font trong lúc build để có thể build khi thiếu kết nối Google.

Bản này được tạo trong thư mục làm việc vì phiên hiện tại không được ghi vào ổ H. Hai dự án gốc được giữ nguyên.

Kiểm tra: production build và TypeScript đã qua. Chưa xác minh thao tác trên Chrome: công cụ trình duyệt lỗi khởi tạo và môi trường chặn HTTP localhost. Khi mở thử, chọn điểm đến → chọn vai trò → hoàn thành checkpoint → kiểm tra EXP, nhật ký → tải lại → kiểm tra tiến độ → chơi lại để kiểm tra không nhận EXP lần hai.

CSS được tạo từ `src/app/globals.css` qua `scripts/build-styles.mjs` trước mỗi lần dev/build. Nếu sửa class Tailwind khi máy chủ đang chạy, chạy lại `node scripts/build-styles.mjs`.
