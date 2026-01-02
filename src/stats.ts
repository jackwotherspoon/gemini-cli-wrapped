import type { RawSessionData } from "./collector";
import type { GeminiStats, ModelStats, WeekdayActivity, LanguageStats } from "./types";
import { format, differenceInDays, parseISO } from "date-fns";
import { calculateCost } from "./pricing";

const EXTENSION_MAP: Record<string, string> = {
  'ts': 'TypeScript', 'tsx': 'TypeScript',
  'js': 'JavaScript', 'jsx': 'JavaScript',
  'py': 'Python',
  'rs': 'Rust',
  'go': 'Go',
  'rb': 'Ruby',
  'java': 'Java',
  'cpp': 'C++', 'cc': 'C++', 'hpp': 'C++', 'c': 'C',
  'md': 'Markdown',
  'html': 'HTML', 'css': 'CSS',
  'sh': 'Shell', 'bash': 'Shell', 'zsh': 'Shell',
  'json': 'JSON', 'yaml': 'YAML', 'yml': 'YAML',
  'sql': 'SQL',
  'swift': 'Swift',
  'kt': 'Kotlin',
  'php': 'PHP'
};

export function processStats(
  sessions: RawSessionData[], 
  periodLabel: string, 
  startDate: Date, 
  endDate: Date,
  absoluteFirstSessionDate: Date | null
): GeminiStats {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCachedTokens = 0;
  let totalThoughtTokens = 0;
  let totalTokens = 0;
  let totalMessages = 0;
  let totalGeminiMessages = 0;
  let totalToolCalls = 0;
  let totalCost = 0;
  const projectHashes = new Set<string>();
  const modelCounts = new Map<string, number>();
  const languageCounts = new Map<string, number>();
  const dailyActivity = new Map<string, number>();
  const weekdayCounts: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];
  
  // We calculate this for internal use within the period, but we use absoluteFirstSessionDate for the final report
  let firstSessionInPeriod: Date | null = null;

  for (const session of sessions) {
    projectHashes.add(session.projectHash);
    
    const sessionStartTime = new Date(session.startTime);
    if (!firstSessionInPeriod || sessionStartTime < firstSessionInPeriod) {
      firstSessionInPeriod = sessionStartTime;
    }

    for (const msg of session.messages) {
      if (msg.type === 'user' || msg.type === 'gemini') {
        totalMessages++;
        
        const timestamp = new Date(msg.timestamp);
        const dateKey = format(timestamp, "yyyy-MM-dd");
        dailyActivity.set(dateKey, (dailyActivity.get(dateKey) || 0) + 1);
        
        const dayOfWeek = timestamp.getDay(); // 0 = Sunday
        weekdayCounts[dayOfWeek]++;
      }

      if (msg.type === 'gemini') {
        totalGeminiMessages++;
        if (msg.model) {
          modelCounts.set(msg.model, (modelCounts.get(msg.model) || 0) + 1);
        }
        
        if (msg.tokens) {
          totalInputTokens += msg.tokens.input || 0;
          totalOutputTokens += msg.tokens.output || 0;
          totalCachedTokens += msg.tokens.cached || 0;
          totalThoughtTokens += msg.tokens.thoughts || 0;
          totalTokens += msg.tokens.total || 0;

          if (msg.model) {
             // Thoughts tokens are billed at the output rate
             const combinedOutput = (msg.tokens.output || 0) + (msg.tokens.thoughts || 0);
             totalCost += calculateCost(msg.model, msg.tokens.input || 0, combinedOutput, msg.tokens.cached || 0);
          }
        }

        if (msg.toolCalls) {
          totalToolCalls += msg.toolCalls.length;
          
          for (const call of msg.toolCalls) {
            const filePath = call.args?.file_path || call.args?.path || call.args?.dir_path;
            if (filePath && typeof filePath === 'string') {
              const ext = filePath.split('.').pop()?.toLowerCase();
              if (ext && EXTENSION_MAP[ext]) {
                const lang = EXTENSION_MAP[ext];
                languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
              }
            }
          }
        }
      }
    }
  }

  // Top Models
  const topModels: ModelStats[] = Array.from(modelCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalGeminiMessages > 0 ? (count / totalGeminiMessages) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top Languages
  const totalLanguageActions = Array.from(languageCounts.values()).reduce((a, b) => a + b, 0);
  const topLanguages: LanguageStats[] = Array.from(languageCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalLanguageActions > 0 ? (count / totalLanguageActions) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Most Active Day
  let mostActiveDay: GeminiStats['mostActiveDay'] = null;
  for (const [date, count] of dailyActivity.entries()) {
    if (!mostActiveDay || count > mostActiveDay.count) {
      mostActiveDay = {
        date,
        count,
        formattedDate: format(parseISO(date), "EEEE, MMM d")
      };
    }
  }

  // Weekday Activity
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let maxWeekdayCount = 0;
  let mostActiveWeekdayIndex = 0;
  for (let i = 0; i < 7; i++) {
    if (weekdayCounts[i] > maxWeekdayCount) {
      maxWeekdayCount = weekdayCounts[i];
      mostActiveWeekdayIndex = i;
    }
  }

  const weekdayActivity: WeekdayActivity = {
    counts: weekdayCounts,
    mostActiveDay: mostActiveWeekdayIndex,
    mostActiveDayName: dayNames[mostActiveWeekdayIndex],
    maxCount: maxWeekdayCount
  };

  // Streak calculation
  const sortedDates = Array.from(dailyActivity.keys()).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  let maxStreakDays = new Set<string>();
  let tempStreakDays = new Set<string>();

  if (sortedDates.length > 0) {
    tempStreak = 1;
    tempStreakDays.add(sortedDates[0]);
    maxStreak = 1;
    maxStreakDays = new Set([sortedDates[0]]);

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = parseISO(sortedDates[i - 1]);
      const curr = parseISO(sortedDates[i]);
      
      if (differenceInDays(curr, prev) === 1) {
        tempStreak++;
        tempStreakDays.add(sortedDates[i]);
      } else {
        if (tempStreak > maxStreak) {
          maxStreak = tempStreak;
          maxStreakDays = new Set(tempStreakDays);
        }
        tempStreak = 1;
        tempStreakDays = new Set([sortedDates[i]]);
      }
    }
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
      maxStreakDays = new Set(tempStreakDays);
    }

    // Current streak (ending today or yesterday)
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
    
    if (dailyActivity.has(today)) {
      let d = new Date();
      while (dailyActivity.has(format(d, "yyyy-MM-dd"))) {
        currentStreak++;
        d = new Date(d.getTime() - 86400000);
      }
    } else if (dailyActivity.has(yesterday)) {
      let d = new Date(Date.now() - 86400000);
      while (dailyActivity.has(format(d, "yyyy-MM-dd"))) {
        currentStreak++;
        d = new Date(d.getTime() - 86400000);
      }
    }
  }

  return {
    year: endDate.getFullYear(), // Default year for backward compatibility
    periodLabel,
    startDate,
    endDate,
    firstSessionDate: absoluteFirstSessionDate,
    daysSinceFirstSession: absoluteFirstSessionDate ? differenceInDays(new Date(), absoluteFirstSessionDate) : 0,
    totalSessions: sessions.length,
    totalMessages,
    totalProjects: projectHashes.size,
    totalInputTokens,
    totalOutputTokens,
    totalCachedTokens,
    totalThoughtTokens,
    totalTokens,
    totalToolCalls,
    topModels,
    topLanguages,
    dailyActivity,
    mostActiveDay,
    weekdayActivity,
    maxStreak,
    currentStreak,
    maxStreakDays,
    totalCost,
    hasUsageCost: totalCost > 0
  };
}