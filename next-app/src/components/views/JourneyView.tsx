'use client';

import React, { useState } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { PERSONAS } from '@/data/personas';
import {
  ScrollText,
  Calendar,
  Award,
  Sparkles,
  Share2,
  CheckCircle,
  Clock,
  Compass,
  Palette,
  ShieldCheck,
  MountainSnow
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const JourneyView: React.FC = () => {
  const { journeyEntries, userExp, userLevel, selectedPersona, setActiveTab } = useHeritage();
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const persona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const handleSharePassport = () => {
    heritageAudio.playClick();
    setShowShareModal(true);
  };

  return (
    <div className="space-y-4 p-3.5 pb-24 parchment-texture">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1A1615] via-stone-900 to-[#C83C23] text-white shadow-xl border border-[#D4AF37]/50 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
              <ScrollText className="w-3.5 h-3.5" />
              <span>Sổ Tay Điền Dã & Niên Biểu</span>
            </div>
            <h2 className="font-serif font-black text-xl text-[#FAF7F2] mt-0.5">
              Mạch Sử Hành Trình
            </h2>
            <p className="text-xs text-stone-300">
              Lưu giữ mọi dấu ấn khảo sát, văn bia và chứng nhận di sản của bạn
            </p>
          </div>
        </div>
      </div>

      {/* CULTURAL PASSPORT / EXPEDITION CERTIFICATE CARD */}
      <div className="p-4 rounded-3xl bg-white border-2 border-[#D4AF37] shadow-md relative overflow-hidden space-y-3">
        {/* Seal stamp watermark */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 border-dashed border-[#C83C23]/20 flex items-center justify-center rotate-12 pointer-events-none">
          <span className="font-serif font-black text-xs text-[#C83C23]/30 uppercase">
            VieN · Thực Địa
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#C83C23] text-white flex items-center justify-center font-serif font-bold text-base shadow">
              V
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                Hộ Chiếu Văn Hóa Số
              </span>
              <h3 className="font-serif font-bold text-sm text-stone-900">
                Du Khách Tinh Hoa (Cấp {userLevel})
              </h3>
            </div>
          </div>

          <button
            onClick={handleSharePassport}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#8C532B] border border-amber-200 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C83C23]" />
            <span>Chia sẻ thẻ</span>
          </button>
        </div>

        {/* Passport Details Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center text-xs">
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-400 block">Vai diễn</span>
            <span className="font-bold text-[#C83C23] line-clamp-1">{persona.title}</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-400 block">Tổng EXP</span>
            <span className="font-mono font-bold text-stone-900">{userExp}</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-400 block">Trạm đã vượt</span>
            <span className="font-bold text-emerald-700">{journeyEntries.length} trạm</span>
          </div>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-sm text-[#1A1615]">
          Dòng Thời Gian Khám Phá
        </h3>

        {journeyEntries.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
            <ScrollText className="w-12 h-12 text-stone-300 mx-auto" />
            <h4 className="font-serif font-bold text-base text-stone-800">
              Chưa có ghi chép trong Mạch Sử
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Hãy bắt đầu hành trình khảo sát đầu tiên tại Đình làng Hải Châu hoặc Ngũ Hành Sơn!
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="py-2 px-5 rounded-full bg-[#C83C23] text-white text-xs font-bold hover:bg-[#a62f1a] transition"
            >
              Đến Trang Khám Phá
            </button>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#C83C23] before:via-[#D4AF37] before:to-stone-300">
            {journeyEntries.map((entry) => (
              <div key={entry.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#C83C23] shadow-sm group-hover:scale-125 transition-transform" />

                {/* Entry Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-[#D4AF37] transition space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {entry.timestamp}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold font-mono">
                      +{entry.expGained} EXP
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#C83C23] font-bold uppercase tracking-wider block">
                      {entry.destinationName}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      {entry.checkpointName}
                    </h4>
                  </div>

                  {/* Reflection observation */}
                  <p className="text-xs text-stone-700 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                    &ldquo;{entry.reflection}&rdquo;
                  </p>

                  {/* Meta tag chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                      Vai diễn: {entry.personaUsed === 'historian' ? 'Sử Gia' : entry.personaUsed === 'explorer' ? 'Thám Hiểm' : 'Nghệ Nhân'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                      Quiz: {entry.quizScore}
                    </span>
                    {entry.badgeEarned && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#D4AF37]" />
                        {entry.badgeEarned}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHAREABLE SOUVENIR CARD MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm bg-[#FAF7F2] rounded-3xl border-2 border-[#D4AF37] p-5 shadow-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thẻ Chứng Nhận Di Sản Việt Nam</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-300 shadow-inner space-y-3 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1A1615]">
                    VieN Heritage Passport
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Mã xác thực: VN-HERITAGE-2026
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#C83C23] text-white flex items-center justify-center font-serif font-black text-sm">
                  V
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 text-xs text-amber-950 font-serif leading-relaxed">
                Chứng nhận du khách đã hoàn thành khảo sát thực địa tại các di tích tiền hiền xứ Quảng Đà.
              </div>

              <div className="flex justify-between text-xs text-stone-700 pt-1 font-mono">
                <span>Cấp: Lv.{userLevel}</span>
                <span>EXP: {userExp}</span>
                <span>Huy hiệu: {journeyEntries.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  heritageAudio.playSuccessChime();
                  setShowShareModal(false);
                }}
                className="w-full py-2.5 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow transition"
              >
                Tải Xuống / Sao Chép Liên Kết
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
