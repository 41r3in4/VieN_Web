'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import type { PersonaId, Badge, HiddenLore } from '@/types';
import type { ProgressSnapshot } from '@/types/progress';
import { DESTINATIONS } from '@/data/destinations';
import { ALL_BADGES } from '@/data/leaderboardData';
import { heritageAudio } from '@/utils/audioSynth';

export type TabType = 'home' | 'explore' | 'leaderboard' | 'journey' | 'profile';
export type ViewMode = 'mobile' | 'responsive';
type Reward = { badge?: Badge; exp: number; title: string; subtitle: string };
interface HeritageContextType extends ProgressSnapshot {
  activeTab: TabType; setActiveTab: (tab: TabType) => void;
  viewMode: ViewMode; setViewMode: (mode: ViewMode) => void;
  setSelectedPersona: (persona: PersonaId) => void;
  userLevel: number;
  syncStatus: 'saved' | 'saving' | 'error'; retrySync: () => Promise<void>;
  isSoundMuted: boolean; toggleSound: () => void;
  isAmbientPlaying: boolean; toggleAmbientAudio: () => void;
  selectedDestinationId: string | null; setSelectedDestinationId: (id: string | null) => void;
  isTrailerOpen: boolean; trailerDestinationId: string | null;
  openTrailer: (id: string) => void; closeTrailer: () => void;
  isPersonaModalOpen: boolean; setIsPersonaModalOpen: (open: boolean) => void;
  isScannerOpen: boolean; setIsScannerOpen: (open: boolean) => void;
  activeQuest: { destinationId: string; checkpointId: string } | null;
  startQuest: (destinationId: string, checkpointId: string) => void; closeQuest: () => void;
  activeLore: HiddenLore | null; openLore: (lore: HiddenLore) => void; closeLore: () => void;
  rewardModalData: Reward | null; closeRewardModal: () => void;
  completeCheckpoint: (destinationId: string, checkpointId: string, answers: number[], riddleAnswer: string, reflection: string) => Promise<boolean>;
  recordListening: (checkpointId: string) => void;
  recordTrailer: (destinationId: string) => void;
  getDestinationProgress: (id: string) => { completedCount: number; totalCount: number; percentage: number; isFullyCompleted: boolean };
  resetProgress: () => Promise<void>;
}
const HeritageContext = createContext<HeritageContextType | undefined>(undefined);

export function HeritageProvider({ children, initialProgress }: { children: ReactNode; initialProgress: ProgressSnapshot }) {
  const [progress, setProgress] = useState(initialProgress);
  const progressRef = useRef(initialProgress);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const inFlight = useRef(0);
  const failed = useRef<{ body?: Record<string, unknown>; method: string }[]>([]);
  const generation = useRef(0);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [trailerDestinationId, setTrailerDestinationId] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<{ destinationId: string; checkpointId: string } | null>(null);
  const [activeLore, setActiveLore] = useState<HiddenLore | null>(null);
  const [rewardModalData, setRewardModalData] = useState<Reward | null>(null);

  const applyProgress = useCallback((next: ProgressSnapshot) => {
    progressRef.current = next;
    setProgress(next);
  }, []);

  const persist = useCallback((body?: Record<string, unknown>, method = 'POST'): Promise<ProgressSnapshot> => {
    generation.current++;
    inFlight.current++;
    setSyncStatus('saving');
    const task = queue.current.catch(() => {}).then(async () => {
      try {
        const response = await fetch('/api/progress', { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
        if (!response.ok) throw new Error('SAVE_FAILED');
        const next: ProgressSnapshot = await response.json();
        failed.current = failed.current.filter(action => !(action.method === method && action.body?.kind === body?.kind && action.body?.targetId === body?.targetId));
        applyProgress(next);
        return next;
      } catch (error) {
        failed.current.push({ body, method });
        throw error;
      } finally {
        inFlight.current--;
        setSyncStatus(failed.current.length ? 'error' : inFlight.current ? 'saving' : 'saved');
      }
    });
    queue.current = task;
    return task;
  }, [applyProgress]);

  const retrySync = async () => {
    const actions = failed.current.splice(0);
    for (const action of actions) {
      try { await persist(action.body, action.method); } catch { /* retained for another retry */ }
    }
  };

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      if (document.hidden || inFlight.current) return;
      const ticket = generation.current;
      try {
        const response = await fetch('/api/progress', { cache: 'no-store' });
        if (!response.ok) throw new Error();
        const next = await response.json();
        if (alive && !inFlight.current && ticket === generation.current) applyProgress(next);
      } catch { /* Preserve current data; mutations report persistence failures separately. */ }
    };
    const interval = setInterval(refresh, 20000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { alive = false; clearInterval(interval); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [applyProgress]);

  const setSelectedPersona = (persona: PersonaId) => { void persist({ kind: 'persona', persona }).catch(() => {}); };
  const completeCheckpoint: HeritageContextType['completeCheckpoint'] = async (destinationId, checkpointId, answers, riddleAnswer, reflection) => {
    const previous = progressRef.current;
    try {
      const next = await persist({ kind: 'checkpoint', targetId: checkpointId, answers, riddleAnswer, reflection, persona: previous.selectedPersona });
      if (!previous.completedCheckpointIds.includes(checkpointId)) {
        const badge = ALL_BADGES.find(b => next.unlockedBadgeIds.includes(b.id) && !previous.unlockedBadgeIds.includes(b.id));
        const checkpoint = DESTINATIONS.find(d => d.id === destinationId)?.checkpoints.find(cp => cp.id === checkpointId);
        setRewardModalData({ badge, exp: checkpoint?.expReward ?? 0, title: badge ? `Nhận huy hiệu ${badge.title}` : 'Hoàn thành trạm khám phá!', subtitle: 'Kết quả và kinh nghiệm đã được lưu vào tài khoản của bạn.' });
        heritageAudio.playFanfare();
      }
      return true;
    } catch { return false; }
  };
  const recordListening = (id: string) => { void persist({ kind: 'audio', targetId: id }).catch(() => {}); };
  const recordTrailer = (id: string) => { void persist({ kind: 'trailer', targetId: id }).catch(() => {}); };
  const resetProgress = async () => {
    // An intentional reset supersedes pending failed writes.
    failed.current = [];
    try { await persist(undefined, 'DELETE'); heritageAudio.playClick(); } catch { /* retry shown in profile */ }
  };

  const getDestinationProgress = (id: string) => {
    const checkpoints = DESTINATIONS.find(d => d.id === id)?.checkpoints ?? [];
    const completedCount = checkpoints.filter(cp => progress.completedCheckpointIds.includes(cp.id)).length;
    return { completedCount, totalCount: checkpoints.length, percentage: checkpoints.length ? Math.round(completedCount / checkpoints.length * 100) : 0, isFullyCompleted: checkpoints.length > 0 && checkpoints.length === completedCount };
  };
  return <HeritageContext.Provider value={{
    ...progress, activeTab, setActiveTab, viewMode, setViewMode, setSelectedPersona,
    userLevel: Math.floor(progress.userExp / 500) + 1, syncStatus, retrySync,
    isSoundMuted, toggleSound: () => { const muted = !isSoundMuted; setIsSoundMuted(muted); heritageAudio.setMuted(muted); if (muted) setIsAmbientPlaying(false); },
    isAmbientPlaying, toggleAmbientAudio: () => { if (!isSoundMuted) setIsAmbientPlaying(heritageAudio.toggleAmbient()); },
    selectedDestinationId, setSelectedDestinationId, isTrailerOpen, trailerDestinationId,
    openTrailer: id => { heritageAudio.playClick(); setTrailerDestinationId(id); setIsTrailerOpen(true); },
    closeTrailer: () => { setIsTrailerOpen(false); setTrailerDestinationId(null); },
    isPersonaModalOpen, setIsPersonaModalOpen, isScannerOpen, setIsScannerOpen, activeQuest,
    startQuest: (destinationId, checkpointId) => { heritageAudio.playClick(); setActiveQuest({ destinationId, checkpointId }); }, closeQuest: () => setActiveQuest(null),
    activeLore, openLore: lore => { if (progress.unlockedLoreIds.includes(lore.id)) setActiveLore(lore); }, closeLore: () => setActiveLore(null),
    rewardModalData, closeRewardModal: () => setRewardModalData(null),
    completeCheckpoint, recordListening, recordTrailer,
    getDestinationProgress, resetProgress,
  }}>{children}</HeritageContext.Provider>;
}

export function useHeritage() {
  const context = useContext(HeritageContext);
  if (!context) throw new Error('useHeritage must be used within a HeritageProvider');
  return context;
}
