import satori from "satori";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import { loadFonts } from "../src/image/fonts";

const GEMINI_LOGO = `   █████████  ██████████ ██████   ██████ █████ ██████   █████ █████
  ███░░░░░███░░███░░░░░█░░██████ ██████ ░░███ ░░██████ ░░███ ░░███
 ███     ░░░  ░███  █ ░  ░███░█████░███  ░███  ░███░███ ░███  ░███
░███          ░██████    ░███░░███ ░███  ░███  ░███░░███░███  ░███
░███    █████ ░███░░█    ░███ ░░░  ░███  ░███  ░███ ░░██████  ░███
░░███  ░░███  ░███ ░   █ ░███      ░███  ░███  ░███  ░░█████  ░███
 ░░█████████  ██████████ █████     █████ █████ █████  ░░█████ █████
  ░░░░░░░░░  ░░░░░░░░░░ ░░░░░     ░░░░░ ░░░░░ ░░░░░    ░░░░░ ░░░░░`;

// Init wasm
await initWasm(Bun.file(resvgWasm).arrayBuffer());

const fonts = await loadFonts();

// Create a tight-fitting SVG just for the logo
const LogoComponent = () => (
  <div
    style={{
      display: "flex",
      fontSize: 14,
      lineHeight: 1.1,
      fontWeight: 700,
      fontFamily: "IBM Plex Mono",
      whiteSpace: "pre",
      color: "white",
    }}
  >
    {GEMINI_LOGO}
  </div>
);

// Generate the SVG
const svg = await satori(<LogoComponent />, {
  width: 580,
  height: 115,
  fonts,
});

console.log("SVG generated, size:", (svg.length / 1024).toFixed(2), "KB");

// Convert to PNG at 1x resolution (smaller file)
const resvg = new Resvg(svg, {
  fitTo: { mode: "zoom", value: 1 },
});
const png = resvg.render().asPng();

await Bun.write("assets/gemini-logo.png", png);
console.log("Generated assets/gemini-logo.png");
console.log("PNG size:", (png.length / 1024).toFixed(2), "KB");

// Also create base64 data URL for embedding
const base64 = Buffer.from(png).toString("base64");
const dataUrl = `data:image/png;base64,${base64}`;
console.log("\nData URL length:", (dataUrl.length / 1024).toFixed(2), "KB");
