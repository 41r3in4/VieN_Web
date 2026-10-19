import type { JourneyEntry, PersonaId } from '@/types';

export interface ProgressSnapshot {
  userExp: number;
  userStreak: number;
  selectedPersona: PersonaId;
  completedCheckpointIds: string[];
  listenedCheckpointIds: string[];
  watchedDestinationIds: string[];
  unlockedBadgeIds: string[];
  unlockedLoreIds: string[];
  journeyEntries: JourneyEntry[];
  challengeScore: number;
  challengeTotal: number;
}
