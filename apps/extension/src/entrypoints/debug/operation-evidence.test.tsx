import { i18n } from "@browser-agent/i18n";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DebugEvidence, DebugOperation, DebugRequest } from "@/debug/types";
import { ConsoleList } from "./evidence";
import { OperationEvidence } from "./operation-evidence";

beforeEach(async () => {
  await i18n.changeLanguage("zh-CN");
});
afterEach(cleanup);
const operation: DebugOperation = {
  id: "d:a1",
  run_id: "d",
  sequence: 1,
  method: "tool.click",
  started_at: 1000,
  state: "completed",
  request_ids: ["d:n1"],
  console_ids: [],
  truncated: false,
  before: { at: 1000, state: "available", text: "Ready" },
  after: { at: 4000, state: "available", text: "Saved" },
};
const request: DebugRequest = {
  id: "d:n1",
  run_id: "d",
  sequence: 2,
  started_at: 2000,
  method: "POST",
  url: "https://app.test/api/save",
  state: "pending",
  request_body: { state: "available" },
  response_body: { state: "pending" },
};
const evidence: DebugEvidence = {
  fields: [
    {
      key: "name",
      label: "æ˜µç§°",
      before: { state: "available", value: "Alice" },
      input: { state: "available", value: "Bob" },
      submitted: [{ state: "available", value: "Bob", source: "d:n1 /name" }],
      response: [],
      later: { state: "not_recorded" },
    },
  ],
  payloads: [{ request_id: "d:n1", part: "request", path: "/name", value: "Bob" }],
  links: [{ request_id: "d:n1", relation: "delayed" }],
  gaps: ["body_pending", "initial_load_not_recorded"],
  changes: { added: ["Saved"], removed: ["Ready"], truncated: false },
  observations: [],
};

describe("operation evidence cards", () => {
  it("distinguishes unknown values, tentative requests and incomplete capture while preserving raw evidence access", () => {
    const open = vi.fn();
    const image = {
      ...request,
      id: "d:n2",
      method: "GET",
      resource_type: "Image",
      url: "https://app.test/noise.png",
    };
    render(
      <OperationEvidence
        operation={operation}
        evidence={evidence}
        requests={[request, image]}
        onRequest={open}
      />,
    );
    expect(screen.getByText("å­—æ®µå˜åŒ–é“¾")).toBeTruthy();
    expect(screen.getByText("æœªæ‰¾åˆ°åŒåå­—æ®µ")).toBeTruthy();
    expect(screen.getByText("æœªé‡‡é›†")).toBeTruthy();
    expect(screen.getByText(/å»¶è¿Ÿå‡ºçŽ°/)).toBeTruthy();
    expect(screen.getByText(/ä¹‹å‰çš„åŠ è½½è¯·æ±‚æ— æ³•è¡¥å½•/)).toBeTruthy();
    expect(screen.queryByText("/noise.png")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /d:n1 \/name/ }));
    expect(open).toHaveBeenCalledWith(request, "request");
    fireEvent.click(screen.getByRole("button", { name: /å±•å¼€å…¶ä»–èµ„æº/ }));
    expect(screen.getByText("/noise.png")).toBeTruthy();
  });
  it("labels unknown console sources and folds extension errors without mixing them into website errors", () => {
    const base = { at: 1000, last_at: 1000, count: 1, level: "error" };
    render(
      <ConsoleList
        entries={[
          { ...base, id: "site", text: "Site failed", source: "website" },
          { ...base, id: "unknown", text: "Unknown failure" },
          { ...base, id: "extension", text: "Extension failed", source: "extension" },
        ]}
      />,
    );
    expect(screen.getByText("æ¥æºæœªç¡®è®¤")).toBeTruthy();
    expect(screen.queryByText("Extension failed")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /å±•å¼€æ‰©å±•ä¸Žæµè§ˆå™¨æ—¥å¿—/ }));
    expect(screen.getByText("Extension failed")).toBeTruthy();
    expect(screen.getByText("æ‰©å±•æ¥æº")).toBeTruthy();
  });
});


