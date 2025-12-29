<div align="center">

# gemini-wrapped

**Your year in Gemini CLI, beautifully visualized.**

Generate a personalized "Wrapped"-style summary of your [Gemini CLI](https://geminicli.com) usage.

Credit: Built on top of [opencode-wrapped](https://github.com/moddi3/opencode-wrapped) by moddi3 ([@moddi3io](https://x.com/moddi3io)) and [cc-wrapped](https://github.com/numman-ali/cc-wrapped) by [@nummanali](https://x.com/nummanali).

[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-%231E1E2E?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQ4IiBoZWlnaHQ9IjU0OCIgdmlld0JveD0iMCAwIDU0OCA1NDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTcyXzEyMikiPgogICAgICAgIDxyZWN0IHdpZHRoPSI1NDgiIGhlaWdodD0iNTQ4IiByeD0iMTAwIiBmaWxsPSIjMUUxRTJFIiAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik00NDkuMjkyIDAuMDA3ODEyNUM1MDMuOTI1IDAuNjk5NTY0IDU0OCA0NS4yMDI4IDU0OCAxMDBWNDQ4TDU0Ny45OTIgNDQ5LjI5MkM1NDcuMyA1MDMuOTI1IDUwMi43OTcgNTQ4IDQ0OCA1NDhIMTAwQzQ0Ljc3MTUgNTQ4IDAgNTAzLjIyOCAwIDQ0OFYxMDBDNC4wOTE1N2UtMDYgNDUuMjAzMiA0NC4wNzQ0IDAuNzAwMDc3IDk4LjcwNyAwLjAwNzgxMjVMMTAwIDBINDQ4TDQ0OS4yOTIgMC4wMDc4MTI1Wk0xMDAgMzJDNjIuNDQ0NiAzMiAzMiA2Mi40NDQ2IDMyIDEwMFY0NDhDMzIgNDg1LjU1NSA2Mi40NDQ2IDUxNiAxMDAgNTE2SDQ0OEM0ODUuNTU1IDUxNiA1MTYgNDg1LjU1NSA1MTYgNDQ4VjEwMEM1MTYgNjIuNDQ0NiA0ODUuNTU1IDMyIDQ0OCAzMkgxMDBaTTM4My4wOTEgMjM4LjgxOFYzMjIuNDU1TDE2NS42MzcgNDI3VjM2Ni4zNjRMMzQzLjc4MiAyODAuNjM3TDE2NS42MzcgMTk0LjkwOVYxMzQuMjczTDM4My4wOTEgMjM4LjgxOFoiCiAgICAgICAgICAgIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xNzJfMTIyKSIKICAgICAgICAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik00NDkuMjkyIDAuMDA3ODEyNUM1MDMuOTI1IDAuNjk5NTY0IDU0OCA0NS4yMDI4IDU0OCAxMDBWNDQ4TDU0Ny45OTIgNDQ5LjI5MkM1NDcuMyA1MDMuOTI1IDUwMi43OTcgNTQ4IDQ0OCA1NDhIMTAwQzQ0Ljc3MTUgNTQ4IDAgNTAzLjIyOCAwIDQ0OFYxMDBDNC4wOTE1N2UtMDYgNDUuMjAzMiA0NC4wNzQ0IDAuNzAwMDc3IDk4LjcwNyAwLjAwNzgxMjVMMTAwIDBINDQ4TDQ0OS4yOTIgMC4wMDc4MTI1Wk0xMDAgMzJDNjIuNDQ0NiAzMiAzMiA2Mi40NDQ2IDMyIDEwMFY0NDhDMzIgNDg1LjU1NSA2Mi40NDQ2IDUxNiAxMDAgNTE2SDQ0OEM0ODUuNTU1IDUxNiA1MTYgNDg1LjU1NSA1MTYgNDQ4VjEwMEM1MTYgNjIuNDQ0NiA0ODUuNTU1IDMyIDQ0OCAzMkgxMDBaTTM4My4wOTEgMjM4LjgxOFYzMjIuNDU1TDE2NS42MzcgNDI3VjM2Ni4zNjRMMzQzLjc4MiAyODAuNjM3TDE2NS42MzcgMTk0LjkwOVYxMzQuMjczTDM4My4wOTEgMjM4LjgxOFoiCiAgICAgICAgICAgIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8xNzJfMTIyKSIKICAgICAgICAvPgogICAgPC9nPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE3Ml8xMjIiIHgxPSIxMjgiIHkxPSIyNzYiIHgyPSI0MjEiIHkyPSIyNzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjAxOTYyOTIiIHN0b3AtY29sb3I9IiM0MDZBRkIiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC4yMjY4MjciIHN0b3AtY29sb3I9IiMwNzhFRkIiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC40MTg3NTciIHN0b3AtY29sb3I9IiM5MzlBRkYiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC41ODQ1MTUiIHN0b3AtY29sb3I9IiNENjk4RkMiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC43NzQyNjQiIHN0b3AtY29sb3I9IiNGQTYxNzgiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC45NzkyOCIgc3RvcC1jb2xvcj0iI0YyNTU0RiIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xNzJfMTIyIiB4MT0iMCIgeTE9IjI3NiIgeDI9IjU0OCIgeTI9IjI3NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMjE3QkZFIiAvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAuMzM1MjgzIiBzdG9wLWNvbG9yPSIjMDc4RUZCIiAvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAuNyIgc3RvcC1jb2xvcj0iI0FDODdFQiIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRUU0RDVEIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwMF8xNzJfMTIyIj4KICAgICAgICAgICAgPHJlY3Qgd2lkdGg9IjU0OCIgaGVpZ2h0PSI1NDgiIHJ4PSIxMDAiIGZpbGw9IndoaXRlIiAvPgogICAgICAgIDwvY2xpcFBhdGg+CiAgICA8L2RlZnM+Cjwvc3ZnPgo=)](https://geminicli.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?logo=bun&logoColor=white)](https://bun.sh)

<img src="https://raw.githubusercontent.com/jackwotherspoon/gemini-cli-wrapped/main/assets/images/demo-wrapped.png" width="70%" alt="Gemini Wrapped Example">

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