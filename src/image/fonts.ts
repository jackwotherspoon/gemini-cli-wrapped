// Font loader for Satori

import type { Font } from "satori";

import regularFontPath from "../../assets/fonts/IBMPlexMono-Regular.ttf";
import mediumFontPath from "../../assets/fonts/IBMPlexMono-Medium.ttf";
import boldFontPath from "../../assets/fonts/IBMPlexMono-Bold.ttf";

export async function loadFonts(): Promise<Font[]> {
  const [regularFont, mediumFont, boldFont] = await Promise.all([
    Bun.file(regularFontPath).arrayBuffer(),
    Bun.file(mediumFontPath).arrayBuffer(),
    Bun.file(boldFontPath).arrayBuffer(),
  ]);

  return [
    {
      name: "IBM Plex Mono",
      data: regularFont,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: mediumFont,
      weight: 500,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: boldFont,
      weight: 700,
      style: "normal",
    },
  ];
}
