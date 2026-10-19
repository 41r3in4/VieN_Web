'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { useMedia } from '@/context/MediaContext';
import { HIDDEN_LORES } from '@/data/hiddenLoreData';
import {
  X,
  Play,
  MapPin,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  MountainSnow
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';
import { useModalDialog } from './useModalDialog';

export const DestinationDetailModal: React.FC = () => {
  const { destinations: DESTINATIONS,catalog,openMediaEditor } = useMedia();
  const {
    selectedDestinationId,
    setSelectedDestinationId,
    openTrailer,
    setIsPersonaModalOpen,
    completedCheckpointIds,
    startQuest,
    openLore,
    unlockedLoreIds
  } = useHeritage();

  const dialog = useModalDialog(!!selectedDestinationId, () => setSelectedDestinationId(null), 'Chi tiết điểm đến');
  if (!selectedDestinationId) return null;

  const destination = DESTINATIONS.find((d) => d.id === selectedDestinationId);
  if (!destination) return null;

  const hiddenLore = HIDDEN_LORES.find((l) => l.id === destination.hiddenLoreId);
  const isLoreUnlocked = destination.hiddenLoreId ? unlockedLoreIds.includes(destination.hiddenLoreId) : false;

  const completedCount = destination.checkpoints.filter((cp) =>
    completedCheckpointIds.includes(cp.id)
  ).length;
  const progressPercent = Math.round((completedCount / destination.totalCheckpoints) * 100);

  const handleStartExpedition = () => {
    heritageAudio.playClick();
    setIsPersonaModalOpen(true);
  };

  const getBadgeIcon = () => {
    if (destination.id === 'dinh-hai-chau') {
      return <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />;
    }
    return <MountainSnow className="w-5 h-5 text-[#D4AF37]" />;
  };

  return (
    <div {...dialog} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cover Hero with Glassmorphism Trailer Button */}
        <div className="relative h-56 shrink-0 bg-stone-900">
          <img
            src={destination.coverImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

          {/* Close Button */}
          <button
            type="button"
            aria-label="Đóng chi tiết điểm đến"
            data-dialog-close
            onClick={() => setSelectedDestinationId(null)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Location & Era */}
          <div className="pointer-events-none absolute top-3 left-3 right-16 flex flex-wrap gap-1.5 z-10">
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-[#FAF7F2] backdrop-blur-md border border-white/20">
              <MapPin className="w-3 h-3 text-[#C83C23]" />
              <span>{destination.location}</span>
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#D4AF37]/90 text-stone-950">
              {destination.era}
            </span>
          </div>

          {/* Floating Glassmorphism Button: "🎬 Xem Trailer Thuyết Minh (1:15)" */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-serif font-black text-xl text-white leading-tight drop-shadow-md">
                {destination.name}
              </h2>
              <p className="text-xs text-stone-300 drop-shadow line-clamp-1">
                {destination.tagline}
              </p>
            </div>

            <button
              onClick={() => openTrailer(destination.id)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/25 hover:bg-white/35 text-white text-xs font-bold backdrop-blur-md border border-white/40 shadow-lg transition transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Xem trailer</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {catalog.isAdmin && <button type="button" className="media-manage-button" onClick={() => openMediaEditor(destination.id)}>Quản lý ảnh/video điểm đến</button>}
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Tiến độ</span>
              <span className="text-xs font-bold text-[#C83C23]">
                {completedCount}/{destination.totalCheckpoints} trạm ({progressPercent}%)
              </span>
            </div>
            <div className="p-2 rounded-xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Thời lượng</span>
              <span className="text-xs font-bold text-stone-800 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                {destination.stats.recommendedTime}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Phần thưởng</span>
              <span className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-amber-600" />
                +{destination.stats.expTotal} EXP
              </span>
            </div>
          </div>

          {/* Historical Narrative */}
          <div className="space-y-1.5">
            <h3 className="font-serif font-bold text-sm text-[#1A1615]">
              Câu Chuyện Di Tích
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-2xl border border-stone-200">
              {destination.story}
            </p>
          </div>

          {/* Checkpoints Sequence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#1A1615]">
                Các Trạm Khám Phá Thực Địa
              </h3>
              <span className="text-[11px] text-stone-500">Mở không cần tuần tự</span>
            </div>

            <div className="space-y-2">
              {destination.checkpoints.map((cp) => {
                const isDone = completedCheckpointIds.includes(cp.id);

                return (
                  <div
                    key={cp.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : cp.order}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {cp.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">
                          {cp.shortDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => startQuest(destination.id, cp.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#C83C23] text-white hover:bg-[#a62f1a]'
                      }`}
                    >
                      {isDone ? 'Khảo sát lại' : 'Khám phá'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badge & Locked Hidden Lore Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center gap-2">
              {getBadgeIcon()}
              <div>
                <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block">
                  Huy hiệu chứng nhận di tích
                </span>
                <h4 className="text-xs font-bold text-stone-900">
                  {destination.badgeName}
                </h4>
              </div>
            </div>
            <p className="text-[11px] text-stone-600">
              {destination.badgeDescription}
            </p>

            {/* Secret Hidden Lore Teaser */}
            {hiddenLore && (
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className={`w-3.5 h-3.5 ${isLoreUnlocked ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span className="text-[11px] font-bold text-stone-800">
                    {isLoreUnlocked ? 'Đã mở khóa Bí Mật' : 'Bí Ẩn Ẩn Giấu (100% Hoàn Thành)'}
                  </span>
                </div>
                {isLoreUnlocked ? (
                  <button
                    onClick={() => openLore(hiddenLore)}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#D4AF37] text-stone-900 font-bold hover:bg-[#c29f2f]"
                  >
                    Xem tài liệu cổ
                  </button>
                ) : (
                  <span className="text-[10px] text-stone-400 font-medium">Đang khóa 🔒</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-600">
            <span className="font-bold text-[#C83C23]">VieN Heritage</span>: Tự do khám phá
          </div>

          <button
            onClick={handleStartExpedition}
            className="flex items-center gap-1.5 py-2.5 px-6 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow-md transition transform active:scale-95"
          >
            <span>Bắt Đầu Hành Trình</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
