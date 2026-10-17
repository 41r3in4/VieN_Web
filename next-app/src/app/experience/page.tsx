'use client';

import React, { useEffect } from 'react';
import { DESTINATIONS } from '@/data/destinations';
import { useHeritage } from '@/context/HeritageContext';
import { MobileFrameWrapper } from '@/components/layout/MobileFrameWrapper';
import { TopHeader } from '@/components/layout/TopHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { HomeView } from '@/components/views/HomeView';
import { ExploreView } from '@/components/views/ExploreView';
import { LeaderboardView } from '@/components/views/LeaderboardView';
import { JourneyView } from '@/components/views/JourneyView';
import { ProfileView } from '@/components/views/ProfileView';

// Interactive Modals & Engines
import { CinematicTrailerModal } from '@/components/experience/CinematicTrailerModal';
import { DestinationDetailModal } from '@/components/experience/DestinationDetailModal';
import { PersonaSelectModal } from '@/components/experience/PersonaSelectModal';
import { ScannerSimulatorModal } from '@/components/experience/ScannerSimulatorModal';
import { InteractiveQuestModal } from '@/components/experience/InteractiveQuestModal';
import { RewardUnlockModal } from '@/components/experience/RewardUnlockModal';
import { HiddenLoreModal } from '@/components/gamification/HiddenLoreModal';
import { LiveChatModal } from '@/components/community/LiveChatModal';
import { FloatingChatPill } from '@/components/community/FloatingChatPill';
import { LiveToastFeed } from '@/components/community/LiveToastFeed';

export default function AppMain() {
  const { activeTab, setActiveTab, setSelectedDestinationId } = useHeritage();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tab = query.get('tab');
    if (tab && ['home', 'explore', 'leaderboard', 'journey', 'profile'].includes(tab)) {
      setActiveTab(tab as 'home' | 'explore' | 'leaderboard' | 'journey' | 'profile');
    }
    const destination = query.get('destination');
    if (destination && DESTINATIONS.some(d => d.id === destination)) {
      setActiveTab('explore');
      setSelectedDestinationId(destination);
    }
  }, [setActiveTab, setSelectedDestinationId]);

  return (
    <div className="experience-shell">
      <MobileFrameWrapper>
        {/* Top Header with branding, EXP, streak & audio */}
        <div className="px-4 py-2 text-xs bg-[#1A1615] text-white flex justify-between"><a href="/">← Trang chủ VieN</a><span>Trải nghiệm di sản</span></div>
        <TopHeader />

        {/* Main View Display */}
        <main className="w-full">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'journey' && <JourneyView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Real-time Community Overlays */}
        <FloatingChatPill />
        <LiveToastFeed />

        {/* Bottom Fixed Navigation Bar (5 tabs) */}
        <BottomNav />

        {/* Interactive Flow Modals */}
        <CinematicTrailerModal />
        <DestinationDetailModal />
        <PersonaSelectModal />
        <ScannerSimulatorModal />
        <InteractiveQuestModal />
        <RewardUnlockModal />
        <HiddenLoreModal />
        <LiveChatModal />
      </MobileFrameWrapper>
    </div>
  );
}
