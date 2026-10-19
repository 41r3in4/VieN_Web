'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

async function prepareAvatar(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Chọn ảnh JPG, PNG hoặc WebP.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Ảnh tối đa 8 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Trình duyệt chưa hỗ trợ xử lý ảnh.');
    const size = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, 256, 256);
    return canvas.toDataURL('image/webp', .85);
  } finally { bitmap.close(); }
}

export function AvatarEditor() {
  const { data: session, refetch } = authClient.useSession();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  async function update(image: string | null) {
    const response = await fetch('/api/profile/avatar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image }) });
    if (!response.ok) throw new Error('Chưa lưu được avatar. Vui lòng thử lại.');
    await refetch();
    setMessage('Đã cập nhật avatar.');
  }
  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPending(true); setMessage('');
    try { await update(await prepareAvatar(file)); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Không thể đọc ảnh này.'); }
    finally { setPending(false); }
  }
  async function remove() {
    setPending(true); setMessage('');
    try { await update(null); } catch { setMessage('Chưa thể xóa avatar. Vui lòng thử lại.'); }
    finally { setPending(false); }
  }
  return <div className="avatar-editor">
    <button className="avatar-picker" onClick={() => input.current?.click()} disabled={pending} aria-label="Đổi ảnh đại diện" title="Đổi ảnh đại diện">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={session?.user.image || '/avatar-default.svg'} alt={`Ảnh đại diện ${session?.user.name ?? ''}`} />
      <span><Camera size={15} /></span>
    </button>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={choose} hidden aria-label="Chọn ảnh đại diện" />
    <button className="avatar-text-action" onClick={() => input.current?.click()} disabled={pending}>{pending ? 'Đang lưu…' : 'Đổi avatar'}</button>
    {session?.user.image && <button className="avatar-text-action" onClick={remove} disabled={pending}>Xóa ảnh</button>}
    {message && <p role="status" className="avatar-message">{message}</p>}
  </div>;
}
