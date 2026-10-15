<?php
declare(strict_types=1);

/**
 * Danh sách điểm đến. Thêm / sửa điểm đến ở đây, giao diện tự cập nhật.
 * k   : kiểu hình minh họa (dinh | bridge | mountain | pagoda | house | museum)
 * c   : các nhóm lọc (Di sản, Lịch sử, Văn hóa, Bảo tàng)
 * tag : nhãn trên thẻ
 * s   : danh sách điểm dừng
 */
return [
    [
        'n' => 'Đình làng Hải Châu', 'p' => 'Hải Châu, Đà Nẵng', 'k' => 'dinh',
        'c' => ['Di sản', 'Lịch sử'], 'tag' => 'Trải nghiệm AR', 'dist' => 'Đang ở đây',
        'time' => '45 phút', 'stops' => 5, 'lv' => 'Dễ đi',
        'd' => 'Được xem là đình cổ nhất Đà Nẵng, nơi đây thờ phụng Thành hoàng và lưu giữ nhiều hiện vật quý báu triều Nguyễn. Là biểu tượng giao thoa tín ngưỡng thuần Việt.',
        's' => ['Cổng đình', 'Sân đình', 'Chính điện', 'Hậu tẩm', 'Bức chạm rồng mây'],
    ],
    [
        'n' => 'Ngũ Hành Sơn', 'p' => 'Hòa Hải, Đà Nẵng', 'k' => 'mountain',
        'c' => ['Di sản', 'Văn hóa'], 'tag' => 'Sắp ra mắt', 'dist' => '8 km',
        'time' => '60 phút', 'stops' => 6, 'lv' => 'Vừa sức',
        'd' => 'Quần thể năm ngọn núi đá vôi gắn với hang động, chùa chiền và làng nghề đá mỹ nghệ Non Nước.',
        's' => ['Chân núi Thủy Sơn', 'Chùa Tam Thai', 'Động Huyền Không', 'Làng đá Non Nước'],
    ],
    [
        'n' => 'Chùa Cầu Hội An', 'p' => 'Hội An, Quảng Nam', 'k' => 'bridge',
        'c' => ['Di sản', 'Lịch sử'], 'tag' => 'Hành trình Audio', 'dist' => '30 km',
        'time' => '30 phút', 'stops' => 4, 'lv' => 'Dễ đi',
        'd' => 'Biểu tượng giao thoa kiến trúc Việt, Nhật và Hoa của phố cổ Hội An, bắc qua lạch nhỏ từ thế kỷ 17.',
        's' => ['Đầu cầu phía Đông', 'Miếu thờ Bắc Đế', 'Tượng linh vật', 'Đầu cầu phía Tây'],
    ],
    [
        'n' => 'Chùa Linh Ứng', 'p' => 'Sơn Trà, Đà Nẵng', 'k' => 'pagoda',
        'c' => ['Văn hóa'], 'tag' => 'Trải nghiệm AR', 'dist' => '2.4 km',
        'time' => '40 phút', 'stops' => 4, 'lv' => 'Dễ đi',
        'd' => 'Ngôi chùa nhìn ra biển trên bán đảo Sơn Trà, nổi tiếng với tượng Phật Quan Thế Âm cao nhất Việt Nam.',
        's' => ['Cổng tam quan', 'Sân Quan Âm', 'Chính điện', 'Vườn tháp'],
    ],
    [
        'n' => 'Nhà cổ Diên Hải', 'p' => 'Hải Châu, Đà Nẵng', 'k' => 'house',
        'c' => ['Lịch sử'], 'tag' => 'Hành trình Audio', 'dist' => '800 m',
        'time' => '25 phút', 'stops' => 3, 'lv' => 'Dễ đi',
        'd' => 'Ngôi nhà gỗ hơn một thế kỷ tuổi, giữ nguyên hoa văn chạm khắc và nếp sinh hoạt của một gia đình thương nhân xưa.',
        's' => ['Tiền sảnh', 'Gian thờ', 'Sân giếng trời'],
    ],
    [
        'n' => 'Bảo tàng Điêu khắc Chăm', 'p' => 'Hải Châu, Đà Nẵng', 'k' => 'museum',
        'c' => ['Bảo tàng', 'Di sản'], 'tag' => 'Sắp ra mắt', 'dist' => '1.1 km',
        'time' => '50 phút', 'stops' => 6, 'lv' => 'Dễ đi',
        'd' => 'Bộ sưu tập điêu khắc sa thạch Chăm Pa lớn nhất thế giới, trải dài từ thế kỷ 7 đến thế kỷ 15.',
        's' => ['Phòng Mỹ Sơn', 'Phòng Trà Kiệu', 'Phòng Đồng Dương', 'Phòng Thần Shiva'],
    ],
];
