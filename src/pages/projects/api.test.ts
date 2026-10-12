import { describe, it, expect } from "vitest";
import { normalizeProjectListResponse } from "./api";
import type { ProjectListResponse } from "../../types/project";

describe("normalizeProjectListResponse", () => {
  it("normalizes body rows", () => {
    const raw: ProjectListResponse = {
      code: 200,
      body: [
        {
          id: "1",
          name: "P",
          description: "",
          created_at: "",
          driver: { engine: "libsql" },
        },
      ],
    };
    const out = normalizeProjectListResponse(raw);
    expect(out.body?.[0]?.db).toBe("libsql");
    expect(out.body?.[0]?.id).toBe("1");
  });
});
