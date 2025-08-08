import React, { useState } from "react";
import { Typography, Card, Button, Space, Alert, Divider, Tabs } from "antd";
import {
  ApiOutlined,
  BookOutlined,
  CodeOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { GraphiQL } from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { explorerPlugin } from "@graphiql/plugin-explorer";
import { SYSTEM_GRAPHQL_URL } from "../../constants/api";
import "graphiql/style.css";
import "@graphiql/plugin-explorer/style.css";

const { Title, Text, Paragraph } = Typography;

const SystemApiPage: React.FC = () => {
  const { decodeTokenData } = useAuth();

  const [activeTab, setActiveTab] = useState("tools");

  // GraphiQL fetcher setup
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

  // GraphiQL explorer plugin
  const explorer = explorerPlugin();

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/system/graphql",
      description: "GraphQL endpoint for system operations",
      color: "#52c41a",
    },
    {
      method: "POST",
      endpoint: "/system/project/list",
      description: "Fetch all projects for current user",
      color: "#1890ff",
    },
    {
      method: "POST",
      endpoint: "/system/project/create",
      description: "Create a new project",
      color: "#1890ff",
    },
    {
      method: "POST",
      endpoint: "/system/project/switch",
      description: "Switch between projects",
      color: "#1890ff",
    },
    {
      method: "GET",
      endpoint: "/system/user/profile",
      description: "Get current user profile",
      color: "#52c41a",
    },
    {
      method: "POST",
      endpoint: "/system/user/profile",
      description: "Update user profile",
      color: "#1890ff",
    },
  ];

  const features = [
    {
      icon: (
        <ExperimentOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      ),
      title: "Interactive API Explorer",
      description:
        "Test API endpoints directly from the browser with real-time results",
      buttonText: "Launch Explorer",
      action: () => window.open("/api-explorer", "_blank"),
    },
    {
      icon: <BookOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      title: "API Documentation",
      description: "Comprehensive documentation for all system APIs",
      buttonText: "View Docs",
      action: () => window.open("https://docs.apito.io/api", "_blank"),
    },
    {
      icon: <CodeOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
      title: "GraphQL Schema",
      description: "Explore the GraphQL schema and available queries",
      buttonText: "View Schema",
      action: () => window.open("/graphql", "_blank"),
    },
    {
      icon: <GlobalOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />,
      title: "REST API",
      description: "RESTful API endpoints for system operations",
      buttonText: "View REST Docs",
      action: () => window.open("/system/doc", "_blank"),
    },
  ];

  return (
    <div style={{ padding: "24px", margin: "0 auto" }}>
      {/* API Tools Tabs */}
      <div style={{ marginBottom: "32px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "tools",
              label: (
                <Space>
                  <ApiOutlined />
                  API Tools
                </Space>
              ),
              children: (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    {features.map((feature, index) => (
                      <Card
                        key={index}
                        hoverable
                        style={{ textAlign: "center", height: "100%" }}
                        bodyStyle={{ padding: "24px" }}
                      >
                        <div style={{ marginBottom: "16px" }}>
                          {feature.icon}
                        </div>
                        <Title level={4} style={{ marginBottom: "8px" }}>
                          {feature.title}
                        </Title>
                        <Paragraph
                          style={{ marginBottom: "20px", minHeight: "48px" }}
                        >
                          {feature.description}
                        </Paragraph>
                        <Button
                          type="primary"
                          block
                          icon={<PlayCircleOutlined />}
                          onClick={feature.action}
                        >
                          {feature.buttonText}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              key: "graphiql",
              label: (
                <Space>
                  <ConsoleSqlOutlined />
                  System GraphQL Endpoint
                </Space>
              ),
              children: (
                <div>
                  <Alert
                    message="Interactive GraphQL Explorer"
                    description="Use this interface to explore the GraphQL schema, write queries, and test your API endpoints in real-time."
                    type="info"
                    style={{ marginBottom: "16px" }}
                    showIcon
                  />
                  <div
                    style={{
                      height: "600px",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
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
      </div>

      <Divider />

      {/* System API Endpoints */}
      <div style={{ marginBottom: "32px" }}>
        <Title level={3}>System API Endpoints</Title>
        <Text type="secondary">
          Common system endpoints available for your applications
        </Text>

        <div style={{ marginTop: "16px" }}>
          {apiEndpoints.map((endpoint, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: "8px" }}
              bodyStyle={{ padding: "16px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: endpoint.color,
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {endpoint.method}
                </div>
                <div style={{ flex: 1 }}>
                  <Text code style={{ fontSize: "14px" }}>
                    {endpoint.endpoint}
                  </Text>
                  <div style={{ marginTop: "4px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {endpoint.description}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginTop: "24px" }}>
        <Space size="middle" wrap>
          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            onClick={() => window.open("/api-explorer", "_blank")}
          >
            Launch API Explorer
          </Button>
          <Button
            icon={<BookOutlined />}
            onClick={() => window.open("https://docs.apito.io", "_blank")}
          >
            View Documentation
          </Button>
          <Button
            icon={<CodeOutlined />}
            onClick={() => window.open("/graphql", "_blank")}
          >
            GraphQL Playground
          </Button>
          <Button
            icon={<GlobalOutlined />}
            onClick={() => window.open("/system/doc", "_blank")}
          >
            REST API Docs
          </Button>
        </Space>
      </Card>

      {/* Usage Examples */}
      <Card title="Usage Examples" style={{ marginTop: "24px" }}>
        <Title level={5}>Fetch Projects (cURL)</Title>
        <div
          style={{
            backgroundColor: "#f6f8fa",
            padding: "16px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontFamily: "monospace",
            fontSize: "12px",
            border: "1px solid #e1e4e8",
          }}
        >
          {`curl -X POST https://api.apito.io/system/project/list \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  --data '{}'`}
        </div>

        <Title level={5}>GraphQL Query</Title>
        <div
          style={{
            backgroundColor: "#f6f8fa",
            padding: "16px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
            border: "1px solid #e1e4e8",
          }}
        >
          {`query {
  getCurrentUser {
    email
    first_name
    last_name
    project_limit
  }
}`}
        </div>
      </Card>
    </div>
  );
};

export default SystemApiPage;
