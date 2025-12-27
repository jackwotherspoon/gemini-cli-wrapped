import { tmpdir } from "os";
import { join } from "path";
import { unlink } from "fs/promises";
import type { ClipboardResult, ClipboardProvider } from "./types";
import { macOSProvider } from "./macos";
import { linuxProvider } from "./linux";
import { windowsProvider } from "./windows";

export type { ClipboardResult };

const providers: ClipboardProvider[] = [macOSProvider, linuxProvider, windowsProvider];

/**
 * Get the appropriate clipboard provider for the current platform
 */
async function getProvider(): Promise<ClipboardProvider | null> {
  for (const provider of providers) {
    if (await provider.isAvailable()) {
      return provider;
    }
  }
  return null;
}

/**
 * Copy a PNG image buffer to the system clipboard
 *
 * Uses platform-specific tools:
 * - macOS: osascript (AppleScript)
 * - Linux: wl-copy (Wayland) or xclip/xsel (X11)
 * - Windows/WSL: PowerShell with .NET
 *
 * @param pngBuffer - PNG image data as Buffer
 * @returns Result indicating success or failure with error message
 */
export async function copyImageToClipboard(pngBuffer: Buffer, filename: string): Promise<ClipboardResult> {
  const provider = await getProvider();

  if (!provider) {
    return {
      success: false,
      error: getUnsupportedPlatformError(),
    };
  }

  // Write to temp file - most reliable for binary data across platforms
  const tempPath = join(tmpdir(), filename);

  try {
    await Bun.write(tempPath, pngBuffer);
    return await provider.copyImage(tempPath);
  } finally {
    // Clean up temp file
    try {
      await unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

function getUnsupportedPlatformError(): string {
  const platform = process.platform;

  if (platform === "linux") {
    return "No clipboard tool found. Install wl-clipboard (Wayland) or xclip/xsel (X11).";
  }

  return `Clipboard not supported on platform: ${platform}`;
}
