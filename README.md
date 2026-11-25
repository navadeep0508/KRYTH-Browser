# Browser Agent

<p align="center">
  <strong>Your agent. Your browser. One connection.</strong><br />
  Turn the browser you already use into a workspace for your AI agent.
</p>

<p align="center">
  English · <a href="README.zh-CN.md">中文</a><br />
  <a href="#quick-start">Get started</a> ·
  <a href="#what-you-can-do">Features</a> ·
  <a href="#documentation">Documentation</a>
</p>

**Browser Agent connects your AI agent to Chrome or Microsoft Edge, using your existing logins.** Give it a task to read, click, fill, or investigate. Work stays visible in a separate **Agent Window**, and you can take over when needed. Existing tabs can be explicitly borrowed and returned when the task ends.

## What you can do

| Your goal | What Browser Agent provides |
| --- | --- |
| **Work where you are already signed in** | Read documents, search internal sites, and complete web workflows with the browser's existing login state. |
| **Turn instructions into browser actions** | Read page text and controls, click, type, fill forms, drag items, select ranges, and manage tabs. Capture viewport or full-page screenshots; upload and download files in local mode. |
| **Stay in control of the task** | Work alongside the agent with shared control, pause it while you edit, and let it reconcile your changes before continuing. Tasks remain visible in their own window; existing tabs can be explicitly borrowed. |
| **Take web data with you** | Export loaded tables and lists as JSON/CSV, with column names, page/frame sources, merged-cell metadata, and explicit coverage. [Structured extraction](docs/structured-extraction.md) |
| **Find the evidence behind a failure** | Connect actions to requests, response bodies, console messages, and page changes. Inspect performance, slow APIs, and suspected duplicate requests; test a hypothesis with explicit HTTP rules or request replay. [Website debugging](docs/website-debugging.md) |
| **Keep a replay of the work** | Record one authorized task tab as a silent MP4, then preview, save, or delete it from the extension. [Task video recording](docs/video-recording.md) |
| **Continue when the page is ready** | Wait for a requested element condition with an explicit timeout before the next step. [Element waits](docs/wait-for-element.md) |
| **Reuse what you already observed** | Execute one chosen action and synchronize with `step`; explicitly save the full observation, then search or read it with `view` without another browser capture. [Steps and saved observations](crates/bsk-cli/skill/references/step-and-cache.md) |
| **Use the right browser for the job** | Name browser instances, bind a task to a specific profile, or pair a server-side agent with the browser on your computer. [Browser profiles](docs/browser-profiles.md) |
| **Review what happened** | Reopen browser-local debugging history, export evidence as JSON, or enable a separate operation audit to review task activity. [Operation audit](docs/operation-audit.md) |

## Quick Start

For local automation, you need **an AI agent + the `bsk` CLI + the browser extension**. The CLI includes the background daemon. The skill teaches your agent how to use it.

| Component | Supported environments |
| --- | --- |
| CLI / daemon | macOS: Apple Silicon and Intel · Linux: x64 and ARM64 · Windows: x64 |
| Extension | Chrome and Microsoft Edge, based on Chromium 125 or later. Other Chromium browsers may work; compatibility is not guaranteed. |
| Agent integration | A shell-capable or MCP-capable agent with the Browser Agent skill. |

### Let your agent set it up

Send this to your agent:

```text
Set up browser-agent on this machine by following AGENT_INSTALL.md
```

The guide covers CLI installation, skill setup, connection checks, and a first browser task. You will still need to install the extension in the browser you want to use.

### Manual setup

#### 1. Install the CLI

macOS / Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/navadeep0508/KRYTH-Browser/main/install.sh | sh
export PATH="${BSK_INSTALL_DIR:-$HOME/.local/bin}:$PATH"
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/navadeep0508/KRYTH-Browser/main/install.ps1 | iex
```

By default, the binary is installed under `~/.local/bin`. Check it in the terminal or agent environment that will use it:

```sh
bsk --version
```

If an already-running agent cannot find `bsk`, restart it to pick up the new PATH, or configure the installed binary's absolute path.

#### 2. Connect the extension

Install the extension from your browser's add-on store (Chrome Web Store or Edge Add-ons), enable the connection and start using it. Local pairing is optional: an unpaired connection stays usable and shows an identity warning. To verify the connection, run `bsk daemon pair` and paste its link into **Connection settings → Pairing link**. Pairing is remembered across restarts and upgrades; a paired connection never automatically skips verification after a failure. See [local pairing](docs/local-pairing.md).

#### 3. Install the skill for your agent

```sh
bsk install-skill
```

Select your harness with **Space**, then press **Enter**. For non-interactive setup, choose it explicitly:

```sh
bsk install-skill --harness cursor --json
```

Use `bsk install-skill --list` to see supported targets and paths. Existing installations are skipped unless you explicitly replace them with `--force`. For another harness, copy the entire [`crates/bsk-cli/skill/`](crates/bsk-cli/skill/) directory into its skills directory as `browser-agent/`, including `references/`.

For MCP clients, `bsk install-skill --harness codex --mcp` also configures the local stdio server (`claude-code` and `cursor` are supported too). See the [MCP setup and workflow](docs/mcp.md).

#### 4. Check the connection

```sh
bsk doctor
```

Resolve any failed checks and confirm that the extension shows **Connected**. Start a new agent session and check that it can discover `browser-agent`; a successful doctor check alone does not confirm skill discovery.

### Try your first task

Once connected, ask your agent:

```text
Use browser-agent to open https://example.com, summarize the page, and end the browser session when finished.
```

The agent opens its own window in the background, reads the page, returns the summary, and stops its task.

## More workflows

### Capture a full page

Use **Quick Actions → Full-page screenshot** for automatic scrolling, a long image you scroll yourself, or the visible area. This extension feature also works without an agent or daemon connection.

For a page in an agent session:

```sh
bsk screenshot --session <id> --full-page --out page.png
```

[Screenshot guide](docs/long-screenshot.md)

### Choose a browser profile

Open the extension in the intended profile and choose **Copy profile instructions**, then send those instructions with your task. You can also assign a unique **Browser name** and select it explicitly:

```sh
bsk browsers
bsk session start --browser "Work profile" --no-focus --json
```

The name is set in Browser Agent; it is not automatically taken from Chrome's profile name. Each session stays bound to the selected instance. [Profile selection guide](docs/browser-profiles.md)

### Run the agent on a server

Keep the browser and its logins on your computer while the agent, CLI, and daemon run on a server. Pair the extension with that server over authenticated WSS; the browser initiates the connection, so your computer needs no inbound port.

[Remote connection guide](docs/remote-extension-connection.md)

## Browser control and privacy

By default, an Agent Window shares the selected profile's login state; **it is not a separate account or security sandbox**. Agents can act with the permissions of the signed-in websites, so choose the tasks and agent you trust.

New tasks enable shared control automatically. Browser Agent observes page changes and supported manual activity in controlled tabs so the agent can yield while you edit and synchronize before acting again. This coordination works even when debugging, audit and video recording are off. Use the task's manual hold and resume controls to keep control while you work. [Shared-control guide](crates/bsk-cli/skill/references/cooperation.md)

The extension has two independent **Automation settings**, both enabled by default:

| Setting | What it controls |
| --- | --- |
| **Confirm before borrowing tabs** | Ask before an agent takes control of one of your existing tabs. Turning it off permits borrowing without that prompt. |
| **Allow requests for human help** | Let the agent ask you to handle login, verification, or another step that needs your participation. |

Browser Agent does not operate a mandatory cloud service or collect product telemetry. Automation results go to your selected daemon or gateway and the agent using it; that agent or service may process or retain them under its own policies. The extension does not independently call an AI provider.

[Privacy policy](apps/extension/PRIVACY.md) · [Operation audit](docs/operation-audit.md) · [Debugging retention and limits](docs/website-debugging.md#history-and-export)

## Documentation

| Goal | Guide |
| --- | --- |
| Install and verify with an agent | [Agent setup](AGENT_INSTALL.md) |
| Investigate a website or API | [Website debugging](docs/website-debugging.md) |
| Capture long pages | [Full-page screenshots](docs/long-screenshot.md) |
| Record and save a task video | [Task video recording](docs/video-recording.md) |
| Export tables or lists | [Structured extraction](docs/structured-extraction.md) |
| Wait for an element condition | [Element waits](docs/wait-for-element.md) |
| Run several decided actions together | [Plans](docs/plan.md) |
| Save and replay a reviewed flow | [Recipes](docs/recipes.md) |
| Use a specific account or profile | [Browser profiles](docs/browser-profiles.md) |
| Connect a server-side agent | [Remote browser connections](docs/remote-extension-connection.md) |
| Run in a sandbox | [Sandboxed agents](docs/sandboxed-agents.md) |
| Review recorded task metadata | [Operation audit](docs/operation-audit.md) |
| Connect over MCP | [MCP server](docs/mcp.md) |
| Understand the implementation | [Architecture](docs/architecture.md) · [Protocol](crates/bsk-protocol/README.md) |

## For Developers

The repository is a Rust + pnpm workspace. For a source build, use Rust stable, Node.js 22, and the pnpm version declared in `package.json`:

```sh
pnpm install --frozen-lockfile
cargo build --release --locked
pnpm ext:build
```

The CLI is built under `target/release/`; load `apps/extension/dist/chrome-mv3/` as an unpacked extension. For extension development, use `pnpm ext:dev`.

| Directory | Component |
| --- | --- |
| `crates/bsk-cli` | CLI, daemon, and bundled agent skill |
| `crates/bsk-protocol` | Wire types and JSON schemas |
| `apps/extension` | Browser automation, debugging workspace, and extension UI |
| `packages/ui`, `packages/i18n`, `packages/vom` | Shared UI, localization, and page observation |
| `evals/browser` | Local test pages and browser capability evaluations |

Run `cargo test --workspace --locked`, `pnpm ext:test`, and `pnpm lint` for the relevant checks. See the [browser evaluation guide](evals/browser/README.md) for reproducible browser cases.

The extension interface supports English, Simplified and Traditional Chinese, Korean, Japanese, French, Italian, Spanish, German, and Brazilian Portuguese. See [localization](packages/i18n/README.md) to contribute translations.

### Reading dynamic pages (unreleased, protocol 1.9)

Use `bsk read` for current DOM fields during animation, and `extract` for tables/lists. MCP exposes it as `bsk_inspect(action=read)`. A script is checked against the `--expect` facts it states, or the whole page when it passes `--observation`; `evaluate --unverified` is the last resort. Read results never renew action authority: protect business facts with expect. See [dynamic reading](docs/dynamic-reading.md) for query fields, safety boundaries, compatibility and reproducible browser tests.
