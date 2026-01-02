export interface ModelStats {
  name: string;
  count: number;
  percentage: number;
}

export interface LanguageStats {
  name: string;
  count: number;
  percentage: number;
}

export interface WeekdayActivity {
  counts: [number, number, number, number, number, number, number];
  mostActiveDay: number;
  mostActiveDayName: string;
  maxCount: number;
}

export interface GeminiStats {
  year: number; // Keep for backward compatibility or primary year
  periodLabel: string;
  startDate: Date;
  endDate: Date;

  // Time-based
  firstSessionDate: Date | null;
  daysSinceFirstSession: number;

  // Counts
  totalSessions: number;
  totalMessages: number;
  totalProjects: number;

  // Tokens
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCachedTokens: number;
  totalThoughtTokens: number;
  totalTokens: number;
  
  // Cost
  totalCost: number;
  hasUsageCost: boolean;
  
  // Tools
  totalToolCalls: number;

  // Models
  topModels: ModelStats[];
  
  // Languages
  topLanguages: LanguageStats[];

  // Activity
  dailyActivity: Map<string, number>; // "yyyy-mm-dd" -> count
  mostActiveDay: {
    date: string;
    count: number;
    formattedDate: string;
  } | null;
  weekdayActivity: WeekdayActivity;

  // Streak
  maxStreak: number;
  currentStreak: number;
  maxStreakDays: Set<string>;
}

export interface CliArgs {
  year?: number;
  help?: boolean;
}