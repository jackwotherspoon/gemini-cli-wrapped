import type { ClipboardProvider, ClipboardResult } from "./types";
import { DEFAULT_TIMEOUT_MS } from "./types";

const isWSL = !!process.env.WSL_DISTRO_NAME;

/**
 * Convert WSL path to Windows path
 * e.g., /tmp/image.png -> \\wsl$\Ubuntu\tmp\image.png
 */
async function toWindowsPath(wslPath: string): Promise<string> {
  const proc = Bun.spawn(["wslpath", "-w", wslPath], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error("Failed to convert WSL path to Windows path");
  }

  return (await new Response(proc.stdout).text()).trim();
}

export const windowsProvider: ClipboardProvider = {
  name: isWSL ? "Windows (via WSL)" : "Windows",

  async isAvailable(): Promise<boolean> {
    return process.platform === "win32" || isWSL;
  },

  async copyImage(imagePath: string): Promise<ClipboardResult> {
    try {
      // Convert path if running under WSL
      const winPath = isWSL ? await toWindowsPath(imagePath) : imagePath;

      // Escape backslashes for PowerShell string
      const escapedPath = winPath.replace(/\\/g, "\\\\");

      // PowerShell script to copy image to clipboard using .NET
      const script = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
try {
  $img = [System.Drawing.Image]::FromFile("${escapedPath}")
  [System.Windows.Forms.Clipboard]::SetImage($img)
  $img.Dispose()
  exit 0
} catch {
  Write-Error $_.Exception.Message
  exit 1
}
`.trim();

      const proc = Bun.spawn(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const timeoutId = setTimeout(() => proc.kill(), DEFAULT_TIMEOUT_MS);

      const exitCode = await proc.exited;
      clearTimeout(timeoutId);

      if (exitCode === 0) {
        return { success: true };
      }

      const stderr = await new Response(proc.stderr).text();
      return {
        success: false,
        error: stderr.trim() || `PowerShell exited with code ${exitCode}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
