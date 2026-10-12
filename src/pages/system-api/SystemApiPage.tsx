import React, { useState } from "react";
import { Button, Space, Alert, Divider, Tabs } from "antd";
import { GraphiQL } from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { explorerPlugin } from "@graphiql/plugin-explorer";
import { SYSTEM_GRAPHQL_URL } from "../../constants/api";
import "graphiql/style.css";
import "@graphiql/plugin-explorer/style.css";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CirclePlay,
  Code,
  FlaskConical,
  Globe,
  Terminal,
  Webhook,
} from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import "../../components/console/ConsoleShell.css";

interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
}

interface ApiFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  action: () => void;
}

const SystemApiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tools");

  const fetcher = createGraphiQLFetcher({
    url: SYSTEM_GRAPHQL_URL,
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
  });

  const explorer = explorerPlugin();

  const apiEndpoints: ApiEndpoint[] = [
    {
      method: "GET",
      endpoint: "/system/graphql",
      description: "GraphQL endpoint for system operations",
    },
    {
      method: "POST",
      endpoint: "/system/project/list",
      description: "Fetch all projects for current user",
    },
    {
      method: "POST",
      endpoint: "/system/project/create",
      description: "Create a new project",
    },
    {
      method: "POST",
      endpoint: "/system/project/switch",
      description: "Switch between projects",
    },
    {
      method: "GET",
      endpoint: "/system/user/profile",
      description: "Get current user profile",
    },
    {
      method: "POST",
      endpoint: "/system/user/profile",
      description: "Update user profile",
    },
  ];

  const features: ApiFeature[] = [
    {
      icon: FlaskConical,
      title: "Interactive API Explorer",
      description:
        "Test API endpoints directly from the browser with real-time results",
      buttonText: "Launch Explorer",
      action: () => window.open("/api-explorer", "_blank"),
    },
    {
      icon: BookOpen,
      title: "API Documentation",
      description: "Comprehensive documentation for all system APIs",
      buttonText: "View Docs",
      action: () => window.open("https://apito.io/docs/api", "_blank"),
    },
    {
      icon: Code,
      title: "GraphQL Schema",
      description: "Explore the GraphQL schema and available queries",
      buttonText: "View Schema",
      action: () => window.open("/graphql", "_blank"),
    },
    {
      icon: Globe,
      title: "REST API",
      description: "RESTful API endpoints for system operations",
      buttonText: "View REST Docs",
      action: () => window.open("/system/doc", "_blank"),
    },
  ];

  return (
    <div className="console-page">
      <div className="console-stack">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "tools",
              label: (
                <Space>
                  <Webhook size={16} strokeWidth={1.75} />
                  API Tools
                </Space>
              ),
              children: (
                <div className="console-grid-cards console-mb-md">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <ConsoleCard
                        key={feature.title}
                        className="console-channel-card"
                        hoverable
                      >
                        <div className="console-channel-icon">
                          <Icon size={24} strokeWidth={1.75} />
                        </div>
                        <p className="console-channel-title">{feature.title}</p>
                        <p className="console-channel-desc">
                          {feature.description}
                        </p>
                        <Button
                          type="primary"
                          block
                          icon={<CirclePlay size={16} strokeWidth={1.75} />}
                          onClick={feature.action}
                        >
                          {feature.buttonText}
                        </Button>
                      </ConsoleCard>
                    );
                  })}
                </div>
              ),
            },
            {
              key: "graphiql",
              label: (
                <Space>
                  <Terminal size={16} strokeWidth={1.75} />
                  System GraphQL Endpoint
                </Space>
              ),
              children: (
                <div>
                  <Alert
                    message="Interactive GraphQL Explorer"
                    description="Use this interface to explore the GraphQL schema, write queries, and test your API endpoints in real-time."
                    type="info"
                    className="console-mb-sm"
                    showIcon
                  />
                  <div className="console-graphiql-shell">
                    <GraphiQL
                      fetcher={fetcher}
                      plugins={[explorer]}
                      visiblePlugin={explorer}
                      defaultQuery={`# Welcome to GraphiQL Explorer
# 
# This is an interactive GraphQL IDE for the Apito System API.
# Use the Explorer panel on the left to build queries visually,
# or write queries directly in this editor.
#
# Example queries to get you started:

query GetCurrentUser {
  getCurrentUser {
    email
    first_name
    last_name
    project_limit
    subscription_status
    is_verified
  }
}

query GetUserProjects {
  getUserProjects {
    id
    name
    description
    database_type
    status
    created_at
  }
}`}
                      shouldPersistHeaders={true}
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />

        <Divider />

        <ConsoleCard
          title={
            <ConsoleCardTitle
              icon={Globe}
              label="System API Endpoints"
            />
          }
        >
          <p className="console-text-muted-block console-mb-md">
            Common system endpoints available for your applications
          </p>
          <div className="console-endpoint-list">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.endpoint} className="console-endpoint-row">
                <span className="console-method-badge">{endpoint.method}</span>
                <div className="console-endpoint-body">
                  <code className="console-code-inline">{endpoint.endpoint}</code>
                  <div className="console-endpoint-desc">
                    {endpoint.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ConsoleCard>

        <ConsoleCard
          title={
            <ConsoleCardTitle icon={FlaskConical} label="Quick Actions" />
          }
        >
          <Space size="middle" wrap>
            <Button
              type="primary"
              icon={<FlaskConical size={16} strokeWidth={1.75} />}
              onClick={() => window.open("/api-explorer", "_blank")}
            >
              Launch API Explorer
            </Button>
            <Button
              icon={<BookOpen size={16} strokeWidth={1.75} />}
              onClick={() => window.open("https://apito.io/docs", "_blank")}
            >
              View Documentation
            </Button>
            <Button
              icon={<Code size={16} strokeWidth={1.75} />}
              onClick={() => window.open("/graphql", "_blank")}
            >
              GraphQL Playground
            </Button>
            <Button
              icon={<Globe size={16} strokeWidth={1.75} />}
              onClick={() => window.open("/system/doc", "_blank")}
            >
              REST API Docs
            </Button>
          </Space>
        </ConsoleCard>

        <ConsoleCard
          title={<ConsoleCardTitle icon={Code} label="Usage Examples" />}
        >
          <p className="console-section-title console-section-title--flush">
            Fetch Projects (cURL)
          </p>
          <pre className="console-code-block console-mb-md">{`curl -X POST ${window.location.origin}/api/system/project/list \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  --data '{}'`}</pre>

          <p className="console-section-title console-section-title--flush">
            GraphQL Query
          </p>
          <pre className="console-code-block">{`query {
  getCurrentUser {
    email
    first_name
    last_name
    project_limit
  }
}`}</pre>
        </ConsoleCard>
      </div>
    </div>
  );
};

export default SystemApiPage;
