/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    "main",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        publishCmd: "bun run ./scripts/publish.ts ${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "dist/binaries/*" }
        ]
      }
    ],
  ],
};
