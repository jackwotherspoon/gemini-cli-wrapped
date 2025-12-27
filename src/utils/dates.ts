import { isAfter, startOfYear, endOfYear, format } from "date-fns";

export interface Availability {
  available: boolean;
  message?: string | string[];
}

export function isWrappedAvailable(year: number): Availability {
  const now = new Date();
  const yearStart = startOfYear(new Date(year, 0, 1));
  const wrapStart = new Date(year, 11, 1); // December 1st

  if (isAfter(yearStart, now)) {
    return {
      available: false,
      message: `The year ${year} hasn't started yet!`,
    };
  }

  if (year < now.getFullYear()) {
    return { available: true };
  }

  if (isAfter(wrapStart, now)) {
    const daysLeft = Math.ceil((wrapStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      available: false,
      message: [
        `Gemini CLI Wrapped ${year} isn't ready yet.`,
        `Come back in ${daysLeft} days (December 1st)!`,
      ],
    };
  }

  return { available: true };
}

export function generateWeeksForYear(year: number): string[][] {
  const weeks: string[][] = [];
  const startDate = new Date(year, 0, 1);
  const startDay = startDate.getDay();
  const adjustedStart = new Date(startDate);
  if (startDay !== 0) {
    adjustedStart.setDate(startDate.getDate() - startDay);
  }

  const now = new Date();
  const isCurrentYear = year === now.getFullYear();
  const endDate = isCurrentYear ? now : new Date(year, 11, 31);

  let currentDate = new Date(adjustedStart);
  let currentWeek: string[] = [];

  while (currentDate <= endDate || currentWeek.length > 0) {
    const dayOfWeek = currentDate.getDay();
    const dateStr = formatDateKey(currentDate);

    if (currentDate.getFullYear() === year && currentDate <= endDate) {
      currentWeek.push(dateStr);
    } else if (currentDate.getFullYear() === year) {
      currentWeek.push("");
    }

    if (dayOfWeek === 6) {
      if (currentWeek.length > 0 && currentWeek.some((d) => d !== "")) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getFullYear() > year + 1) break;
  }

  if (currentWeek.length > 0 && currentWeek.some((d) => d !== "")) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getIntensityLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  if (count === 0 || maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.1) return 1;
  if (ratio <= 0.25) return 2;
  if (ratio <= 0.4) return 3;
  if (ratio <= 0.6) return 4;
  if (ratio <= 0.8) return 5;
  return 6;
}