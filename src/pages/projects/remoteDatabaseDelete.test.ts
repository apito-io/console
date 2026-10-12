import { describe, expect, it } from "vitest";
import { canOfferRemoteDatabaseDelete } from "./remoteDatabaseDelete";

describe("canOfferRemoteDatabaseDelete", () => {
  it("shows for BYOD libsql", () => {
    expect(
      canOfferRemoteDatabaseDelete({ db: "libsql", plan_type: "byod" })
    ).toBe(true);
  });

  it("shows for dedicated SaaS on Turso (engine libsql)", () => {
    expect(
      canOfferRemoteDatabaseDelete({ db: "libsql", plan_type: "dedicated" })
    ).toBe(true);
  });

  it("hides for Apito-managed stub", () => {
    expect(
      canOfferRemoteDatabaseDelete({ db: "apitoDB", plan_type: "dedicated" })
    ).toBe(false);
  });

  it("hides when engine missing", () => {
    expect(canOfferRemoteDatabaseDelete({ db: "", plan_type: "byod" })).toBe(
      false
    );
  });
});
