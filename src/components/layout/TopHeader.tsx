'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Volume2, VolumeX, Sparkles, Smartphone, Monitor, Flame } from 'lucide-react';
import { PERSONAS } from '@/data/personas';

export const TopHeader: React.FC = () => {
  const {
    userExp,
    userLevel,
    userStreak,
    isSoundMuted,
    toggleSound,
    isAmbientPlaying,
    toggleAmbientAudio,
    viewMode,
    setViewMode,
    selectedPersona,
    setIsPersonaModalOpen
  } = useHeritage();

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];
  const nextLevelExp = userLevel * 500;
  const currentLevelBaseExp = (userLevel - 1) * 500;
  const expProgressPercent = Math.min(
    100,
    Math.max(0, Math.round(((userExp - currentLevelBaseExp) / (nextLevelExp - currentLevelBaseExp)) * 100))
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E8DFC8] px-3 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Persona badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#C83C23] text-[#FAF7F2] font-serif font-black text-base shadow-sm ring-1 ring-[#D4AF37]/70">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-lg text-[#1A1615] tracking-tight">VieN</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#8C532B] font-bold border border-[#D4AF37]/40">
                Di Sản
              </span>
            </div>
            {/* Clickable persona selector */}
            <button
              onClick={() => setIsPersonaModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-[#C83C23] hover:underline font-medium text-left min-h-5"
              title="Đổi vai diễn"
            >
              <span>{currentPersona.title}</span>
              <span className="text-[9px] text-[#D4AF37]">▼</span>
            </button>
          </div>
        </div>

        {/* Center / Right: EXP, Streak & Audio Controls */}
        <div className="flex items-center gap-1.5">
          {/* Daily Streak */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold"
            title={`Chuỗi ${userStreak} ngày liên tục khám phá`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
            <span>{userStreak}d</span>
          </div>

          {/* Level & EXP pill */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#1A1615]">
              <span className="text-[#C83C23]">Lv.{userLevel}</span>
              <span className="text-[#D4AF37]">★</span>
              <span className="font-mono text-[10px] text-stone-600">{userExp} EXP</span>
            </div>
            {/* Progress bar */}
            <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#C83C23] to-[#D4AF37] transition-all duration-500"
                style={{ width: `${expProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Audio toggle */}
          <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
            <button
              onClick={toggleAmbientAudio}
              className={`p-2 rounded-xl border transition-colors ${
                isAmbientPlaying
                  ? 'bg-[#1E4D3B] text-emerald-100 border-[#1E4D3B]'
                  : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title={isAmbientPlaying ? 'Tắt nhạc nền thiền' : 'Bật nhạc nền sáo trúc cổ'}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAmbientPlaying ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-white/80 border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
              title={isSoundMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
            >
              {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#C83C23]" />}
            </button>

            {/* View Mode Switcher (Desktop toggle) */}
            <button
              onClick={() => setViewMode(viewMode === 'mobile' ? 'responsive' : 'mobile')}
              className="hidden sm:flex p-2 rounded-xl bg-white/80 border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
              title={viewMode === 'mobile' ? 'Mở rộng toàn màn hình' : 'Chuyển sang khung điện thoại'}
            >
              {viewMode === 'mobile' ? (
                <Monitor className="w-3.5 h-3.5 text-stone-600" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-[#C83C23]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
