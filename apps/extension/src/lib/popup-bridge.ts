import type { SnapshotInfo } from "./connection-controller";
import type { CooperationView } from "@/cooperation/types";

/**
 * Wire protocol for `chrome.runtime.connect({ name: "popup" })`:
 *  - Background pushes `{ kind: "snapshot", data: PopupSnapshotInfo }`.
 *  - Popup sends `{ kind: "set_label" }`, `{ kind: "set_connection_enabled" }`,
 *    `{ kind: "ownership_hold" }`, `{ kind: "ownership_resume" }`,
 *    `{ kind: "ownership_yield" }`, etc.
 *
 * Daemon port preference is persisted via `chrome.storage.local` instead
 * of this bridge (see `use-daemon-port.ts`).
 */

export const POPUP_PORT_NAME = "popup";

export interface TabOwnershipInfo {
  tabId: number;
  windowId: number;
  url: string;
  title: string;
  cooperation: CooperationView;
}

export interface PopupSnapshotInfo extends SnapshotInfo {
  /** Live sessions in this browser instance. Label changes are blocked while nonzero. */
  sessionCount: number;
  /** Per-tab cooperation + ownership state for controlled/observed tabs. */
  tabs: TabOwnershipInfo[];
}

export type PopupOutbound =
  | { kind: "set_label"; value: string }
  | { kind: "set_connection_enabled"; value: boolean }
  | { kind: "ownership_hold"; tabId: number; revision: number }
  | { kind: "ownership_resume"; tabId: number; revision: number }
  | { kind: "ownership_yield"; tabId: number };

export type PopupInbound = { kind: "snapshot"; data: PopupSnapshotInfo };
