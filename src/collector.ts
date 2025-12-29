import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import os from "node:os";
import { glob } from "glob";
import type { GeminiSessionData } from "./types";

const GEMINI_DIR = join(os.homedir(), ".gemini");
const GEMINI_TMP_DIR = join(GEMINI_DIR, "tmp");

export interface RawSessionData {
  sessionId: string;
  projectHash: string;
  startTime: string;
  lastUpdated: string;
  messages: any[];
}

export async function checkGeminiDataExists(): Promise<boolean> {
  try {
    const stats = await stat(GEMINI_TMP_DIR);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function collectGeminiSessions(year: number): Promise<RawSessionData[]> {
  if (!(await checkGeminiDataExists())) {
    return [];
  }

  const pattern = join(GEMINI_TMP_DIR, "*", "chats", "session-*.json");
  const sessionFiles = await glob(pattern, { windowsPathsNoEscape: true });
  
  const sessionMap = new Map<string, RawSessionData>();

  for (const file of sessionFiles) {
    try {
      const content = await readFile(file, "utf-8");
      const data = JSON.parse(content) as RawSessionData;
      
      const startTime = new Date(data.startTime);
      if (startTime.getFullYear() !== year) {
        continue;
      }

      const existing = sessionMap.get(data.sessionId);
      if (!existing || new Date(data.lastUpdated) > new Date(existing.lastUpdated)) {
        sessionMap.set(data.sessionId, data);
      }
    } catch (e) {
      continue;
    }
  }

  return Array.from(sessionMap.values());
}
