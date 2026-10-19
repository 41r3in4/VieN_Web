import type { ChatMessage, LeaderboardUser } from '@/types';

export type LeaderboardPeriod = 'week' | 'month' | 'all';
export interface RankedMember extends LeaderboardUser { id: string }
export interface LeaderboardResponse {
  users: RankedMember[];
  currentUser: RankedMember | null;
  totalUsers: number;
  nextRankExp: number | null;
}
export interface ChatResponse { messages: ChatMessage[]; hasMore: boolean }
