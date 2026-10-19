'use client';

import React, { ReactNode } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

export const MobileFrameWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { viewMode, setViewMode } = useHeritage();

  if (viewMode === 'responsive') {
    return (
      <div className="experience-responsive min-h-screen bg-[#FAF7F2] text-[#1A1615] flex flex-col items-center">
        {/* Top desktop banner with switcher */}
        <div className="w-full bg-[#1A1615] text-[#FAF7F2] py-1 px-4 text-xs flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Chế độ Xem Mở Rộng Desktop</span>
          </div>
          <button
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#C83C23] text-white hover:bg-[#a62f1a] font-medium transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Chuyển sang Khung Điện Thoại Mobile-First</span>
          </button>
        </div>

        <div className="experience-responsive-content w-full min-h-screen pb-20 shadow-xl bg-[#FAF7F2] relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4">
      {/* Desktop view switcher tip */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 text-stone-400 text-xs px-2">
        <div className="flex items-center gap-1.5 text-stone-300">
          <Smartphone className="w-4 h-4 text-[#C83C23]" />
          <span className="font-medium">Mô phỏng Mobile-First (iPhone 16 Pro)</span>
        </div>
        <button
          onClick={() => setViewMode('responsive')}
          className="flex items-center gap-1 text-[#D4AF37] hover:underline"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Mở rộng Desktop</span>
        </button>
      </div>

      {/* Phone chassis */}
      <div className="w-full sm:max-w-md h-screen sm:h-[844px] bg-[#FAF7F2] sm:rounded-[42px] sm:ring-12 sm:ring-stone-800 shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-4 sm:border-stone-700">
        {/* Phone Dynamic Island / Status Bar */}
        <div className="bg-[#FAF7F2] pt-2 px-6 pb-1 flex items-center justify-between text-xs text-stone-700 font-semibold select-none z-50 shrink-0">
          <span>09:41</span>
          {/* Dynamic Island */}
          <div className="w-24 h-5 bg-stone-950 rounded-full flex items-center justify-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-800 ring-1 ring-stone-700" />
            <div className="w-2 h-2 rounded-full bg-blue-900/60" />
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-20 relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-400 rounded-full z-50 pointer-events-none opacity-60" />
      </div>
    </div>
  );
};
