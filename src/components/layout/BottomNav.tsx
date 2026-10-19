'use client';

import React from 'react';
import { useHeritage, TabType } from '@/context/HeritageContext';
import { Home, Compass, Trophy, ScrollText, User } from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'explore', label: 'Khám phá', icon: Compass },
  { id: 'leaderboard', label: 'Xếp hạng', icon: Trophy },
  { id: 'journey', label: 'Mạch sử', icon: ScrollText },
  { id: 'profile', label: 'Hồ sơ', icon: User }
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, viewMode } = useHeritage();

  const handleTabClick = (tab: TabType) => {
    heritageAudio.playClick();
    setActiveTab(tab);
  };

  return (
    <nav aria-label="Điều hướng chính" className={`experience-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E8DFC8] py-2 px-2 shadow-lg mx-auto transition-all ${viewMode === 'responsive' ? 'max-w-6xl' : 'max-w-md'}`}>
      <div className="flex items-center justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#C83C23] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#C83C23] text-white text-[9px] rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>

              {/* Active gold dot */}
              {isActive && (
                <div className="w-1.5 h-1.5 bg-[#C83C23] rounded-full mt-0.5 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
