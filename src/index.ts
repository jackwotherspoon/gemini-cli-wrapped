#!/usr/bin/env bun

import * as p from "@clack/prompts";
import { join } from "node:path";
import { parseArgs } from "node:util";
import os from "node:os";

import { checkGeminiDataExists, collectGeminiSessions, getAbsoluteFirstSessionDate } from "./collector";
import { processStats } from "./stats";
import { generateImage } from "./image/generator";
import { displayInTerminal, getTerminalName } from "./terminal/display";
import { copyImageToClipboard } from "./clipboard";
import { formatNumber } from "./utils/format";
import { isWrappedAvailable, getWrappedPeriod } from "./utils/dates";
import type { GeminiStats } from "./types";
import pkg from "../package.json";

const VERSION = pkg.version;

function printHelp() {
  console.log(`
  gemini-wrapped v${VERSION}

  Generate your Gemini CLI year in review stats card.

  USAGE:
    gemini-wrapped [OPTIONS]

  OPTIONS:
    --year <YYYY>    Generate wrapped for a specific year (default: current year)
    --help, -h       Show this help message
    --version, -v    Show version number

  EXAMPLES:
    gemini-wrapped              # Generate current year wrapped
    gemini-wrapped --year 2025  # Generate 2025 wrapped
  `);
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      year: { type: "string", short: "y" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
    strict: true,
    allowPositionals: false,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  if (values.version) {
    console.log(`gemini-wrapped v${VERSION}`);
    process.exit(0);
  }

  p.intro("gemini wrapped");

  const requestedYear = values.year ? parseInt(values.year, 10) : undefined;
  const period = getWrappedPeriod(requestedYear);

  const availability = isWrappedAvailable(requestedYear || new Date().getFullYear());
  if (!availability.available) {
    if (Array.isArray(availability.message)) {
      availability.message.forEach((line) => p.log.warn(line));
    } else {
      p.log.warn(availability.message || "Wrapped not available yet.");
    }
    p.cancel();
    process.exit(0);
  }

  const dataExists = await checkGeminiDataExists();
  if (!dataExists) {
    p.cancel(`Gemini CLI data not found in ~/.gemini/tmp\n\nMake sure you have used Gemini CLI at least once.`);
    process.exit(0);
  }

  const spinner = p.spinner();
  spinner.start("Scanning your Gemini CLI history...");

  let stats: GeminiStats;
  try {
    const rawSessions = await collectGeminiSessions(period.startDate, period.endDate);
    const absoluteFirstSessionDate = await getAbsoluteFirstSessionDate();
    if (rawSessions.length === 0) {
      spinner.stop("No data found");
      p.cancel(`No Gemini CLI activity found for ${period.label}`);
      process.exit(0);
    }
    stats = processStats(rawSessions, period.label, period.startDate, period.endDate, absoluteFirstSessionDate);
  } catch (error) {
    spinner.stop("Failed to collect stats");
    p.cancel(`Error: ${error}`);
    process.exit(1);
  }

  spinner.stop("Found your stats!");

  // Display summary
  const summaryLines = [
    `Sessions:      ${formatNumber(stats.totalSessions)}`,
    `Messages:      ${formatNumber(stats.totalMessages)}`,
    `Total Tokens:  ${formatNumber(stats.totalTokens)}`,
    `Projects:      ${formatNumber(stats.totalProjects)}`,
    `Streak:        ${stats.maxStreak} days`,
    stats.mostActiveDay && `Most Active:   ${stats.mostActiveDay.formattedDate}`,
  ].filter(Boolean) as string[];

  p.note(summaryLines.join("\n"), `Your ${period.label} in Gemini CLI`);

  if (period.isRolling) {
    p.log.info(`Tip: Use --year <YYYY> to see stats for a specific year.`);
  }

  // Generate image
  spinner.start("Generating your wrapped image...");

  let image;
  try {
    image = await generateImage(stats);
  } catch (error) {
    spinner.stop("Failed to generate image");
    p.cancel(`Error generating image: ${error}`);
    console.error(error);
    process.exit(1);
  }

  spinner.stop("Image generated!");

  const displayed = await displayInTerminal(image.displaySize);
  if (!displayed) {
    p.log.info(`Terminal (${getTerminalName()}) doesn't support inline images`);
  }

  const filename = `gemini-wrapped-${period.label.replace(/\s+/g, "-").toLowerCase()}.png`;
  const { success, error } = await copyImageToClipboard(image.fullSize, filename);

  if (success) {
    p.log.success("Automatically copied image to clipboard!");
  } else {
    p.log.warn(`Clipboard unavailable: ${error}`);
    p.log.info("You can save the image to disk instead.");
  }

  const defaultPath = join(os.homedir(), filename);

  const shouldSave = await p.confirm({
    message: `Save image to ~/${filename}?`,
    initialValue: true,
  });

  if (p.isCancel(shouldSave)) {
    p.outro("Cancelled");
    process.exit(0);
  }

  if (shouldSave) {
    try {
      await Bun.write(defaultPath, image.fullSize);
      p.log.success(`Saved to ${defaultPath}`);
    } catch (error) {
      p.log.error(`Failed to save: ${error}`);
    }
  }

  const shouldShare = await p.confirm({
    message: "Share on X (Twitter)? Don't forget to attach your image!",
    initialValue: true,
  });

  if (!p.isCancel(shouldShare) && shouldShare) {
    const tweetUrl = generateTweetUrl(stats);
    const opened = await openUrl(tweetUrl);
    if (opened) {
      p.log.success("Opened X in your browser.");
    } else {
      p.log.warn("Couldn't open browser. Copy this URL:");
      p.log.info(tweetUrl);
    }
  }

  p.outro("Share your wrapped! geminicli.com");
  process.exit(0);
}

function generateTweetUrl(stats: GeminiStats): string {
  const lines: string[] = [];
  lines.push(`Gemini CLI Wrapped ${stats.periodLabel} 📊`);
  lines.push("");
  lines.push(`Total Tokens: ${formatNumber(stats.totalTokens)}`);
  lines.push(`Total Messages: ${formatNumber(stats.totalMessages)}`);
  lines.push(`Total Sessions: ${formatNumber(stats.totalSessions)}`);
  lines.push("");
  lines.push(`Longest Streak: ${stats.maxStreak} days`);
  lines.push(`Top Model: ${stats.topModels[0]?.name ?? "N/A"}`);
  lines.push(`Top Language: ${stats.topLanguages[0]?.name ?? "N/A"}`);

  lines.push("");
  lines.push("Get yours:");
  lines.push("❯ npx gemini-wrapped");
  lines.push("");
  lines.push("Credit: @JackWoth98 @moddi3io @nummanali");
  lines.push("");
  lines.push("(Paste image with CMD/CTRL+V)");

  const text = lines.join("\n");
  const url = new URL("https://x.com/intent/tweet");
  url.searchParams.set("text", text);
  return url.toString();
}

async function openUrl(url: string): Promise<boolean> {
  const platform = process.platform;
  let command: string;

  if (platform === "darwin") {
    command = "open";
  } else if (platform === "win32") {
    command = "start";
  } else {
    command = "xdg-open";
  }

  try {
    const proc = Bun.spawn([command, url], {
      stdout: "ignore",
      stderr: "ignore",
    });
    await proc.exited;
    return proc.exitCode === 0;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});