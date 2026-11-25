import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PopupSnapshotInfo } from "@/lib/popup-bridge";
import { App } from "./App";
import { useConnectionState } from "./use-connection-state";

vi.mock("./use-connection-state", () => ({
  useConnectionState: vi.fn(),
}));

const mockUseConnectionState = vi.mocked(useConnectionState);

const baseSnapshot: PopupSnapshotInfo = {
  state: "disconnected",
  instanceId: "",
  label: "",
  extensionVersion: "1.0.0",
  handshake: null,
  lastError: null,
  connectionEnabled: true,
  sessionCount: 0,
  tabs: [],
};

describe("App", () => {
  const setLabel = vi.fn();
  const setConnectionEnabled = vi.fn();
  const holdTab = vi.fn();
  const resumeTab = vi.fn();
  const yieldTab = vi.fn();

  beforeEach(() => {
    mockUseConnectionState.mockReturnValue({
      snapshot: baseSnapshot,
      statusState: "disconnected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders the connection screen by default", () => {
    render(<App />);
    expect(screen.getByText("Disconnected")).toBeTruthy();
    expect(screen.getByText("Open Browser to connect.")).toBeTruthy();
    expect(screen.getByText("Standby")).toBeTruthy();
  });

  it("shows connected status when connected", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, state: "connected" },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    expect(screen.getByText("Connected")).toBeTruthy();
    expect(screen.getByText("Ready")).toBeTruthy();
  });

  it("shows disabled status when connection is off", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, connectionEnabled: false },
      statusState: "disabled",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    expect(screen.getByText("Connection off")).toBeTruthy();
    expect(screen.getByText("Off")).toBeTruthy();
  });

  it("renders all five screen tabs", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /^Connection$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Live Browser$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Ownership Controls$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Activity Timeline$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Session Management$/ })).toBeTruthy();
  });

  it("navigates between screens via tabs", () => {
    render(<App />);
    expect(screen.getByText("Disconnected")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /^Ownership Controls$/ }));
    expect(screen.getByRole("heading", { name: "Ownership Controls" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Live Browser$/ })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /^Live Browser$/ }));
    expect(screen.getByRole("heading", { name: "Live Browser" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Ownership Controls" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^Connection$/ }));
    expect(screen.getByText("Disconnected")).toBeTruthy();
  });

  it("shows connection toggle and calls setConnectionEnabled", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, state: "connected", connectionEnabled: true },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    const toggle = screen.getByRole("switch", { name: /Browser/ });
    expect(toggle.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(toggle);
    expect(setConnectionEnabled).toHaveBeenCalledWith(false);
  });

  it("shows connect button when disconnected and connection is enabled", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, state: "disconnected", connectionEnabled: true },
      statusState: "disconnected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    expect(screen.getByRole("button", { name: "Connect" })).toBeTruthy();
  });

  it("disables connect button when connection is disabled", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, state: "disconnected", connectionEnabled: false },
      statusState: "disconnected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    const connectButton = screen.getByRole("button", { name: "Connect" });
    expect((connectButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows version info card", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, state: "connected" },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    expect(screen.getByText("Daemon")).toBeTruthy();
    expect(screen.getByText("Extension")).toBeTruthy();
    expect(screen.getByText("1.0.0")).toBeTruthy();
  });

  it("copies instance ID", async () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, instanceId: "03c3e47f" },
      statusState: "disconnected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    const buttons = document.querySelectorAll<HTMLElement>('[data-slot="popup-copy-instance-id"]');
    expect(buttons.length).toBeGreaterThan(0);
    fireEvent.click(buttons[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("03c3e47f");
  });

  it("shows ownership controls screen with tabs", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: {
        ...baseSnapshot,
        tabs: [
          {
            tabId: 7,
            windowId: 1,
            url: "https://example.com",
            title: "Example",
            cooperation: {
              mode: "ready",
              revision: 1,
              editing: false,
              humanOwnershipState: "AGENT_OWNED",
            },
          },
          {
            tabId: 8,
            windowId: 1,
            url: "https://example.org",
            title: "Example Org",
            cooperation: {
              mode: "human",
              revision: 2,
              editing: false,
              humanOwnershipState: "WAITING_FOR_HUMAN",
            },
          },
        ],
      },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Ownership Controls$/ }));
    expect(screen.getByText("Agent owns")).toBeTruthy();
    expect(screen.getByText("Waiting for human")).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Hold$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Resume$/ })).toBeTruthy();
  });

  it("calls holdTab when Hold button is clicked", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: {
        ...baseSnapshot,
        tabs: [
          {
            tabId: 7,
            windowId: 1,
            url: "https://example.com",
            title: "Example",
            cooperation: {
              mode: "ready",
              revision: 17,
              editing: false,
              humanOwnershipState: "AGENT_OWNED",
            },
          },
        ],
      },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Ownership Controls$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Hold$/ }));
    expect(holdTab).toHaveBeenCalledWith(7, 17);
  });

  it("calls resumeTab when Resume button is clicked", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: {
        ...baseSnapshot,
        tabs: [
          {
            tabId: 8,
            windowId: 1,
            url: "https://example.org",
            title: "Example Org",
            cooperation: {
              mode: "human",
              revision: 23,
              editing: false,
              humanOwnershipState: "WAITING_FOR_HUMAN",
            },
          },
        ],
      },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Ownership Controls$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Resume$/ }));
    expect(resumeTab).toHaveBeenCalledWith(8, 23);
  });

  it("shows live browser screen with tab list", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: {
        ...baseSnapshot,
        tabs: [
          {
            tabId: 7,
            windowId: 1,
            url: "https://example.com",
            title: "Example",
            cooperation: {
              mode: "ready",
              revision: 1,
              editing: false,
              humanOwnershipState: "AGENT_OWNED",
            },
          },
        ],
      },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Live Browser$/ }));
    expect(screen.getByText("Example")).toBeTruthy();
    expect(screen.getByText("https://example.com")).toBeTruthy();
    expect(screen.getByText("Ready")).toBeTruthy();
  });

  it("shows no tabs message when there are no tabs", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Live Browser$/ }));
    expect(screen.getByText("No tabs observed")).toBeTruthy();
  });

  it("shows session management screen with session count", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, sessionCount: 3 },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Session Management$/ }));
    expect(screen.getByRole("heading", { name: "Session Management" })).toBeTruthy();
    expect(screen.getByText("3", { selector: '[data-slot="session-count-badge"]' })).toBeTruthy();
  });

  it("shows activity timeline screen", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: {
        ...baseSnapshot,
        tabs: [
          {
            tabId: 7,
            windowId: 1,
            url: "https://example.com",
            title: "Example",
            cooperation: {
              mode: "acting",
              revision: 5,
              editing: false,
              humanOwnershipState: "AGENT_OWNED",
            },
          },
        ],
      },
      statusState: "connected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Activity Timeline$/ }));
    expect(screen.getByRole("heading", { name: "Activity Timeline" })).toBeTruthy();
    expect(screen.getByText("Agent is working")).toBeTruthy();
    expect(screen.getByText("Example")).toBeTruthy();
  });

  it("renders header with copy instance ID button", () => {
    mockUseConnectionState.mockReturnValue({
      snapshot: { ...baseSnapshot, instanceId: "abc12345" },
      statusState: "disconnected",
      setLabel,
      setConnectionEnabled,
      holdTab,
      resumeTab,
      yieldTab,
    });
    render(<App />);
    expect(screen.getByText("abc12345")).toBeTruthy();
    const buttons = document.querySelectorAll<HTMLElement>('[data-slot="popup-copy-instance-id"]');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

