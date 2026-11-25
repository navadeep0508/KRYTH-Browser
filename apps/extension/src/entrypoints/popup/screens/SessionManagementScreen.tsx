import { Badge, Button, Card, CardContent, CardHeader } from "@browser-agent/ui";
import { RiFolderLine, RiRefreshLine, RiUserLine } from "@remixicon/react";

type SessionManagementScreenProps = {
  sessionCount: number;
};

export function SessionManagementScreen({ sessionCount }: SessionManagementScreenProps) {
  return (
    <div className="space-y-3" data-slot="session-screen">
      <Card data-slot="session-summary-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiUserLine className="size-4 shrink-0" aria-hidden />
              <span className="text-sm font-semibold">Session Management</span>
            </div>
            <Badge
              variant="default"
              className="text-[10px]"
              data-slot="session-count-badge"
            >
              {sessionCount}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Live sessions in this browser instance.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <RiFolderLine className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="text-sm font-medium">Active sessions</span>
            </div>
            <code className="font-mono text-lg font-medium">{sessionCount}</code>
          </div>
        </CardContent>
      </Card>

      <Card data-slot="session-actions-card">
        <CardHeader>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Controls
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={sessionCount === 0}
              data-slot="end-all-sessions"
              onClick={() => {
                // Session end handled by background
              }}
            >
              <RiRefreshLine className="size-3.5 shrink-0" aria-hidden />
              <span className="ml-1">End all sessions</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-slot="new-session"
              onClick={() => {
                // New session handled by background
              }}
            >
              <RiUserLine className="size-3.5 shrink-0" aria-hidden />
              <span className="ml-1">New session</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


