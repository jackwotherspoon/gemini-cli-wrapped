#!/usr/bin/env bun

import { generateImage } from "../src/image/generator";
import type { GeminiStats } from "../src/types";
import { join } from "node:path";

function generateDemoStats(): GeminiStats {
  const year = 2025;
  const dailyActivity = new Map<string, number>();
  const endDate = new Date(year, 11, 27);
  const startDate = new Date(year, 10, 1);
  
  const last30DaysStart = new Date(endDate);
  last30DaysStart.setDate(last30DaysStart.getDate() - 30);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const isRecent = d >= last30DaysStart;
    const baseChance = isRecent ? 0.95 : 0.4;
    const multiplier = isRecent ? 12 : 3;

    if (Math.random() < baseChance) {
      const count = (Math.floor(Math.random() * 50) + 10) * multiplier;
      dailyActivity.set(dateStr, count);
    }
  }

  const maxStreakDays = new Set<string>();
  const streakStart = new Date(year, 11, 8);
  for (let i = 0; i < 19; i++) {
    const d = new Date(streakStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    maxStreakDays.add(dateStr);
    dailyActivity.set(dateStr, Math.floor(Math.random() * 150) + 100);
  }

  const weekdayCounts: [number, number, number, number, number, number, number] = [
    800, 4500, 2400, 2800, 3100, 4200, 1000
  ];

  const maxWeekdayCount = Math.max(...weekdayCounts);
  const mostActiveWeekday = weekdayCounts.indexOf(maxWeekdayCount);
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return {
    year,
    firstSessionDate: new Date(year, 10, 1),
    daysSinceFirstSession: 57,
    totalSessions: 6220,
    totalMessages: 44100,
    totalProjects: 48,
    totalInputTokens: 1_493_673_920,
    totalOutputTokens: 13_613_510,
    totalCachedTokens: 1_119_118_490,
    totalThoughtTokens: 2_500_000,
    totalTokens: 1_516_000_000,
    totalCost: 794.43,
    hasUsageCost: true,
    topModels: [
      { name: "gemini-3-pro-preview", count: 13200, percentage: 30.0 },
      { name: "gemini-2.5-flash", count: 10560, percentage: 24.0 },
      { name: "gemini-3-flash-preview", count: 7480, percentage: 17.0 },
    ],
    topLanguages: [
      { name: "TypeScript", count: 5800, percentage: 59.0 },
      { name: "HTML", count: 1000, percentage: 10.0 },
      { name: "JavaScript", count: 900, percentage: 9.0 },
    ],
    totalToolCalls: 24060,
    maxStreak: 19,
    currentStreak: 19,
    maxStreakDays,
    dailyActivity,
    mostActiveDay: {
      date: "2025-12-15",
      count: 1120,
      formattedDate: "Monday, Dec 15",
    },
    weekdayActivity: {
      counts: weekdayCounts,
      mostActiveDay: mostActiveWeekday,
      mostActiveDayName: weekdayNames[mostActiveWeekday],
      maxCount: maxWeekdayCount,
    },
  };
}

async function main() {
  console.log("Generating demo wrapped image...");

  const stats = generateDemoStats();
  const image = await generateImage(stats);

  const outputPath = join(import.meta.dir, "..", "assets", "images", "demo-wrapped.png");
  await Bun.write(outputPath, image.fullSize);

  console.log(`Demo image saved to: ${outputPath}`);
}

main().catch(console.error);