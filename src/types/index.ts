export type PersonaId = 'historian' | 'explorer' | 'artisan';

export interface Persona {
  id: PersonaId;
  title: string;
  vietnameseRole: string;
  iconName: string;
  tagline: string;
  description: string;
  specialty: string;
  toolName: string;
  toolDesc: string;
  bonusPerk: string;
  themeColor: string;
}

export interface RiddlePuzzle {
  type: 'han-nom' | 'spatial-angle' | 'sculpture-relic';
  prompt: string;
  personaHint: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  culturalInsight: string; // "Bạn có biết?"
}

export interface Checkpoint {
  id: string;
  order: number;
  name: string;
  shortDesc: string;
  culturalEra: string;
  qrCode: string;
  nfcCode: string;
  coords: { x: number; y: number }; // Percentage in Fog of War map
  storySnippet: string[];
  audioGuideText: string;
  historicalImage: string;
  personaClues: Record<PersonaId, {
    taskTitle: string;
    clue: string;
    toolAction: string;
  }>;
  riddle: RiddlePuzzle;
  quizzes: QuizQuestion[];
  expReward: number;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  tagline: string;
  era: string;
  coverImage: string;
  videoTrailer: {
    duration: string;
    title: string;
    narrationText: string;
    videoUrl?: string; // Real video file path (/videos/xxx.mp4) or URL
    youtubeEmbedId?: string; // Optional YouTube embed ID
    scenes: {
      timestamp: string;
      caption: string;
      image: string;
    }[];
  };
  story: string;
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  totalCheckpoints: number;
  checkpoints: Checkpoint[];
  hiddenLoreId: string;
  stats: {
    rating: number;
    expTotal: number;
    historicalYears: number;
    recommendedTime: string;
  };
}

export interface HiddenLore {
  id: string;
  destinationId: string;
  title: string;
  ancientTitle: string;
  requiredCondition: string;
  secretText: string[];
  historicArtifact: string;
  curatorNote: string;
}

export interface Badge {
  id: string;
  title: string;
  destinationId?: string;
  icon: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  unlockedAt?: string;
}

export interface JourneyEntry {
  id: string;
  timestamp: string;
  destinationId: string;
  destinationName: string;
  checkpointName: string;
  personaUsed: PersonaId;
  expGained: number;
  quizScore: string;
  badgeEarned?: string;
  reflection: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  role: string;
  exp: number;
  badgesCount: number;
  isCurrentUser?: boolean;
  recentAchievement: string;
}

export interface ChatMessage {
  createdAt?: string;
  id: string;
  sender: string;
  avatar: string;
  role: string;
  text: string;
  timestamp: string;
  isSelf?: boolean;
  photoUrl?: string;
  likes: number;
  hasLiked?: boolean;
}

export interface LiveNotification {
  id: string;
  type: 'badge' | 'quiz' | 'lore' | 'visitor';
  message: string;
  timestamp: string;
}
