#!/usr/bin/env bun

import type { BuildOptions } from "bunup";

type Target = {
  os: "linux" | "darwin" | "win32";
  arch: "arm64" | "x64";
  abi?: "musl";
  avx2?: false;
};

export const targetpackageName = "gemini-wrapped";
export const getTargetName = (item: Target) => {
  return [
    targetpackageName,
    item.os === "win32" ? "windows" : item.os,
    item.arch,
    item.avx2 === false ? "baseline" : undefined,
    item.abi === undefined ? undefined : item.abi,
  ]
    .filter(Boolean)
    .join("-");
};

export const targets: Target[] = [
  {
    os: "linux",
    arch: "arm64",
  },
  {
    os: "linux",
    arch: "x64",
  },
  {
    os: "linux",
    arch: "x64",
    avx2: false,
  },
  {
    os: "linux",
    arch: "arm64",
    abi: "musl",
  },
  {
    os: "linux",
    arch: "x64",
    abi: "musl",
  },
  {
    os: "linux",
    arch: "x64",
    abi: "musl",
    avx2: false,
  },
  {
    os: "darwin",
    arch: "arm64",
  },
  {
    os: "darwin",
    arch: "x64",
  },
  {
    os: "darwin",
    arch: "x64",
    avx2: false,
  },
  {
    os: "win32",
    arch: "x64",
  },
  {
    os: "win32",
    arch: "x64",
    avx2: false,
  },
];

const entry = "src/index.ts";
const builds: Partial<BuildOptions>[] = [];
for (const item of targets) {
  const name = getTargetName(item);

  builds.push({
    name,
    entry,
    sourcemap: "external",
    minify: true,
    packages: "bundle",
    preferredTsconfig: "./tsconfig.json",
    compile: {
      target: name.replace(targetpackageName, "bun") as any,
      autoloadBunfig: false,
      autoloadDotenv: false,
      outfile: `bin/${targetpackageName}`,
    },
    outDir: `dist/${name}`,
    format: "esm",
  });
}

export { builds };
