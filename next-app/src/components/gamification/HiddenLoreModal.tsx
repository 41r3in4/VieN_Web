'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { X, Sparkles, Scroll, BookOpen, ShieldAlert } from 'lucide-react';

export const HiddenLoreModal: React.FC = () => {
  const { activeLore, closeLore } = useHeritage();

  if (!activeLore) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Ancient Scroll Header */}
        <div className="p-4 bg-[#1A1615] text-[#FAF7F2] flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#C83C23] text-white">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider block">
                Tài Liệu Cổ Độc Quyền
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-stone-100 line-clamp-1 font-serif">
                {activeLore.ancientTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={closeLore}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parchment Styled Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 parchment-texture">
          {/* Certificate Stamp */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold text-amber-900">Chứng thư mật mã số hóa</span>
            </div>
            <span className="font-mono text-[10px] text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded">
              VIEN-ARCHIVE-01
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-black text-lg text-[#C83C23] leading-snug">
              {activeLore.title}
            </h3>
            <p className="text-[11px] text-stone-500 italic">
              Hiện vật liên kết: {activeLore.historicArtifact}
            </p>
          </div>

          {/* Secret paragraphs */}
          <div className="space-y-3 pt-2 border-t border-stone-200 text-stone-800 text-xs leading-relaxed font-serif">
            {activeLore.secretText.map((para, idx) => (
              <p key={idx} className="bg-white/70 p-3 rounded-xl border border-stone-200/80 shadow-sm">
                &ldquo;{para}&rdquo;
              </p>
            ))}
          </div>

          {/* Curator's Note */}
          <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 space-y-1">
            <div className="flex items-center gap-1 font-bold text-stone-800">
              <BookOpen className="w-3.5 h-3.5 text-[#C83C23]" />
              <span>Ghi chú của Ban Giám Tuyển:</span>
            </div>
            <p>{activeLore.curatorNote}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={closeLore}
            className="py-2 px-5 rounded-full bg-[#1A1615] hover:bg-stone-800 text-white font-bold text-xs transition"
          >
            Đóng Tài Liệu
          </button>
        </div>
      </div>
    </div>
  );
};
