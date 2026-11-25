# Browser Agent

<p align="center">
  <strong>你的 Agent。你的浏览器。连接，就能协作。</strong><br />
  让 AI Agent 在你熟悉、已登录的浏览器里办事。
</p>

<p align="center">
  <a href="#快速开始"><img src="docs/assets/readme-start-zh-CN.svg" alt="开始使用 Browser Agent" width="200" /></a>
  <a href="#能做什么"><img src="docs/assets/readme-features-zh-CN.svg" alt="功能一览" width="200" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> · 中文<br />
  <a href="#快速开始">快速开始</a> ·
  <a href="#能做什么">功能一览</a> ·
  <a href="#文档导航">文档导航</a> ·
  <a href="#面向开发者">面向开发者</a>
</p>

**Browser Agent 把你的 AI Agent 连接到 Chrome 或 Microsoft Edge，直接使用你已有的登录状态。** 交给它读取、点击、填表或排查问题。任务在独立、可见的 **Agent Window（代理窗口）** 中运行，需要时由你接手；也可以显式借用已有标签页，任务结束后归还。

---

## 看看实际效果

<details>
<summary><strong>▶ 观看演示 · 81 秒 · 中文版</strong></summary>

https://github.com/navadeep0508/KRYTH-Browser/raw/main/docs/assets/demo/demo-zh-CN.mp4

</details>

<p align="center">
  点击封面展开播放 · <a href="docs/assets/demo/demo-zh-CN.mp4">下载 MP4</a>
</p>

---

## 能做什么

<table>
  <tr>
    <td><b>用已有账号，做网站任务</b></td>
    <td>复用浏览器登录态，读取文档、搜索内部网站，完成需要登录的网页流程。</td>
  </tr>
  <tr>
    <td><b>一句指令，落实到操作</b></td>
    <td>读取页面文本和控件，点击、输入、填写表单、拖拽元素、选择范围、管理标签页；截取可见区域或完整页面，在本地模式上传和下载文件。</td>
  </tr>
  <tr>
    <td><b>Agent 操作，你来掌控</b></td>
    <td>共享控制让你与 Agent 协作；编辑时暂停 Agent，让它核对你的改动后继续。任务在独立窗口中可见运行，也可显式借用已有标签页。</td>
  </tr>
  <tr>
    <td><b>网页表格，导出即用</b></td>
    <td>将已加载的表格和列表导出为 JSON/CSV，保留列名、页面/frame 来源、合并单元格信息和完整性标记。[结构化提取](docs/structured-extraction.md)</td>
  </tr>
  <tr>
    <td><b>操作出错，找到线索</b></td>
    <td>关联操作、请求、响应正文、控制台和页面变化，检查性能、慢接口与疑似重复请求。[网站调试](docs/website-debugging.md)</td>
  </tr>
  <tr>
    <td><b>录下过程，随时回看</b></td>
    <td>将一个已授权的任务标签页录制为无声 MP4，在扩展中预览、保存或删除。[任务视频录制](docs/video-recording.md)</td>
  </tr>
  <tr>
    <td><b>页面就绪，再做下一步</b></td>
    <td>设置明确的超时，等待目标元素满足指定条件后再继续操作。[元素等待](docs/wait-for-element.md)</td>
  </tr>
  <tr>
    <td><b>已经观察，按需复用</b></td>
    <td>用 `step` 执行一个已决定的动作并同步状态；明确保存完整观察结果，再用 `view` 搜索或分段阅读，无需重新采集页面。[步骤与观察结果保存](crates/bsk-cli/skill/references/step-and-cache.md)</td>
  </tr>
  <tr>
    <td><b>浏览器与账号，选对再开工</b></td>
    <td>为浏览器实例命名，让任务绑定指定 Profile；也可以让服务器上的 Agent 连接你电脑上的浏览器。[浏览器 Profile](docs/browser-profiles.md)</td>
  </tr>
  <tr>
    <td><b>任务结束，记录可查</b></td>
    <td>重新打开浏览器本地的调试历史、导出 JSON，或单独开启操作审计，查看任务执行记录。[操作审计](docs/operation-audit.md)</td>
  </tr>
</table>

---

## 快速开始

本地自动化需要 **AI Agent + `bsk` CLI + 浏览器扩展**。CLI 自带后台守护进程（daemon），skill 则负责告诉 Agent 如何使用这些工具。

| 组件 | 支持环境 |
| --- | --- |
| CLI / daemon | macOS：Apple Silicon、Intel；Linux：x64、ARM64；Windows：x64 |
| 浏览器扩展 | 基于 Chromium 125 或更新版本的 Chrome、Microsoft Edge |
| Agent 接入 | 能调用 Shell 或支持 MCP 的 Agent 配合 Browser Agent skill（[MCP 配置](docs/mcp.md)）。 |

### 让 Agent 帮你安装

把下面这句话发给 Agent：

```text
按照 AGENT_INSTALL.md 的说明，在本机安装并配置 browser-agent。
```

### 手动安装步骤

**1. 安装 CLI**

macOS / Linux：

```sh
curl -fsSL https://raw.githubusercontent.com/navadeep0508/KRYTH-Browser/main/install.sh | sh
export PATH="${BSK_INSTALL_DIR:-$HOME/.local/bin}:$PATH"
```

Windows PowerShell：

```powershell
irm https://raw.githubusercontent.com/navadeep0508/KRYTH-Browser/main/install.ps1 | iex
```

```sh
bsk --version
```

**2. 连接扩展**

从浏览器扩展商店安装 Browser Agent 扩展（Chrome Web Store 或 Edge 加载项商店），开启连接后即可使用。本机配对是可选的：未配对仍可正常使用，扩展会提示连接身份未经验证。如需配对，运行 `bsk daemon pair`，将链接粘贴到**连接设置 → 配对链接**并保存。详见[本机配对指南](docs/local-pairing.zh-CN.md)。

**3. 给 Agent 安装 skill**

```sh
bsk install-skill
```

按 **空格** 选择使用的 Agent，按 **Enter** 安装。非交互安装时显式指定目标，例如：

```sh
bsk install-skill --harness cursor --json
```

用 `bsk install-skill --list` 查看支持的目标和安装路径。其他 Agent 可将完整的 [`crates/bsk-cli/skill/`](crates/bsk-cli/skill/) 目录复制到其 skill 目录下，命名为 `browser-agent/`，保留其中的 `references/`。

**4. 验证连接**

```sh
bsk doctor
```

## 文档导航

| 你想做什么 | 文档 |
| --- | --- |
| 让 Agent 安装并验证连接 | [安装指南](AGENT_INSTALL.md) |
| 排查网站或接口问题 | [网站调试](docs/website-debugging.md) |
| 截取长页面 | [长截图](docs/long-screenshot.md) |
| 录制并保存任务视频 | [任务视频录制](docs/video-recording.md) |
| 导出表格或列表 | [结构化提取](docs/structured-extraction.md) |
| 等待元素条件 | [元素等待](docs/wait-for-element.md) |
| 一次执行多个已决定的动作 | [Plan 命令](docs/plan.md) |
| 保存并回放已审阅的流程 | [Recipe 命令](docs/recipes.md) |
| 使用指定账号或 Profile | [浏览器 Profile](docs/browser-profiles.md) |
| 连接服务器上的 Agent | [远程浏览器连接](docs/remote-extension-connection.md) |
| 在沙盒中使用 | [沙盒环境配置](docs/sandboxed-agents.md) |
| 回看任务操作元数据 | [操作审计](docs/operation-audit.md) |
| 通过 MCP 接入 | [MCP 服务](docs/mcp.md) |
| 了解项目实现 | [架构](docs/architecture.md) · [协议](crates/bsk-protocol/README.md) |

---

## 面向开发者

项目使用 Rust + pnpm workspace。源码构建需要 Rust stable、Node.js 22，以及 `package.json` 声明的 pnpm 版本：

```sh
pnpm install --frozen-lockfile
cargo build --release --locked
pnpm ext:build
```

CLI 产物位于 `target/release/`；将 `apps/extension/dist/chrome-mv3/` 作为解压后的扩展加载。开发扩展时使用 `pnpm ext:dev`。

| 目录 | 内容 |
| --- | --- |
| `crates/bsk-cli` | CLI、daemon 和内置 Agent skill |
| `crates/bsk-protocol` | 通信类型与 JSON Schema |
| `apps/extension` | 浏览器自动化、调试工作区和扩展界面 |
| `packages/ui`、`packages/i18n`、`packages/vom` | 共享 UI、多语言和页面观察 |
| `evals/browser` | 本地测试页面与浏览器能力评测 |

相关检查包括 `cargo test --workspace --locked`、`pnpm ext:test` 和 `pnpm lint`。可复现的浏览器用例见[评测指南](evals/browser/README.zh-CN.md)。

### 动态页面读取（未发布，协议 1.9）

持续动画中的 DOM 字段使用 `bsk read`，表格/列表使用 `extract`；MCP 对应 `bsk_inspect(action=read)`。查询格式、安全边界、兼容性和可复现浏览器测试见[动态页面读取说明](docs/dynamic-reading.md)。

---

<p align="center">
  <b>Browser Agent</b> · 面向 AI 驱动浏览器自动化
</p>
