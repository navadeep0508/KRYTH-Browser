import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import { DEFAULT_DAEMON_WS_URL } from "./src/transport/generated/methods";

// Resolve the extension's own version once at config-evaluation time
// so every entrypoint sees the same string. Reading package.json this
// way avoids the "JSON-import the entire manifest into the bundle"
// trap (review M3 fix to round-1) â€” only the `version` field reaches
// the production bundle via Vite's `define`.
const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(here, "package.json"), "utf8")) as { version: string };
const EXTENSION_VERSION = pkg.version;
let EXTENSION_BUILD = "unknown";
try {
  EXTENSION_BUILD = execFileSync("git", ["describe", "--always", "--dirty"], {
    cwd: here,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  /* Source archives need not contain Git metadata. */
}
const LOGO_PATH = resolve(here, "assets/logo.svg");

const resolvePackageSource = (pkg: string) => resolve(here, `../../packages/${pkg}/src/index.ts`);

// browser-agent extension: MV3, talks to local bsk daemon over WebSocket.
export default defineConfig({
  srcDir: "src",
  outDir: "dist",
  modules: ["@wxt-dev/module-react"],
  hooks: {
    "build:manifestGenerated": (_wxt, manifest) => {
      if (manifest.content_scripts?.length === 0) {
        delete manifest.content_scripts;
      }
      if (manifest.host_permissions?.includes("<all_urls>")) {
        manifest.host_permissions = ["<all_urls>"];
      }
      // Force the action tooltip title â€” wxt/module defaults keep reverting to "Browser Agent"
      if (manifest.action) {
        manifest.action.default_title = "Browser";
      }
    },
  },
  manifest: {
    name: "Browser",
    description:
      "Let AI agents use your logged-in browser in a separate Agent Windowâ€”without interrupting your work. Powered by the bsk CLI.",
    // Flat debugger sessions are required to address out-of-process iframes.
    minimum_chrome_version: "125",
    permissions: [
      "alarms",
      "activeTab",
      "debugger",
      "downloads",
      "idle",
      "notifications",
      "offscreen",
      "scripting",
      "tabs",
      "tabGroups",
      "storage",
      "webNavigation",
      "windows",
    ],
    host_permissions: ["<all_urls>"],
    icons: {
      16: "icon/logo.svg",
      32: "icon/logo.svg",
      48: "icon/logo.svg",
      128: "icon/logo.svg",
    },
    action: {
      default_title: "Browser",
      default_icon: {
        16: "icon/logo.svg",
        32: "icon/logo.svg",
        48: "icon/logo.svg",
        128: "icon/logo.svg",
      },
    },
  },
  vite: (env) => ({
    plugins: [
      tailwindcss(),
      {
        name: "browser-agent-intern-logo-icon",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "icon/logo.svg",
            source: readFileSync(LOGO_PATH),
          });
        },
      },
      ...(env.mode === "production"
        ? [
            {
              name: "browser-agent-strip-output-validators",
              enforce: "pre" as const,
              load(id: string) {
                if (
                  id.replaceAll("\\", "/").endsWith("/src/transport/generated/output-validators.js")
                ) {
                  return "export {};";
                }
                return null;
              },
            },
          ]
        : []),
    ],
    define: {
      __BSK_EXT_BUILD__: JSON.stringify(EXTENSION_BUILD),
      __BSK_EXT_VERSION__: JSON.stringify(EXTENSION_VERSION),
      __BSK_DAEMON_WS_URL__: JSON.stringify(process.env.BSK_DAEMON_WS_URL ?? DEFAULT_DAEMON_WS_URL),
    },
    resolve: {
      alias: {
        "@browser-agent/i18n/react": resolve(here, "../../packages/i18n/src/react.tsx"),
        "@browser-agent/i18n": resolvePackageSource("i18n"),
      },
    },
  }),
});


