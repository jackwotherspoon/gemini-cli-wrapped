import { isAfter, startOfYear, endOfYear, format, subDays, subYears, isSameYear } from "date-fns";

export interface Availability {
  available: boolean;
  message?: string | string[];
}

export interface WrappedPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
  isRolling: boolean;
}

export function getWrappedPeriod(requestedYear?: number): WrappedPeriod {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Explicit year requested
  if (requestedYear) {
    if (requestedYear < currentYear) {
      return {
        startDate: startOfYear(new Date(requestedYear, 0, 1)),
        endDate: endOfYear(new Date(requestedYear, 0, 1)),
        label: requestedYear.toString(),
        isRolling: false
      };
    } else {
      // requestedYear >= currentYear (isWrappedAvailable handles future years)
      return {
        startDate: startOfYear(new Date(requestedYear, 0, 1)),
        endDate: now,
        label: requestedYear.toString(),
        isRolling: false
      };
    }
  }

  // Default behavior (no year provided)
  // If it's December, we show the current year's wrapped
  if (now.getMonth() === 11) {
    return {
      startDate: startOfYear(now),
      endDate: now,
      label: currentYear.toString(),
      isRolling: false
    };
  }

  // Otherwise, show the last 365 days
  return {
    startDate: subYears(now, 1),
    endDate: now,
    label: "Last 365 Days",
    isRolling: true
  };
}

export function isWrappedAvailable(year: number): Availability {
  const now = new Date();
  const yearStart = startOfYear(new Date(year, 0, 1));

  if (isAfter(yearStart, now)) {
    return {
      available: false,
      message: `The year ${year} hasn't started yet!`,
    };
  }

  return { available: true };
}

export function generateWeeksForYear(year: number): string[][] {
  const startDate = new Date(year, 0, 1);
  const now = new Date();
  const isCurrentYear = year === now.getFullYear();
  const endDate = isCurrentYear ? now : new Date(year, 11, 31);
  
  return generateWeeksForRange(startDate, endDate);
}

export function generateWeeksForRange(startDate: Date, endDate: Date): string[][] {
  const weeks: string[][] = [];
  const startDay = startDate.getDay();
  const adjustedStart = new Date(startDate);
  
  // Start from the beginning of the week
  if (startDay !== 0) {
    adjustedStart.setDate(startDate.getDate() - startDay);
  }

  let currentDate = new Date(adjustedStart);
  let currentWeek: string[] = [];

  // Continue until we've processed the endDate or finished the last week
  while (currentDate <= endDate || (currentWeek.length > 0 && currentWeek.length < 7)) {
    const dateStr = formatDateKey(currentDate);

    // Only include the date if it's within the requested range
    if (currentDate >= startDate && currentDate <= endDate) {
      currentWeek.push(dateStr);
    } else {
      currentWeek.push("");
    }

    if (currentWeek.length === 7) {
      if (currentWeek.some(d => d !== "")) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
    
    // Safety break (approx 1 year + buffer)
    if (weeks.length > 60) break;
  }

  if (currentWeek.length > 0 && currentWeek.some(d => d !== "")) {
    while (currentWeek.length < 7) {
      currentWeek.push("");
    }
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