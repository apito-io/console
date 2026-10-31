// Content GraphQL is POST /secured/graphql. Subscriptions live one path deeper.
export function realtimeGraphqlEndpoints(
  httpGraphql: string,
  origin = "http://localhost"
): { http: string; socket: string } {
  const url = new URL(httpGraphql, origin);
  const path = url.pathname.replace(/\/$/, "");
  if (path.endsWith("/graphql")) {
    url.pathname = `${path}/subscription`;
  }
  const http = url.toString();
  const socket = new URL(http);
  socket.protocol = socket.protocol === "https:" ? "wss:" : "ws:";
  return { http, socket: socket.toString() };
}
