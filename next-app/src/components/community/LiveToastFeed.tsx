'use client';

import React, { useState, useEffect } from 'react';
import { LIVE_TOAST_PRESETS } from '@/data/leaderboardData';
import { Sparkles, X } from 'lucide-react';

export const LiveToastFeed: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Initial toast after 4 seconds
    const initialTimer = setTimeout(() => {
      showRandomToast();
    }, 4000);

    // Recurring toast every 22 seconds
    const interval = setInterval(() => {
      showRandomToast();
    }, 22000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const showRandomToast = () => {
    const randomIndex = Math.floor(Math.random() * LIVE_TOAST_PRESETS.length);
    setCurrentToast(LIVE_TOAST_PRESETS[randomIndex]);
    setIsVisible(true);

    // Auto hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);
  };

  if (!currentToast || !isVisible) return null;

  return (
    <div className="fixed top-14 left-4 right-4 z-40 max-w-sm mx-auto animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#1A1615]/95 text-white border border-[#D4AF37]/50 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#C83C23] text-white shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-stone-200 line-clamp-2">
            {currentToast}
          </span>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full text-stone-400 hover:text-white shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
