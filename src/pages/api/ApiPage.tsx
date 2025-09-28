import { ConsoleSqlOutlined, GlobalOutlined } from "@ant-design/icons";
import { explorerPlugin } from "@graphiql/plugin-explorer";
import "@graphiql/plugin-explorer/style.css";
import {
  createGraphiQLFetcher,
  type FetcherOpts,
  type FetcherParams,
} from "@graphiql/toolkit";
// import { ApiReference } from "@scalar/api-reference";
import { Space, Tabs } from "antd";
import { GraphiQL } from "graphiql";
import "graphiql/style.css";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ENV } from "../../utils/env";
import { useTourTracking } from "../../hooks/useTourTracking";
//import { useAuth } from "../../contexts/AuthContext";

const ApiPage: React.FC = () => {
  //const { readJWTToken } = useAuth();
  //const token = readJWTToken();
  const [activeTab, setActiveTab] = useState("graphql");
  const { trackQueryExecuted } = useTourTracking();

  // Ensure GraphiQL Explorer is open by setting localStorage
  useEffect(() => {
    localStorage.setItem("graphiql:visiblePlugin", "GraphiQL Explorer");
  }, []);

  // Handle GraphiQL query execution for tour progress
  const handleGraphiQLExecute = useCallback(() => {
    console.log("GraphiQL query executed - tracking for tour");
    trackQueryExecuted();
  }, [trackQueryExecuted]);

  // GraphQL configuration
  const graphqlEndpoint = `${
    ENV.VITE_PUBLIC_GRAPH_API || "https://api.apito.io/secured/graphql"
  }`;

  // Create the base fetcher
  const baseFetcher = createGraphiQLFetcher({
    url: graphqlEndpoint,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Use-Cookies": "true",
    },
    fetch: (url, args) => {
      return fetch(url, {
        ...args,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Use-Cookies": "true",
        },
        credentials: "include",
      });
    },
    schemaFetcher: (graphqlParam: FetcherParams, _opts?: FetcherOpts): any => {
      try {
        return fetch(graphqlEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Use-Cookies": "true",
          },
          credentials: "include",
          body: JSON.stringify(graphqlParam),
        })
          .then(function (response) {
            return response.text();
          })
          .then(function (responseBody) {
            try {
              return JSON.parse(responseBody);
            } catch {
              return responseBody;
            }
          });
      } catch (e) {
        console.log("gql fetch error", e);
      }
    },
  });

  // Track GraphiQL query execution using DOM events
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
        // Always track execute button clicks - the user has intentionally executed a query
        console.log("Execute button clicked - tracking execution");
        console.log(
          "Current localStorage project-has-run-query:",
          localStorage.getItem("project-has-run-query")
        );
        handleGraphiQLExecute();
        console.log(
          "After handleGraphiQLExecute - localStorage project-has-run-query:",
          localStorage.getItem("project-has-run-query")
        );
      }
    };

    // Listen for clicks on execute button
    document.addEventListener("click", handleExecuteButtonClick, true);

    return () => {
      document.removeEventListener("click", handleExecuteButtonClick, true);
    };
  }, [trackQueryExecuted, handleGraphiQLExecute]);

  const fetcher = baseFetcher;

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

  // Sample OpenAPI spec for demonstration - in real app, this would come from your backend
  /* 
  const openApiSpec = {
    openapi: "3.0.3",
    info: {
      title: "Apito REST API",
      description: "RESTful API endpoints for your Apito project",
      version: "1.0.0",
    },
    servers: [
      {
        url:
          import.meta.env.VITE_REST_API_ENDPOINT || "https://api.apito.io/rest",
        description: "Production server",
      },
    ],
    paths: {
      "/models": {
        get: {
          summary: "List all models",
          description: "Retrieve a list of all models in your project",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        created_at: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new model",
          description: "Create a new model in your project",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["name"],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Model created successfully",
            },
          },
        },
      },
      "/content/{model}": {
        get: {
          summary: "Get content for a model",
          parameters: [
            {
              name: "model",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  };
  */

  const renderGraphQLContent = () => (
    <div
      style={{
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        margin: 0,
        padding: 0,
      }}
    >
      <GraphiQL
        key="graphiql-instance"
        fetcher={fetcher}
        plugins={plugins}
        style={{
          height: "100%",
          position: "absolute",
        }}
        defaultQuery={`# Welcome to Apito GraphQL API
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
  );

  const renderRESTContent = () => (
    <div
      style={{
        height: "calc(100vh - 180px)",
        width: "100%",
        overflow: "auto",
      }}
    >
      {/* TODO: Fix ApiReference component type issues */}
      {/* <ApiReference
        configuration={{
          spec: {
            content: JSON.stringify(openApiSpec),
          },
          authentication: {
            bearerToken: token || "",
          },
          theme: "default",
          layout: "modern",
          showSidebar: true,
        }}
      /> */}
      <div>API Reference component temporarily disabled due to type issues</div>
    </div>
  );

  const tabItems = [
    {
      key: "graphql",
      label: (
        <Space>
          <ConsoleSqlOutlined />
          GraphQL
        </Space>
      ),
      children: renderGraphQLContent(),
    },
    {
      key: "rest",
      label: (
        <Space>
          <GlobalOutlined />
          REST API
        </Space>
      ),
      children: renderRESTContent(),
    },
  ];

  return (
    <>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header Section */}
        {/*       <div
        style={{
          padding: "24px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <ApiOutlined />
              API Explorer
            </Title>
            <Text type="secondary">
              Explore and test your APIs using GraphQL playground and REST API
              documentation
            </Text>
          </div>

          <Alert
            message="API Access"
            description={
              <Space direction="vertical" size={8}>
                <Text>
                  <strong>GraphQL Endpoint:</strong> {graphqlEndpoint}
                </Text>
                <Text>
                  <strong>REST API Endpoint:</strong>{" "}
                  {import.meta.env.VITE_REST_API_ENDPOINT ||
                    "https://api.apito.io/rest"}
                </Text>
                <Text type="secondary">
                  Both endpoints require authentication with your API token.
                </Text>
              </Space>
            }
            type="info"
            showIcon
          />
        </Space>
      </div>
 */}
        {/* Tabs Content */}
        <div
          style={{
            flex: 1,
            padding: "0",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            tabBarStyle={{
              paddingLeft: "24px",
              paddingRight: "24px",
              marginBottom: 0,
              background: "#fff",
              borderBottom: "1px solid #f0f0f0",
            }}
            tabBarGutter={0}
            destroyInactiveTabPane={false}
            tabPosition="top"
          />
        </div>
      </div>
    </>
  );
};

export default ApiPage;
