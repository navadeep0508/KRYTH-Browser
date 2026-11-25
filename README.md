# Browser Agent

<p align="center">
  <strong>Your agent. Your browser. One connection.</strong><br />
  Turn the browser you already use into a workspace for your AI agent.
</p>

<p align="center">
  <a href="#quick-start"><img src="docs/assets/readme-start-en.svg" alt="Get started with Browser Agent" width="200" /></a>
  <a href="#what-you-can-do"><img src="docs/assets/readme-features-en.svg" alt="Features" width="200" /></a>
</p>

<p align="center">
  English · <a href="README.zh-CN.md">中文</a><br />
  <a href="#quick-start">Quick Start</a> ·
  <a href="#what-you-can-do">Features</a> ·
  <a href="#documentation">Documentation</a> ·
  <a href="#for-developers">For Developers</a>
</p>

**Browser Agent connects your AI agent to Chrome or Microsoft Edge, using your existing logins.** Give it a task to read, click, fill, or investigate. Work stays visible in a separate **Agent Window**, and you can take over when needed. Existing tabs can be explicitly borrowed and returned when the task ends.

---

## See it in action

<details>
<summary><strong>▶ Watch the demo · 81 seconds · English</strong></summary>

https://github.com/navadeep0508/KRYTH-Browser/raw/main/docs/assets/demo/demo-en.mp4

</details>

<p align="center">
  Click the cover to expand the video · <a href="docs/assets/demo/demo-en.mp4">Download MP4</a>
</p>

---

## What you can do

<table>
  <tr>
    <td><b>Work where you are already signed in</b></td>
    <td>Read documents, search internal sites, and complete web workflows with the browser's existing login state.</td>
  </tr>
  <tr>
    <td><b>Turn instructions into browser actions</b></td>
    <td>Read page text and controls, click, type, fill forms, drag items, select ranges, and manage tabs. Capture viewport or full-page screenshots; upload and download files in local mode.</td>
  </tr>
  <tr>
    <td><b>Stay in control of the task</b></td>
    <td>Work alongside the agent with shared control, pause it while you edit, and let it reconcile your changes before continuing. Tasks remain visible in their own window; existing tabs can be explicitly borrowed.</td>
  </tr>
  <tr>
    <td><b>Take web data with you</b></td>
    <td>Export loaded tables and lists as JSON/CSV, with column names, page/frame sources, merged-cell metadata, and explicit coverage. [Structured extraction](docs/structured-extraction.md)</td>
  </tr>
  <tr>
    <td><b>Find the evidence behind a failure</b></td>
    <td>Connect actions to requests, response bodies, console messages, and page changes. Inspect performance, slow APIs, and suspected duplicate requests. [Website debugging](docs/website-debugging.md)</td>
  </tr>
  <tr>
    <td><b>Keep a replay of the work</b></td>
    <td>Record one authorized task tab as a silent MP4, then preview, save, or delete it from the extension. [Task video recording](docs/video-recording.md)</td>
  </tr>
  <tr>
    <td><b>Continue when the page is ready</b></td>
    <td>Wait for a requested element condition with an explicit timeout before the next step. [Element waits](docs/wait-for-element.md)</td>
  </tr>
  <tr>
    <td><b>Reuse what you already observed</b></td>
    <td>Execute one chosen action and synchronize with `step`; explicitly save the full observation, then search or read it with `view` without another browser capture. [Steps and saved observations](crates/bsk-cli/skill/references/step-and-cache.md)</td>
  </tr>
  <tr>
    <td><b>Use the right browser for the job</b></td>
    <td>Name browser instances, bind a task to a specific profile, or pair a server-side agent with the browser on your computer. [Browser profiles](docs/browser-profiles.md)</td>
  </tr>
  <tr>
    <td><b>Review what happened</b></td>
    <td>Reopen browser-local debugging history, export evidence as JSON, or enable a separate operation audit to review task activity. [Operation audit](docs/operation-audit.md)</td>
  </tr>
</table>

---

## Quick Start

For local automation, you need **an AI agent + the `bsk` CLI + the browser extension**. The CLI includes the background daemon. The skill teaches your agent how to use it.

| Component | Supported environments |
| --- | --- |
| CLI / daemon | macOS: Apple Silicon and Intel · Linux: x64 and ARM64 · Windows: x64 |
| Extension | Chrome and Microsoft Edge, based on Chromium 125 or later |
| Agent integration | A shell-capable or MCP-capable agent with the Browser Agent skill |

### Let your agent set it up

Send this to your agent:

```text
Set up browser-agent on this machine by following AGENT_INSTALL.md
```

### Manual setup

**1. Install the CLI**

macOS / Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/navadeep0508/KRYTH-Browser/main/install.sh | sh
export PATH="${BSK_INSTALL_DIR:-$HOME/.local/bin}:$PATH"
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/navadeep0508/KRYTH-Browser/main/install.ps1 | iex
```

```sh
bsk --version
```

**2. Connect the extension**

Install the Browser Agent extension from your browser's add-on store (Chrome Web Store or Edge Add-ons), enable the connection and start using it. Local pairing is optional: an unpaired connection stays usable and shows an identity warning. To verify the connection, run `bsk daemon pair` and paste its link into **Connection settings → Pairing link**. [Local pairing guide](docs/local-pairing.md).

**3. Install the skill for your agent**

```sh
bsk install-skill
```

Select your harness with **Space**, then press **Enter**. For non-interactive setup:

```sh
bsk install-skill --harness cursor --json
```

Use `bsk install-skill --list` to see supported targets. For another harness, copy the entire [`crates/bsk-cli/skill/`](crates/bsk-cli/skill/) directory into its skills directory as `browser-agent/`, including `references/`.

**4. Check the connection**

```sh
bsk doctor
```

### Try your first task

Once connected, ask your agent:

```text
Use browser-agent to open https://example.com, summarize the page, and end the browser session when finished.
```

---

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

---

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

### Reading dynamic pages (unreleased, protocol 1.9)

Use `bsk read` for current DOM fields during animation, and `extract` for tables/lists. MCP exposes it as `bsk_inspect(action=read)`. See [dynamic reading](docs/dynamic-reading.md) for query fields, safety boundaries, and reproducible browser tests.

---

<p align="center">
  <b>Browser Agent</b> · Built for AI-driven browser automation
</p>
