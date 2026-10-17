import { Badge, LeaderboardUser, ChatMessage } from '@/types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-hai-chau',
    destinationId: 'dinh-hai-chau',
    title: 'Người Bảo Tồn Hải Châu',
    icon: 'ShieldCheck',
    description: 'Hoàn thành chuyến thám hiểm Đình làng Hải Châu, giải mã văn bia 42 tộc họ và 12 đạo sắc phong hoàng triều.',
    tier: 'gold'
  },
  {
    id: 'badge-ngu-hanh-son',
    destinationId: 'ngu-hanh-son',
    title: 'Kẻ Chinh Phục Ngũ Hành',
    icon: 'MountainSnow',
    description: 'Chinh phục đỉnh Thủy Sơn, đón ánh thiên quang Huyền Không và thấu tỏ triết lý thiện ác Động Âm Phủ.',
    tier: 'legendary'
  },
  {
    id: 'badge-han-nom',
    title: 'Bậc Thầy Hán-Nôm',
    icon: 'ScrollText',
    description: 'Giải mã thành công 100% câu đố ký tự Hán-Nôm cổ trên văn bia các triều đại.',
    tier: 'silver'
  },
  {
    id: 'badge-explorer-lens',
    title: 'Thợ Săn Góc Sáng',
    icon: 'Compass',
    description: 'Tìm ra tọa độ góc rọi ánh sáng mặt trời chính ngọ trong động đá vôi.',
    tier: 'silver'
  },
  {
    id: 'badge-sculpture',
    title: 'Bàn Tay Nghệ Nhân',
    icon: 'Palette',
    description: 'Khảo sát và phục dựng chi tiết nghệ thuật chạm lộng gỗ lim và phù điêu sành sứ.',
    tier: 'bronze'
  },
  {
    id: 'badge-streak-master',
    title: 'Ngọn Lửa Di Sản',
    icon: 'Flame',
    description: 'Duy trì chuỗi 7 ngày liên tục khám phá và tích lũy tri thức văn hóa Việt.',
    tier: 'gold'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'TS. Phan Thanh Sơn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Sử Gia Khai Phá',
    exp: 2850,
    badgesCount: 6,
    recentAchievement: 'Giải mã bản rập thời Minh Mạng'
  },
  {
    rank: 2,
    name: 'Lê Nguyễn Hoàng My',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    role: 'Thám Hiểm Tầm Bảo',
    exp: 2420,
    badgesCount: 5,
    recentAchievement: 'Phát hiện luồng sáng Huyền Không'
  },
  {
    rank: 3,
    name: 'Trần Khắc Vũ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Nghệ Nhân Dân Lập',
    exp: 2190,
    badgesCount: 5,
    recentAchievement: 'Bóc tách hoa văn rồng thếp vàng'
  },
  {
    rank: 4,
    name: 'Đặng Mai Phương',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'Sử Gia Khai Phá',
    exp: 1840,
    badgesCount: 4,
    recentAchievement: 'Hoàn thành 3 trạm Đình Hải Châu'
  },
  {
    rank: 5,
    name: 'Võ Minh Triết',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'Thám Hiểm Tầm Bảo',
    exp: 1680,
    badgesCount: 4,
    recentAchievement: 'Vượt qua Động Âm Phủ'
  },
  {
    rank: 6,
    name: 'Nguyễn Thị Bích Ngọc',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    role: 'Nghệ Nhân Dân Lập',
    exp: 1520,
    badgesCount: 3,
    recentAchievement: 'Khảo sát tháp Xá Lợi bát giác'
  },
  {
    rank: 7,
    name: 'Bạn (Du Khách Tinh Hoa)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: 'Sử Gia Khai Phá',
    exp: 1350,
    badgesCount: 3,
    isCurrentUser: true,
    recentAchievement: 'Khám phá Cổng Tam Quan'
  },
  {
    rank: 8,
    name: 'Bùi Gia Huy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    role: 'Thám Hiểm Tầm Bảo',
    exp: 1100,
    badgesCount: 2,
    recentAchievement: 'Mở khóa bản đồ sương mù'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'TS. Phan Thanh Sơn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Sử Gia Khai Phá',
    text: 'Chào mọi người! Ai đang ở Đình Hải Châu nhớ để ý kỹ chiếc khám thờ ở Hậu Tẩm nhé, vân gỗ chạm lộng cực kỳ tinh xảo!',
    timestamp: '10 phút trước',
    likes: 8,
    photoUrl: 'https://images.unsplash.com/photo-1548625361-195feee18a7a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'msg-2',
    sender: 'Lê Nguyễn Hoàng My',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    role: 'Thám Hiểm Tầm Bảo',
    text: 'Vừa quét NFC ở Động Huyền Không xong! Ánh sáng hôm nay lúc 11h trưa rọi xuống tượng Phật đẹp không nói nên lời 🌅✨',
    timestamp: '5 phút trước',
    likes: 14,
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'msg-3',
    sender: 'Cụ Từ (Ban Quản Lý)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Người Giữ Lửa Đình Làng',
    text: 'Hoan nghênh các bạn trẻ đến chiêm bái di tích tiền hiền. Nếu cần tra cứu 42 tộc họ, cứ hỏi lão nhé!',
    timestamp: '2 phút trước',
    likes: 26
  }
];

export const LIVE_TOAST_PRESETS = [
  '🎉 Du khách Nam vừa mở khóa huy hiệu "Kẻ Chinh Phục Ngũ Hành"!',
  '🔥 Minh Anh vừa đạt mốc 100% trạm khám phá Đình làng Hải Châu!',
  '📜 Sử Gia Tuấn Kiệt vừa giải mã câu đố Hán-Nôm thời Tự Đức (+150 EXP)!',
  '📸 Thám Hiểm Lan Hương vừa check-in góc rọi sáng Động Huyền Không!',
  '✨ Du khách Quốc Bảo vừa mở khóa Bí Ẩn Giếng Tiên Không Đáy!',
  '🏆 Bạn Hoàng My vừa vươn lên Top 2 Bảng Xếp Hạng Di Sản Tuần!'
];
