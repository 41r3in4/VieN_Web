# VieN integrated

Trang `/` giới thiệu VieN với giao diện cam–đen và nền ombre chuyển động. Nút bắt đầu mở `/sign-up`; người có tài khoản dùng `/sign-in`. `/experience` kiểm tra phiên ở server trước khi hiển thị nội dung. Người chưa đăng nhập được chuyển sang đăng ký, giữ lại điểm đến/tab đã chọn. API `/api/destinations` yêu cầu đăng nhập và trả 401 cho khách.

- `npm run dev -- --port 3100`: chạy tại http://localhost:3100
- `npm run build`: kiểm tra bản production.
- `npm start -- --port 3100`: chạy bản production sau khi build.

Điểm đến và checkpoint dùng chung `src/data/destinations.ts`; API `/api/destinations` trả cùng dữ liệu. Trang chủ chỉ hiển thị hai điểm đến có nội dung trong app. Nút bắt đầu mở đúng điểm đến. Các liên kết nhật ký, hồ sơ và bảng xếp hạng mở đúng tab. Có liên kết quay về trang chủ trong app.

Các chức năng giữ lại: chọn vai trò, nội dung theo vai trò, mô phỏng quét QR/NFC, câu đố/quiz, EXP/cấp độ, huy hiệu, bí mật di sản, nhật ký và cảm nhận, âm thanh, giao diện mobile/desktop, cộng đồng mẫu.

Tài khoản và phiên đăng nhập lưu trong Neon qua Better Auth. Hồ sơ hiển thị tên thật, avatar có thể đổi/xóa, EXP, điểm quiz, trạm hoàn thành, thuyết minh đã nghe và trailer đã xem. Avatar được cắt vuông, thu nhỏ 256px WebP trong trình duyệt rồi lưu trong trường `user.image`; không phụ thuộc ổ đĩa tạm Render. Giới hạn ảnh nguồn 8 MB, ảnh lưu 200 KB. Tiến độ gắn với user ID trên Neon, không còn dùng dữ liệu localStorage chung giữa các tài khoản. Dữ liệu localStorage cũ chưa tự nhập vào tài khoản.

Chạy `npm run progress:migrate` để tạo bảng tiến độ và ngày hoạt động. Server tự tính điểm quiz/EXP/huy hiệu và không cộng EXP lặp. Nghe thuyết minh dùng SpeechSynthesis của trình duyệt; chỉ ghi nhận khi đọc hết. Trailer ghi nhận khi phát hết và đã xem ít nhất 90% thời lượng; video tùy chọn tải lên để xem thử không tính vào tiến độ. Hồ sơ cập nhật sau mỗi thao tác lưu, mỗi 20 giây khi tab đang mở và khi quay lại tab. Hoạt động lưu lỗi có thông báo và nút thử lại. Chuỗi ngày tính theo múi giờ Asia/Bangkok. `npm run progress:check` kiểm tra API, chống cộng lặp, cách ly tài khoản, avatar và reset bằng tài khoản thử được tự dọn. Scanner vẫn là mô phỏng.

Xếp hạng và cộng đồng dùng dữ liệu tài khoản thật trên Neon. `/api/leaderboard?period=week|month|all` chỉ xếp hạng tài khoản đã hoàn thành thử thách và có EXP trong kỳ, tính theo thời điểm hoàn thành trạm; tuần bắt đầu thứ Hai theo Asia/Bangkok. Hiển thị 50 hạng đầu và hạng riêng của người xem. Người chưa có EXP trong kỳ chưa được xếp hạng. Bục dẫn đầu chỉ có người tham gia thực, không tạo thêm chỗ hạng 2/3 khi chưa đủ người. Huy hiệu dùng chung cách tính với hồ sơ. Bằng EXP thì ưu tiên thời điểm tham gia rồi user ID. Không trả email trong dữ liệu cộng đồng. Bảng xếp hạng làm mới mỗi 20 giây khi mở tab và khi EXP thay đổi.

Chạy `npm run community:migrate` để tạo bảng tin nhắn, lượt thích và presence; `predev` tự chạy migration tiến độ/cộng đồng trước khi mở web. Trên Render chạy hai migration khi chuẩn bị triển khai. Chat tải 30 tin gần nhất và có phân trang tin cũ, cập nhật mỗi 3 giây khi mở và tab đang hiển thị. Người gửi luôn lấy từ phiên server; không nhận tên/user ID từ client. Gửi lại cùng client ID không tạo tin trùng; giới hạn tối thiểu 2 giây giữa hai tin mới. Ảnh nguồn JPG/PNG/WebP tối đa 8 MB, thu nhỏ WebP tối đa 768px và 200 KB, lưu PostgreSQL; ảnh chỉ tải qua API yêu cầu đăng nhập. Like/unlike lưu theo từng tài khoản và không cộng lặp. Presence gửi heartbeat 30 giây, đếm mỗi tài khoản một lần nếu hoạt động trong 75 giây gần nhất; không dùng số online hoặc toast giả. `npm run community:check` kiểm tra quyền truy cập, tính hạng, lọc thời gian, chat, ảnh, like, chống trùng, phân trang và presence bằng tài khoản/tin nhắn thử rồi tự dọn.

Thiết lập xác thực: `.env` cần `DATABASE_URL`, `BETTER_AUTH_SECRET` (ít nhất 32 ký tự ngẫu nhiên) và `BETTER_AUTH_URL`. Chạy `npm run auth:setup` để bổ sung khóa còn thiếu, `npm run auth:migrate` để tạo bảng, `npm run auth:check` để thử đăng ký/đăng nhập/đăng xuất bằng tài khoản tạm và tự dọn tài khoản đó. Các lệnh migration/kiểm tra dùng Node 22 với hỗ trợ TypeScript. Không commit `.env`.

Render: thêm ba biến trên vào Environment, đặt `BETTER_AUTH_URL` thành URL HTTPS thực của dịch vụ. Chạy migration trước khi sử dụng đăng ký. Chưa cấu hình gửi email xác minh hoặc đặt lại mật khẩu. Các API chứa dữ liệu riêng tư bổ sung sau này phải xác minh phiên phía server. `npm run auth:check:web` kiểm tra quyền truy cập của khách/thành viên, chuyển hướng và xác thực qua HTTP khi máy chủ local đang chạy; tài khoản thử được tự dọn. Đăng xuất quay về trang giới thiệu.

Sửa lỗi lưu trước khi tải xong tiến độ; ngăn nhận EXP lặp khi chơi lại checkpoint. Không dùng next/font tải font trong lúc build để có thể build khi thiếu kết nối Google.

Bản này được tạo trong thư mục làm việc vì phiên hiện tại không được ghi vào ổ H. Hai dự án gốc được giữ nguyên.

Kiểm tra: production build và TypeScript đã qua. Chưa xác minh thao tác trên Chrome: công cụ trình duyệt lỗi khởi tạo và môi trường chặn HTTP localhost. Khi mở thử, chọn điểm đến → chọn vai trò → hoàn thành checkpoint → kiểm tra EXP, nhật ký → tải lại → kiểm tra tiến độ → chơi lại để kiểm tra không nhận EXP lần hai.

CSS được tạo từ `src/app/globals.css` qua `scripts/build-styles.mjs` trước mỗi lần dev/build. Nếu sửa class Tailwind khi máy chủ đang chạy, chạy lại `node scripts/build-styles.mjs`.

Các cửa sổ nổi dùng nút đóng tối thiểu 44px, Esc, bấm nền ngoài và quản lý focus/khóa cuộn. Chỉ cửa sổ đang ở trên cùng được hiển thị và nhận thao tác; đóng trailer/vai diễn/thử thách quay về chi tiết điểm đến khi phù hợp. Đóng máy quét hủy tác vụ quét đang chờ, tránh thử thách tự mở lại. `npm run test:modals` kiểm tra nút X, nền ngoài, Esc, khóa cuộn và ưu tiên các cửa sổ bằng DOM mô phỏng.
