import { describe, expect, it } from "vitest";
import {
  consoleSessionRequestInit,
  contentApiRequestInit,
} from "./contentApiRequest";

describe("contentApiRequestInit", () => {
  it("uses the console cookie when no API token is set", () => {
    const init = contentApiRequestInit(new Headers());
    const headers = init.headers as Headers;
    expect(headers.get("X-Use-Cookies")).toBe("true");
    expect(init.credentials).toBe("include");
  });

  it("keeps the console cookie on REST Send and drops a pasted token", () => {
    const headers = new Headers({ Authorization: "Bearer ak_role" });
    const init = consoleSessionRequestInit(headers);
    expect((init.headers as Headers).has("Authorization")).toBe(false);
    expect((init.headers as Headers).get("X-Use-Cookies")).toBe("true");
    expect(init.credentials).toBe("include");
  });

  it("drops cookies when an explicit Authorization token is set", () => {
    const headers = new Headers({ Authorization: "Bearer ak_role" });
    const init = contentApiRequestInit(headers);
    expect((init.headers as Headers).get("X-Use-Cookies")).toBe("false");
    expect(init.credentials).toBe("omit");
  });
});
