import { explorerPlugin } from "@graphiql/plugin-explorer";
import "@graphiql/plugin-explorer/style.css";
import { createGraphiQLFetcher, type Storage } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/style.css";
import React, { useMemo, useEffect, useCallback } from "react";
import { analyticsProduct } from "../../lib/consoleAnalytics";
import { contentApiRequestInit } from "./contentApiRequest";
import { realtimeGraphqlEndpoints } from "./realtimeEndpoints";
import { ENV, getConsoleDomain } from "../../utils/env";
import { useTourTracking } from "../../hooks/useTourTracking";
import { useAuth } from "../../contexts/AuthContext";
import "../../components/console/ConsoleShell.css";

const CONTENT_QUERY = `# Content API. A role key from Settings → API Secrets calls this path.
# Authorization: Bearer ak_…
# A login-role key is only for registerUser and loginUser.
# With no Authorization header, this page uses the console session cookie.

query {
  noteList {
    id
    data {
      title
      body
      done
    }
  }
}`;

const REALTIME_QUERY = `# Realtime. Same cookie or role key as GraphQL API.
# The explorer lists <model>Changed for each model this role can read, plus broadcast.
# Run stays on the socket. The app receives events until you stop.

subscription {
  broadcast(channel: "demo") {
    channel
    event
    payload
    at
  }
}`;

function prefixedStorage(prefix: string): Storage {
  return {
    getItem: (key) => localStorage.getItem(prefix + key),
    setItem: (key, value) => localStorage.setItem(prefix + key, value),
    removeItem: (key) => localStorage.removeItem(prefix + key),
    clear() {
      const drop: string[] = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) drop.push(key);
      }
      drop.forEach((key) => localStorage.removeItem(key));
    },
    get length() {
      let count = 0;
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) count += 1;
      }
      return count;
    },
  };
}

const GraphqlExplorer: React.FC<{ kind: "content" | "realtime" }> = ({ kind }) => {
  const { trackQueryExecuted } = useTourTracking();
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";

  useEffect(() => {
    localStorage.setItem("graphiql:visiblePlugin", "GraphiQL Explorer");
  }, []);

  const handleGraphiQLExecute = useCallback(() => {
    trackQueryExecuted();
  }, [trackQueryExecuted]);

  const graphqlEndpoint = `${
    ENV.VITE_PUBLIC_GRAPH_API || "/public-graphql"
  }`;
  const realtime =
    kind === "realtime"
      ? realtimeGraphqlEndpoints(
          graphqlEndpoint,
          typeof window === "undefined" ? "http://localhost" : window.location.origin
        )
      : null;

  const baseFetcher = createGraphiQLFetcher({
    url: realtime?.http ?? graphqlEndpoint,
    subscriptionUrl: realtime?.socket,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Use-Cookies": "true",
    },
    fetch: (url, args) => {
      const body = typeof args?.body === "string" ? args.body : "";
      const isIntrospection =
        body.includes("__schema") || body.includes("IntrospectionQuery");
      const headers = new Headers(args?.headers);
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return fetch(url, contentApiRequestInit(headers, args)).then((response) => {
        if (response.ok && !isIntrospection) {
          try {
            const host = window.location.hostname;
            if (host !== "localhost" && host !== "127.0.0.1") {
              const guardKey = projectId
                ? `ph_public_api_first_${projectId}`
                : "";
              if (!guardKey || localStorage.getItem(guardKey) !== "1") {
                if (guardKey) localStorage.setItem(guardKey, "1");
                window.posthog?.capture("public_api_first_success", {
                  feature_category: "api",
                  product: analyticsProduct(),
                  domain: getConsoleDomain(),
                  project_id: projectId,
                  transport: "graphql",
                });
              }
            }
          } catch {
            /* ignore analytics failures */
          }
        }
        return response;
      });
    },
  });

  useEffect(() => {
    const handleExecuteButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest("button");

      if (
        button &&
        (button.title?.includes("Execute query") ||
          button.getAttribute("aria-label")?.includes("Execute query") ||
          button.querySelector('img[alt*="play icon"]'))
      ) {
        handleGraphiQLExecute();
      }
    };

    document.addEventListener("click", handleExecuteButtonClick, true);

    return () => {
      document.removeEventListener("click", handleExecuteButtonClick, true);
    };
  }, [handleGraphiQLExecute]);

  const plugins = useMemo(
    () => [
      explorerPlugin({
        showAttribution: true,
        explorerIsOpen: true,
        title: kind === "realtime" ? "Realtime" : "GraphQL API",
      }),
    ],
    [kind]
  );
  const realtimeStorage = useMemo(
    () => (kind === "realtime" ? prefixedStorage("graphiql-realtime-v2:") : undefined),
    [kind]
  );

  return (
    <div className="api-page-shell">
      <div className="api-embed-root">
        <GraphiQL
          key={`${kind}-${projectId || "graphiql-instance"}`}
          fetcher={baseFetcher}
          plugins={plugins}
          storage={realtimeStorage}
          className="api-graphiql-embed"
          defaultQuery={kind === "realtime" ? REALTIME_QUERY : CONTENT_QUERY}
        />
      </div>
    </div>
  );
};

const GraphqlApiPage: React.FC = () => <GraphqlExplorer kind="content" />;

export const RealtimeApiPage: React.FC = () => (
  <GraphqlExplorer kind="realtime" />
);

export default GraphqlApiPage;
