'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { useModalDialog } from './useModalDialog';
import { Sparkles, Award, ArrowRight, ShieldCheck, MountainSnow, ScrollText, X } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const RewardUnlockModal: React.FC = () => {
  const { rewardModalData, closeRewardModal, setActiveTab, setSelectedDestinationId } = useHeritage();

  const dialog = useModalDialog(!!rewardModalData, closeRewardModal, 'Kết quả thử thách');
  if (!rewardModalData) return null;

  const handleGoToJourney = () => {
    heritageAudio.playClick();
    closeRewardModal();
    setSelectedDestinationId(null);
    setActiveTab('journey');
  };

  const getBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-12 h-12 text-[#D4AF37]" />;
      case 'MountainSnow':
        return <MountainSnow className="w-12 h-12 text-[#D4AF37]" />;
      default:
        return <ScrollText className="w-12 h-12 text-[#D4AF37]" />;
    }
  };

  return (
    <div {...dialog} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
      <div className="relative w-full max-w-sm bg-[#FAF7F2] rounded-3xl border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)] overflow-hidden text-center p-6 pt-14 space-y-4">
        <button type="button" onClick={closeRewardModal} aria-label="Đóng kết quả thử thách" data-dialog-close className="absolute top-2 right-2 p-2 rounded-full bg-stone-800 text-white"><X className="w-5 h-5" /></button>
        {/* Top Header Star */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-stone-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Thành Tựu Di Sản Mới</span>
        </div>

        {/* Badge Medal / Emblem */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-[#1A1615] via-stone-800 to-[#C83C23] border-4 border-[#D4AF37] flex items-center justify-center shadow-xl">
          <div className="absolute -inset-2 rounded-full border border-[#D4AF37]/40 animate-ping opacity-30" />
          {rewardModalData.badge ? (
            getBadgeIcon(rewardModalData.badge.icon)
          ) : (
            <Award className="w-12 h-12 text-[#D4AF37]" />
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <h3 className="font-serif font-black text-xl text-[#1A1615]">
            {rewardModalData.title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {rewardModalData.subtitle}
          </p>
        </div>

        {/* EXP Reward Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm">
          <span>+{rewardModalData.exp} EXP</span>
          <span className="text-xs text-stone-500 font-normal">đã ghi nhận</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleGoToJourney}
            className="w-full py-3 px-4 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Xem Ngay Trong Mạch Sử</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={closeRewardModal}
            className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition"
          >
            Tiếp Tục Khám Phá
          </button>
        </div>
      </div>
    </div>
  );
};
