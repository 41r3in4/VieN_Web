'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { ChatMessage } from '@/types';
import type { ChatResponse } from '@/types/community';

interface CommunityContextValue {
  isChatOpen: boolean; setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[]; chatLoading: boolean; chatError: string;
  onlineCount: number | null; hasMore: boolean;
  sendChatMessage: (text: string, photo: string | undefined, clientId: string) => Promise<boolean>;
  likeChatMessage: (id: string) => Promise<void>;
  loadOlder: () => Promise<void>; refreshChat: () => Promise<void>;
}
const CommunityContext = createContext<CommunityContextValue | undefined>(undefined);
function mergeMessages(previous: ChatMessage[], next: ChatMessage[]) {
  const map = new Map(previous.map(message => [message.id, message]));
  for (const message of next) map.set(message.id, message);
  return [...map.values()].sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? '') || a.id.localeCompare(b.id));
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const revision = useRef(0);
  const olderLoaded = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const refreshing = useRef(false);
  const merge = useCallback((next: ChatMessage[]) => {
    setChatMessages(previous => {
      const result = mergeMessages(previous, next);
      messagesRef.current = result;
      return result;
    });
  }, []);
  const applyPage = useCallback((data: ChatResponse) => {
    if (!olderLoaded.current || !data.hasMore) {
      messagesRef.current = data.messages;
      setChatMessages(data.messages);
      setHasMore(data.hasMore);
      if (!data.hasMore) olderLoaded.current = false;
    } else {
      merge(data.messages);
    }
  }, [merge]);

  const refreshChat = useCallback(async () => {
    if (refreshing.current || document.hidden) return;
    refreshing.current = true;
    const ticket = revision.current;
    try {
      const response = await fetch('/api/community/chat', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data: ChatResponse = await response.json();
      if (ticket === revision.current) {
        applyPage(data);
        setLoadError('');
      }
    } catch { setLoadError('Chưa tải được trò chuyện. Nội dung hiện có vẫn được giữ lại.'); }
    finally { refreshing.current = false; setChatLoading(false); }
  }, [applyPage]);

  useEffect(() => {
    if (!isChatOpen) return;
    const initialLoad = setTimeout(() => void refreshChat(), 0);
    const interval = setInterval(refreshChat, 3000);
    window.addEventListener('focus', refreshChat);
    document.addEventListener('visibilitychange', refreshChat);
    return () => { clearTimeout(initialLoad); clearInterval(interval); window.removeEventListener('focus', refreshChat); document.removeEventListener('visibilitychange', refreshChat); };
  }, [isChatOpen, refreshChat]);

  useEffect(() => {
    let alive = true;
    let pending = false;
    const heartbeat = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch('/api/community/presence', { method: 'POST' });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (alive) setOnlineCount(data.online);
      } catch { if (alive) setOnlineCount(null); }
      finally { pending = false; }
    };
    void heartbeat();
    const interval = setInterval(heartbeat, 30000);
    window.addEventListener('focus', heartbeat);
    document.addEventListener('visibilitychange', heartbeat);
    return () => { alive = false; clearInterval(interval); window.removeEventListener('focus', heartbeat); document.removeEventListener('visibilitychange', heartbeat); };
  }, []);

  const sendChatMessage = async (text: string, photo: string | undefined, clientId: string) => {
    revision.current++;
    setActionError('');
    try {
      const response = await fetch('/api/community/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, photo, clientId }) });
      if (!response.ok) {
        setActionError(response.status === 429 ? 'Bạn gửi hơi nhanh. Đợi 2 giây rồi thử lại.' : 'Chưa gửi được tin nhắn. Nội dung đang soạn vẫn được giữ lại.');
        return false;
      }
      const data: ChatResponse = await response.json();
      applyPage(data);
      return true;
    } catch { setActionError('Chưa gửi được tin nhắn. Kiểm tra kết nối rồi thử lại.'); return false; }
  };
  const likeChatMessage = async (id: string) => {
    const message = messagesRef.current.find(item => item.id === id);
    if (!message) return;
    revision.current++;
    try {
      const response = await fetch('/api/community/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId: id, liked: !message.hasLiked }) });
      if (!response.ok) throw new Error();
      const data = await response.json();
      merge([{ ...message, likes: data.likes, hasLiked: data.hasLiked }]);
      setActionError('');
    } catch { setActionError('Chưa lưu được lượt thích. Vui lòng thử lại.'); }
  };
  const loadOlder = async () => {
    const oldest = messagesRef.current[0];
    if (!oldest) return;
    try {
      const response = await fetch(`/api/community/chat?before=${encodeURIComponent(oldest.id)}`, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data: ChatResponse = await response.json();
      olderLoaded.current = true;
      merge(data.messages);
      setHasMore(data.hasMore);
    } catch { setActionError('Chưa tải được tin nhắn cũ. Vui lòng thử lại.'); }
  };
  return <CommunityContext.Provider value={{ isChatOpen, setIsChatOpen, chatMessages, chatLoading, chatError: actionError || loadError, onlineCount, hasMore, sendChatMessage, likeChatMessage, loadOlder, refreshChat }}>{children}</CommunityContext.Provider>;
}
export function useCommunity() {
  const value = useContext(CommunityContext);
  if (!value) throw new Error('CommunityProvider is required');
  return value;
}
