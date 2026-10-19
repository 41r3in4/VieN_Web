'use client';
/* eslint-disable @next/next/no-img-element -- Media endpoints require the browser session cookie; use direct image requests. */

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { X, Send, Heart, ImagePlus, LoaderCircle } from 'lucide-react';
import { useCommunity } from '@/context/CommunityContext';
import { prepareChatPhoto } from '@/lib/client-photo';
import { AiChatPanel } from './AiChatPanel';

export function LiveChatModal() {
  const [tab,setTab] = useState<'community' | 'ai'>('community');
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, likeChatMessage, onlineCount, chatLoading, chatError, hasMore, loadOlder, refreshChat } = useCommunity();
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string>();
  const [sending, setSending] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [olderLoading, setOlderLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [liking, setLiking] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const stream = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const clientId = useRef<string | null>(null);
  const nearBottom = useRef(true);
  const latestId = chatMessages.at(-1)?.id;

  useEffect(() => {
    if (isChatOpen && nearBottom.current && stream.current) stream.current.scrollTop = stream.current.scrollHeight;
  }, [isChatOpen, latestId]);
  useEffect(() => {
    if (!isChatOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsChatOpen(false);
      if (event.key === 'Tab') {
        const elements = [...(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea:not(:disabled),a[href]') ?? [])].filter(element=>element.getClientRects().length>0);
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [isChatOpen, setIsChatOpen]);
  if (!isChatOpen) return null;

  async function send(event: FormEvent) {
    event.preventDefault();
    if (sending || preparing || (!text.trim() && !photo)) return;
    setSending(true); setLocalError('');
    clientId.current ??= crypto.randomUUID();
    const saved = await sendChatMessage(text.trim(), photo, clientId.current);
    if (saved) { setText(''); setPhoto(undefined); clientId.current = null; nearBottom.current = true; }
    setSending(false);
  }
  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPreparing(true); setLocalError('');
    try { setPhoto(await prepareChatPhoto(file)); clientId.current = null; }
    catch (error) { setLocalError(error instanceof Error ? error.message : 'Không thể đọc ảnh.'); }
    finally { setPreparing(false); }
  }
  async function older() {
    if (olderLoading) return;
    setOlderLoading(true);
    const height = stream.current?.scrollHeight ?? 0;
    const top = stream.current?.scrollTop ?? 0;
    await loadOlder();
    requestAnimationFrame(() => { if (stream.current) stream.current.scrollTop = top + stream.current.scrollHeight - height; });
    setOlderLoading(false);
  }
  async function like(id: string) {
    if (liking.includes(id)) return;
    setLiking(previous => [...previous, id]);
    await likeChatMessage(id);
    setLiking(previous => previous.filter(value => value !== id));
  }
  return <div className="community-backdrop" onClick={event => { if (event.target === event.currentTarget) setIsChatOpen(false); }}>
    <section ref={dialog} tabIndex={-1} data-vien-dialog="true" className="community-chat" role="dialog" aria-modal="true" aria-labelledby="community-title">
      <header className="community-chat-header"><div><h2 id="community-title">Cộng đồng VieN</h2><p>{onlineCount === null ? 'Chia sẻ hành trình cùng các thành viên' : `${onlineCount} thành viên đang hoạt động`}</p></div><button onClick={() => setIsChatOpen(false)} aria-label="Đóng trò chuyện"><X size={20} /></button></header>
      <div className="chat-channel-tabs" role="tablist" aria-label="Kênh trò chuyện"><button id="community-tab" role="tab" aria-selected={tab==='community'} aria-controls="community-panel" onClick={()=>setTab('community')}>Cộng đồng</button><button id="ai-tab" role="tab" aria-selected={tab==='ai'} aria-controls="ai-panel" onClick={()=>setTab('ai')}>✦ Trợ lý VieN</button></div>
      <div id="ai-panel" role="tabpanel" aria-labelledby="ai-tab" className="chat-tab-panel" hidden={tab!=='ai'}><AiChatPanel /></div>
      <div id="community-panel" role="tabpanel" aria-labelledby="community-tab" className="chat-tab-panel" hidden={tab!=='community'}>
      <div className="community-stream" ref={stream} onScroll={() => { const element = stream.current; if (element) nearBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 100; }}>
        <p className="community-channel-note">Kênh chung · Tin nhắn được chia sẻ với các thành viên VieN.</p>
        {hasMore && <button className="community-load-older" onClick={() => void older()} disabled={olderLoading}>{olderLoading ? 'Đang tải…' : 'Xem tin nhắn cũ'}</button>}
        {chatLoading && !chatMessages.length && <p className="community-empty" role="status">Đang tải trò chuyện…</p>}
        {!chatLoading && !chatMessages.length && !chatError && <div className="community-empty"><h3>Câu chuyện bắt đầu từ bạn</h3><p>Chia sẻ cảm nhận đầu tiên về hành trình di sản.</p></div>}
        {chatMessages.map(message => <article key={message.id} className={`community-message ${message.isSelf ? 'community-message-self' : ''}`}>
          <img className="community-message-avatar" src={message.avatar} alt={`Avatar ${message.sender}`} />
          <div className="community-message-content"><div className="community-message-author"><strong>{message.sender}{message.isSelf ? ' · Bạn' : ''}</strong><span>{message.role}</span></div><div className="community-bubble">{message.text && <p>{message.text}</p>}{message.photoUrl && <a href={message.photoUrl} target="_blank" rel="noreferrer"><img src={message.photoUrl} alt="Ảnh chia sẻ trong cộng đồng" loading="lazy" /></a>}</div><div className="community-message-meta"><time dateTime={message.createdAt}>{message.timestamp}</time><button onClick={() => void like(message.id)} aria-label={`${message.hasLiked ? 'Bỏ thích' : 'Thích'} tin nhắn của ${message.sender}`} aria-pressed={!!message.hasLiked} disabled={liking.includes(message.id)}><Heart size={13} fill={message.hasLiked ? 'currentColor' : 'none'} />{message.likes}</button></div></div>
        </article>)}
      </div>
      {(chatError || localError) && <div className="community-error" role="alert">{localError || chatError}{chatError && <button onClick={() => void refreshChat()}>Tải lại</button>}</div>}
      {photo && <div className="community-photo-preview"><img src={photo} alt="Ảnh sắp gửi" /><button disabled={sending} onClick={() => { setPhoto(undefined); clientId.current = null; }} aria-label="Bỏ ảnh đính kèm"><X size={16} /></button></div>}
      <form className="community-composer" onSubmit={send}>
        <input type="file" ref={fileInput} accept="image/jpeg,image/png,image/webp" hidden onChange={choose} aria-label="Chọn ảnh chia sẻ" />
        <button type="button" onClick={() => fileInput.current?.click()} disabled={sending || preparing} aria-label="Đính kèm ảnh từ thiết bị">{preparing ? <LoaderCircle size={20} className="animate-spin" /> : <ImagePlus size={20} />}</button>
        <textarea value={text} maxLength={2000} rows={2} disabled={sending} onChange={event => { setText(event.target.value); clientId.current = null; }} placeholder="Chia sẻ câu chuyện của bạn…" aria-label="Nội dung tin nhắn" />
        <button type="submit" disabled={sending || preparing || (!text.trim() && !photo)} aria-label="Gửi tin nhắn">{sending ? <LoaderCircle size={19} className="animate-spin" /> : <Send size={19} />}</button>
      </form>
      </div>
    </section>
  </div>;
}
