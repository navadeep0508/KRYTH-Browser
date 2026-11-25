import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/lib/instance-id";
import { LOCAL_PAIRING_MESSAGE } from "@/lib/local-pairing-bridge";
import {
  DEFAULT_DAEMON_PORT,
  DEFAULT_DAEMON_WS_URL,
  LOCAL_PAIRING_FRAGMENT_PREFIX,
} from "@/transport/generated/methods";
import type { RemoteEndpoint } from "@/transport/remote-endpoint";
import { readRemoteConnection, readSavedRemoteConnection } from "@/transport/remote-storage";
import { ConnectionSettings } from "./connection-settings";

vi.mock("@/transport/remote-storage", () => ({
  REMOTE_CONNECTION_REVISION: "revision",
  REMOTE_CONNECTION_MODE: "mode",
  readRemoteConnection: vi.fn(),
  readSavedRemoteConnection: vi.fn(),
}));
vi.mock("./local-pairing", async (original) => ({
  ...(await original<typeof import("./local-pairing")>()),
  readLocalPairingInfo: vi.fn(),
}));

import type { LocalAuthStatus } from "@/transport/local-auth";
import v from "../../../../../crates/bsk-protocol/tests/fixtures/local-auth-v1.json";
import { readLocalPairingInfo } from "./local-pairing";

const localLink = `${DEFAULT_DAEMON_WS_URL}/#${LOCAL_PAIRING_FRAGMENT_PREFIX}${v.daemon_id}.${v.device_id}.${v.key}`;
const endpoint: RemoteEndpoint = {
  url: "wss://browser.example/extension",
  token: "a".repeat(43),
  deviceId: "b".repeat(32),
  expiresAt: "2099-01-01T00:00:00Z",
  renewAfter: "2098-01-01T00:00:00Z",
};
const pairing = `wss://other.example:8443/extension#${"c".repeat(43)}`;
let remote: RemoteEndpoint | null;
let storageFails: boolean;
let portWriteFails: boolean;
let store: Record<string, unknown>;
let listeners: Set<(changes: Record<string, chrome.storage.StorageChange>, area: string) => void>;
function notify(changes: Record<string, chrome.storage.StorageChange>) {
  for (const listener of listeners) listener(changes, "local");
}

beforeEach(() => {
  remote = null;
  storageFails = false;
  portWriteFails = false;
  store = { [STORAGE_KEYS.DAEMON_PORT]: DEFAULT_DAEMON_PORT };
  listeners = new Set();
  vi.mocked(readLocalPairingInfo)
    .mockReset()
    .mockResolvedValue({
      policy: { skip: false },
      devices: [],
    });
  vi.mocked(readSavedRemoteConnection)
    .mockReset()
    .mockImplementation(async () => remote);
  vi.mocked(readRemoteConnection)
    .mockReset()
    .mockImplementation(async () => {
      if (storageFails) throw new Error("Storage unavailable");
      return remote;
    });
  const runtime = {
    lastError: undefined as { message: string } | undefined,
    sendMessage: vi.fn(async ({ pairing }: { pairing: string | null }) => {
      remote = pairing === null ? null : { ...endpoint, url: pairing.split("#")[0] };
      storageFails = false;
      notify({ mode: { newValue: remote ? "remote" : "local" } });
      return { url: remote?.url ?? null };
    }),
  };
  vi.stubGlobal("chrome", {
    runtime,
    storage: {
      local: {
        get: vi.fn((_keys: unknown, callback?: (value: typeof store) => void) => {
          callback?.({ ...store });
          return Promise.resolve({ ...store });
        }),
        set: vi.fn((items: typeof store, callback?: () => void) => {
          if (portWriteFails) {
            runtime.lastError = { message: "Write failed" };
            callback?.();
            runtime.lastError = undefined;
            return;
          }
          Object.assign(store, items);
          notify(
            Object.fromEntries(
              Object.entries(items).map(([key, value]) => [key, { newValue: value }]),
            ),
          );
          callback?.();
        }),
      },
      onChanged: {
        addListener: (listener: Parameters<typeof listeners.add>[0]) => listeners.add(listener),
        removeListener: (listener: Parameters<typeof listeners.delete>[0]) =>
          listeners.delete(listener),
      },
    },
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function choose(name: "æœ¬æœº" | "è¿œç¨‹") {
  const button = screen.getByRole("button", { name });
  await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
  fireEvent.click(button);
}
function submit() {
  fireEvent.submit(document.querySelector("form")!);
}

it("shows the settings without a disclosure and the address under the selected tab", async () => {
  const { container } = render(<ConnectionSettings connectionEnabled />);
  const settings = container.querySelector('[data-slot="popup-connection-settings"]')!;
  expect(settings.tagName).toBe("SECTION");
  await waitFor(() => expect(settings.firstElementChild?.textContent).toContain("æœ¬æœº"));
  expect(settings.firstElementChild?.textContent).not.toContain("ws://");
  const address = settings.querySelector('[data-slot="popup-current-connection"]')!;
  expect(address.textContent).toBe(`æœ¬æœº Â· ${DEFAULT_DAEMON_WS_URL}`);
  const tabs = screen.getByRole("group", { name: "è¿žæŽ¥æ–¹å¼" });
  expect(tabs.compareDocumentPosition(address) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  await choose("è¿œç¨‹");
  expect(settings.querySelector('[data-slot="popup-current-connection"]')).toBeNull();
});

it("explains what saving does only once there is a valid change to save", async () => {
  render(<ConnectionSettings connectionEnabled />);
  await choose("æœ¬æœº");
  const warning = () => document.querySelector('[data-slot="popup-save-warning"]');
  expect(warning()).toBeNull();
  fireEvent.change(screen.getByLabelText("æœ¬æœºç«¯å£"), { target: { value: "53300" } });
  expect(warning()?.textContent).toBe("ä¿å­˜åŽä¼šç»“æŸå½“å‰ä»»åŠ¡ï¼Œå¹¶åœ¨è¿žæŽ¥å¼€å¯æ—¶é‡æ–°è¿žæŽ¥ã€‚");
  fireEvent.change(screen.getByLabelText("æœ¬æœºç«¯å£"), { target: { value: "port" } });
  submit();
  await screen.findByText("è¯·è¾“å…¥ 1 åˆ° 65535 ä¹‹é—´çš„ç«¯å£å·ã€‚");
  expect(warning()).toBeNull();
  fireEvent.change(screen.getByLabelText("æœ¬æœºç«¯å£"), {
    target: { value: String(DEFAULT_DAEMON_PORT) },
  });
  expect(warning()).toBeNull();
});

it("local: gives the pairing steps behind an info icon and keeps the remote hint in place", async () => {
  render(<ConnectionSettings connectionEnabled />);
  await choose("æœ¬æœº");
  const info = screen.getByRole("button", { name: "é…å¯¹é“¾æŽ¥è¯´æ˜Ž" });
  const steps = document.getElementById(info.getAttribute("aria-describedby")!)!;
  expect(steps.getAttribute("role")).toBe("tooltip");
  expect(steps.textContent).toBe("è¿è¡Œ bsk daemon pair å‘½ä»¤\nå°†è¾“å‡ºçš„å®Œæ•´é“¾æŽ¥ç²˜è´´è¿›è¾“å…¥æ¡†");
  expect(document.querySelector("form")?.textContent).not.toContain("è‡ªåŠ¨è¯†åˆ«");
  await choose("è¿œç¨‹");
  expect(screen.queryByRole("button", { name: "é…å¯¹é“¾æŽ¥è¯´æ˜Ž" })).toBeNull();
  expect(screen.getByText("ç²˜è´´å¯ä¿¡æœåŠ¡å™¨çš„å®Œæ•´é…å¯¹é“¾æŽ¥ï¼Œç«¯å£å·²åŒ…å«åœ¨å†…ã€‚")).toBeTruthy();
});

it("only changes the form until saved, and cancels both mode and port drafts without writes", async () => {
  render(<ConnectionSettings connectionEnabled />);
  await choose("æœ¬æœº");
  fireEvent.change(screen.getByLabelText("æœ¬æœºç«¯å£"), { target: { value: "53300" } });
  await choose("è¿œç¨‹");
  expect(document.querySelector('[data-slot="popup-current-connection"]')).toBeNull();
  expect(screen.queryByLabelText("æœ¬æœºç«¯å£")).toBeNull();
  fireEvent.change(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), { target: { value: pairing } });
  expect(screen.getByText("å°†è¿žæŽ¥åˆ°ï¼šwss://other.example:8443/extension")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "å–æ¶ˆä¿®æ”¹" }));
  expect((screen.getByLabelText("æœ¬æœºç«¯å£") as HTMLInputElement).value).toBe(
    String(DEFAULT_DAEMON_PORT),
  );
  expect(chrome.storage.local.set).not.toHaveBeenCalled();
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
});

it("submits pairing on Enter, preserves the disabled switch and shows the configured address", async () => {
  const user = userEvent.setup();
  render(<ConnectionSettings connectionEnabled={false} />);
  await choose("è¿œç¨‹");
  await user.type(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), pairing);
  await user.keyboard("{Enter}");
  expect(await screen.findByText("é…å¯¹æˆåŠŸï¼Œè¿žæŽ¥å¼€å…³å½“å‰å…³é—­ã€‚å¼€å¯åŽå³å¯è¿žæŽ¥ã€‚")).toBeTruthy();
  expect(chrome.runtime.sendMessage).toHaveBeenCalledExactlyOnceWith({
    kind: "bsk-remote-authorization",
    pairing,
  });
  expect(chrome.storage.local.set).not.toHaveBeenCalled();
  expect(document.querySelector('[data-slot="popup-current-connection"]')?.textContent).toBe(
    "è¿œç¨‹ Â· wss://other.example:8443/extension",
  );
  expect((screen.getByLabelText("é…å¯¹é“¾æŽ¥") as HTMLInputElement).value).toBe("");
  expect(document.body.textContent).not.toContain(pairing.split("#")[1]);
});

it("rejects an invalid pairing link before messaging the background", async () => {
  render(<ConnectionSettings connectionEnabled />);
  await choose("è¿œç¨‹");
  fireEvent.change(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), { target: { value: "https://example.com" } });
  submit();
  expect(await screen.findByText(/é…å¯¹é“¾æŽ¥ä¸å®Œæ•´æˆ–æ ¼å¼ä¸æ­£ç¡®/)).toBeTruthy();
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
  await act(async () => notify({ revision: { newValue: "updated" } }));
  expect(screen.getByRole("alert").textContent).toContain("é…å¯¹é“¾æŽ¥ä¸å®Œæ•´");
  expect((screen.getByLabelText("é…å¯¹é“¾æŽ¥") as HTMLInputElement).value).toBe("https://example.com");
});

it("shows progress and prevents duplicate pairing while the request is pending", async () => {
  let finish!: (reply: { url: string }) => void;
  vi.mocked(chrome.runtime.sendMessage).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  render(<ConnectionSettings connectionEnabled />);
  await choose("è¿œç¨‹");
  fireEvent.change(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), { target: { value: pairing } });
  submit();
  submit();
  expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
  expect((screen.getByRole("button", { name: "æ­£åœ¨é…å¯¹â€¦" }) as HTMLButtonElement).disabled).toBe(
    true,
  );
  expect((screen.getByRole("button", { name: "æœ¬æœº" }) as HTMLButtonElement).disabled).toBe(true);
  await act(async () => {
    remote = endpoint;
    finish({ url: endpoint.url });
  });
  expect(await screen.findByText("é…å¯¹æˆåŠŸã€‚")).toBeTruthy();
});

it("keeps the current grant and draft when pairing fails", async () => {
  remote = endpoint;
  vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ error: "Unable to pair" });
  render(<ConnectionSettings connectionEnabled />);
  await choose("è¿œç¨‹");
  fireEvent.change(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), { target: { value: pairing } });
  submit();
  expect(await screen.findByText(/é…å¯¹æœªå®Œæˆ/)).toBeTruthy();
  expect(document.querySelector('[data-slot="popup-current-connection"]')?.textContent).toBe(
    `è¿œç¨‹ Â· ${endpoint.url}`,
  );
  expect((screen.getByLabelText("é…å¯¹é“¾æŽ¥") as HTMLInputElement).value).toBe(pairing);
  expect(remote).toBe(endpoint);
});

it("keeps the remote grant when the proposed local port is invalid or cannot be saved", async () => {
  remote = endpoint;
  render(<ConnectionSettings connectionEnabled />);
  await choose("æœ¬æœº");
  expect(screen.getByText(/è¿œç¨‹é…å¯¹ä¼šä¿ç•™/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText("æœ¬æœºç«¯å£"), { target: { value: "65536" } });
  submit();
  expect(await screen.findByText("è¯·è¾“å…¥ 1 åˆ° 65535 ä¹‹é—´çš„ç«¯å£å·ã€‚")).toBeTruthy();
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
  portWriteFails = true;
  fireEvent.change(screen.getByLabelText("æœ¬æœºç«¯å£"), { target: { value: "53300" } });
  submit();
  expect(await screen.findByText("ç«¯å£ä¿å­˜å¤±è´¥ï¼Œè¯·é‡è¯•ã€‚")).toBeTruthy();
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
  expect(remote).toBe(endpoint);
  portWriteFails = false;
  submit();
  expect(await screen.findByText("å·²åˆ‡æ¢åˆ°æœ¬æœºæœåŠ¡ã€‚")).toBeTruthy();
  expect(store[STORAGE_KEYS.DAEMON_PORT]).toBe(53300);
  expect(remote).toBeNull();
  expect(chrome.runtime.sendMessage).toHaveBeenCalledExactlyOnceWith({
    kind: "bsk-remote-authorization",
    pairing: null,
  });
});

it("offers explicit local recovery when remote storage cannot be read", async () => {
  storageFails = true;
  render(<ConnectionSettings connectionEnabled />);
  expect((await screen.findByRole("alert")).textContent).toContain("æ— æ³•è¯»å–è¿žæŽ¥è®¾ç½®");
  expect(screen.getByText("æ— æ³•è¯»å–è¿žæŽ¥è®¾ç½®")).toBeTruthy();
  await choose("æœ¬æœº");
  submit();
  expect(await screen.findByText("å·²åˆ‡æ¢åˆ°æœ¬æœºæœåŠ¡ã€‚")).toBeTruthy();
  expect(chrome.runtime.sendMessage).toHaveBeenCalledExactlyOnceWith({
    kind: "bsk-remote-authorization",
    pairing: null,
  });
  expect(chrome.storage.local.set).not.toHaveBeenCalled();
});

it("shows remote-specific guidance for a disconnected remote connection", async () => {
  remote = endpoint;
  render(<ConnectionSettings connectionEnabled disconnected />);
  expect(await screen.findByText("æ— æ³•è¿žæŽ¥è¿œç¨‹æœåŠ¡ï¼Œè¯·æ£€æŸ¥æœåŠ¡å™¨ã€ç½‘ç»œæˆ–æŽˆæƒçŠ¶æ€ã€‚")).toBeTruthy();
  expect(screen.queryByText("æ— æ³•è¿žæŽ¥ï¼Œè¯·ç¡®è®¤ daemon å·²å¯åŠ¨ä¸”ç«¯å£ä¸€è‡´ã€‚")).toBeNull();
});

it("shows an expired grant and asks for a new pairing without deleting it", async () => {
  remote = { ...endpoint, expiresAt: "2020-01-01T00:00:00Z" };
  render(<ConnectionSettings connectionEnabled disconnected />);
  expect(await screen.findByText("æŽˆæƒå·²è¿‡æœŸï¼Œè¯·ä½¿ç”¨æ–°çš„é…å¯¹é“¾æŽ¥é‡æ–°è¿žæŽ¥ã€‚")).toBeTruthy();
  expect(screen.getByText(/æŽˆæƒåˆ°æœŸæ—¶é—´ï¼š/)).toBeTruthy();
  expect(screen.getByText("éœ€è¦å…³æ³¨")).toBeTruthy();
  expect(screen.queryByText("æ— æ³•è¿žæŽ¥è¿œç¨‹æœåŠ¡ï¼Œè¯·æ£€æŸ¥æœåŠ¡å™¨ã€ç½‘ç»œæˆ–æŽˆæƒçŠ¶æ€ã€‚")).toBeNull();
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
});

it("distinguishes a failed renewal from an expired grant", async () => {
  remote = { ...endpoint, pendingToken: "c".repeat(43), renewalFailure: "unavailable" };
  render(<ConnectionSettings connectionEnabled />);
  expect(await screen.findByText(/ç»­æœŸæš‚æœªæˆåŠŸ/)).toBeTruthy();
  expect(screen.queryByText(/æŽˆæƒå·²è¿‡æœŸ/)).toBeNull();
  expect(document.body.textContent).not.toContain(endpoint.token);
});

it("does not declare an unconfirmed rotation invalid based on its old local expiry", async () => {
  remote = { ...endpoint, expiresAt: "2020-01-01T00:00:00Z", pendingToken: "c".repeat(43) };
  render(<ConnectionSettings connectionEnabled />);
  expect(await screen.findByText(/æ­¤å‰ç»­æœŸå¯èƒ½å·²æˆåŠŸ/)).toBeTruthy();
  expect(screen.queryByText("æŽˆæƒå·²è¿‡æœŸï¼Œè¯·ä½¿ç”¨æ–°çš„é…å¯¹é“¾æŽ¥é‡æ–°è¿žæŽ¥ã€‚")).toBeNull();
});

it("pair: opens local pairing immediately and recognizes local links from either tab", async () => {
  render(
    <ConnectionSettings
      connectionEnabled
      instanceId="a1b2c3d4"
      localAuth={{ state: "pairing_required" }}
    />,
  );
  await choose("è¿œç¨‹");
  fireEvent.change(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), { target: { value: localLink } });
  expect(screen.getByRole("button", { name: "æœ¬æœº" }).getAttribute("aria-pressed")).toBe("true");
  vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ ok: true });
  submit();
  await screen.findByText("é…å¯¹æˆåŠŸã€‚");
  expect(chrome.runtime.sendMessage).toHaveBeenCalledExactlyOnceWith({
    kind: LOCAL_PAIRING_MESSAGE,
    action: "pair",
    link: localLink,
  });
  expect(document.body.textContent).not.toContain(v.key);
});
function pairedInfo(skip = false) {
  vi.mocked(readLocalPairingInfo).mockResolvedValue({
    policy: { skip },
    devices: [
      {
        daemonId: v.daemon_id,
        deviceId: v.device_id,
        endpoint: `${DEFAULT_DAEMON_WS_URL}/`,
      },
    ],
  });
}
it("connected/settings: the new-link input and advanced settings stay hidden until asked for", async () => {
  pairedInfo();
  render(
    <ConnectionSettings
      connectionEnabled
      localAuth={{ state: "verified", daemonId: v.daemon_id }}
    />,
  );
  const newLink = await screen.findByRole("button", { name: "ä½¿ç”¨æ–°çš„é…å¯¹é“¾æŽ¥" });
  expect(newLink.getAttribute("data-variant")).toBe("outline");
  expect(document.querySelector<HTMLDetailsElement>('[data-slot="local-advanced"]')?.open).toBe(
    false,
  );
  expect(screen.queryByLabelText("é…å¯¹é“¾æŽ¥")).toBeNull();
  fireEvent.click(screen.getByText("ä½¿ç”¨æ–°çš„é…å¯¹é“¾æŽ¥"));
  expect(screen.getByLabelText("é…å¯¹é“¾æŽ¥")).toBeTruthy();
});
it.each([
  ["already_paired", /bsk daemon pair --replace a1b2c3d4/],
  ["replace_mismatch", /bsk daemon revoke a1b2c3d4/],
] as const)("%s: replacement requires confirmation and a rejected link preserves the current grant", async (error, guidance) => {
  pairedInfo();
  render(
    <ConnectionSettings
      connectionEnabled
      instanceId="b7e2f019"
      localAuth={{ state: "verified", daemonId: v.daemon_id }}
    />,
  );
  fireEvent.click(await screen.findByText("ä½¿ç”¨æ–°çš„é…å¯¹é“¾æŽ¥"));
  fireEvent.change(screen.getByLabelText("é…å¯¹é“¾æŽ¥"), { target: { value: localLink } });
  submit();
  expect(screen.getByRole("alertdialog").textContent).toContain("æ›¿æ¢æˆåŠŸåŽå½“å‰ä»»åŠ¡ä¼šç»“æŸ");
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
  vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ error, browserId: "a1b2c3d4" });
  fireEvent.click(screen.getByText("ç»§ç»­é…å¯¹"));
  expect(await screen.findByText(guidance)).toBeTruthy();
  expect((screen.getByLabelText("é…å¯¹é“¾æŽ¥") as HTMLInputElement).value).toBe(localLink);
  expect(document.querySelector('[data-slot="local-paired-info"]')).toBeTruthy();
  expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
});
it("skip: requires confirmation and keeps restore guidance visible without a click", async () => {
  pairedInfo();
  const { rerender } = render(<ConnectionSettings connectionEnabled />);
  await screen.findByText("ä½¿ç”¨æ–°çš„é…å¯¹é“¾æŽ¥");
  fireEvent.click(screen.getByRole("switch", { name: "è·³è¿‡æœ¬æœºéªŒè¯" }));
  expect(screen.getByRole("alertdialog").textContent).toContain("bsk daemon trust-local on");
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
  vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ ok: true });
  pairedInfo(true);
  fireEvent.click(screen.getByText("ç¡®è®¤è·³è¿‡"));
  await screen.findByText("æ¢å¤éªŒè¯");
  expect(chrome.runtime.sendMessage).toHaveBeenCalledExactlyOnceWith({
    kind: LOCAL_PAIRING_MESSAGE,
    action: "skip",
    value: true,
  });
  rerender(
    <ConnectionSettings
      connectionEnabled
      localAuth={{ state: "unverified_local", reason: "skip" }}
    />,
  );
  expect(
    document.querySelector('[data-slot="local-pairing-notice"]')?.closest("details"),
  ).toBeNull();
  pairedInfo(false);
  vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ ok: true });
  fireEvent.click(screen.getByText("æ¢å¤éªŒè¯"));
  expect(await screen.findByText(/bsk daemon trust-local off/)).toBeTruthy();
});
it.each([
  [{ state: "unverified_local", reason: "unpaired" }, /è¿žæŽ¥èº«ä»½å°šæœªéªŒè¯/],
  [{ state: "server_unverified" }, /æœåŠ¡æœªé€šè¿‡éªŒè¯/],
  [{ state: "daemon_too_old" }, /æœ¬æœº bsk ç‰ˆæœ¬è¿‡æ—§/],
] satisfies [
  LocalAuthStatus,
  RegExp,
][])("renders the %j state without revealing credentials", async (status, message) => {
  render(<ConnectionSettings connectionEnabled localAuth={status} />);
  if (status.state === "unverified_local")
    fireEvent.click(screen.getByRole("button", { name: "æœªé…å¯¹" }));
  await screen.findByText(message);
  if (["server_unverified", "daemon_too_old"].includes(status.state)) {
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getByText("é‡è¯•"));
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      kind: LOCAL_PAIRING_MESSAGE,
      action: "retry",
    });
  }
  expect(document.body.textContent).not.toContain(v.key);
});
it("unpaired: keeps the advice behind a warning icon and offers optional pairing and official security guidance", async () => {
  render(
    <ConnectionSettings
      connectionEnabled
      localAuth={{ state: "unverified_local", reason: "unpaired" }}
    />,
  );
  const settings = document.querySelector('[data-slot="popup-connection-settings"]')!;
  const toggle = screen.getByRole("button", { name: "æœªé…å¯¹" });
  expect(settings.firstElementChild?.contains(toggle)).toBe(true);
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(document.querySelector('[data-slot="local-pairing-notice"]')).toBeNull();
  fireEvent.click(toggle);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(settings.contains(document.querySelector('[data-slot="local-pairing-notice"]'))).toBe(
    true,
  );
  expect(screen.getByText(/è¿žæŽ¥èº«ä»½å°šæœªéªŒè¯/)).toBeTruthy();
  const help = screen.getByRole("link", { name: "ä¸ºä»€ä¹ˆå»ºè®®é…å¯¹ï¼Ÿ" });
  expect(help.getAttribute("href")).toBe("https://Browser Agent.weixin.qq.com/#security");
  expect(help.getAttribute("target")).toBe("_blank");
  fireEvent.click(screen.getByRole("button", { name: "åŽ»é…å¯¹" }));
  expect(document.activeElement).toBe(screen.getByLabelText("é…å¯¹é“¾æŽ¥"));
  expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
  fireEvent.click(toggle);
  expect(document.querySelector('[data-slot="local-pairing-notice"]')).toBeNull();
});
it("remote: resumes retained authorization before expiry without asking for a new link", async () => {
  vi.mocked(readSavedRemoteConnection).mockResolvedValue(endpoint);
  render(<ConnectionSettings connectionEnabled />);
  await choose("è¿œç¨‹");
  expect(screen.getByText(/æŽˆæƒåˆ°æœŸæ—¶é—´/)).toBeTruthy();
  vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({ url: endpoint.url });
  fireEvent.click(screen.getByText("åˆ‡å›žè¿œç¨‹"));
  await screen.findByText("é…å¯¹æˆåŠŸã€‚");
  expect(chrome.runtime.sendMessage).toHaveBeenCalledExactlyOnceWith({
    kind: "bsk-remote-authorization",
    resume: true,
  });
});

