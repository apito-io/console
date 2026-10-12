import React from "react";
import {
  Alert,
  Button,
  Collapse,
  Skeleton,
  Typography,
} from "antd";
import { useNavigate } from "../../router/navigation";
import { ENV } from "../../utils/env";
import {
  useAccessTokensQuery,
  useRevokeAccessTokenMutation,
} from "../sync/queries";
import { AccessTokensTable } from "../sync/AccessTokensTable";
import { Bot, Plus } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import "../../components/console/ConsoleShell.css";

const { Text, Paragraph } = Typography;

const MCP_REMOTE_SSE = "https://apito-mcp.apito.workers.dev/sse";

const cursorLocalConfig = `{
  "mcpServers": {
    "apito": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/apito-mcp/src/index.ts"],
      "env": {
        "APITO_API_KEY": "apt_your-token-here",
        "APITO_GRAPHQL_ENDPOINT": "${ENV.VITE_GRAPH_API || "https://api.apito.io/system/graphql"}",
        "APITO_ALLOWED_PROJECT_IDS": "project-id-1,project-id-2",
        "APITO_DEFAULT_PROJECT_ID": "optional-read-default-project-id",
        "TENANT_ID": "optional-saas-tenant-id"
      }
    }
  }
}`;

const cursorRemoteConfig = `{
  "mcpServers": {
    "apito-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${MCP_REMOTE_SSE}",
        "--header",
        "Authorization: Bearer \${APITO_API_KEY}",
        "--header",
        "X-Apito-Tenant-ID:\${TENANT_ID}"
      ],
      "env": {
        "APITO_API_KEY": "apt_your-token-here",
        "TENANT_ID": "optional-tenant-id"
      }
    }
  }
}`;

const exampleQueries = [
  "List models in my Apito project",
  "Create a model named blog_post",
  "Add a text field to model blog_post",
  "Get schema versioning status",
  "Summarize the schema draft for review before I publish in Console",
  "Upsert a row in model task after schema is published",
];

const McpPage: React.FC = () => {
  const navigate = useNavigate();
  const tokensQuery = useAccessTokensQuery();
  const revokeMutation = useRevokeAccessTokenMutation();
  const [revokingId, setRevokingId] = React.useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeMutation.mutateAsync({ id });
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="console-page">
      <div className="console-stack">
        <Alert
          type="info"
          showIcon
          className="console-mb-0"
          message="Apito MCP uses the system GraphQL API"
          description={
            <>
              Create a unified access token on the{" "}
              <Button
                type="link"
                className="console-link-btn"
                onClick={() => navigate("/access-token")}
              >
                Access Token
              </Button>{" "}
              page (preset <Text strong>MCP assistant</Text> for read-only, or
              custom capabilities). Use it as{" "}
              <Text code>Authorization: Bearer apt_…</Text> /{" "}
              <Text code>APITO_API_KEY</Text>. Tool availability follows the
              token&apos;s capabilities (<Text code>CAPABILITY_DENIED</Text> when
              missing). The MCP server also requires an explicit{" "}
              <Text code>APITO_ALLOWED_PROJECT_IDS</Text> allowlist; it can only
              narrow the token&apos;s engine-side grants.
            </>
          }
        />

        <ConsoleCard
          title={
            <ConsoleCardTitle icon={Plus} label="Your access tokens" />
          }
          extra={
            <Button type="primary" onClick={() => navigate("/access-token")}>
              Manage tokens
            </Button>
          }
        >
          {tokensQuery.isLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <AccessTokensTable
              tokens={tokensQuery.data?.tokens ?? []}
              loading={tokensQuery.isLoading}
              revokingId={revokingId}
              onRevoke={handleRevoke}
              onRotate={() => navigate("/access-token")}
              emptyText="No access tokens yet. Create one with the MCP assistant preset."
            />
          )}
        </ConsoleCard>

        <ConsoleCard
          title={
            <ConsoleCardTitle icon={Bot} label="MCP client setup" />
          }
        >
          <Paragraph type="secondary">
            Prefer the <Text strong>MCP assistant</Text> preset (read-only) unless
            you intentionally grant write/deploy capabilities. Reads identify a
            project on each tool call. Writes first use{" "}
            <Text code>prepare_project_scope</Text> then{" "}
            <Text code>confirm_project_scope</Text> to obtain a short-lived,
            project-bound lease.
          </Paragraph>
          <Collapse
            items={[
              {
                key: "local",
                label: "Cursor — local MCP server",
                children: (
                  <pre className="console-code-block">{cursorLocalConfig}</pre>
                ),
              },
              {
                key: "remote",
                label: "Cursor — remote SSE",
                children: (
                  <pre className="console-code-block">{cursorRemoteConfig}</pre>
                ),
              },
              {
                key: "examples",
                label: "Example prompts",
                children: (
                  <ul>
                    {exampleQueries.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </ConsoleCard>
      </div>
    </div>
  );
};

export default McpPage;
