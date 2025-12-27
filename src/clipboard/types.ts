export interface ClipboardResult {
  success: boolean;
  error?: string;
}

export interface ClipboardProvider {
  copyImage(imagePath: string): Promise<ClipboardResult>;
  isAvailable(): Promise<boolean>;
  name: string;
}

export const DEFAULT_TIMEOUT_MS = 2000;
