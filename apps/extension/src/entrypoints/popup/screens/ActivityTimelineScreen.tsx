import { Badge, Card, CardContent, CardHeader } from "@browser-agent/ui";
import {
  RiArrowRightLine,
  RiEditLine,
  RiHistoryLine,
  RiUserLine,
} from "@remixicon/react";
import { type TabOwnershipInfo } from "@/lib/popup-bridge";

const MODE_LABELS: Record<string, string> = {
  ready: "Agent is ready",
  human: "You are in control",
  held: "Agent is paused",
  yielding: "Agent is yielding",
  syncing: "Agent is syncing",
  acting: "Agent is working",
  unavailable: "Page unavailable",
};

const MODE_HINTS: Record<string, string> = {
  ready: "You can take over at any time",
  human: "Agent resumes when you stop interacting",
  held: "Hand back to Agent when ready",
  yielding: "Waiting for the current action to finish",
  syncing: "Reading the latest page state",
  acting: "You can take over at any time",
  unavailable: "Agent has stopped interacting",
};

type ActivityTimelineScreenProps = {
  tabs: TabOwnershipInfo[];
};

export function ActivityTimelineScreen({ tabs }: ActivityTimelineScreenProps) {
  const entries = tabs.flatMap((tab) => {
      const mode = tab.cooperation.mode;
      return [
        {
          tabId: tab.tabId,
          title: tab.title || "(no title)",
          mode,
          label: MODE_LABELS[mode] ?? mode,
          hint: MODE_HINTS[mode] ?? "",
          editing: tab.cooperation.editing,
          revision: tab.cooperation.revision,
          humanOwnershipState: tab.cooperation.humanOwnershipState,
          detail: tab.cooperation.detail,
        },
      ];
  });

  return (
    <div className="space-y-3" data-slot="activity-screen">
      <Card data-slot="activity-header-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <RiHistoryLine className="size-4 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Activity Timeline</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Recent cooperation state changes across tabs.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {entries.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground text-xs">
                No activity recorded
              </div>
            ) : (
              entries.map((entry, idx) => (
                <div
                  key={`${entry.tabId}-${idx}`}
                  className="flex items-start gap-3 border-l border-border pl-3"
                  data-slot={`activity-entry-${entry.tabId}`}
                >
                  <div className="flex items-center gap-1">
                    <div className="size-1.5 rounded-full bg-muted" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-medium text-foreground truncate">
                        {entry.title}
                      </span>
                      <span className="font-mono text-[10px] text-foreground/50">
                        rev {entry.revision}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                        data-slot={`activity-mode-${entry.tabId}`}
                      >
                        {entry.mode}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {entry.label}
                      </span>
                      {entry.editing && (
                        <span className="flex items-center gap-1 text-[10px] text-primary">
                          <RiEditLine className="size-3" aria-hidden />
                          Editing
                        </span>
                      )}
                    </div>
                    {entry.hint && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {entry.hint}
                      </p>
                    )}
                    {entry.detail && (
                      <p className="mt-0.5 text-[10px] text-foreground/50 italic">
                        {entry.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


