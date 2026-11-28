import { describe, expect, it } from "vitest";
import { connectionValuesKey } from "./DatabaseConnectionsPage";

describe("connectionValuesKey", () => {
  it("ignores surrounding whitespace and missing fields", () => {
    expect(connectionValuesKey({ host: " db ", port: "5432" })).toBe(
      connectionValuesKey({ host: "db", port: "5432", database: "" }),
    );
  });
  it("changes when any value changes, so Save locks again", () => {
    const base = { host: "db", database: "apito", username: "u", password: "p" };
    expect(connectionValuesKey(base)).not.toBe(connectionValuesKey({ ...base, password: "q" }));
    expect(connectionValuesKey(base)).not.toBe(connectionValuesKey({ ...base, database: "other" }));
  });
});
