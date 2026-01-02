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

export function mergeSessions(sessions: RawSessionData[]): RawSessionData[] {
  const sessionGroups = new Map<string, RawSessionData[]>();

  for (const session of sessions) {
    if (!sessionGroups.has(session.sessionId)) {
      sessionGroups.set(session.sessionId, []);
    }
    sessionGroups.get(session.sessionId)!.push(session);
  }

  const mergedSessions: RawSessionData[] = [];

  for (const [sessionId, group] of sessionGroups.entries()) {
    if (group.length === 0) continue;

    const messageMap = new Map<string, any>();
    let earliestStart = new Date(group[0].startTime);
    let latestUpdate = new Date(group[0].lastUpdated);
    const projectHash = group[0].projectHash;

    for (const session of group) {
      const start = new Date(session.startTime);
      const update = new Date(session.lastUpdated);
      
      if (start < earliestStart) earliestStart = start;
      if (update > latestUpdate) latestUpdate = update;

      for (const msg of session.messages) {
        const existing = messageMap.get(msg.id);
        // Keep the version of the message that has tokens/metadata if available
        if (!existing || (msg.tokens && !existing.tokens) || (msg.toolCalls && !existing.toolCalls)) {
          messageMap.set(msg.id, msg);
        }
      }
    }

    const mergedMessages = Array.from(messageMap.values()).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    mergedSessions.push({
      sessionId,
      projectHash,
      startTime: earliestStart.toISOString(),
      lastUpdated: latestUpdate.toISOString(),
      messages: mergedMessages
    });
  }

  return mergedSessions;
}

export async function collectGeminiSessions(startDate: Date, endDate: Date): Promise<RawSessionData[]> {
  if (!(await checkGeminiDataExists())) {
    return [];
  }

  const pattern = join(GEMINI_TMP_DIR, "*", "chats", "session-*.json");
  const sessionFiles = await glob(pattern, { windowsPathsNoEscape: true });
  
  const rawSessions: RawSessionData[] = [];

  for (const file of sessionFiles) {
    try {
      const content = await readFile(file, "utf-8");
      const data = JSON.parse(content) as RawSessionData;
      
      const startTime = new Date(data.startTime);
      if (startTime < startDate || startTime > endDate) {
        continue;
      }

      rawSessions.push(data);
    } catch (e) {
      continue;
    }
  }

  return mergeSessions(rawSessions);
}

export async function getAbsoluteFirstSessionDate(): Promise<Date | null> {
  if (!(await checkGeminiDataExists())) {
    return null;
  }

  const pattern = join(GEMINI_TMP_DIR, "*", "chats", "session-*.json");
  const sessionFiles = await glob(pattern, { windowsPathsNoEscape: true });
  
  let earliestDate: Date | null = null;

  for (const file of sessionFiles) {
    try {
      const content = await readFile(file, "utf-8");
      const data = JSON.parse(content) as RawSessionData;
      const startTime = new Date(data.startTime);
      
      if (!earliestDate || startTime < earliestDate) {
        earliestDate = startTime;
      }
    } catch (e) {
      continue;
    }
  }

  return earliestDate;
}
