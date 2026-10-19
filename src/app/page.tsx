import Link from 'next/link';
import { ArrowRight, Compass, ScanLine, BookOpen, Award, ArrowUpRight } from 'lucide-react';

export default function IntroductionPage() {
  return (
    <div className="experience-shell intro-shell">
      <header className="intro-header">
        <Link href="/" className="auth-brand" aria-label="VieN trang giới thiệu">VieN<span>.</span></Link>
        <nav aria-label="Điều hướng giới thiệu"><a href="#ve-vien">Về VieN</a><a href="#trai-nghiem">Trải nghiệm</a><a href="#bat-dau">Cách bắt đầu</a></nav>
        <Link href="/sign-in" className="intro-login">Đăng nhập <ArrowUpRight size={15} /></Link>
      </header>
      <main>
        <section className="intro-hero" id="ve-vien">
          <div className="intro-hero-copy">
            <span className="auth-eyebrow">DI SẢN VIỆT · KẾT NỐI QUA TỪNG CÂU CHUYỆN</span>
            <h1>Chạm vào di sản.<br /><span>Tiếp nối chuyện Việt.</span></h1>
            <p>VieN mở ra một cách khám phá văn hóa Việt Nam gần gũi hơn: lắng nghe câu chuyện, hóa thân vào vai trò và tự mình giải mã những dấu ấn thời gian.</p>
            <div className="intro-actions"><Link href="/sign-up" className="intro-primary">Tạo tài khoản để khám phá <ArrowRight size={18} /></Link><a href="#trai-nghiem" className="intro-secondary">Tìm hiểu về VieN</a></div>
            <p className="intro-hero-note">Đã có tài khoản? <Link href="/sign-in">Đăng nhập để tiếp tục hành trình.</Link></p>
          </div>
          <div className="intro-art" aria-hidden="true">
            <div className="intro-orbit intro-orbit-one" /><div className="intro-orbit intro-orbit-two" />
            <svg className="intro-monument" viewBox="0 0 480 430" fill="none">
              <circle cx="240" cy="177" r="112" fill="url(#intro-sun)" />
              <path d="M45 225Q112 226 155 168H188Q202 137 240 117Q278 137 292 168H325Q368 226 435 225Q388 251 340 252H140Q92 251 45 225Z" fill="#1b110d" stroke="#f6a16b" strokeWidth="1.5" />
              <path d="M125 268H355M110 350H370M91 365H389M70 380H410" stroke="#e3844c" strokeWidth="2" />
              <path d="M146 271V348M192 271V348M288 271V348M334 271V348" stroke="#d67b49" strokeWidth="6" />
              <path d="M218 348V291Q240 271 262 291V348" fill="#f69753" fillOpacity=".18" stroke="#e3844c" />
              <path d="M240 117V97M230 103L240 89L250 103" stroke="#ffc59d" strokeWidth="2" />
              <defs><linearGradient id="intro-sun" x1="128" y1="65" x2="352" y2="289" gradientUnits="userSpaceOnUse"><stop stopColor="#ffae6e" /><stop offset="1" stopColor="#ba411e" stopOpacity=".2" /></linearGradient></defs>
            </svg>
            <div className="intro-art-caption"><span>VĂN HÓA ĐƯỢC GÌN GIỮ</span><span>CÂU CHUYỆN ĐƯỢC TIẾP NỐI</span></div>
          </div>
        </section>
        <section className="intro-features" id="trai-nghiem">
          <div className="intro-section-heading"><span className="auth-eyebrow">KHÁM PHÁ THEO CÁCH CỦA BẠN</span><h2>Mỗi điểm dừng.<br />Một điều mới để hiểu.</h2><p>Công nghệ giúp con người trải nghiệm văn hóa, không thay thế văn hóa.</p></div>
          <div className="intro-feature-grid">
            {[{ icon: Compass, title: 'Chọn hành trình', text: 'Tìm những không gian văn hóa và câu chuyện khiến bạn tò mò.' }, { icon: ScanLine, title: 'Tương tác cùng di sản', text: 'Khám phá qua câu chuyện, vai trò và hoạt động quét mã mô phỏng.' }, { icon: BookOpen, title: 'Giải mã chuyện xưa', text: 'Quan sát, tìm manh mối và thử sức với những câu hỏi văn hóa.' }, { icon: Award, title: 'Ghi dấu trải nghiệm', text: 'Nhận huy hiệu và ghi lại cảm nhận sau mỗi hành trình khám phá.' }].map(({ icon: Icon, title, text }, index) => <article className="intro-feature" key={title}><div className="intro-feature-top"><Icon size={24} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>
        <section className="intro-start" id="bat-dau">
          <div><span className="auth-eyebrow">HÀNH TRÌNH BẮT ĐẦU TỪ ĐÂY</span><h2>Sẵn sàng viết tiếp<br />câu chuyện của bạn?</h2><p>Tạo tài khoản hoặc đăng nhập để mở không gian khám phá di sản.</p><Link href="/sign-up" className="intro-primary">Bắt đầu cùng VieN <ArrowRight size={18} /></Link></div>
          <ol className="intro-steps"><li><span>01</span><div><h3>Tạo tài khoản</h3><p>Đăng ký bằng tên, email và mật khẩu.</p></div></li><li><span>02</span><div><h3>Bước vào VieN</h3><p>Đăng nhập để truy cập trang chính của bạn.</p></div></li><li><span>03</span><div><h3>Khám phá di sản</h3><p>Chọn điểm đến, nhập vai và bắt đầu hành trình.</p></div></li></ol>
        </section>
      </main>
      <footer className="intro-footer"><Link href="/" className="auth-brand">VieN<span>.</span></Link><p>Kết nối con người với di sản Việt.</p><Link href="/sign-in">Đăng nhập <ArrowRight size={14} /></Link></footer>
    </div>
  );
}
