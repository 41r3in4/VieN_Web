import { Persona } from '@/types';

export const PERSONAS: Persona[] = [
  {
    id: 'historian',
    title: 'Sử Gia Khai Phá',
    vietnameseRole: 'Nhà Nghiên Cứu Di Sản & Văn Bia',
    iconName: 'ScrollText',
    tagline: 'Lần theo từng nét mực Hán-Nôm và sắc phong cổ',
    description: 'Tập trung khảo cứu các văn bia cổ thời Lê - Nguyễn, 12 đạo sắc phong nguyên bản, và gia phả 42 tộc họ tiền hiền. Người nắm giữ chìa khóa văn tự.',
    specialty: 'Giải mã Hán-Nôm, đối chiếu niên đại triều Nguyễn, xác minh nguồn gốc sắc chỉ hoàng gia.',
    toolName: 'Kính Lúp Văn Tự Hán-Nôm',
    toolDesc: 'Phóng đại các vết khắc mờ trên bia đá và hiển thị chú giải chữ Hán tương ứng.',
    bonusPerk: '+25% EXP thưởng cho các câu hỏi lịch sử và niên hiệu.',
    themeColor: '#C83C23' // Terracotta Red
  },
  {
    id: 'explorer',
    title: 'Thám Hiểm Tầm Bảo',
    vietnameseRole: 'Nhà Thám Hiểm Thực Địa & Không Gian',
    iconName: 'Compass',
    tagline: 'Vạch lối trong sương mù huyền tích và hang động',
    description: 'Chuyên giải các câu đố không gian, tìm góc nhìn kiến trúc ẩn, định hướng vòm hang động và truy tìm các dấu tích phong thủy nghìn năm.',
    specialty: 'Định vị góc ánh sáng Huyền Không, phát hiện lối đi bí mật Động Âm Phủ, vượt qua sương mù.',
    toolName: 'La Bàn Địa Lý Cổ & Kính Trắc Địa',
    toolDesc: 'Đo đạc phương vị cổng Tam Quan và điểm hội tụ ánh sáng tự nhiên trên vòm đá.',
    bonusPerk: 'Mở rộng bán kính hé lộ sương mù Fog of War thêm 50%.',
    themeColor: '#1E4D3B' // Jade Green
  },
  {
    id: 'artisan',
    title: 'Nghệ Nhân Dân Lập',
    vietnameseRole: 'Bậc Thầy Kiến Trúc & Điêu Khắc Dân Gian',
    iconName: 'Palette',
    tagline: 'Lắng nghe linh hồn gỗ lim và đá sa thạch Non Nước',
    description: 'Tập trung vào nghệ thuật chạm khắc hoa văn Long - Lân - Quy - Phụng, thức cột đao đình làng, và kỹ nghệ đục đẽo linh thiêng của làng đá Non Nước.',
    specialty: 'Phân biệt phù điêu thế kỷ XVII với thời Nguyễn, nhận diện kỹ thuật ghép gốm sành cổ.',
    toolName: 'Thấu Kính Khảo Sát Họa Tiết',
    toolDesc: 'Bóc tách các lớp sơn thếp vàng, hiển thị cấu trúc chạm lộng và hoa văn ẩn.',
    bonusPerk: 'Mở khóa sớm các bản vẽ bảo tồn kiến trúc độc quyền.',
    themeColor: '#D4AF37' // Heritage Gold
  }
];
