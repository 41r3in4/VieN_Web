export type AssistantMessage = { role: 'user' | 'assistant'; content: string };
export const ASSISTANT_TOPICS = [
  { question:'Giới thiệu Đình làng Hải Châu',keywords:['hai chau','dinh lang'],answer:'Đình làng Hải Châu là điểm đến di sản tại Hải Châu, Đà Nẵng trong VieN. Bạn có thể tìm hiểu câu chuyện di tích, xem ảnh và video, rồi khám phá các trạm. Vào mục Khám phá → chọn Đình làng Hải Châu → Bắt đầu hành trình.' },
  { question:'Ngũ Hành Sơn có gì đặc biệt?',keywords:['ngu hanh son','am phu','huyen khong'],answer:'Hành trình Ngũ Hành Sơn & Động Âm Phủ trong VieN giới thiệu cảnh quan núi đá vôi, Động Huyền Không, Chùa Linh Ứng Non Nước và Động Âm Phủ. Vào Khám phá → chọn điểm đến này để xem câu chuyện và các trạm trải nghiệm.' },
  { question:'Làm sao nhận EXP và huy hiệu?',keywords:['exp','kinh nghiem','huy hieu','diem','thach','quiz'],answer:'Hoàn thành câu đố và thử thách tại các trạm để nhận EXP. Mỗi trạm chỉ cộng EXP lần đầu hoàn thành. Hoàn tất các trạm của một điểm đến để mở huy hiệu tương ứng. Bạn có thể theo dõi tiến độ trong Hồ sơ và Mạch sử.' },
  { question:'Cách đổi ảnh đại diện',keywords:['avatar','anh dai dien','doi anh'],answer:'Mở mục Hồ sơ, chọn chức năng đổi ảnh đại diện, chọn ảnh từ thiết bị rồi lưu. Ảnh được cập nhật cho tài khoản của bạn.' },
  { question:'Bảng xếp hạng hoạt động thế nào?',keywords:['xep hang','bang hang','top'],answer:'Bảng xếp hạng hiển thị thành viên thật có EXP trong kỳ được chọn: tuần này, tháng này hoặc toàn thời gian. Hoàn thành thử thách để nhận EXP và tham gia xếp hạng.' },
  { question:'Bắt đầu khám phá thế nào?',keywords:['kham pha','bat dau','hanh trinh','su dung','huong dan'],answer:'Chọn mục Khám phá, mở một điểm đến rồi bấm Bắt đầu hành trình. Chọn vai trải nghiệm, đọc câu chuyện và hoàn thành các trạm theo lựa chọn của bạn. Tiến độ được lưu theo tài khoản.' },
  { question:'Cách chat với cộng đồng',keywords:['chat','cong dong','tin nhan'],answer:'Chuyển sang tab Cộng đồng trong cửa sổ này để gửi tin nhắn, chia sẻ ảnh và tương tác với thành viên VieN. Tab Trợ lý VieN chỉ trả lời các chủ đề có sẵn, không gửi tin nhắn tới cộng đồng.' },
];
function normalize(text:string) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim(); }
export function assistantReply(text:string):string {
  const query=normalize(text);
  if (!query) return 'Bạn hãy chọn một câu hỏi gợi ý hoặc nhập nội dung cần hỗ trợ nhé.';
  const topic=ASSISTANT_TOPICS.find(item=>normalize(item.question)===query) ?? ASSISTANT_TOPICS.find(item=>item.keywords.some(keyword=>` ${query} `.includes(` ${keyword} `)));
  if(topic) return topic.answer;
  if(/^(xin chao|chao|hello|hi)( ban)?$/.test(query)) return 'Chào bạn! Mình là trợ lý tự động của VieN. Mình có thể hướng dẫn khám phá di sản, nhận EXP, huy hiệu, đổi avatar và xem bảng xếp hạng. Bạn chọn một câu hỏi gợi ý nhé.';
  if(query.includes('cam on')) return 'Rất vui được hỗ trợ bạn. Chúc bạn có hành trình khám phá di sản thú vị cùng VieN!';
  return 'Mình là trợ lý trả lời có sẵn, hiện chưa có câu trả lời cho nội dung này. Bạn có thể chọn các câu hỏi gợi ý về di sản, EXP, huy hiệu, hồ sơ hoặc bảng xếp hạng bên dưới.';
}
