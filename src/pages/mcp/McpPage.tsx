import React from "react";
import {
  Alert,
  Button,
  Collapse,
  Skeleton,
  Typography,
} from "antd";
import { useLocation, useNavigate } from "../../router/navigation";
import DeviceApprovalPage from "../sync/DeviceApprovalPage";
import {
  useAccessTokensQuery,
  useRevokeAccessTokenMutation,
} from "../sync/queries";
import { AccessTokensTable } from "../sync/AccessTokensTable";
import { Bot, Plus } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import "../../components/console/ConsoleShell.css";

const { Text, Paragraph } = Typography;

const cursorLocalConfig = `{
  "mcpServers": {
    "apito": {
      "command": "apito",
      "args": ["mcp", "serve", "--transport", "http", "--account", "local"]
    }
  }
}`;

const remoteURLConfig = `{
  "mcpServers": {
    "apito-cloud": { "type": "http", "url": "https://api.apito.io/mcp" },
    "apito-local": { "type": "http", "url": "http://localhost:4055/mcp" },
    "apito-enterprise": { "type": "http", "url": "https://enterprise.example.com/mcp" }
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

const McpDocsPage: React.FC = () => {
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
          message="Connect with a URL"
          description={
            <>
              Add <Text code>https://api.apito.io/mcp</Text> as an HTTP MCP
              server. Do not put a token in the config. The first request
              opens this page so you can approve an{" "}
              <Text strong>MCP assistant</Text> grant. Local Studio uses{" "}
              <Text code>http://localhost:4055/mcp</Text>. The npm{" "}
              <Text code>apito-mcp</Text> package is deprecated and does not
              serve tools. Write and deploy tools return{" "}
              <Text code>CAPABILITY_DENIED</Text> until you create a broader
              token on the{" "}
              <Button
                type="link"
                className="console-link-btn"
                onClick={() => navigate("/access-token")}
              >
                Access Token
              </Button>{" "}
              page.
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
            Paste the URL into Cursor or Claude. The client discovers OAuth
            and opens this page. Docs:{" "}
            <a href="https://apito.io/docs/platform/mcp/">Connect MCP</a>.
          </Paragraph>
          <Collapse
            defaultActiveKey={["remote"]}
            items={[
              {
                key: "remote",
                label: "URL connection",
                children: (
                  <>
                    <Paragraph type="secondary">
                      Paste only the URL. The client stores the credential
                      after you click Give MCP access. Do not paste an{" "}
                      <Text code>apt_</Text> token or a project{" "}
                      <Text code>ak_</Text> key.
                    </Paragraph>
                    <pre className="console-code-block">{remoteURLConfig}</pre>
                  </>
                ),
              },
              {
                key: "local",
                label: "Older stdio bridge",
                children: (
                  <>
                    <Paragraph type="secondary">
                      <Text code>apito mcp serve --transport http</Text>{" "}
                      bridges a stdio client to the same URL. It does not
                      embed a token. <Text code>APITO_MCP_RUNTIME=node</Text>{" "}
                      is the retired Node runtime.
                    </Paragraph>
                    <pre className="console-code-block">{cursorLocalConfig}</pre>
                  </>
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

const McpPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const deviceCode = params.get("device_code")?.trim() ?? "";
  const requestId = params.get("request_id")?.trim() ?? "";
  if (deviceCode || requestId) {
    return <DeviceApprovalPage audience="mcp" />;
  }
  return <McpDocsPage />;
};

export default McpPage;
