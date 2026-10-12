import { useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import { Copy, Eye, EyeOff } from "lucide-react";
import type { FunctionGraphQLExposure } from "../logicApi";
import { restCallableUrl } from "../logicApi";

type Props = {
  projectId: string;
  name: string;
  isCreate: boolean;
  onNameChange: (name: string) => void;
  graphqlExposure: FunctionGraphQLExposure;
  onGraphqlExposureChange: (v: FunctionGraphQLExposure) => void;
  runtime: "deno" | "wasm";
  onRuntimeChange: (v: "deno" | "wasm") => void;
  capabilities: string[];
  onCapabilitiesChange: (caps: string[]) => void;
  restSecret?: string;
  description: string;
  onDescriptionChange: (v: string) => void;
};

const CAPABILITY_OPTIONS = [
  { value: "data.read:food", label: "data.read:food" },
  { value: "data.read:*", label: "data.read:* (all models)" },
];

export function FunctionSettingsForm({
  projectId,
  name,
  isCreate,
  onNameChange,
  graphqlExposure,
  onGraphqlExposureChange,
  runtime,
  onRuntimeChange,
  capabilities,
  onCapabilitiesChange,
  restSecret,
  description,
  onDescriptionChange,
}: Props) {
  const [reveal, setReveal] = useState(false);
  const restUrl = projectId && name ? restCallableUrl(projectId, name) : "";

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${label} copied`);
    } catch {
      message.error("Copy failed");
    }
  };

  const publicGraphqlExample =
    graphqlExposure === "Mutation"
      ? `mutation { ${name || "fn"}(payload: { limit: 10 }) }`
      : `query { ${name || "fn"}(payload: { limit: 10 }) }`;

  return (
    <Form layout="vertical">
      <Form.Item label="Function name" required>
        <Input
          value={name}
          disabled={!isCreate}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="listFoodNames"
          aria-label="Function name"
        />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          aria-label="Function description"
        />
      </Form.Item>
      <Form.Item
        label="Public GraphQL exposure"
        tooltip="Query = read-style field; Mutation = write-style. REST callable uses X-Fn-Hash after first save."
      >
        <Select
          value={graphqlExposure}
          onChange={onGraphqlExposureChange}
          options={[
            { value: "Query", label: "Query (read / side-effect-free)" },
            { value: "Mutation", label: "Mutation (writes / side effects)" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Runtime">
        <Select
          value={runtime}
          onChange={onRuntimeChange}
          options={[
            { value: "deno", label: "Deno / TypeScript (recommended)" },
            { value: "wasm", label: "WASM (prebuilt artifact)" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Capabilities"
        tooltip="Enforced server-side. Guest code cannot elevate capabilities."
      >
        <Select
          mode="tags"
          value={capabilities}
          onChange={onCapabilitiesChange}
          options={CAPABILITY_OPTIONS}
          placeholder="e.g. data.read:food"
          aria-label="Function capabilities"
        />
      </Form.Item>

      <Typography.Title level={5}>Endpoints</Typography.Title>
      {restUrl ? (
        <Alert
          type="info"
          showIcon
          message="Callable REST"
          description={
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography.Text code copyable={{ text: restUrl }}>
                {restUrl}
              </Typography.Text>
              <Space wrap>
                <Typography.Text type="secondary">X-Fn-Hash</Typography.Text>
                {restSecret ? (
                  <>
                    <Typography.Text code>
                      {reveal ? restSecret : "•••••••••••••••••••••••••"}
                    </Typography.Text>
                    <Button
                      size="small"
                      icon={reveal ? <EyeOff size={14} /> : <Eye size={14} />}
                      onClick={() => setReveal((v) => !v)}
                      aria-label={reveal ? "Hide secret" : "Reveal secret"}
                    />
                    <Button
                      size="small"
                      icon={<Copy size={14} />}
                      onClick={() => copy(restSecret, "Secret")}
                      aria-label="Copy secret"
                    />
                  </>
                ) : (
                  <Typography.Text type="secondary">
                    Save draft once to generate a secret.
                  </Typography.Text>
                )}
              </Space>
              <Typography.Paragraph
                type="secondary"
                style={{ marginBottom: 0 }}
                copyable={{ text: publicGraphqlExample }}
              >
                Public GraphQL: {publicGraphqlExample}
              </Typography.Paragraph>
              <Space>
                <Typography.Text type="secondary">Mask secret by default</Typography.Text>
                <Switch checked={!reveal} onChange={(c) => setReveal(!c)} size="small" />
              </Space>
            </Space>
          }
        />
      ) : (
        <Alert type="warning" showIcon message="Select a project to see callable endpoints." />
      )}
    </Form>
  );
}
