import { Alert, Button, Modal, Tabs, Typography, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, TriangleAlert } from "lucide-react";
import { ENV } from "../../utils/env";
import "../../components/console/ConsoleShell.css";

const { Text, Paragraph } = Typography;

export interface RevealTokenModalProps {
  open: boolean;
  token: string | null;
  tokenName?: string;
  onClose: () => void;
}

function buildSnippets(token: string) {
  const restApi = (ENV.VITE_REST_API || "https://api.apito.io").replace(/\/$/, "");

  const curl = `curl -H "Authorization: Bearer ${token}" \\
  "${restApi}/system/access-tokens"`;

  const fetchSnippet = `const res = await fetch("${restApi}/system/access-tokens", {
  headers: {
    Authorization: \`Bearer \${process.env.APITO_ACCESS_TOKEN}\`,
  },
});
const { tokens } = await res.json();`;

  const cli = `export APITO_ACCESS_TOKEN=${token}
apito-cli sync push`;

  const mcp = `{
  "mcpServers": {
    "apito": { "type": "http", "url": "${restApi}/mcp" }
  }
}`;

  return { curl, fetchSnippet, cli, mcp };
}

function CopyBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="token-reveal-code-row">
      <pre className="console-pre-block console-code-block">{code}</pre>
      <CopyToClipboard
        text={code}
        onCopy={() => message.success(`${label} copied to clipboard!`)}
      >
        <Button icon={<Copy size={14} strokeWidth={1.75} />} size="small" />
      </CopyToClipboard>
    </div>
  );
}

export function RevealTokenModal({ open, token, tokenName, onClose }: RevealTokenModalProps) {
  if (!token) return null;
  const { curl, fetchSnippet, cli, mcp } = buildSnippets(token);

  return (
    <Modal
      title={`Access token created${tokenName ? `: ${tokenName}` : ""}`}
      open={open}
      onCancel={onClose}
      footer={
        <Button type="primary" onClick={onClose}>
          Done — I've copied it
        </Button>
      }
      width={640}
      maskClosable={false}
    >
      <Alert
        type="warning"
        showIcon
        icon={<TriangleAlert size={16} strokeWidth={1.75} />}
        className="token-reveal-alert"
        message="Copy this token now"
        description="For your security, this value is shown only once. Store it in a secret manager or environment variable — it can't be retrieved again after you close this dialog."
      />

      <Paragraph className="console-text-block console-mb-sm">
        <Text strong>Access token</Text>
      </Paragraph>
      <CopyBlock code={token} label="Token" />

      <Paragraph className="console-text-block console-mt-lg console-mb-sm">
        <Text strong>Use it</Text>
        <Text type="secondary"> — send it as a bearer token on every request.</Text>
      </Paragraph>

      <Tabs
        className="token-snippet-tabs"
        size="small"
        items={[
          {
            key: "curl",
            label: "cURL",
            children: <CopyBlock code={curl} label="cURL snippet" />,
          },
          {
            key: "sdk",
            label: "Fetch / SDK",
            children: <CopyBlock code={fetchSnippet} label="Fetch snippet" />,
          },
          {
            key: "cli",
            label: "apito-cli",
            children: <CopyBlock code={cli} label="CLI snippet" />,
          },
          {
            key: "mcp",
            label: "MCP client",
            children: (
              <>
                <Paragraph type="secondary">
                  Do not paste the token above into this file. The client
                  opens the URL and asks you to approve access.
                </Paragraph>
                <CopyBlock code={mcp} label="MCP config" />
              </>
            ),
          },
        ]}
      />
    </Modal>
  );
}

export default RevealTokenModal;
