'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { PersonaId, Badge, HiddenLore, JourneyEntry, ChatMessage } from '@/types';
import { DESTINATIONS } from '@/data/destinations';
import { ALL_BADGES, INITIAL_CHAT_MESSAGES } from '@/data/leaderboardData';
import { HIDDEN_LORES } from '@/data/hiddenLoreData';
import { heritageAudio } from '@/utils/audioSynth';

export type TabType = 'home' | 'explore' | 'leaderboard' | 'journey' | 'profile';
export type ViewMode = 'mobile' | 'responsive';

interface HeritageContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedPersona: PersonaId;
  setSelectedPersona: (p: PersonaId) => void;
  
  // Progress & Stats
  userExp: number;
  userLevel: number;
  userStreak: number;
  completedCheckpointIds: string[];
  unlockedBadgeIds: string[];
  unlockedLoreIds: string[];
  journeyEntries: JourneyEntry[];
  
  // Audio state
  isSoundMuted: boolean;
  toggleSound: () => void;
  isAmbientPlaying: boolean;
  toggleAmbientAudio: () => void;

  // Active Modals & Flows
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;
  isTrailerOpen: boolean;
  trailerDestinationId: string | null;
  openTrailer: (destId: string) => void;
  closeTrailer: () => void;
  isPersonaModalOpen: boolean;
  setIsPersonaModalOpen: (open: boolean) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  activeQuest: { destinationId: string; checkpointId: string } | null;
  startQuest: (destinationId: string, checkpointId: string) => void;
  closeQuest: () => void;
  activeLore: HiddenLore | null;
  openLore: (lore: HiddenLore) => void;
  closeLore: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  rewardModalData: {
    badge?: Badge;
    exp: number;
    title: string;
    subtitle: string;
  } | null;
  closeRewardModal: () => void;

  // Quest & Completion Actions
  completeCheckpoint: (
    destinationId: string,
    checkpointId: string,
    expGained: number,
    quizScore: string,
    reflectionText: string
  ) => void;
  unlockLoreById: (loreId: string) => void;

  // Social & Community
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, photoUrl?: string) => void;
  likeChatMessage: (id: string) => void;

  // Helpers
  getDestinationProgress: (destinationId: string) => {
    completedCount: number;
    totalCount: number;
    percentage: number;
    isFullyCompleted: boolean;
  };
  resetProgress: () => void;
}

const HeritageContext = createContext<HeritageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vien_heritage_state_v1';

export const HeritageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('historian');

  const [hydrated, setHydrated] = useState(false);
  const completionGuard = useRef(new Set<string>());
  const [userExp, setUserExp] = useState<number>(0);
  const [userStreak] = useState<number>(0);
  const [completedCheckpointIds, setCompletedCheckpointIds] = useState<string[]>([]);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);
  const [unlockedLoreIds, setUnlockedLoreIds] = useState<string[]>([]);
  
  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);

  // Audio state
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  // Modals
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);
  const [trailerDestinationId, setTrailerDestinationId] = useState<string | null>(null);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [activeQuest, setActiveQuest] = useState<{ destinationId: string; checkpointId: string } | null>(null);
  const [activeLore, setActiveLore] = useState<HiddenLore | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [rewardModalData, setRewardModalData] = useState<{
    badge?: Badge;
    exp: number;
    title: string;
    subtitle: string;
  } | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Level calculation: 500 EXP per level
  const userLevel = Math.max(1, Math.floor(userExp / 500) + 1);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.userExp === 'number' && Number.isFinite(parsed.userExp) && parsed.userExp >= 0) setUserExp(parsed.userExp);
        if (parsed.selectedPersona) setSelectedPersona(parsed.selectedPersona);
        if (parsed.completedCheckpointIds) setCompletedCheckpointIds(parsed.completedCheckpointIds);
        if (parsed.unlockedBadgeIds) setUnlockedBadgeIds(parsed.unlockedBadgeIds);
        if (parsed.unlockedLoreIds) setUnlockedLoreIds(parsed.unlockedLoreIds);
        if (parsed.journeyEntries) setJourneyEntries(parsed.journeyEntries);
        if (parsed.viewMode) setViewMode(parsed.viewMode);
      }
    } catch {
      // LocalStorage unavailable
    }
    setHydrated(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      const dataToSave = {
        userExp,
        selectedPersona,
        completedCheckpointIds,
        unlockedBadgeIds,
        unlockedLoreIds,
        journeyEntries,
        viewMode
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [hydrated, userExp, selectedPersona, completedCheckpointIds, unlockedBadgeIds, unlockedLoreIds, journeyEntries, viewMode]);

  // Audio toggles
  const toggleSound = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    heritageAudio.setMuted(nextMuted);
    if (nextMuted) {
      setIsAmbientPlaying(false);
    }
  };

  const toggleAmbientAudio = () => {
    if (isSoundMuted) return;
    const playing = heritageAudio.toggleAmbient();
    setIsAmbientPlaying(playing);
  };

  const openTrailer = (destId: string) => {
    heritageAudio.playClick();
    setTrailerDestinationId(destId);
    setIsTrailerOpen(true);
  };

  const closeTrailer = () => {
    setIsTrailerOpen(false);
    setTrailerDestinationId(null);
  };

  const startQuest = (destinationId: string, checkpointId: string) => {
    heritageAudio.playClick();
    setActiveQuest({ destinationId, checkpointId });
  };

  const closeQuest = () => {
    setActiveQuest(null);
  };

  const openLore = (lore: HiddenLore) => {
    heritageAudio.playClick();
    setActiveLore(lore);
  };

  const closeLore = () => {
    setActiveLore(null);
  };

  const closeRewardModal = () => {
    setRewardModalData(null);
  };

  const getDestinationProgress = (destinationId: string) => {
    const dest = DESTINATIONS.find((d) => d.id === destinationId);
    if (!dest) return { completedCount: 0, totalCount: 0, percentage: 0, isFullyCompleted: false };
    
    const totalCount = dest.checkpoints.length;
    const completedCount = dest.checkpoints.filter((cp) =>
      completedCheckpointIds.includes(cp.id)
    ).length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const isFullyCompleted = completedCount === totalCount;

    return { completedCount, totalCount, percentage, isFullyCompleted };
  };

  const unlockLoreById = (loreId: string) => {
    if (!unlockedLoreIds.includes(loreId)) {
      const nextLores = [...unlockedLoreIds, loreId];
      setUnlockedLoreIds(nextLores);
      heritageAudio.playSuccessChime();
    }
  };

  const completeCheckpoint = (
    destinationId: string,
    checkpointId: string,
    expGained: number,
    quizScore: string,
    reflectionText: string
  ) => {
    const destination = DESTINATIONS.find(d => d.id === destinationId);
    const checkpoint = destination?.checkpoints.find(cp => cp.id === checkpointId);
    if (!checkpoint || completedCheckpointIds.includes(checkpointId) || completionGuard.current.has(checkpointId)) return;
    completionGuard.current.add(checkpointId);
    expGained = checkpoint.expReward;
    heritageAudio.playFanfare();
    
    // Add completed checkpoint
    const nextCompleted = completedCheckpointIds.includes(checkpointId)
      ? completedCheckpointIds
      : [...completedCheckpointIds, checkpointId];
    setCompletedCheckpointIds(nextCompleted);

    // Increase EXP
    const nextExp = userExp + expGained;
    setUserExp(nextExp);

    // Check if this completes the destination
    const dest = DESTINATIONS.find((d) => d.id === destinationId);
    const destCheckpoints = dest?.checkpoints || [];
    const allDone = destCheckpoints.every((cp) => nextCompleted.includes(cp.id));

    let earnedBadge: Badge | undefined;
    let nextBadges = [...unlockedBadgeIds];

    if (allDone && dest) {
      const matchingBadge = ALL_BADGES.find((b) => b.destinationId === destinationId);
      if (matchingBadge && !nextBadges.includes(matchingBadge.id)) {
        nextBadges.push(matchingBadge.id);
        setUnlockedBadgeIds(nextBadges);
        earnedBadge = matchingBadge;
      }
      // Also unlock the hidden lore automatically!
      if (dest.hiddenLoreId && !unlockedLoreIds.includes(dest.hiddenLoreId)) {
        setUnlockedLoreIds((prev) => [...prev, dest.hiddenLoreId]);
      }
    }

    // Add journey record
    const cp = destCheckpoints.find((c) => c.id === checkpointId);
    const newEntry: JourneyEntry = {
      id: `journey-${Date.now()}`,
      timestamp: 'Vừa xong',
      destinationId,
      destinationName: dest ? dest.name : 'Di tích Văn Hóa',
      checkpointName: cp ? cp.name : 'Trạm Di Sản',
      personaUsed: selectedPersona,
      expGained,
      quizScore,
      badgeEarned: earnedBadge ? earnedBadge.title : undefined,
      reflection: reflectionText
    };

    setJourneyEntries([newEntry, ...journeyEntries]);

    // Show celebration reward modal
    setRewardModalData({
      badge: earnedBadge,
      exp: expGained,
      title: earnedBadge ? `Chúc Mừng! Nhận Huy Hiệu "${earnedBadge.title}"` : 'Hoàn Thành Trạm Khám Phá!',
      subtitle: earnedBadge
        ? `Bạn đã mở khóa 100% trạm kiểm soát tại ${dest?.name} và giải mã bí ẩn di sản!`
        : `Bạn nhận được +${expGained} EXP vào Mạch Sử của mình!`
    });
  };

  const sendChatMessage = (text: string, photoUrl?: string) => {
    heritageAudio.playClick();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Bạn (Du Khách Tinh Hoa)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: selectedPersona === 'historian' ? 'Sử Gia Khai Phá' : selectedPersona === 'explorer' ? 'Thám Hiểm Tầm Bảo' : 'Nghệ Nhân Dân Lập',
      text,
      timestamp: 'Vừa xong',
      isSelf: true,
      photoUrl,
      likes: 0
    };
    setChatMessages((prev) => [newMsg, ...prev]);
  };

  const likeChatMessage = (id: string) => {
    heritageAudio.playClick();
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              likes: m.hasLiked ? m.likes - 1 : m.likes + 1,
              hasLiked: !m.hasLiked
            }
          : m
      )
    );
  };

  const resetProgress = () => {
    completionGuard.current.clear();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUserExp(0);
    setCompletedCheckpointIds([]);
    setUnlockedBadgeIds([]);
    setUnlockedLoreIds([]);
    setJourneyEntries([]);
    heritageAudio.playClick();
  };

  return (
    <HeritageContext.Provider
      value={{
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        selectedPersona,
        setSelectedPersona,
        userExp,
        userLevel,
        userStreak,
        completedCheckpointIds,
        unlockedBadgeIds,
        unlockedLoreIds,
        journeyEntries,
        isSoundMuted,
        toggleSound,
        isAmbientPlaying,
        toggleAmbientAudio,
        selectedDestinationId,
        setSelectedDestinationId,
        isTrailerOpen,
        trailerDestinationId,
        openTrailer,
        closeTrailer,
        isPersonaModalOpen,
        setIsPersonaModalOpen,
        isScannerOpen,
        setIsScannerOpen,
        activeQuest,
        startQuest,
        closeQuest,
        activeLore,
        openLore,
        closeLore,
        isChatOpen,
        setIsChatOpen,
        rewardModalData,
        closeRewardModal,
        completeCheckpoint,
        unlockLoreById,
        chatMessages,
        sendChatMessage,
        likeChatMessage,
        getDestinationProgress,
        resetProgress
      }}
    >
      {children}
    </HeritageContext.Provider>
  );
};

export const useHeritage = () => {
  const context = useContext(HeritageContext);
  if (!context) {
    throw new Error('useHeritage must be used within a HeritageProvider');
  }
  return context;
};
