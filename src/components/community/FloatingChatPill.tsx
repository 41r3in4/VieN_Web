'use client';

import React from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { useCommunity } from '@/context/CommunityContext';
import { MessageSquare } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const FloatingChatPill: React.FC = () => {
  const { activeTab, viewMode } = useHeritage();
  const { isChatOpen, setIsChatOpen, onlineCount } = useCommunity();

  if (isChatOpen || activeTab === 'leaderboard') return null;

  const handleClick = () => {
    heritageAudio.playClick();
    setIsChatOpen(true);
  };

  return (
    <div className={`experience-chat-pill fixed bottom-20 right-4 ${viewMode === 'mobile' ? 'experience-device-chat' : ''} z-30 animate-in fade-in slide-in-from-bottom duration-300`}>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1A1615] hover:bg-stone-800 text-white shadow-xl border border-[#D4AF37]/50 backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 group"
      >
        {/* Pulsing Green Online Indicator */}
        <div className="relative flex items-center justify-center">
          <span className={`w-2 h-2 rounded-full ${onlineCount ? 'bg-emerald-400' : 'bg-stone-500'}`} />
          {!!onlineCount && <span className="absolute -inset-0.5 rounded-full bg-emerald-400 animate-ping opacity-75" />}
        </div>

        <MessageSquare className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />

        <div className="text-left">
          <span className="text-[11px] font-bold block leading-none">
            {onlineCount === null ? 'Cộng đồng VieN' : `${onlineCount} thành viên`}
          </span>
          <span className="text-[9px] text-stone-400 leading-tight">
            {onlineCount === null ? 'Mở trò chuyện' : 'đang hoạt động'}
          </span>
        </div>
      </button>
    </div>
  );
};
