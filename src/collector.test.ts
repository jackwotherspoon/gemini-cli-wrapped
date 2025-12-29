import { expect, test, describe } from "bun:test";
import { mergeSessions, type RawSessionData } from "./collector";

describe("mergeSessions", () => {
  test("deduplicates incremental snapshots by message id", () => {
    const sessionId = "session-1";
    const projectHash = "hash-1";
    
    const snapshot1: RawSessionData = {
      sessionId,
      projectHash,
      startTime: "2025-01-01T10:00:00Z",
      lastUpdated: "2025-01-01T10:05:00Z",
      messages: [
        { id: "msg-1", timestamp: "2025-01-01T10:01:00Z", type: "user", content: "hi" },
        { id: "msg-2", timestamp: "2025-01-01T10:02:00Z", type: "gemini", content: "hello" }
      ]
    };

    const snapshot2: RawSessionData = {
      sessionId,
      projectHash,
      startTime: "2025-01-01T10:00:00Z",
      lastUpdated: "2025-01-01T10:10:00Z",
      messages: [
        { id: "msg-1", timestamp: "2025-01-01T10:01:00Z", type: "user", content: "hi" },
        { id: "msg-2", timestamp: "2025-01-01T10:02:00Z", type: "gemini", content: "hello" },
        { id: "msg-3", timestamp: "2025-01-01T10:08:00Z", type: "user", content: "how are you?" }
      ]
    };

    const merged = mergeSessions([snapshot1, snapshot2]);
    
    expect(merged.length).toBe(1);
    expect(merged[0].messages.length).toBe(3);
    expect(merged[0].messages.map(m => m.id)).toEqual(["msg-1", "msg-2", "msg-3"]);
    expect(merged[0].lastUpdated).toBe("2025-01-01T10:10:00.000Z");
  });

  test("merges segmented sessions (e.g. from /compress)", () => {
    const sessionId = "session-1";
    const projectHash = "hash-1";

    // Part 1: Initial messages (before compression)
    const part1: RawSessionData = {
      sessionId,
      projectHash,
      startTime: "2025-01-01T10:00:00Z",
      lastUpdated: "2025-01-01T10:05:00Z",
      messages: [
        { id: "msg-1", timestamp: "2025-01-01T10:01:00Z", type: "user", content: "very long prompt" },
        { id: "msg-2", timestamp: "2025-01-01T10:02:00Z", type: "gemini", content: "detailed response" }
      ]
    };

    // Part 2: After compression (Part 1 messages are gone, replaced by summary, plus new messages)
    const part2: RawSessionData = {
      sessionId,
      projectHash,
      startTime: "2025-01-01T10:10:00Z",
      lastUpdated: "2025-01-01T10:15:00Z",
      messages: [
        { id: "msg-summary", timestamp: "2025-01-01T10:11:00Z", type: "user", content: "summary of part 1" },
        { id: "msg-3", timestamp: "2025-01-01T10:12:00Z", type: "user", content: "new message" }
      ]
    };

    const merged = mergeSessions([part1, part2]);

    expect(merged.length).toBe(1);
    // Should have all unique messages across segments
    expect(merged[0].messages.length).toBe(4);
    expect(merged[0].messages.map(m => m.id)).toEqual(["msg-1", "msg-2", "msg-summary", "msg-3"]);
    expect(merged[0].startTime).toBe("2025-01-01T10:00:00.000Z");
    expect(merged[0].lastUpdated).toBe("2025-01-01T10:15:00.000Z");
  });

  test("prioritizes messages with tokens/metadata during deduplication", () => {
    const sessionId = "session-1";
    
    // An early snapshot where tokens aren't recorded yet
    const snapshot1: RawSessionData = {
      sessionId,
      projectHash: "h1",
      startTime: "2025-01-01T10:00:00Z",
      lastUpdated: "2025-01-01T10:01:00Z",
      messages: [
        { id: "msg-1", timestamp: "2025-01-01T10:00:30Z", type: "gemini", content: "resp" }
      ]
    };

    // A later snapshot where the same message now has token usage data
    const snapshot2: RawSessionData = {
      sessionId,
      projectHash: "h1",
      startTime: "2025-01-01T10:00:00Z",
      lastUpdated: "2025-01-01T10:02:00Z",
      messages: [
        { 
          id: "msg-1", 
          timestamp: "2025-01-01T10:00:30Z", 
          type: "gemini", 
          content: "resp",
          tokens: { input: 10, output: 5, total: 15 } 
        }
      ]
    };

    const merged = mergeSessions([snapshot1, snapshot2]);
    expect(merged[0].messages[0].tokens).toBeDefined();
    expect(merged[0].messages[0].tokens?.input).toBe(10);

    // Should also work if provided in reverse order
    const mergedReverse = mergeSessions([snapshot2, snapshot1]);
    expect(mergedReverse[0].messages[0].tokens).toBeDefined();
    expect(mergedReverse[0].messages[0].tokens?.input).toBe(10);
  });
});
