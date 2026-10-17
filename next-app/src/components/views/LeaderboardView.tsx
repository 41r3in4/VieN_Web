'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { INITIAL_LEADERBOARD } from '@/data/leaderboardData';
import { Trophy, Crown, Sparkles, Award, ArrowUp, Flame, Shield } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const LeaderboardView: React.FC = () => {
  const { userExp, selectedPersona } = useHeritage();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  // Dynamically update user's EXP and rank in the leaderboard
  const dynamicLeaderboard = INITIAL_LEADERBOARD.map((u) => {
    if (u.isCurrentUser) {
      return {
        ...u,
        exp: userExp,
        role:
          selectedPersona === 'historian'
            ? 'Sử Gia Khai Phá'
            : selectedPersona === 'explorer'
            ? 'Thám Hiểm Tầm Bảo'
            : 'Nghệ Nhân Dân Lập'
      };
    }
    return u;
  }).sort((a, b) => b.exp - a.exp);

  // Recalculate ranks based on sorted EXP
  const rankedUsers = dynamicLeaderboard.map((user, idx) => ({
    ...user,
    rank: idx + 1
  }));

  const top1 = rankedUsers[0];
  const top2 = rankedUsers[1];
  const top3 = rankedUsers[2];
  const restUsers = rankedUsers.slice(3);

  const currentUser = rankedUsers.find((u) => u.isCurrentUser) || rankedUsers[6];

  const handleTimeframeChange = (tf: 'week' | 'month' | 'all') => {
    heritageAudio.playClick();
    setTimeframe(tf);
  };

  return (
    <div className="space-y-4 p-3.5 pb-36 parchment-texture relative">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1A1615] via-stone-900 to-[#C83C23] text-white shadow-xl border border-[#D4AF37]/50 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Bảng Vinh Danh Tiền Hiền</span>
            </div>
            <h2 className="font-serif font-black text-xl text-[#FAF7F2] mt-0.5">
              Bảng Xếp Hạng Di Sản
            </h2>
            <p className="text-xs text-stone-300">
              Vinh danh các nhà nghiên cứu & thám hiểm xuất sắc nhất
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe Filter Switcher */}
      <div className="flex rounded-2xl bg-white p-1 border border-stone-200 shadow-sm text-xs font-semibold">
        {[
          { id: 'week', label: 'Tuần này' },
          { id: 'month', label: 'Tháng này' },
          { id: 'all', label: 'Toàn thời gian' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleTimeframeChange(item.id as 'week' | 'month' | 'all')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              timeframe === item.id
                ? 'bg-[#C83C23] text-white shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TOP 3 PODIUM */}
      <div className="p-4 pt-6 rounded-3xl bg-gradient-to-b from-amber-50 to-white border border-[#D4AF37]/60 shadow-lg">
        <div className="flex items-end justify-center gap-2 sm:gap-4">
          {/* SILVER PODIUM (TOP 2) */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-stone-300 shadow-md">
                <img src={top2.avatar} alt={top2.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-1 rounded-full bg-stone-300 text-stone-800 shadow">
                <Crown className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="font-serif font-bold text-xs text-stone-900 text-center line-clamp-1">
              {top2.name}
            </span>
            <span className="text-[10px] text-stone-500 font-mono font-bold">
              {top2.exp} EXP
            </span>
            <div className="w-full h-24 bg-gradient-to-t from-stone-300 to-stone-200 rounded-t-2xl mt-2 flex flex-col items-center justify-center text-stone-700 font-black text-xl shadow-inner border-t border-white">
              <span>🥈</span>
              <span className="text-xs font-bold text-stone-600">Top 2</span>
            </div>
          </div>

          {/* GOLD PODIUM (TOP 1) */}
          <div className="flex flex-col items-center flex-1 -mt-4">
            <div className="relative mb-2">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl ring-4 ring-[#D4AF37]/30">
                <img src={top1.avatar} alt={top1.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-[#D4AF37] text-stone-950 shadow-lg animate-bounce">
                <Crown className="w-4 h-4 fill-amber-300" />
              </div>
            </div>
            <span className="font-serif font-black text-xs sm:text-sm text-[#1A1615] text-center line-clamp-1">
              {top1.name}
            </span>
            <span className="text-[11px] text-[#C83C23] font-mono font-bold">
              {top1.exp} EXP
            </span>
            <div className="w-full h-32 bg-gradient-to-t from-[#D4AF37] via-amber-300 to-amber-200 rounded-t-2xl mt-2 flex flex-col items-center justify-center text-amber-950 font-black text-2xl shadow-lg border-t-2 border-white">
              <span>🥇</span>
              <span className="text-xs font-black text-amber-900">Quán Quân</span>
            </div>
          </div>

          {/* BRONZE PODIUM (TOP 3) */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-600 shadow-md">
                <img src={top3.avatar} alt={top3.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-1 rounded-full bg-amber-700 text-white shadow">
                <Crown className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="font-serif font-bold text-xs text-stone-900 text-center line-clamp-1">
              {top3.name}
            </span>
            <span className="text-[10px] text-stone-500 font-mono font-bold">
              {top3.exp} EXP
            </span>
            <div className="w-full h-20 bg-gradient-to-t from-amber-700/60 to-amber-600/40 rounded-t-2xl mt-2 flex flex-col items-center justify-center text-amber-900 font-black text-lg shadow-inner border-t border-white">
              <span>🥉</span>
              <span className="text-xs font-bold text-amber-900">Top 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEADERBOARD LIST (RANKS 4+) */}
      <div className="space-y-2">
        <h3 className="font-serif font-bold text-sm text-stone-900 px-1">
          Bảng Hạng Chi Tiết
        </h3>

        <div className="space-y-1.5">
          {restUsers.map((user) => {
            const isMe = user.isCurrentUser;

            return (
              <div
                key={user.rank}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isMe
                    ? 'bg-amber-50 border-[#C83C23] shadow-md ring-2 ring-[#C83C23]/20'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono font-bold text-xs text-stone-500">
                    #{user.rank}
                  </span>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-200"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-xs text-stone-900">
                        {user.name}
                      </h4>
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C83C23] text-white font-bold">
                          Bạn
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-1">
                      {user.role} · {user.recentAchievement}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs text-[#C83C23] block">
                    {user.exp} EXP
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {user.badgesCount} huy hiệu
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKY PERSONAL RANK FOOTER */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-3 py-2.5 z-30">
        <div className="p-3 rounded-2xl bg-[#1A1615] text-white border-2 border-[#D4AF37] shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C83C23] text-white flex items-center justify-center font-bold text-xs font-mono ring-1 ring-[#D4AF37]">
              #{currentUser.rank}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xs text-[#FAF7F2]">
                  Hạng của bạn: #{currentUser.rank}
                </span>
                <span className="text-[10px] text-[#D4AF37] font-mono font-bold">
                  • {currentUser.exp} EXP
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                Thăng lên Top {Math.max(1, currentUser.rank - 1)} sau +150 EXP nữa!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>+2 bậc</span>
          </div>
        </div>
      </div>
    </div>
  );
};
