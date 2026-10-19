'use client';
/* eslint-disable @next/next/no-img-element -- Avatar endpoints require the browser session cookie; use direct image requests. */

import { useEffect, useState } from 'react';
import { Trophy, Crown, MessageSquare, RefreshCw } from 'lucide-react';
import { useHeritage } from '@/context/HeritageContext';
import { useCommunity } from '@/context/CommunityContext';
import type { LeaderboardPeriod, LeaderboardResponse } from '@/types/community';

export function LeaderboardView() {
  const { userExp, unlockedBadgeIds, setActiveTab } = useHeritage();
  const { setIsChatOpen } = useCommunity();
  const [period, setPeriod] = useState<LeaderboardPeriod>('week');
  const [data, setData] = useState<{ period: LeaderboardPeriod; value: LeaderboardResponse } | null>(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    const load = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch(`/api/leaderboard?period=${period}`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error();
        const value: LeaderboardResponse = await response.json();
        if (!controller.signal.aborted) { setData({ period, value }); setError(''); }
      } catch { if (!controller.signal.aborted) setError('Chưa tải được bảng xếp hạng. Vui lòng thử lại.'); }
      finally { pending = false; }
    };
    void load();
    const timer = setInterval(load, 20000);
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', load);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('focus', load); document.removeEventListener('visibilitychange', load); };
  }, [period, userExp, unlockedBadgeIds.length, refreshKey]);

  const ranking = data?.period === period ? data.value : null;
  const own = ranking?.currentUser;
  return <div className="experience-view space-y-5 p-3.5 pb-36 parchment-texture">
    <section className="ranking-heading"><span className="auth-eyebrow"><Trophy size={16} /> CỘNG ĐỒNG VIEN</span><h1>Bảng xếp hạng di sản</h1><p>EXP từ thử thách đã hoàn thành của các thành viên VieN.</p></section>
    <div className="ranking-periods" role="group" aria-label="Khoảng thời gian xếp hạng">{([{ id: 'week', label: 'Tuần này' }, { id: 'month', label: 'Tháng này' }, { id: 'all', label: 'Toàn thời gian' }] as const).map(item => <button key={item.id} aria-pressed={period === item.id} onClick={() => setPeriod(item.id)}>{item.label}</button>)}</div>
    <div className="ranking-meta"><p>{ranking ? `${ranking.totalUsers} thành viên đã tham gia · cập nhật tự động` : 'Đang tải dữ liệu…'}</p><button onClick={() => setRefreshKey(key => key + 1)} aria-label="Làm mới bảng xếp hạng"><RefreshCw size={15} /> Làm mới</button></div>
    {error && <p className="auth-error" role="alert">{error}</p>}
    {!ranking && !error && <p role="status" className="community-empty">Đang tải bảng xếp hạng…</p>}
    {ranking && ranking.users.length === 0 && <p className="community-empty">Chưa có thành viên hoàn thành thử thách trong khoảng thời gian này.</p>}
    {ranking && ranking.users.length > 0 && <>
      <section className="ranking-podium" style={{ gridTemplateColumns: `repeat(${Math.min(3, ranking.users.length)}, minmax(0, 1fr))` }} aria-label="Thành viên dẫn đầu từ database">{[2, 1, 3].filter(rank => ranking.users.some(user => user.rank === rank)).map(rank => {
        const member = ranking.users.find(user => user.rank === rank);
        return <div key={rank} className={`ranking-place ranking-place-${rank}`}>
          {member ? <><div className="ranking-avatar"><Crown size={20} /><img src={member.avatar} alt={`Avatar ${member.name}`} /></div><h2>{member.name}{member.isCurrentUser && <small> · Bạn</small>}</h2><p>{member.exp} EXP</p></> : <div className="ranking-vacant">Chưa có thành viên</div>}
          <div className="ranking-plinth"><span>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span><strong>{rank === 1 ? 'Hạng nhất' : `Hạng ${rank}`}</strong></div>
        </div>;
      })}</section>
      {ranking.users.length > 3 && <section><h2 className="ranking-list-title">Bảng hạng chi tiết</h2><div className="ranking-list">{ranking.users.slice(3).map(member => <article className={`ranking-row ${member.isCurrentUser ? 'ranking-row-self' : ''}`} key={member.id}><span className="ranking-number">#{member.rank}</span><img src={member.avatar} alt="" /><div className="ranking-member"><h3>{member.name}{member.isCurrentUser && <small> · Bạn</small>}</h3><p>{member.role} · {member.recentAchievement}</p></div><div className="ranking-points"><strong>{member.exp} EXP</strong><span>{member.badgesCount} huy hiệu</span></div></article>)}</div></section>}
      <p className="ranking-footnote">Chỉ xếp hạng tài khoản có EXP từ thử thách đã hoàn thành trong khoảng thời gian này. Hiển thị 50 hạng đầu; huy hiệu là tổng đã đạt. Tuần/tháng tính theo múi giờ Việt Nam.</p>
    </>}
    {own && <section className="ranking-own" aria-label="Xếp hạng của bạn"><div><strong>Hạng của bạn: #{own.rank} · {own.exp} EXP</strong><p>{ranking?.nextRankExp === null ? 'Bạn đang dẫn đầu bảng xếp hạng này.' : `Cần thêm ít nhất ${ranking?.nextRankExp} EXP để vượt hạng trên.`}</p></div><button onClick={() => setIsChatOpen(true)} aria-label="Mở trò chuyện cộng đồng"><MessageSquare size={20} /></button></section>}
    {ranking && !own && <section className="ranking-own"><div><strong>Bạn chưa có hạng trong khoảng thời gian này</strong><p>Hoàn thành thử thách để nhận EXP và tham gia cùng các thành viên VieN.</p></div><button onClick={() => setActiveTab('explore')} aria-label="Khám phá thử thách"><Trophy size={20} /></button></section>}
  </div>;
}
