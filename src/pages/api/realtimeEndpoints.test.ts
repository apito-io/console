import { describe, expect, it } from "vitest";
import { realtimeGraphqlEndpoints } from "./realtimeEndpoints";

describe("realtimeGraphqlEndpoints", () => {
  it("points HTTP and the socket at the subscription path", () => {
    expect(
      realtimeGraphqlEndpoints("http://localhost:5055/secured/graphql")
    ).toEqual({
      http: "http://localhost:5055/secured/graphql/subscription",
      socket: "ws://localhost:5055/secured/graphql/subscription",
    });
  });

  it("uses wss when the content API is https", () => {
    expect(
      realtimeGraphqlEndpoints("https://engine.example/secured/graphql").socket
    ).toBe("wss://engine.example/secured/graphql/subscription");
  });
});
