import type { ClipboardProvider, ClipboardResult } from "./types";
import { DEFAULT_TIMEOUT_MS } from "./types";

export const macOSProvider: ClipboardProvider = {
  name: "macOS (osascript)",

  async isAvailable(): Promise<boolean> {
    return process.platform === "darwin";
  },

  async copyImage(imagePath: string): Promise<ClipboardResult> {
    // AppleScript to copy PNG to clipboard
    // Uses «class PNGf» for PNG format
    const script = `set the clipboard to (read POSIX file "${imagePath}" as «class PNGf»)`;

    const proc = Bun.spawn(["osascript", "-e", script], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const timeoutId = setTimeout(() => proc.kill(), DEFAULT_TIMEOUT_MS);

    try {
      const exitCode = await proc.exited;
      clearTimeout(timeoutId);

      if (exitCode === 0) {
        return { success: true };
      }

      const stderr = await new Response(proc.stderr).text();
      return {
        success: false,
        error: stderr.trim() || `osascript exited with code ${exitCode}`,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
