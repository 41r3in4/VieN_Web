'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { PERSONAS } from '@/data/personas';
import { PersonaId } from '@/types';
import { X, CheckCircle2, ScrollText, Compass, Palette, Sparkles, Wrench } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';
import { useModalDialog } from './useModalDialog';

export const PersonaSelectModal: React.FC = () => {
  const {
    isPersonaModalOpen,
    setIsPersonaModalOpen,
    selectedPersona,
    setSelectedPersona,
    selectedDestinationId,
    setIsScannerOpen
  } = useHeritage();

  const dialog = useModalDialog(isPersonaModalOpen, () => setIsPersonaModalOpen(false), 'Chọn vai khám phá');
  if (!isPersonaModalOpen) return null;

  const handleSelect = (id: PersonaId) => {
    heritageAudio.playClick();
    setSelectedPersona(id);
  };

  const handleConfirm = () => {
    heritageAudio.playSuccessChime();
    setIsPersonaModalOpen(false);
    // If entered via destination journey, launch the scanner!
    if (selectedDestinationId) {
      setIsScannerOpen(true);
    }
  };

  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'historian':
        return <ScrollText className="w-6 h-6 text-[#C83C23]" />;
      case 'explorer':
        return <Compass className="w-6 h-6 text-[#1E4D3B]" />;
      case 'artisan':
        return <Palette className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <div {...dialog} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#C83C23] to-[#8C2614] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hệ Thống Nhập Vai Di Sản</span>
            </div>
            <h2 className="font-serif text-lg font-bold">Chọn Thân Phận Khám Phá</h2>
          </div>
          <button
            onClick={() => setIsPersonaModalOpen(false)}
            type="button" aria-label="Đóng chọn vai" data-dialog-close
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Philosophy alert */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200/60 text-[12px] text-amber-900 leading-tight">
          💡 <span className="font-bold">Đặc quyền vai diễn:</span> Mỗi thân phận sở hữu công cụ độc quyền, thay đổi góc nhìn hiện vật, câu đố và manh mối giải mã.
        </div>

        {/* Persona list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {PERSONAS.map((p) => {
            const isSelected = selectedPersona === p.id;

            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C83C23] bg-white shadow-md ring-2 ring-[#C83C23]/20'
                    : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                }`}
              >
                {/* Active checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[#C83C23]">
                    <CheckCircle2 className="w-5 h-5 fill-[#C83C23] text-white" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 shadow-sm shrink-0">
                    {getPersonaIcon(p.id)}
                  </div>

                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-[#1A1615]">
                        {p.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 font-medium text-stone-700">
                        {p.id === 'historian' ? 'Hán-Nôm' : p.id === 'explorer' ? 'Địa Lý' : 'Kiến Trúc'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 italic mt-0.5">
                      &ldquo;{p.tagline}&rdquo;
                    </p>

                    <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Dedicated Tool & Perk */}
                    <div className="mt-2.5 pt-2 border-t border-stone-200/80 space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-stone-800 font-semibold">
                        <Wrench className="w-3.5 h-3.5 text-[#C83C23]" />
                        <span>Công cụ: <span className="text-[#C83C23] font-bold">{p.toolName}</span></span>
                      </div>
                      <div className="text-emerald-800 font-medium pl-5">
                        ✦ {p.bonusPerk}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Có thể đổi vai diễn bất kỳ lúc nào
          </div>
          <button
            onClick={handleConfirm}
            className="py-2.5 px-6 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-sm shadow-md transition transform active:scale-95"
          >
            Xác Nhận Nhập Vai
          </button>
        </div>
      </div>
    </div>
  );
};
