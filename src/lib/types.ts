export interface Square {
  id: number;
  row: number;
  col: number;
  text: string;
  is_heart: boolean;
  is_free: boolean;
}

export interface Completion {
  id: string;
  user_id: string;
  square_id: number;
  coworker_name: string;
  is_cross_team: boolean;
  completed_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  department: string;
  is_admin: boolean;
  created_at: string;
}

export interface ScoreBreakdown {
  basePoints: number;
  bingoLines: number;
  bingoLineCount: number;
  heartBonus: number;
  blackoutBonus: number;
  total: number;
}

export interface LeaderboardEntry {
  user_id: string;
  anonymous_id: string;
  total_completions: number;
  cross_team_count: number;
  score: ScoreBreakdown;
}
