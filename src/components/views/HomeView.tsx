'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { useMedia } from '@/context/MediaContext';
import { PERSONAS } from '@/data/personas';
import { HIDDEN_LORES } from '@/data/hiddenLoreData';
import {
  Play,
  QrCode,
  MapPin,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MountainSnow,
  Lock,
  ChevronRight,
  Flame,
  Wrench
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const HomeView: React.FC = () => {
  const { destinations: DESTINATIONS,catalog,openMediaEditor } = useMedia();
  const {
    openTrailer,
    setSelectedDestinationId,
    setIsPersonaModalOpen,
    setIsScannerOpen,
    selectedPersona,
    getDestinationProgress,
    openLore,
    unlockedLoreIds,
    setActiveTab
  } = useHeritage();

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const handleOpenDestination = (id: string) => {
    heritageAudio.playClick();
    setSelectedDestinationId(id);
  };

  return (
    <div className="experience-view heritage-home space-y-5 p-3.5 pb-24 parchment-texture">
      {/* PHILOSOPHY & TAGLINE BANNER */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1A1615] via-stone-900 to-[#C83C23] text-white shadow-xl border border-[#D4AF37]/40 relative overflow-hidden">
        {/* Background bronze lotus motif */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Nền Tảng Di Sản Tương Tác 4.0</span>
          </div>

          <h1 className="font-serif font-black text-xl sm:text-2xl text-[#FAF7F2] leading-tight">
            Một nền tảng · Nhiều điểm đến · Mỗi nơi một câu chuyện.
          </h1>

          <p className="text-xs text-stone-300 italic leading-relaxed pt-1">
            &ldquo;Công nghệ giúp con người trải nghiệm văn hóa, không thay thế văn hóa.&rdquo;
          </p>
        </div>
      </div>

      {/* HERO DESTINATION SHOWCASE WITH CINEMATIC TRAILER BUTTON */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 group">
        <div className="relative h-60 sm:h-72 w-full bg-stone-900">
          <img
            src={DESTINATIONS[0].coverImage}
            alt="Đình Làng Hải Châu Trailer Banner"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Era pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#C83C23] text-white text-[11px] font-bold shadow">
              Tiêu Điểm Di Sản
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/60 text-[#FAF7F2] text-[11px] font-semibold backdrop-blur-md border border-white/20">
              Đà Nẵng
            </span>
          </div>

          {/* Floating Glassmorphism Button: "🎬 Xem Trailer Thuyết Minh (1:15)" */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => openTrailer('dinh-hai-chau')}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md border border-white/40 shadow-xl transition transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Xem trailer thuyết minh</span>
            </button>
          </div>

          {/* Bottom Title & Actions */}
          <div className="absolute bottom-3 left-3 right-3 z-10 space-y-2">
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-white leading-tight drop-shadow-md">
                Đình làng Hải Châu
              </h2>
              <p className="text-xs text-stone-200 line-clamp-1 drop-shadow">
                400 năm lịch sử · 42 tộc họ tiền hiền · 12 đạo sắc phong triều Nguyễn
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleOpenDestination('dinh-hai-chau')}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Bắt Đầu Khám Phá</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition"
                title="Quét QR thực địa"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROLEPLAY PERSONA QUICK SWITCHER STRIP */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shrink-0">
            {currentPersona.id === 'historian' ? '📜' : currentPersona.id === 'explorer' ? '🔍' : '🎨'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                Thân Phận Của Bạn
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                Kích hoạt
              </span>
            </div>
            <h3 className="font-serif font-bold text-sm text-[#1A1615]">
              {currentPersona.title}
            </h3>
            <p className="text-[11px] text-stone-500 line-clamp-1">
              Công cụ: {currentPersona.toolName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPersonaModalOpen(true)}
          className="text-xs px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#C83C23] font-bold border border-stone-200 transition shrink-0"
        >
          Đổi Vai
        </button>
      </div>

      {/* MULTI-DESTINATION NON-LINEAR SELECTION CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#1A1615]">
              Các Điểm Đến Di Sản Nổi Bật
            </h3>
            <p className="text-xs text-stone-500">
              Tự do lựa chọn khám phá không cần theo thứ tự cố định
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-bold text-[#C83C23] hover:underline flex items-center gap-0.5"
          >
            <span>Tất cả</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DESTINATIONS.map((dest) => {
            const { completedCount, totalCount, percentage, isFullyCompleted } =
              getDestinationProgress(dest.id);

            return (
              <div
                key={dest.id}
                onClick={() => handleOpenDestination(dest.id)}
                className="rounded-3xl bg-white border border-stone-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer group"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges / Era */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                      {dest.era}
                    </span>
                  </div>

                  {/* Trailer button on card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTrailer(dest.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-[#C83C23] text-white backdrop-blur-md transition"
                    title="Xem trailer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-serif font-bold text-base text-[#FAF7F2]">
                      {dest.name}
                    </h4>
                    <p className="text-[11px] text-stone-300 line-clamp-1">
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Meta & Progress */}
                <div className="p-3.5 space-y-2.5">
                  {catalog.isAdmin && <button type="button" className="media-card-edit" onClick={event => { event.stopPropagation(); openMediaEditor(dest.id); }}>Thay ảnh / tải video</button>}
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#C83C23]" />
                      {dest.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-700 text-[11px]">
                      <Award className="w-3 h-3 text-amber-500" />
                      +{dest.stats.expTotal} EXP
                    </span>
                  </div>

                  {/* Progress meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-stone-700">
                        Tiến độ: {completedCount}/{totalCount} trạm
                      </span>
                      <span className={isFullyCompleted ? 'text-emerald-700' : 'text-[#C83C23]'}>
                        {isFullyCompleted ? 'Đã hoàn thành 100%' : `${percentage}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C83C23] to-[#D4AF37] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Badge & Lore Teaser */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                    <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                      {dest.id === 'dinh-hai-chau' ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      ) : (
                        <MountainSnow className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                      <span>Huy hiệu: <strong>{dest.badgeName}</strong></span>
                    </div>
                    <span className="text-[#C83C23] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Chi tiết <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOCKED HIDDEN LORE SHOWCASE SECTION */}
      <div className="p-4 rounded-3xl bg-amber-50/90 border border-amber-300 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/30 text-stone-900">
              <Lock className="w-4 h-4 text-[#8C532B]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900">
                Kho Tàng Bí Mật Ẩn Giấu
              </h4>
              <p className="text-[11px] text-stone-600">
                Đạt 100% trạm hoặc điểm tuyệt đối Quiz để mở khóa
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {HIDDEN_LORES.map((lore) => {
            const isUnlocked = unlockedLoreIds.includes(lore.id);

            return (
              <div
                key={lore.id}
                onClick={() => (isUnlocked ? openLore(lore) : null)}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 hover:border-[#D4AF37] cursor-pointer shadow-sm'
                    : 'bg-stone-100/70 border-stone-200 opacity-80'
                }`}
              >
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 uppercase">
                    <span>{lore.ancientTitle}</span>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-stone-900 line-clamp-1 mt-0.5">
                    {lore.title}
                  </h5>
                  <p className="text-[10px] text-stone-500 line-clamp-1">
                    {isUnlocked ? 'Đã giải mã thành công!' : lore.requiredCondition}
                  </p>
                </div>

                <div className="shrink-0">
                  {isUnlocked ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D4AF37] text-stone-950 shadow-sm">
                      Mở Đọc
                    </span>
                  ) : (
                    <span className="p-1.5 rounded-full bg-stone-200 text-stone-500 inline-block">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {catalog.isAdmin && <aside className="media-admin-toolbar"><span>Quản trị ảnh/video</span>{DESTINATIONS.map(destination => <button type="button" key={destination.id} onClick={() => openMediaEditor(destination.id)}>{destination.name} · Chỉnh media</button>)}</aside>}
    </div>
  );
};
