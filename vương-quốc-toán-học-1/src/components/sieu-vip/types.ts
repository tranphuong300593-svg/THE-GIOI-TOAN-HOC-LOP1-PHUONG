export type SieuVipGameId = 'fruit_catcher' | 'math_bowling' | 'memory_match' | 'geometry_painter' | 'balloon_shooter';

export interface SieuVipBadge {
  id: string;
  gameId: SieuVipGameId;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

export interface SieuVipGameProgress {
  highScore: number;
  completedTimes: number;
  isUnlocked: boolean;
  badgeEarned: boolean;
}

export type SieuVipMode = 'topic' | 'comprehensive' | 'challenge';

export interface SieuVipProfile {
  totalStars: number;
  gamesProgress: Record<SieuVipGameId, SieuVipGameProgress>;
  badges: string[]; // Badge IDs
  championUnlocked: boolean;
}

export const INITIAL_SIEU_VIP_PROFILE: SieuVipProfile = {
  totalStars: 0,
  championUnlocked: false,
  badges: [],
  gamesProgress: {
    fruit_catcher: { highScore: 0, completedTimes: 0, isUnlocked: true, badgeEarned: false },
    math_bowling: { highScore: 0, completedTimes: 0, isUnlocked: true, badgeEarned: false },
    memory_match: { highScore: 0, completedTimes: 0, isUnlocked: true, badgeEarned: false },
    geometry_painter: { highScore: 0, completedTimes: 0, isUnlocked: true, badgeEarned: false },
    balloon_shooter: { highScore: 0, completedTimes: 0, isUnlocked: true, badgeEarned: false },
  }
};
