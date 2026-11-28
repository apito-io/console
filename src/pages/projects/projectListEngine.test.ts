import { describe, expect, it } from "vitest";
import { normalizeProjectListRow } from "./api";

describe("normalizeProjectListRow database engine", () => {
  it("prefers database_engine over the managed apitoDB stub driver", () => {
    const p = normalizeProjectListRow({ id: "a", name: "A", driver: { engine: "apitoDB" }, database_engine: "postgresql" });
    expect(p.database_engine).toBe("postgresql");
    expect(p.db).toBe("apitoDB"); // delete/teardown logic still sees the stub
  });
  it("falls back to the driver engine", () => {
    const p = normalizeProjectListRow({ id: "b", name: "B", driver: { engine: "sqlite" } });
    expect(p.database_engine).toBe("sqlite");
  });
});
