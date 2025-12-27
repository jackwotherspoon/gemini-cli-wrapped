<div align="center">

# gemini-wrapped

**Your year in Gemini CLI, beautifully visualized.**

Generate a personalized "Wrapped"-style summary of your [Gemini CLI](https://geminicli.com) usage.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?logo=bun&logoColor=white)](https://bun.sh)

</div>

---

## Installation

### Quick Start

Run directly without installing:

```bash
npx gemini-wrapped
```

or with Bun:

```bash
bunx gemini-wrapped
```

## Usage Options

| Option          | Description                          |
| --------------- | ------------------------------------ |
| `--year <YYYY>` | Generate wrapped for a specific year |
| `--help, -h`    | Show help message                    |
| `--version, -v` | Show version number                  |

## Features

- Sessions, messages, tokens, projects, and streaks
- GitHub-style activity heatmap
- Top models breakdown
- Detailed token usage (Input, Output, Cached)
- Shareable PNG image
- Inline image display (Ghostty, Kitty, iTerm2, WezTerm, Konsole)
- Auto-copy to clipboard

## Data Source

Gemini Wrapped reads data from your local Gemini CLI installation (~/.gemini/tmp).
No data is sent anywhere. Everything is processed locally.

## Acknowledgements

Special thanks to the following projects which provided the inspiration and starting point for this tool:
- [opencode-wrapped](https://github.com/moddi3/opencode-wrapped)
- [cc-wrapped](https://github.com/numman-ali/cc-wrapped)

---

<div align="center">

Made with ❤️ for the [Gemini CLI](https://geminicli.com) community

</div>