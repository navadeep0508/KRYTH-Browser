import { Badge, Button, Card, CardContent, CardFooter, CardHeader, Input } from "@browser-agent/ui";
import { RiGlobalLine, RiInformationLine, RiLinksLine } from "@remixicon/react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { i18n } from "@browser-agent/i18n";
import { Switch } from "../switch";
import { type PopupSnapshotInfo } from "@/lib/popup-bridge";
import { type PopupStatusState } from "../use-connection-state";

type ConnectionScreenProps = {
  snapshot: PopupSnapshotInfo;
  statusState: PopupStatusState;
  setLabel: (value: string) => void;
  setConnectionEnabled: (value: boolean) => void;
  connectionLive: boolean;
  isSkewed: boolean;
  isDisconnected: boolean;
  daemonVersion: string;
  extensionVersion: string;
  controlHintsHidden: boolean;
  setControlHintsHidden: (hidden: boolean) => void;
};

const STATE_LABELS: Record<PopupStatusState, string> = {
  disconnected: "Disconnected",
  connected: "Connected",
  version_skew: "Connected",
  disabled: "Connection off",
};

const STATE_DETAILS: Record<PopupStatusState, string> = {
  disconnected: "Open Browser to connect.",
  connected: "Ready for automation tasks.",
  version_skew: "Protocol versions differ. Please upgrade.",
  disabled: "Connection is turned off.",
};

const STATE_BADGES: Record<PopupStatusState, { label: string; variant: "default" | "secondary" }> = {
  disconnected: { label: "Standby", variant: "secondary" },
  connected: { label: "Ready", variant: "default" },
  version_skew: { label: "Upgradable", variant: "secondary" },
  disabled: { label: "Off", variant: "secondary" },
};

export function ConnectionScreen({
  snapshot,
  statusState,
  setLabel,
  setConnectionEnabled,
  connectionLive,
  isSkewed,
  isDisconnected,
  daemonVersion,
  extensionVersion,
  controlHintsHidden,
  setControlHintsHidden,
}: ConnectionScreenProps) {
  const [label, setLabelLocal] = useState(snapshot.label);
  const labelRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLabelLocal(snapshot.label);
  }, [snapshot.label]);

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabelLocal(e.target.value);
  };

  const handleLabelSave = () => {
    if (labelRef.current) {
      setLabel(labelRef.current.value);
    }
  };

  const isConnected = statusState === "connected" || isSkewed;

  return (
    <div className="space-y-3" data-slot="connection-screen">
      {/* Connection status card */}
      <Card data-slot="connection-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiGlobalLine className="size-4 shrink-0" aria-hidden />
              <span className="text-sm font-semibold">{i18n.t("extension:popup.brandName")}</span>
            </div>
            <Badge variant={STATE_BADGES[statusState].variant} data-slot="connection-badge">
              {STATE_BADGES[statusState].label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{STATE_LABELS[statusState]}</p>
          <p className="text-[10px] text-muted-foreground">{STATE_DETAILS[statusState]}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-3">
            <Switch
              checked={snapshot.connectionEnabled}
              onCheckedChange={setConnectionEnabled}
              aria-label={i18n.t("extension:popup.connectionToggleTitle")}
              data-slot="connection-toggle"
            />
            {isDisconnected && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!snapshot.connectionEnabled}
                data-slot="connect-button"
              >
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Browser label */}
      <Card data-slot="label-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <RiLinksLine className="size-4 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Browser name</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Input
            type="text"
            placeholder="e.g. Work profile"
            value={label}
            onChange={handleLabelChange}
            ref={labelRef}
            disabled={!isConnected}
            data-slot="label-input"
          />
          <CardFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLabelSave}
              disabled={!isConnected || label === snapshot.label}
              data-slot="label-save"
            >
              Save
            </Button>
          </CardFooter>
        </CardContent>
      </Card>

      {/* Control hints toggle */}
      <Card data-slot="control-hints-card">
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RiInformationLine className="size-4 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Control hints</span>
          </div>
          <Switch
            checked={!controlHintsHidden}
            onCheckedChange={setControlHintsHidden}
            aria-label="Control hints"
            data-slot="control-hints-toggle"
          />
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-[10px] text-muted-foreground">
            Show the status pill and orange glow while the Agent controls a page.
          </p>
        </CardContent>
      </Card>

      {/* Version info */}
      <Card data-slot="version-card">
        <CardHeader>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Versions
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground/70">Daemon</span>
              <code className="font-mono text-foreground">{daemonVersion}</code>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground/70">Extension</span>
              <code className="font-mono text-foreground">{extensionVersion}</code>
            </div>
            {isSkewed && (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-foreground/50">Protocol</span>
                <span className="text-foreground/50">Versions differ â€” upgrade recommended</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


