import { Destination } from '@/types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'dinh-hai-chau',
    name: 'Đình làng Hải Châu',
    location: 'Hải Châu, Đà Nẵng',
    tagline: 'Cái nôi văn hóa 400 năm & 42 tộc họ khai canh xứ Quảng',
    era: 'Hậu Lê - Triều Nguyễn (Khởi lập 1606)',
    coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
    story: 'Đình làng Hải Châu được thành lập từ năm 1606, là ngôi đình cổ kính và có quy mô bậc nhất của thành phố Đà Nẵng. Nơi đây thờ 42 vị tiền hiền của 42 tộc họ gốc làng Hải Châu (huyện Tĩnh Gia, Thanh Hóa) theo chúa Nguyễn Hoàng vào Nam mở cõi. Ngôi đình đặc biệt vinh dự lưu giữ trọn vẹn 12 đạo sắc phong của các vị vua triều Nguyễn ban tặng qua các thời kỳ.',
    badgeName: 'Người Bảo Tồn Hải Châu',
    badgeIcon: 'ShieldCheck',
    badgeDescription: 'Vinh danh người đã khảo sát trọn vẹn di tích Đình làng Hải Châu, giải mã 12 đạo sắc phong và 42 tộc họ tiền hiền khai sơn phá thạch.',
    totalCheckpoints: 3,
    hiddenLoreId: 'lore-hai-chau',
    stats: {
      rating: 4.9,
      expTotal: 450,
      historicalYears: 420,
      recommendedTime: '45 phút'
    },
    videoTrailer: {
      duration: '1:15',
      title: 'Hải Châu Cổ Tự: Tiếng Vọng 400 Năm Mở Cõi Xứ Quảng',
      videoUrl: '/videos/dinh-hai-chau-trailer.mp4',
      narrationText: 'Năm 1606, giữa bến sông Hàn hoang sơ, 42 dòng tộc cùng đặt những viên gạch đầu tiên dựng nên mái đình Hải Châu. Trải qua 4 thế kỷ thăng trầm binh lửa, nơi đây vẫn sừng sững lưu giữ 12 đạo sắc chỉ hoàng gia triều Nguyễn và ngọn lửa tiền hiền chưa từng tắt...',
      scenes: [
        {
          timestamp: '0:05',
          caption: 'Cổng Tam Quan rêu phong đón ánh bình minh bên dòng sông Hàn',
          image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1000&q=80'
        },
        {
          timestamp: '0:25',
          caption: 'Hậu tẩm thâm nghiêm - Nơi lưu giữ chiếc rương mun đựng 12 sắc phong hoàng triều',
          image: 'https://images.unsplash.com/photo-1548625361-195feee18a7a?auto=format&fit=crop&w=1000&q=80'
        },
        {
          timestamp: '0:48',
          caption: 'Nhà bia ghi danh 42 họ tiền hiền - Chứng tích cộng đồng tiên phong xứ Đà',
          image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=1000&q=80'
        },
        {
          timestamp: '1:05',
          caption: 'Khám phá huyền tích cùng VieN: Chạm tay vào trang sử sống',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80'
        }
      ]
    },
    checkpoints: [
      {
        id: 'hc-cp-1',
        order: 1,
        name: 'Cổng Tam Quan & Văn Bia Cổ Niên Hiệu Gia Long',
        shortDesc: 'Ba vòm cuốn biểu trưng cho Tam Quan Phật giáo & Nho giáo hòa quyện',
        culturalEra: 'Thời Gia Long (1802 - 1820)',
        qrCode: 'VIEN-HC-TQ-01',
        nfcCode: 'NFC-HC-TAMQUAN-01',
        coords: { x: 28, y: 35 },
        storySnippet: [
          'Cổng Tam Quan của Đình Hải Châu gồm 3 lối đi: lối chính giữa dành cho thần linh và bậc tôn kính trong ngày tế lễ hội làng, hai lối tả hữu (Thanh Long - Bạch Hổ) dành cho dân làng và du khách.',
          'Trên đỉnh cổng chạm đôi rồng chầu mặt trời ("Lưỡng long chầu nguyệt") bằng kỹ thuật ghép mảnh sành sứ tinh xảo đặc trưng của mỹ thuật Trung Bộ thế kỷ XIX.'
        ],
        audioGuideText: 'Bạn đang đứng trước cổng Tam Quan Đình Hải Châu. Hãy chú ý hai câu đối chữ Hán khảm xà cừ ở hai cột trụ chính nói về công đức khai hoang lập ấp...',
        historicalImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        personaClues: {
          historian: {
            taskTitle: 'Khảo cứu Văn bia Cột Trụ Cổng Tam Quan',
            clue: 'Dùng Kính Lúp Hán-Nôm quan sát 2 câu đối: Chữ thứ ba ở cột tả là gì để xác định niên đại trùng tu?',
            toolAction: 'Soi kính lúp văn tự chữ Hán vào chân cột đá'
          },
          explorer: {
            taskTitle: 'Đo trục phong thủy Cổng Tam Quan ra Sông Hàn',
            clue: 'Dùng La Bàn Địa Lý căn chỉnh hướng cổng: Cổng nhìn thẳng về hướng nào để đón sinh khí?',
            toolAction: 'Kích hoạt la bàn phong thủy phương vị Đông Nam'
          },
          artisan: {
            taskTitle: 'Nhận diện kỹ thuật gắn gốm sành "Lưỡng Long Chầu Nguyệt"',
            clue: 'Dùng Thấu Kính Họa Tiết kiểm tra vảy rồng: Đây là mảnh gốm men lam hay sành ngọc thời Nguyễn?',
            toolAction: 'Bóc tách chi tiết kỹ thuật sành gốm thế kỷ XIX'
          }
        },
        riddle: {
          type: 'han-nom',
          prompt: 'Trên bức hoành phi cổng Tam Quan cổ, danh xưng làng cổ được khắc bằng ba chữ Hán. Đó là chữ nào?',
          personaHint: 'Gợi ý từ vai diễn: Hải tượng trưng cho biển, Châu tượng trưng cho châu ngọc bờ cõi.',
          options: [
            {
              id: 'a',
              text: '海珠亭 (Hải Châu Đình - Mái đình châu ngọc ven biển)',
              isCorrect: true,
              explanation: 'Chính xác! Ba chữ Hán "Hải Châu Đình" khẳng định danh hiệu linh thiêng từ lúc lập làng.'
            },
            {
              id: 'b',
              text: '廣南亭 (Quảng Nam Đình - Mái đình xứ Quảng)',
              isCorrect: false,
              explanation: 'Sai rồi. Tên làng từ thời Thanh Hóa di cư vào là Hải Châu.'
            },
            {
              id: 'c',
              text: '韓江殿 (Hàn Giang Điện - Đền thờ bến sông Hàn)',
              isCorrect: false,
              explanation: 'Sai rồi. Đây là ngôi đình làng của 42 họ tộc.'
            }
          ]
        },
        quizzes: [
          {
            id: 'hc-q1',
            question: 'Ngôi đình làng Hải Châu ban đầu được thành lập vào năm nào dưới thời các chúa Nguyễn?',
            options: ['Năm 1606 (Bính Ngọ)', 'Năm 1789 (Kỷ Dậu)', 'Năm 1802 (Nhâm Tuất)', 'Năm 1858 (Mậu Ngọ)'],
            correctIndex: 0,
            explanation: 'Đình làng Hải Châu được lập năm 1606 khi các tiền hiền theo lệnh Chúa Tiên Nguyễn Hoàng vượt đèo Hải Vân vào khai phá đất này.',
            culturalInsight: 'Làng Hải Châu ban đầu vốn mang tên ngôi làng gốc ở Thanh Hóa, thể hiện truyền thống "uống nước nhớ nguồn" của lưu dân người Việt.'
          },
          {
            id: 'hc-q2',
            question: 'Cổng Tam Quan theo kiến trúc truyền thống có quy tắc di chuyển thế nào?',
            options: [
              'Vào cổng Tả (Thanh Long), ra cổng Hữu (Bạch Hổ), cổng Giữa chỉ mở dịp đại lễ',
              'Tất cả mọi người đi qua cổng Giữa để đón lộc',
              'Đi vào cổng Hữu và đi ra cổng Tả',
              'Chỉ có chức sắc mới được đi qua cổng Tam Quan'
            ],
            correctIndex: 0,
            explanation: 'Theo phong thủy và lễ nghi xưa: "Tả vào Hữu ra" (Nhập Thanh Long, Xuất Bạch Hổ), cổng Trung Thiên tôn kính dành cho thần linh và lễ rước.',
            culturalInsight: 'Quy ước này thể hiện sự tuần hoàn cân bằng âm dương và tính kỷ cương của không gian làng xã Việt Nam.'
          }
        ],
        expReward: 150
      },
      {
        id: 'hc-cp-2',
        order: 2,
        name: 'Hậu Tẩm Trọng Điểm & 12 Đạo Sắc Phong Triều Nguyễn',
        shortDesc: 'Gian thờ linh thiêng cất giữ kho báu văn bản Hán-Nôm của 6 đời vua',
        culturalEra: 'Triều Nguyễn (Minh Mạng đến Khải Định)',
        qrCode: 'VIEN-HC-HT-02',
        nfcCode: 'NFC-HC-HAUTAM-02',
        coords: { x: 50, y: 55 },
        storySnippet: [
          'Hậu Tẩm là gian sâu kín nhất của đình, nơi đặt khám thờ chạm rồng sơn son thếp vàng. Đây là nơi tôn nghiêm tuyệt đối lưu giữ chiếc tráp gỗ mun cất giữ 12 đạo sắc chỉ.',
          'Các đạo sắc phong này lần lượt được ban bởi các vị hoàng đế: Minh Mạng (1825, 1840), Thiệu Trị (1844), Tự Đức (1850, 1852, 1880), Đồng Khánh (1886), Thành Thái, Duy Tân và Khải Định.'
        ],
        audioGuideText: 'Hãy bước thật khẽ trong không gian Hậu Tẩm phảng phất hương trầm. 12 đạo sắc phong tại đây được viết trên giấy long đằng vàng óng vẽ rồng mây...',
        historicalImage: 'https://images.unsplash.com/photo-1548625361-195feee18a7a?auto=format&fit=crop&w=800&q=80',
        personaClues: {
          historian: {
            taskTitle: 'Đối chiếu dấu triện sắc phong hoàng triều',
            clue: 'Dùng Kính Lúp Văn Tự kiểm tra triện son "Sắc Mệnh Chi Bảo" trên bản sắc chỉ năm Tự Đức ngũ niên.',
            toolAction: 'Quét dấu ngự ấn đỏ trên giấy sắc long đằng'
          },
          explorer: {
            taskTitle: 'Tìm kiếm hầm gạch bí mật giấu sắc phong thời chiến',
            clue: 'Dùng máy quét quang học định vị khoang rỗng dưới bệ thờ tổ.',
            toolAction: 'Rà soát cấu trúc âm sàn gạch cổ Bát Tràng'
          },
          artisan: {
            taskTitle: 'Phân tích nghệ thuật chạm lộng "Tứ Linh Chầu Tổ"',
            clue: 'Dùng Thấu Kính Họa Tiết nhận diện đường đục rỗng 3 lớp của vì kèo gỗ lim.',
            toolAction: 'Soi lớp sơn then và vàng quỳ trên bao lơn khám thờ'
          }
        },
        riddle: {
          type: 'sculpture-relic',
          prompt: 'Trong 12 đạo sắc phong của Đình Hải Châu, loại giấy quý nào được triều đình đặc chế riêng để viết sắc phong?',
          personaHint: 'Gợi ý từ vai diễn: Loại giấy này có pha bột nghệ chống mối mọt và in chìm hình rồng cuộn 5 móng.',
          options: [
            {
              id: 'a',
              text: 'Giấy Long Đằng dát kim nhũ (vẽ rồng mây vàng)',
              isCorrect: true,
              explanation: 'Chính xác! Giấy sắc phong Long Đằng là bảo vật của triều đình, có độ bền hàng trăm năm không bị mối mọt.'
            },
            {
              id: 'b',
              text: 'Giấy Điệp của làng tranh Đông Hồ',
              isCorrect: false,
              explanation: 'Sai rồi. Giấy điệp làm từ vỏ sò điệp dùng cho tranh dân gian, không dùng cho sắc mệnh vua ban.'
            },
            {
              id: 'c',
              text: 'Giấy Dó thô Bắc Ninh',
              isCorrect: false,
              explanation: 'Sai rồi. Triều đình dùng giấy sắc tráng kim nhũ chuyên biệt chế tác từ phường Lại Bằng.'
            }
          ]
        },
        quizzes: [
          {
            id: 'hc-q3',
            question: 'Có tổng cộng bao nhiêu đạo sắc phong cổ được lưu giữ nguyên vẹn tại Đình làng Hải Châu?',
            options: ['12 đạo sắc phong', '6 đạo sắc phong', '24 đạo sắc phong', '3 đạo sắc phong'],
            correctIndex: 0,
            explanation: 'Đình làng Hải Châu vinh dự bảo tồn 12 đạo sắc phong quý giá từ triều Minh Mạng đến Khải Định.',
            culturalInsight: 'Đây là một trong những nơi tại miền Trung lưu giữ được số lượng sắc phong dày đặc và nguyên vẹn nhất qua chiến tranh.'
          },
          {
            id: 'hc-q4',
            question: 'Vị vua nào của triều Nguyễn đã ban nhiều đạo sắc phong nhất cho làng Hải Châu?',
            options: ['Vua Tự Đức', 'Vua Gia Long', 'Vua Bảo Đại', 'Vua Hàm Nghi'],
            correctIndex: 0,
            explanation: 'Vua Tự Đức là người ban nhiều đạo sắc nhất (các năm 1850, 1852, 1880) nhằm tri ân lòng trung nghĩa của dân làng trong giai đoạn kháng Pháp.',
            culturalInsight: 'Thời vua Tự Đức, người dân Hải Châu đã kiên cường hỗ trợ quân đội triều đình của danh tướng Nguyễn Tri Phương tại phòng tuyến bến Hàn.'
          }
        ],
        expReward: 150
      },
      {
        id: 'hc-cp-3',
        order: 3,
        name: 'Giếng Tiên Cổ & Nhà Bia Ghi Danh 42 Tộc Họ',
        shortDesc: 'Nơi tri ân 42 dòng họ tiên khởi đã hợp sức san đồi bạt lau lập ấp',
        culturalEra: 'Hơn 400 năm liên tục',
        qrCode: 'VIEN-HC-NB-03',
        nfcCode: 'NFC-HC-NHABIA-03',
        coords: { x: 74, y: 70 },
        storySnippet: [
          'Phía bên tả ngôi đình là nhà bia trang trọng khắc ghi danh tính 42 vị tiền hiền đại diện cho 42 dòng tộc: họ Nguyễn, họ Trần, họ Lê, họ Phan, họ Huỳnh, họ Ngô...',
          'Gần đó là chiếc giếng cổ xây bằng đá ong có mạch nước ngọt mát lành, từng là nguồn sống nuôi dưỡng bao thế hệ người dân làng chài thuở ban sơ.'
        ],
        audioGuideText: 'Bia đá này là bản trường ca bằng đá của tinh thần đoàn kết. Không có sự đồng lòng của 42 tộc họ, sẽ không có một Đà Nẵng trù phú hôm nay...',
        historicalImage: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80',
        personaClues: {
          historian: {
            taskTitle: 'Đọc gia phổ 42 tộc họ trên văn bia đá xanh',
            clue: 'Dùng Kính Lúp Văn Tự tra cứu dòng họ nào được ghi ở vị trí Tiền Hiền Khai Canh đầu tiên.',
            toolAction: 'Truy quét danh sách 42 họ tộc theo thứ tự ghi danh'
          },
          explorer: {
            taskTitle: 'Khảo sát mạch ngầm giếng cổ đá ong',
            clue: 'Dùng La Bàn Địa Lý tìm vị trí giếng nước so với long mạch đình làng.',
            toolAction: 'Đo độ sâu mạch nước giếng cổ 400 năm tuổi'
          },
          artisan: {
            taskTitle: 'Đánh giá kỹ nghệ ghép đá ong cổ',
            clue: 'Dùng Thấu Kính Họa Tiết quan sát kỹ thuật xếp đá không dùng xi măng của tiền nhân.',
            toolAction: 'Phân tích các lỗ tổ ong và mạch vôi hàu tự nhiên'
          }
        },
        riddle: {
          type: 'spatial-angle',
          prompt: '42 tộc họ tiền hiền làng Hải Châu có nguồn gốc xuất thân nguyên quán từ địa phương nào?',
          personaHint: 'Gợi ý từ vai diễn: Nằm ở vùng đất Thanh Hóa, nơi chúa Nguyễn Hoàng khởi nghiệp chiêu mộ nghĩa sĩ.',
          options: [
            {
              id: 'a',
              text: 'Huyện Tĩnh Gia (nay là thị xã Nghi Sơn), tỉnh Thanh Hóa',
              isCorrect: true,
              explanation: 'Chính xác! 42 tộc họ cùng xuất thân từ huyện Tĩnh Gia, Thanh Hóa theo chân Chúa Tiên vào Nam.'
            },
            {
              id: 'b',
              text: 'Huyện Nam Đàn, tỉnh Nghệ An',
              isCorrect: false,
              explanation: 'Sai rồi. Quê gốc của tiền hiền Hải Châu là ở Thanh Hóa.'
            },
            {
              id: 'c',
              text: 'Kinh thành Thăng Long',
              isCorrect: false,
              explanation: 'Sai rồi. Tiền hiền di cư từ vùng duyên hải Tĩnh Gia.'
            }
          ]
        },
        quizzes: [
          {
            id: 'hc-q5',
            question: 'Con số 42 tộc họ ở Đình làng Hải Châu mang ý nghĩa văn hóa sâu sắc nào?',
            options: [
              'Tượng trưng cho sự đồng tâm hiệp lực của 42 họ tộc lớn cùng chung sức dựng làng',
              'Là số lượng gia nhân của quan huyện thời bấy giờ',
              'Là số lượng các thương lái cập cảng sông Hàn',
              'Được chỉ định ngẫu nhiên trong một kỳ tế thần'
            ],
            correctIndex: 0,
            explanation: '42 tộc họ chính là minh chứng hiếm có về mô hình cộng đồng liên họ tộc cùng tôn trọng, gắn bó mở cõi bền vững qua nhiều thế kỷ.',
            culturalInsight: 'Hằng năm vào ngày mùng 10 tháng 3 Âm lịch, con cháu của cả 42 dòng họ đều tề tựu về sân đình tế lễ trang nghiêm.'
          }
        ],
        expReward: 150
      }
    ]
  },
  {
    id: 'ngu-hanh-son',
    name: 'Ngũ Hành Sơn & Động Âm Phủ',
    location: 'Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
    tagline: 'Quần sơn đá vôi ngũ hành & kiệt tác ánh sáng vòm Huyền Không',
    era: 'Hàng trăm triệu năm địa chất & Thế kỷ XIX triều Nguyễn',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    story: 'Ngũ Hành Sơn là kiệt tác non nước hữu tình gồm 6 ngọn núi đá vôi (Kim, Mộc, Thủy, Thổ, Dương Hỏa, Âm Hỏa) vươn lên giữa dải cát ven biển Đà Nẵng. Nơi đây ẩn chứa hệ thống hang động kỳ vĩ như Động Huyền Không với luồng thiên quang rọi từ vòm trời, cùng Động Âm Phủ tái hiện triết lý thiện ác nhân quả của 12 tầng địa ngục và Cầu Nại Hà huyền bí.',
    badgeName: 'Kẻ Chinh Phục Ngũ Hành',
    badgeIcon: 'MountainSnow',
    badgeDescription: 'Vinh danh người đã leo qua đỉnh Thủy Sơn, chứng kiến luồng thiên quang Động Huyền Không và thấu tỏ triết lý thiện ác Động Âm Phủ.',
    totalCheckpoints: 3,
    hiddenLoreId: 'lore-ngu-hanh-son',
    stats: {
      rating: 4.95,
      expTotal: 500,
      historicalYears: 200,
      recommendedTime: '60 phút'
    },
    videoTrailer: {
      duration: '1:15',
      title: 'Ngũ Hành Sơn: Kỳ Sơn Huyền Ảo Giữa Cõi Sáng & Cõi Tối',
      videoUrl: '/videos/ngu-hanh-son-trailer.mp4',
      narrationText: 'Từ quả trứng rồng huyền thoại vỡ đôi thời tiền sử, năm ngọn núi đá ngũ sắc vươn mình soi bóng biển Đông. Hãy bước vào vòm sáng Huyền Không huyền diệu và thám hiểm vực sâu Động Âm Phủ - nơi soi rọi tâm can con người giữa ranh giới Thiện và Ác...',
      scenes: [
        {
          timestamp: '0:05',
          caption: 'Toàn cảnh 6 ngọn Ngũ Hành sừng sững bên bờ sóng Non Nước',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80'
        },
        {
          timestamp: '0:22',
          caption: 'Động Huyền Không: Vệt sáng thiên đàng rọi qua vòm đá vôi hàng triệu năm',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
        },
        {
          timestamp: '0:45',
          caption: 'Động Âm Phủ: Cầu Nại Hà và biểu tượng 12 cửa ải khảo nghiệm nhân tâm',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
        },
        {
          timestamp: '1:02',
          caption: 'Bắt đầu hành trình giải mã ngũ hành cùng VieN',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80'
        }
      ]
    },
    checkpoints: [
      {
        id: 'nhs-cp-1',
        order: 1,
        name: 'Vòm Ánh Sáng Động Huyền Không (Thiên Thai)',
        shortDesc: 'Vòm đá vôi lộ thiên đưa ánh dương chính ngọ rọi thẳng xuống tượng Phật Thích Ca',
        culturalEra: 'Hàng trăm triệu năm địa chất & Thế kỷ XIX',
        qrCode: 'VIEN-NHS-HK-01',
        nfcCode: 'NFC-NHS-HUYENKHONG-01',
        coords: { x: 34, y: 38 },
        storySnippet: [
          'Động Huyền Không là động đẹp nhất trong quần thể Ngũ Hành Sơn. Vòm động có 5 lỗ hổng thông lên trời đón ánh sáng tự nhiên rực rỡ như chốn bồng lai tiên cảnh.',
          'Khi mặt trời đứng bóng vào giữa trưa, luồng ánh sáng hội tụ chiếu thẳng vào tượng Phật Thích Ca được tạc liền vào vách đá bởi nghệ nhân làng Non Nước năm 1960.'
        ],
        audioGuideText: 'Bạn đang đứng trong Động Huyền Không. Không khí ở đây luôn mát lạnh dù ngoài trời nắng gắt. Hãy nhìn lên vòm trần tự nhiên nơi ánh sáng trời rọi xuống...',
        historicalImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        personaClues: {
          historian: {
            taskTitle: 'Đọc thơ ngự chế của Vua Minh Mạng trên vách đá',
            clue: 'Dùng Kính Lúp Văn Tự tìm bài thơ chữ Hán do vua Minh Mạng ngự đề năm 1825 khi đặt tên cho danh thắng.',
            toolAction: 'Quét vách đá cẩm thạch tìm bút tích hoàng triều'
          },
          explorer: {
            taskTitle: 'Đo góc nghiêng chùm tia sáng Huyền Không',
            clue: 'Dùng La Bàn Kính Trắc Địa đo góc hội tụ của ánh sáng mặt trời qua 5 lỗ thông thiên.',
            toolAction: 'Xác định thời khắc chùm sáng rọi thẳng tâm đài sen'
          },
          artisan: {
            taskTitle: 'Khảo sát chất đá cẩm thạch hồng Thủy Sơn',
            clue: 'Dùng Thấu Kính Họa Tiết kiểm tra vân đá tạc tượng thần Đô Lực & Hộ Pháp gác cửa động.',
            toolAction: 'Phân tích các tinh thể canxit phản quang trong bóng tối'
          }
        },
        riddle: {
          type: 'spatial-angle',
          prompt: 'Vòm trần của Động Huyền Không có bao nhiêu lỗ thông thiên tự nhiên đưa ánh sáng vào động?',
          personaHint: 'Gợi ý từ vai diễn: Trùng khớp với số lượng yếu tố Ngũ Hành (Kim - Mộc - Thủy - Hỏa - Thổ).',
          options: [
            {
              id: 'a',
              text: '5 lỗ hổng (Ngũ Quang Động biểu thị Ngũ Hành hòa hợp)',
              isCorrect: true,
              explanation: 'Chính xác! 5 lỗ thông thiên tự nhiên tạo nên luồng ánh sáng ngũ sắc tuyệt mỹ.'
            },
            {
              id: 'b',
              text: '1 lỗ hổng duy nhất ở đỉnh cao nhất',
              isCorrect: false,
              explanation: 'Sai rồi. Trần động có 5 vệt nứt thông thiên mở ra bầu trời.'
            },
            {
              id: 'c',
              text: '3 lỗ hổng tượng trưng cho Tam Giới',
              isCorrect: false,
              explanation: 'Sai rồi. Số lượng chuẩn xác là 5 cửa lấy sáng tự nhiên.'
            }
          ]
        },
        quizzes: [
          {
            id: 'nhs-q1',
            question: 'Vị vua nào của triều Nguyễn đã chính thức đặt tên cho 5 ngọn núi là "Ngũ Hành Sơn" vào năm 1825?',
            options: ['Vua Minh Mạng', 'Vua Gia Long', 'Vua Tự Đức', 'Vua Khải Định'],
            correctIndex: 0,
            explanation: 'Vua Minh Mạng trong chuyến ngự du tuần tra đất Quảng năm 1825 đã dựa vào thuyết ngũ hành dịch học để đặt tên: Kim, Mộc, Thủy, Hỏa, Thổ.',
            culturalInsight: 'Dù gọi là Ngũ Hành Sơn nhưng thực tế có 6 ngọn núi vì ngọn Hỏa Sơn gồm 2 ngọn liền nhau: Dương Hỏa Sơn và Âm Hỏa Sơn.'
          },
          {
            id: 'nhs-q2',
            question: 'Ngọn núi nào trong Ngũ Hành Sơn có diện tích lớn nhất và tập trung nhiều chùa chiền, hang động nhất?',
            options: ['Thủy Sơn', 'Kim Sơn', 'Mộc Sơn', 'Thổ Sơn'],
            correctIndex: 0,
            explanation: 'Thủy Sơn là ngọn núi cao nhất (khoảng 106m) và rộng lớn nhất, nơi tọa lạc chùa Linh Ứng cổ, chùa Tam Thai và động Huyền Không.',
            culturalInsight: 'Người xưa quan niệm Nước (Thủy) là cội nguồn dung dưỡng vạn vật nên Thủy Sơn chiếm vị trí trung tâm tâm linh.'
          }
        ],
        expReward: 160
      },
      {
        id: 'nhs-cp-2',
        order: 2,
        name: 'Tháp Xá Lợi & Chuông Đồng Chùa Linh Ứng Non Nước',
        shortDesc: 'Tòa tháp 7 tầng cao 28m lưu giữ xá lợi Phật & tiếng đại hồng chung trầm mặc',
        culturalEra: 'Khởi dựng thời Lê Trung Hưng (1630)',
        qrCode: 'VIEN-NHS-XL-02',
        nfcCode: 'NFC-NHS-XALOI-02',
        coords: { x: 62, y: 30 },
        storySnippet: [
          'Tháp Xá Lợi sừng sững trên đỉnh dốc ngắm nhìn ra biển Đông, có kiến trúc bát giác 7 tầng tượng trưng cho thất bảo Phật thừa.',
          'Bên trong tháp tôn trí gần 200 pho tượng Phật, Bồ Tát bằng đá trắng Non Nước được điêu khắc thủ công tinh xảo qua bàn tay các nghệ nhân nhiều đời.'
        ],
        audioGuideText: 'Tiếng chuông chùa Linh Ứng ngân vang giữa gió biển từ thế kỷ XVII. Đứng từ sân Tháp Xá Lợi, bạn có thể phóng tầm mắt ngắm toàn cảnh bờ biển miền Trung...',
        historicalImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        personaClues: {
          historian: {
            taskTitle: 'Khảo cứu bài ký đúc đại hồng chung thời vua Gia Long',
            clue: 'Dùng Kính Lúp Văn Tự đọc văn tự khắc trên chuông đồng cổ chùa Linh Ứng.',
            toolAction: 'Giải mã niên hiệu Gia Long năm thứ mười'
          },
          explorer: {
            taskTitle: 'Định vị tọa độ phong thủy Tháp Xá Lợi hướng Biển Đông',
            clue: 'Dùng La Bàn Địa Lý tìm hướng đón gió biển và tầm nhìn hướng Sơn Trà.',
            toolAction: 'Căn chỉnh góc nhìn bao quát bờ biển Non Nước'
          },
          artisan: {
            taskTitle: 'So sánh đường nét tượng đá Non Nước qua 7 tầng tháp',
            clue: 'Dùng Thấu Kính Họa Tiết quan sát kỹ thuật chạm khắc đá cẩm thạch trắng nguyên khối.',
            toolAction: 'Bóc tách hoa văn cánh sen trên bệ tượng Phật'
          }
        },
        riddle: {
          type: 'sculpture-relic',
          prompt: 'Tháp Xá Lợi tại Ngũ Hành Sơn có cấu trúc bao nhiêu tầng và mặt bằng hình gì?',
          personaHint: 'Gợi ý từ vai diễn: Con số tầng tượng trưng cho Thất Phật, mặt bằng hình bát quái điều hòa phong thủy.',
          options: [
            {
              id: 'a',
              text: '7 tầng, mặt bằng hình Bát giác (8 cạnh)',
              isCorrect: true,
              explanation: 'Chính xác! Tòa tháp cao 28m gồm 7 tầng hình bát giác uy nghiêm hướng ra biển Đông.'
            },
            {
              id: 'b',
              text: '9 tầng hình vuông (Cửu phẩm liên hoa)',
              isCorrect: false,
              explanation: 'Sai rồi. Tháp có 7 tầng hình bát giác.'
            },
            {
              id: 'c',
              text: '5 tầng hình tròn (Ngũ phúc lâm môn)',
              isCorrect: false,
              explanation: 'Sai rồi. Cấu trúc chuẩn xác là 7 tầng bát giác.'
            }
          ]
        },
        quizzes: [
          {
            id: 'nhs-q3',
            question: 'Làng nghề điêu khắc đá mỹ nghệ Non Nước dưới chân Ngũ Hành Sơn có lịch sử phát triển bao nhiêu năm?',
            options: ['Hơn 400 năm', 'Khoảng 50 năm', 'Hơn 1000 năm', 'Mới xuất hiện thời kỳ cận đại'],
            correctIndex: 0,
            explanation: 'Làng đá Non Nước được cụ Huỳnh Bá Quát người Thanh Hóa khởi dựng từ cuối thế kỷ XVII, đến nay đã có lịch sử hơn 400 năm.',
            culturalInsight: 'Nghề điêu khắc đá Non Nước đã được công nhận là Di sản văn hóa phi vật thể quốc gia.'
          }
        ],
        expReward: 160
      },
      {
        id: 'nhs-cp-3',
        order: 3,
        name: 'Cửa Ải Động Âm Phủ & Cầu Nại Hà (12 Tầng Địa Ngục)',
        shortDesc: 'Vực sâu trong lòng núi tái hiện triết lý thiện ác nhân quả sâu sắc của phương Đông',
        culturalEra: 'Hang động tự nhiên & Nghệ thuật tạo hình thế kỷ XX',
        qrCode: 'VIEN-NHS-AP-03',
        nfcCode: 'NFC-NHS-AMPHU-03',
        coords: { x: 78, y: 72 },
        storySnippet: [
          'Động Âm Phủ đi ngược xuống lòng đất, đối lập hoàn toàn với vòm sáng thanh cao của Động Huyền Không. Lối vào động dẫn qua Cầu Nại Hà bắc qua sông Vong Xuyên u tịch.',
          'Trong động mô phỏng 12 cửa ngục phán xét hành vi của con người khi còn sống: khuyên răn con người tránh điều ác, tích lũy điều thiện và hiếu kính với cha mẹ.'
        ],
        audioGuideText: 'Bước qua Cầu Nại Hà, bạn sẽ cảm nhận sự huyền bí của cõi u minh. Triết lý của Động Âm Phủ không nhằm gieo rắc sợ hãi, mà nhắc nhở mỗi con người sống trọn đạo làm người...',
        historicalImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        personaClues: {
          historian: {
            taskTitle: 'Khảo cứu bia giáo huấn luật nhân quả thời xưa',
            clue: 'Dùng Kính Lúp Văn Tự tìm câu đối răn dạy lòng hiếu đễ khắc trước cửa động.',
            toolAction: 'Dịch thuật các chữ triết lý Thiện Ác phân minh'
          },
          explorer: {
            taskTitle: 'Vượt qua mê cung thạch nhũ Động Âm Phủ',
            clue: 'Dùng La Bàn Cổ xác định nhánh hang dẫn xuống suối Giải Oan sâu nhất.',
            toolAction: 'Dò đường qua kẽ nứt địa chất ăn sâu xuống lòng đất'
          },
          artisan: {
            taskTitle: 'Đánh giá nghệ thuật đắp tượng phù điêu Diêm Vương',
            clue: 'Dùng Thấu Kính Họa Tiết quan sát biểu cảm khuôn mặt của Thập Điện Diêm Vương.',
            toolAction: 'Phân tích kỹ thuật đắp xi măng kết hợp thạch nhũ tự nhiên'
          }
        },
        riddle: {
          type: 'han-nom',
          prompt: 'Trong điển tích dân gian, cây cầu bắc qua sông ranh giới giữa cõi trần và cõi âm trong Động Âm Phủ có tên là gì?',
          personaHint: 'Gợi ý từ vai diễn: Cây cầu gắn liền với chén canh quên lãng để bước vào luân hồi.',
          options: [
            {
              id: 'a',
              text: 'Cầu Nại Hà (奈何桥)',
              isCorrect: true,
              explanation: 'Chính xác! Cầu Nại Hà là biểu tượng kinh điển thử thách lòng dạ con người theo giáo lý phương Đông.'
            },
            {
              id: 'b',
              text: 'Cầu Ô Thước',
              isCorrect: false,
              explanation: 'Sai rồi. Cầu Ô Thước trong tích Ngưu Lang Chức Nữ.'
            },
            {
              id: 'c',
              text: 'Cầu Kiều',
              isCorrect: false,
              explanation: 'Sai rồi. Đó là hình tượng cầu thơ mộng trong văn học.'
            }
          ]
        },
        quizzes: [
          {
            id: 'nhs-q4',
            question: 'Ý nghĩa nhân văn cốt lõi lớn nhất mà Động Âm Phủ muốn truyền tải đến người tham quan là gì?',
            options: [
              'Khuyên con người "Lánh dữ làm lành", sống chính trực và giữ trọn đạo hiếu',
              'Làm cho du khách cảm thấy sợ hãi bóng tối',
              'Trưng bày các hiện vật khảo cổ học thời tiền sử',
              'Chỉ để thử thách lòng dũng cảm của người leo núi'
            ],
            correctIndex: 0,
            explanation: 'Toàn bộ không gian Động Âm Phủ hướng tới bài học đạo đức nhân quả, khuyến thiện trừ tà và tôn vinh lòng hiếu thảo.',
            culturalInsight: 'Tại cuối động có đường dẫn lên "Thiên Thai" lộng gió, tượng trưng cho con người khi gột rửa tâm hồn sẽ vươn tới sự thanh thản.'
          }
        ],
        expReward: 180
      }
    ]
  }
];
