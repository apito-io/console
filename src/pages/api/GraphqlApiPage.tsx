import { explorerPlugin } from "@graphiql/plugin-explorer";
import "@graphiql/plugin-explorer/style.css";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/style.css";
import React, { useMemo, useEffect, useCallback } from "react";
import { ENV, getConsoleDomain } from "../../utils/env";
import { useTourTracking } from "../../hooks/useTourTracking";
import { useAuth } from "../../contexts/AuthContext";
import "../../components/console/ConsoleShell.css";

const GraphqlApiPage: React.FC = () => {
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

  const baseFetcher = createGraphiQLFetcher({
    url: graphqlEndpoint,
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
      if (!headers.has("Authorization")) {
        headers.set("X-Use-Cookies", "true");
      }
      return fetch(url, {
        ...args,
        headers,
        credentials: "include",
      }).then((response) => {
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
                  product: "app",
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
        title: "GraphQL API",
      }),
    ],
    []
  );

  return (
    <div className="api-page-shell">
      <div className="api-embed-root">
        <GraphiQL
          key={projectId || "graphiql-instance"}
          fetcher={baseFetcher}
          plugins={plugins}
          className="api-graphiql-embed"
          defaultQuery={`# Welcome to Apito GraphQL API
# Authorize with a project API key from Settings → API Secrets:
# Authorization: Bearer ak_…
# With no Authorization header, this page uses the console session cookie.
# 
# Use this playground to explore your API
# Try selecting a query from the Explorer on the left, or write your own:

query {
  # Example: Get all models
  projectModelsInfo {
    name
    description
  }
}`}
        />
      </div>
    </div>
  );
};

export default GraphqlApiPage;
