'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
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
import { useCommunity } from '@/context/CommunityContext';
import { getExperienceModal } from './modal-priority';
import { useMedia } from '@/context/MediaContext';
import { MediaEditor } from '@/components/admin/MediaEditor';

export default function ExperienceApp() {
  const { activeTab, setActiveTab, setSelectedDestinationId, selectedDestinationId, activeQuest, trailerDestinationId, syncStatus, retrySync, activeLore, rewardModalData, isScannerOpen, isPersonaModalOpen, isTrailerOpen } = useHeritage();
  const { isChatOpen } = useCommunity();
  const { editingDestinationId } = useMedia();
  const modal = editingDestinationId ? 'media' : getExperienceModal({ isChatOpen, hasLore: !!activeLore, hasReward: !!rewardModalData, hasQuest: !!activeQuest, isScannerOpen, isPersonaModalOpen, isTrailerOpen, hasDestination: !!selectedDestinationId });
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
        <div className="experience-sitebar px-4 py-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <Link className="transition-colors hover:text-white" href="/" prefetch={false}>← Trang chủ VieN</Link>
            <span className="font-medium tracking-wide">Trải nghiệm di sản</span>
          </div>
        </div>
        <TopHeader />
        {syncStatus !== 'saved' && <div className="progress-sync-banner" role="status">{syncStatus === 'saving' ? 'Đang lưu hoạt động vào tài khoản…' : <>Chưa đồng bộ được hoạt động. <button onClick={() => void retrySync()}>Thử lại</button></>}</div>}

        {/* Main View Display */}
        <main key={activeTab} className="w-full experience-tab-panel">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'journey' && <JourneyView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Real-time Community Overlays */}
        <FloatingChatPill />

        {/* Bottom Fixed Navigation Bar (5 tabs) */}
        <BottomNav />

        {/* Interactive Flow Modals */}
        {modal === 'trailer' && <CinematicTrailerModal key={`trailer-${trailerDestinationId}`} />}
        {modal === 'destination' && <DestinationDetailModal />}
        {modal === 'persona' && <PersonaSelectModal />}
        {modal === 'scanner' && <ScannerSimulatorModal />}
        {modal === 'quest' && <InteractiveQuestModal key={`quest-${activeQuest?.checkpointId}`} />}
        {modal === 'reward' && <RewardUnlockModal />}
        {modal === 'lore' && <HiddenLoreModal />}
        <LiveChatModal />
        {editingDestinationId && <MediaEditor key={editingDestinationId} />}
      </MobileFrameWrapper>
    </div>
  );
}
