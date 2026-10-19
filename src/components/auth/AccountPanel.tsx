'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useHeritage } from '@/context/HeritageContext';
import { AvatarEditor } from '@/components/auth/AvatarEditor';

export function AccountPanel() {
  const { syncStatus, retrySync } = useHeritage();
  const router = useRouter();
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function signOut() {
    setPending(true);
    setError('');
    try {
      const result = await authClient.signOut();
      if (result.error) setError('Chưa thể đăng xuất. Vui lòng thử lại.');
      else { router.replace('/'); router.refresh(); }
    } catch { setError('Chưa kết nối được máy chủ.'); }
    finally { setPending(false); }
  }

  return (
    <section className="account-panel" aria-label="Tài khoản VieN">
      {isPending ? <p role="status">Đang tải tài khoản…</p> : sessionError ? <p role="alert">Chưa tải được tài khoản. Vui lòng tải lại trang.</p> : session ? <>
        <AvatarEditor />
        <div className="account-identity"><span className="auth-eyebrow">TÀI KHOẢN CỦA BẠN</span><h2>{session.user.name}</h2><p>{session.user.email}</p></div>
        <button onClick={signOut} disabled={pending} className="account-action">{pending ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
      </> : <>
        <div><h2>Chào mừng đến với VieN</h2><p>Đăng nhập hoặc tạo tài khoản của bạn.</p></div>
        <div className="account-links"><Link href="/sign-in" className="account-action">Đăng nhập</Link><Link href="/sign-up" className="account-action account-primary">Đăng ký</Link></div>
      </>}
      {error && <p role="alert" className="auth-error">{error}</p>}
      <div className="account-note" role="status" aria-live="polite">{syncStatus === 'saving' ? 'Đang lưu tiến độ…' : syncStatus === 'error' ? <>Chưa lưu được một số hoạt động. <button onClick={() => void retrySync()} className="account-action">Thử đồng bộ lại</button></> : 'Đã đồng bộ tài khoản · EXP, thử thách và nội dung đã nghe được lưu tự động.'}</div>
    </section>
  );
}
