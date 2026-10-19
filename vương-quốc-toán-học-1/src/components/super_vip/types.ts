export type SuperVipGameId = 
  | 'fruit_catcher'
  | 'math_bowling'
  | 'card_memory'
  | 'geometry_painter'
  | 'balloon_shooter';

export interface SuperVipBadge {
  id: SuperVipGameId;
  name: string;
  icon: string;
  title: string;
  unlocked: boolean;
  unlockedAt?: string;
  description: string;
}

export interface SuperVipProgress {
  badges: Record<SuperVipGameId, boolean>;
  highScores: Record<SuperVipGameId, number>;
  totalCompleted: number;
  isChampion: boolean;
}

export type SuperVipKnowledgeMode = 'all_topics' | 'topic_by_topic' | 'vip_challenge';
