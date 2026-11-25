import { Badge, Button, Card, CardContent, CardHeader } from "@browser-agent/ui";
import { RiAlertLine, RiPauseLine, RiPlayLine, RiShareLine } from "@remixicon/react";
import { type TabOwnershipInfo } from "@/lib/popup-bridge";

type OwnershipControlsScreenProps = {
  tabs: TabOwnershipInfo[];
  holdTab: (tabId: number, revision: number) => void;
  resumeTab: (tabId: number, revision: number) => void;
  yieldTab: (tabId: number) => void;
};

const OWNERSHIP_BADGES: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  AGENT_OWNED: { label: "Agent owns", variant: "default" },
  WAITING_FOR_HUMAN: { label: "Waiting for human", variant: "secondary" },
  HUMAN_OWNED: { label: "Human owns", variant: "destructive" },
  REACQUIRING: { label: "Reacquiring", variant: "secondary" },
  AGENT_RESUMED: { label: "Agent resumed", variant: "secondary" },
};

function actionForState(
  state: string,
): { label: string; icon: React.ElementType; onTab: (tab: TabOwnershipInfo) => void } | null {
  switch (state) {
    case "AGENT_OWNED":
      return {
        label: "Hold",
        icon: RiPauseLine,
        onTab: (tab) => {},
      };
    case "WAITING_FOR_HUMAN":
      return {
        label: "Resume",
        icon: RiPlayLine,
        onTab: (tab) => {},
      };
    case "HUMAN_OWNED":
      return {
        label: "Yield",
        icon: RiShareLine,
        onTab: (tab) => {},
      };
    default:
      return null;
  }
}

export function OwnershipControlsScreen({
  tabs,
  holdTab,
  resumeTab,
  yieldTab,
}: OwnershipControlsScreenProps) {
  return (
    <div className="space-y-3" data-slot="ownership-screen">
      <Card data-slot="ownership-header-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <RiAlertLine className="size-4 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Ownership Controls</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Control human vs Agent ownership per tab.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-1.5 text-foreground/50 font-medium">Tab</th>
                  <th className="pb-1.5 text-foreground/50 font-medium text-right">Ownership</th>
                  <th className="pb-1.5 text-foreground/50 font-medium text-right">Action</th>
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
                  tabs.map((tab) => {
                    const badge = OWNERSHIP_BADGES[tab.cooperation.humanOwnershipState];
                    const action = actionForState(tab.cooperation.humanOwnershipState);
                    const isTransition =
                      tab.cooperation.humanOwnershipState === "REACQUIRING" ||
                      tab.cooperation.humanOwnershipState === "AGENT_RESUMED";
                    return (
                      <tr
                        key={tab.tabId}
                        className="border-b border-border last:border-0"
                        data-slot={`ownership-row-${tab.tabId}`}
                      >
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-foreground/60">
                              #{tab.tabId}
                            </span>
                            <span className="truncate text-sm">{tab.title || "(no title)"}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right">
                          <Badge
                            variant={badge?.variant ?? "secondary"}
                            data-slot={`ownership-badge-${tab.tabId}`}
                          >
                            {badge?.label ?? tab.cooperation.humanOwnershipState}
                          </Badge>
                          {isTransition && (
                            <span className="mt-1 block text-[10px] text-foreground/50">
                              Transitioningâ€¦
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right">
                          {action && !isTransition ? (
                            <Button
                              type="button"
                              variant="outline"
              size="sm"
                              onClick={() => {
                                if (action.label === "Hold") {
                                  holdTab(tab.tabId, tab.cooperation.revision);
                                } else if (action.label === "Resume") {
                                  resumeTab(tab.tabId, tab.cooperation.revision);
                                } else if (action.label === "Yield") {
                                  yieldTab(tab.tabId);
                                }
                              }}
                              data-slot={`ownership-action-${tab.tabId}`}
                            >
                              <action.icon className="size-3.5 shrink-0" aria-hidden />
                              <span className="ml-1">{action.label}</span>
                            </Button>
                          ) : (
                            <span className="text-[10px] text-foreground/40">â€”</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


