'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export function AuthForm({ mode, next = '/experience' }: { mode: 'sign-in' | 'sign-up'; next?: string }) {
  const signUp = mode === 'sign-up';
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    setError('');
    if (signUp && !name) { setError('Vui lòng nhập tên hiển thị.'); return; }
    if (signUp && password !== form.get('confirmPassword')) {
      setError('Mật khẩu xác nhận chưa khớp.'); return;
    }
    setPending(true);
    try {
      const result = signUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.status === 429
          ? 'Bạn đã thử quá nhiều lần. Vui lòng đợi một chút rồi thử lại.'
          : signUp
            ? 'Không thể tạo tài khoản. Kiểm tra thông tin hoặc đăng nhập nếu bạn đã có tài khoản.'
            : 'Không thể đăng nhập. Kiểm tra email, mật khẩu và thử lại.');
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError('Chưa kết nối được máy chủ. Vui lòng thử lại.');
    } finally { setPending(false); }
  }

  return (
    <main className="experience-shell auth-shell">
      <div className="auth-topbar">
        <Link href="/" className="auth-brand">VieN<span>.</span></Link>
        <Link href="/" className="auth-back"><ArrowLeft size={15} /> Về trang giới thiệu</Link>
      </div>
      <div className="auth-layout">
        <aside className="auth-story">
          <span className="auth-eyebrow">DI SẢN VIỆT · CÂU CHUYỆN CỦA BẠN</span>
          <h1>Mỗi hành trình.<br />Một kết nối<br /><span>với cội nguồn.</span></h1>
          <p>Đi qua những miền di sản, lắng nghe chuyện xưa và viết tiếp hành trình của riêng bạn.</p>
          <div className="auth-story-footer"><ShieldCheck size={19} /><span>Một tài khoản để bắt đầu cùng VieN</span></div>
        </aside>
        <section className="auth-card" aria-labelledby="auth-title">
          <span className="auth-eyebrow">CHÀO MỪNG ĐẾN VỚI VIEN</span>
          <h2 id="auth-title">{signUp ? 'Bắt đầu hành trình' : 'Chào mừng trở lại'}</h2>
          <p className="auth-description">{signUp ? 'Tạo tài khoản để trở thành một phần của cộng đồng khám phá di sản.' : 'Đăng nhập để tiếp tục khám phá cùng VieN.'}</p>
          <form onSubmit={submit} className="auth-form" aria-busy={pending}>
            <fieldset disabled={pending}>
              {signUp && <label htmlFor="auth-name">Tên hiển thị<input id="auth-name" name="name" autoComplete="name" placeholder="Tên của bạn" required maxLength={100} /></label>}
              <label htmlFor="auth-email">Email<input id="auth-email" name="email" type="email" autoComplete="email" placeholder="ban@example.com" required maxLength={254} /></label>
              <label htmlFor="auth-password">Mật khẩu
                <div className="auth-password">
                  <input id="auth-password" name="password" type={visible ? 'text' : 'password'} autoComplete={signUp ? 'new-password' : 'current-password'} placeholder={signUp ? 'Ít nhất 8 ký tự' : 'Nhập mật khẩu'} minLength={8} maxLength={128} required />
                  <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={visible}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </label>
              {signUp && <label htmlFor="auth-confirm">Xác nhận mật khẩu<input id="auth-confirm" name="confirmPassword" type={visible ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập lại mật khẩu" minLength={8} maxLength={128} required /></label>}
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit">{pending ? <><LoaderCircle className="animate-spin" size={18} /> Đang xử lý…</> : <>{signUp ? 'Tạo tài khoản' : 'Đăng nhập'}<ArrowRight size={18} /></>}</button>
            </fieldset>
          </form>
          <p className="auth-switch">{signUp ? 'Đã có tài khoản? ' : 'Bạn chưa có tài khoản? '}<Link href={`${signUp ? '/sign-in' : '/sign-up'}?next=${encodeURIComponent(next)}`}>{signUp ? 'Đăng nhập' : 'Đăng ký ngay'}</Link></p>
        </section>
      </div>
      <p className="auth-footer">VieN · Kết nối con người với di sản Việt.</p>
    </main>
  );
}
