import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { posthogClient } from "./consoleAnalytics";

let w: { posthog?: unknown };

describe("posthogClient", () => {
  beforeEach(() => {
    w = {};
    vi.stubGlobal("window", w);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is undefined when PostHog is not loaded", () => {
    expect(posthogClient()).toBeUndefined();
  });

  // Studio images: the loader snippet ran but init() never did (no key), so
  // window.posthog is the array stub without capture. This blanked the console.
  it("is undefined for the uninitialised loader stub", () => {
    const stub = Object.assign([], { _i: [], init: () => {}, __SV: 1 });
    w.posthog = stub;
    expect(posthogClient()).toBeUndefined();
  });

  it("returns the client once capture exists", () => {
    const client = { capture: () => {}, identify: () => {}, group: () => {}, reset: () => {} };
    w.posthog = client;
    expect(posthogClient()).toBe(client);
  });
});
