'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { ALL_BADGES } from '@/data/leaderboardData';
import { PERSONAS } from '@/data/personas';
import {
  User,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  MountainSnow,
  ScrollText,
  Compass,
  Palette,
  Flame,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';
import { AccountPanel } from '@/components/auth/AccountPanel';
import { authClient } from '@/lib/auth-client';
import { DESTINATIONS } from '@/data/destinations';
import { useModalDialog } from '@/components/experience/useModalDialog';

export const ProfileView: React.FC = () => {
  const { data: session } = authClient.useSession();
  const {
    userExp,
    userLevel,
    userStreak,
    selectedPersona,
    setIsPersonaModalOpen,
    unlockedBadgeIds,
    completedCheckpointIds,
    listenedCheckpointIds,
    watchedDestinationIds,
    challengeScore,
    challengeTotal,
    isSoundMuted,
    toggleSound,
    isAmbientPlaying,
    toggleAmbientAudio,
    resetProgress
  } = useHeritage();

  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<string | null>(null);
  const badgeDialog = useModalDialog(!!selectedBadgeDetail, () => setSelectedBadgeDetail(null), 'Chi tiết huy hiệu');

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const handleReset = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ thám hiểm và EXP?')) {
      resetProgress();
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />;
      case 'MountainSnow':
        return <MountainSnow className="w-6 h-6 text-[#D4AF37]" />;
      case 'ScrollText':
        return <ScrollText className="w-6 h-6 text-[#D4AF37]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#D4AF37]" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-[#D4AF37]" />;
      default:
        return <Flame className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="experience-view space-y-4 p-3.5 pb-24 parchment-texture">
      <AccountPanel />
      {/* USER PROFILE CARD */}
      <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-md relative overflow-hidden space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={session?.user.image || '/avatar-default.svg'}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#C83C23] text-white text-[9px] font-bold font-mono">
              Lv.{userLevel}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif font-black text-lg text-stone-900">
                {session?.user.name || 'Thành viên VieN'}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                Khai Phá Giả
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-0.5">
              Thành viên VieN · Hành trình di sản của bạn
            </p>

            <button
              onClick={() => setIsPersonaModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-[#C83C23] font-semibold mt-1 hover:underline"
            >
              <span>Vai diễn: {currentPersona.title}</span>
              <span>(Đổi)</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center text-xs">
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-400 block">Kinh nghiệm</span>
            <span className="font-mono font-bold text-[#C83C23]">{userExp} EXP</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-400 block">Huy hiệu</span>
            <span className="font-mono font-bold text-amber-700">
              {unlockedBadgeIds.length}/{ALL_BADGES.length}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-400 block">Chuỗi khảo sát</span>
            <span className="font-mono font-bold text-emerald-700">{userStreak} ngày</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200"><span className="text-[10px] text-stone-400 block">Trạm đã hoàn thành</span><span className="font-mono font-bold text-[#C83C23]">{completedCheckpointIds.length}/{DESTINATIONS.reduce((sum, d) => sum + d.checkpoints.length, 0)}</span></div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200"><span className="text-[10px] text-stone-400 block">Câu trả lời đúng</span><span className="font-mono font-bold text-[#C83C23]">{challengeScore}/{challengeTotal}</span></div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200"><span className="text-[10px] text-stone-400 block">Thuyết minh đã nghe</span><span className="font-mono font-bold text-[#C83C23]">{listenedCheckpointIds.length}</span></div>
        </div>
      </div>

      <section className="profile-activity" aria-label="Hoạt động di sản"><h3>Hoạt động của bạn</h3><p>{watchedDestinationIds.length} trailer đã xem · cập nhật tự động khi hoàn thành.</p>{DESTINATIONS.map(destination => <div key={destination.id}><h4>{destination.name}</h4>{destination.checkpoints.map(checkpoint => <div className="profile-activity-row" key={checkpoint.id}><span>{checkpoint.name}</span><span>{listenedCheckpointIds.includes(checkpoint.id) ? '♫ Đã nghe' : 'Chưa nghe'}</span><span>{completedCheckpointIds.includes(checkpoint.id) ? '✓ Đã hoàn thành' : 'Chưa hoàn thành'}</span></div>)}</div>)}</section>

      {/* BADGE SHOWCASE GRID */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-[#1A1615]">
            Bộ Sưu Tập Huy Hiệu Di Sản
          </h3>
          <span className="text-[11px] text-stone-500">
            {unlockedBadgeIds.length} đã mở khóa
          </span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadgeDetail(badge.id)}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isUnlocked
                    ? 'bg-white border-[#D4AF37]/60 shadow-sm hover:shadow-md'
                    : 'bg-stone-100 border-stone-200 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition ${
                    isUnlocked
                      ? 'bg-amber-50 border-[#D4AF37] shadow-inner'
                      : 'bg-stone-200 border-stone-300'
                  }`}
                >
                  {isUnlocked ? (
                    getBadgeIcon(badge.icon)
                  ) : (
                    <Lock className="w-5 h-5 text-stone-400" />
                  )}
                </div>

                <span className="font-serif font-bold text-[11px] text-stone-900 line-clamp-1 leading-tight">
                  {badge.title}
                </span>

                <span
                  className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded ${
                    isUnlocked
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {badge.tier}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* BADGE DETAIL POPUP MODAL */}
      {selectedBadgeDetail && (
        <div {...badgeDialog} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          {(() => {
            const badge = ALL_BADGES.find((b) => b.id === selectedBadgeDetail);
            if (!badge) return null;
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div className="w-full max-w-xs bg-[#FAF7F2] rounded-3xl border-2 border-[#D4AF37] p-5 shadow-2xl text-center space-y-3">
                <div className="w-16 h-16 rounded-full mx-auto bg-amber-50 border-2 border-[#D4AF37] flex items-center justify-center shadow">
                  {getBadgeIcon(badge.icon)}
                </div>

                <h4 className="font-serif font-bold text-base text-stone-900">
                  {badge.title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {badge.description}
                </p>

                <div className="p-2 rounded-xl bg-stone-100 text-xs font-semibold text-stone-700">
                  Trạng thái:{' '}
                  <span className={isUnlocked ? 'text-emerald-700' : 'text-stone-500'}>
                    {isUnlocked ? '✦ Đã đạt được' : '🔒 Chưa mở khóa'}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedBadgeDetail(null)}
                  className="w-full py-2 rounded-full bg-[#C83C23] text-white text-xs font-bold transition"
                >
                  Đóng
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* AUDIO & APP SETTINGS */}
      <div className="space-y-2">
        <h3 className="font-serif font-bold text-sm text-[#1A1615]">
          Cài Đặt Ứng Dụng
        </h3>

        <div className="rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100 text-xs">
          {/* Sound FX */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#C83C23]" />}
              <div>
                <span className="font-bold text-stone-800 block">Hiệu ứng âm thanh</span>
                <span className="text-[11px] text-stone-500">Tiếng chuông cổ, quét QR, haptic</span>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                !isSoundMuted ? 'bg-[#C83C23]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  !isSoundMuted ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Ambient Music */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="font-bold text-stone-800 block">Nhạc thiền không gian</span>
                <span className="text-[11px] text-stone-500">Sóng âm ngũ cung truyền thống</span>
              </div>
            </div>
            <button
              onClick={toggleAmbientAudio}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                isAmbientPlaying ? 'bg-emerald-700' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAmbientPlaying ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Progress */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-500" />
              <div>
                <span className="font-bold text-red-600 block">Đặt lại tiến độ</span>
                <span className="text-[11px] text-stone-500">Xóa dữ liệu lưu và làm lại từ đầu</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 transition"
            >
              Đặt Lại
            </button>
          </div>
        </div>
      </div>

      {/* CORE PHILOSOPHY QUOTE CARD */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1.5">
        <span className="font-serif font-black text-xs text-[#C83C23] tracking-widest uppercase block">
          VieN Platform · Triết Lý Cốt Lõi
        </span>
        <p className="font-serif italic text-xs text-stone-700 max-w-sm mx-auto leading-relaxed">
          &ldquo;Công nghệ giúp con người trải nghiệm văn hóa, không thay thế văn hóa.&rdquo;
        </p>
        <span className="text-[10px] text-stone-400 block pt-1">
          Phiên bản 1.0.0 · Bản quyền Di Sản Số Việt Nam
        </span>
      </div>
    </div>
  );
};
