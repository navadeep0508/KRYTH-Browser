import { Badge, Button, Card, CardContent, CardHeader } from "@browser-agent/ui";
import {
  RiGlobalLine,
  RiCheckLine,
  RiRefreshLine,
  RiShieldLine,
} from "@remixicon/react";
import { type TabOwnershipInfo } from "@/lib/popup-bridge";

type LiveBrowserScreenProps = {
  tabs: TabOwnershipInfo[];
  connectionLive: boolean;
};

const MODE_BADGES: Record<string, { label: string; variant: "default" | "secondary" }> = {
  ready: { label: "Ready", variant: "secondary" },
  human: { label: "Human", variant: "default" },
  held: { label: "Paused", variant: "secondary" },
  yielding: { label: "Yielding", variant: "secondary" },
  syncing: { label: "Syncing", variant: "secondary" },
  acting: { label: "Acting", variant: "default" },
  unavailable: { label: "Unavailable", variant: "secondary" },
};

export function LiveBrowserScreen({ tabs, connectionLive }: LiveBrowserScreenProps) {
  return (
    <div className="space-y-3" data-slot="live-browser-screen">
      <Card data-slot="live-browser-header-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiGlobalLine className="size-4 shrink-0" aria-hidden />
              <span className="text-sm font-semibold">Live Browser</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!connectionLive}
              data-slot="refresh-button"
              onClick={() => window.location.reload()}
            >
              <RiRefreshLine className="size-3.5" aria-hidden />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Observed tabs and their cooperation state.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-1.5 text-foreground/50 font-medium">Tab</th>
                  <th className="pb-1.5 text-foreground/50 font-medium text-right">State</th>
                  <th className="pb-1.5 text-foreground/50 font-medium text-right">Revision</th>
                </tr>
              </thead>
              <tbody>
                {tabs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-muted-foreground text-xs">
                      No tabs observed
                    </td>
                  </tr>
                ) : (
                  tabs.map((tab) => (
                    <tr
                      key={tab.tabId}
                      className="border-b border-border last:border-0"
                      data-slot={`tab-row-${tab.tabId}`}
                    >
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-foreground/60">
                              #{tab.tabId}
                            </span>
                            <span className="truncate text-sm">{tab.title || "(no title)"}</span>
                          </div>
                          <a
                            href={tab.url}
                            className="text-[10px] text-primary hover:underline truncate max-w-[200px]"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-slot={`tab-url-${tab.tabId}`}
                          >
                            {tab.url}
                          </a>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge
                          variant={MODE_BADGES[tab.cooperation.mode]?.variant ?? "secondary"}
                          data-slot={`tab-mode-${tab.tabId}`}
                        >
                          {MODE_BADGES[tab.cooperation.mode]?.label ?? tab.cooperation.mode}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <code className="font-mono text-[10px] text-foreground/50">
                          {tab.cooperation.revision}
                        </code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!connectionLive && (
            <p className="mt-2 text-[10px] text-muted-foreground">
              Not connected â€” tab data may be stale.
            </p>
          )}
        </CardContent>
      </Card>

      {tabs.some((t) => t.cooperation.target) && (
        <Card data-slot="target-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RiShieldLine className="size-4 shrink-0" aria-hidden />
              <span className="text-sm font-semibold">Active target</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {tabs
                .filter((t) => t.cooperation.target)
                .map((tab) => {
                  const target = tab.cooperation.target!;
                  return (
                    <div
                      key={tab.tabId}
                      className="flex items-center justify-between gap-2 text-xs"
                      data-slot={`tab-target-${tab.tabId}`}
                    >
                      <span className="truncate">{tab.title || "(no title)"}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-foreground/70">Target</span>
                        <code className="font-mono text-[10px] text-foreground">
                          ({target.x}, {target.y})
                        </code>
                        <Badge variant="default" data-slot="target-active">
                          Active
                        </Badge>
                        <RiCheckLine className="size-3 shrink-0 text-primary" aria-hidden />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


