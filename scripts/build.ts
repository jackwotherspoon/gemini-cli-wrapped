#!/usr/bin/env bun

import { $ } from "bun";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "bunup";

import pkg from "../package.json";
import { builds, getTargetName, targetpackageName, targets } from "./bunup-builds";

export const buildTargets = async (version: string) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dir = path.resolve(__dirname, "..");

  process.chdir(dir);
  await $`rm -rf dist`;

  const binaries: Record<string, string> = {};

  for (let i = 0; i < targets.length; i++) {
    const item = targets[i];
    const name = getTargetName(item);
    const pkgName = name.replace(targetpackageName, pkg.name);
    binaries[pkgName] = version;

    console.log(`\n📦 Building ${name}...`);
    await build(builds[i] as any);

    await Bun.file(`dist/${name}/package.json`).write(
      JSON.stringify(
        {
          name: pkgName,
          version: version,
          os: [item.os === "win32" ? "win32" : item.os],
          cpu: [item.arch],
        },
        null,
        2
      )
    );
    console.log(`✅ ${name}`);
  }

  return binaries;
};

// Allow running directly
if (import.meta.main) {
  const version = process.argv[2] || pkg.version;
  console.log(`\n🎁 Building oc-wrapped v${version}\n`);
  await buildTargets(version);
  console.log("\n✅ Build complete\n");
}
