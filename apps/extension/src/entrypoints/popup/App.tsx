import { useTranslation } from "@browser-agent/i18n/react";
import { Button, cn } from "@browser-agent/ui";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { PROTOCOL_VERSION } from "@/transport/handshake";
import { DaemonUpgradeNotice } from "./daemon-upgrade-notice";
import {
  type PopupStatusState,
  useConnectionState,
} from "./use-connection-state";
import type { PopupSnapshotInfo } from "@/lib/popup-bridge";
import { useControlHintsHidden } from "./use-control-hints-hidden";
import { ConnectionScreen } from "./screens/ConnectionScreen";
import { LiveBrowserScreen } from "./screens/LiveBrowserScreen";
import { OwnershipControlsScreen } from "./screens/OwnershipControlsScreen";
import { ActivityTimelineScreen } from "./screens/ActivityTimelineScreen";
import { SessionManagementScreen } from "./screens/SessionManagementScreen";
import {
  RiLayoutLine,
  RiGlobalLine,
  RiShieldLine,
  RiHistoryLine,
  RiFolderLine,
} from "@remixicon/react";
import { POPUP_FEATURES } from "./features";

type Screen =
  | "connection"
  | "live-browser"
  | "ownership"
  | "timeline"
  | "sessions";

const SCREEN_ICONS: Record<Screen, typeof RiLayoutLine> = {
  connection: RiLayoutLine,
  "live-browser": RiGlobalLine,
  ownership: RiShieldLine,
  timeline: RiHistoryLine,
  sessions: RiFolderLine,
};

const SCREEN_LABELS: Record<Screen, string> = {
  connection: "Connection",
  "live-browser": "Live Browser",
  ownership: "Ownership Controls",
  timeline: "Activity Timeline",
  sessions: "Session Management",
};

const STATE_LABEL_KEYS: Record<PopupStatusState, string> = {
  disconnected: "popup.stateLabel.disconnected",
  connected: "popup.stateLabel.connected",
  version_skew: "popup.stateLabel.version_skew",
  disabled: "popup.stateLabel.disabled",
} as const satisfies Record<PopupStatusState, string>;

function getLogoSrc() {
  if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
    return chrome.runtime.getURL("icon/logo.svg");
  }
  return "/icon/logo.svg";
}

export function App() {
  const { t } = useTranslation("extension");
  const {
    snapshot,
    statusState,
    setLabel,
    setConnectionEnabled,
    holdTab,
    resumeTab,
    yieldTab,
  } = useConnectionState();
  const [controlHintsHidden, setControlHintsHidden] = useControlHintsHidden();
  const [screen, setScreen] = useState<Screen>("connection");
  const [copiedInstanceId, setCopiedInstanceId] = useState(false);
  const [copiedTick, setCopiedTick] = useState(0);
  const showCopiedToast = copiedTick > 0;

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (isDark: boolean) => {
      document.documentElement.classList.toggle("dark", isDark);
    };
    applyTheme(query.matches);
    const onChange = (event: MediaQueryListEvent) => applyTheme(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setCopiedInstanceId(false);
    setCopiedTick(0);
  }, [snapshot.instanceId]);

  const isSkewed = statusState === "version_skew";
  const isDisconnected = statusState === "disconnected";
  const connectionLive = statusState === "connected" || isSkewed;
  const daemonUpgrade =
    snapshot.connectionEnabled &&
    snapshot.state !== "connected" &&
    snapshot.state !== "version_skew"
      ? snapshot.daemonUpgradeRequired
      : null;
  const daemonVersion = snapshot.handshake?.version ?? daemonUpgrade?.daemonVersion ?? "â€”";
  const daemonProtocol = snapshot.handshake?.protocol_version ?? "â€”";
  const extensionVersion = snapshot.extensionVersion || "â€”";
  const instanceId = snapshot.instanceId || "â€”";

  const copyInstanceId = async () => {
    if (!snapshot.instanceId || !navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(snapshot.instanceId);
    setCopiedInstanceId(true);
    setCopiedTick((tick) => tick + 1);
  };

  const isDev = import.meta.env.DEV;

  const headerTitle = SCREEN_LABELS[screen];

  return (
    <main
      className="min-w-[320px] max-w-[360px] bg-background text-foreground"
      data-slot="popup-root"
    >
      <header
        className="flex items-center justify-between gap-2 border-b border-border pb-2 mb-3"
        data-slot="popup-header"
      >
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={getLogoSrc()}
            alt=""
            className="size-6 shrink-0 rounded-md"
            data-slot="popup-brand-logo"
          />
          <h1 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
            {headerTitle}
          </h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 shrink-0 rounded-md"
          aria-label={t("popup.copyInstanceId")}
          disabled={!snapshot.instanceId}
          title={copiedInstanceId ? t("popup.copied") : t("popup.copyInstanceId")}
          onClick={() => {
            void copyInstanceId();
          }}
          data-slot="popup-copy-instance-id"
        >
          {copiedInstanceId ? (
            <RiCheckLine className="size-3" aria-hidden />
          ) : (
            <RiFileCopyLine className="size-3" aria-hidden />
          )}
        </Button>
      </header>

      {daemonUpgrade && <DaemonUpgradeNotice upgrade={daemonUpgrade} error={snapshot.lastError} />}

      {/* Screen navigation */}
      <nav className="flex gap-1 border-b border-border pb-2 mb-3 overflow-x-auto" data-slot="popup-nav">
        {Object.entries(SCREEN_LABELS).map(([id, label]) => {
          const active = screen === id;
          const Icon = SCREEN_ICONS[id as Screen];
          return (
            <Button
              key={id}
              type="button"
              variant={active ? "default" : "ghost"}
              size="sm"
              className={cn(
                "shrink-0 rounded-lg text-xs font-medium",
                active
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
              onClick={() => setScreen(id as Screen)}
              data-slot={`popup-nav-${id}`}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden />
              <span className="ml-1.5 hidden sm:inline">{label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Screen content */}
      {screen === "connection" && (
        <ConnectionScreen
          snapshot={snapshot}
          statusState={statusState}
          setLabel={setLabel}
          setConnectionEnabled={setConnectionEnabled}
          connectionLive={connectionLive}
          isSkewed={isSkewed}
          isDisconnected={isDisconnected}
          daemonVersion={daemonVersion}
          extensionVersion={extensionVersion}
          controlHintsHidden={controlHintsHidden}
          setControlHintsHidden={setControlHintsHidden}
        />
      )}
      {screen === "live-browser" && (
        <LiveBrowserScreen tabs={snapshot.tabs} connectionLive={connectionLive} />
      )}
      {screen === "ownership" && (
        <OwnershipControlsScreen
          tabs={snapshot.tabs}
          holdTab={holdTab}
          resumeTab={resumeTab}
          yieldTab={yieldTab}
        />
      )}
      {screen === "timeline" && <ActivityTimelineScreen tabs={snapshot.tabs} />}
      {screen === "sessions" && <SessionManagementScreen sessionCount={snapshot.sessionCount} />}

      {/* Dev features (hidden behind dev flag) */}
      {isDev && (
        <section
          className="mt-4 border-t border-border pt-3"
          data-slot="popup-dev-section"
        >
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Dev
          </h2>
          <div className="space-y-1" data-slot="popup-dev-features">
            {POPUP_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  data-slot={`popup-dev-feature-${feature.id}`}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {t(feature.titleKey)}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {t(feature.descKey)}
                    </span>
                  </span>
                  <RiArrowRightSLine className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer: connection status + meta */}
      <footer
        className="mt-4 border-t border-border pt-2"
        data-slot="popup-footer"
      >
        <div className="flex items-center justify-between gap-2 text-[10px] leading-tight text-gray-500">
          <div className="flex shrink-0 items-center gap-1">
            <span title={t("popup.daemonVersionHint")}>CLI {daemonVersion}</span>
            <span aria-hidden>/</span>
            <span title={t("popup.extensionVersionHint")}>Ext {extensionVersion}</span>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-1">
            <span className="shrink-0">{t("popup.instanceTitle")}</span>
            <code
              className="max-w-[88px] truncate font-mono text-foreground/80"
              data-slot="popup-instance-id"
            >
              {instanceId}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-5 rounded-md px-1.5"
              disabled={!snapshot.instanceId}
              aria-label={t("popup.copyInstanceId")}
              title={copiedInstanceId ? t("popup.copied") : t("popup.copyInstanceId")}
              onClick={() => {
                void copyInstanceId();
              }}
              data-slot="popup-copy-instance-id"
            >
              {copiedInstanceId ? (
                <RiCheckLine className="size-3" aria-hidden />
              ) : (
                <RiFileCopyLine className="size-3" aria-hidden />
              )}
            </Button>
          </div>
        </div>
        {copiedTick > 0 && (
          <div
            role="status"
            className="mt-1 flex items-center gap-1 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[10px] font-medium text-white shadow-md backdrop-blur"
            data-slot="popup-copied-toast"
          >
            <RiCheckLine className="size-3" aria-hidden />
            {t("popup.copied")}
          </div>
        )}
      </footer>
    </main>
  );
}


