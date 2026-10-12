import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { LogicCodeEditor } from "./LogicCodeEditor";
import { testFunctionDraft, type DraftTestResult } from "../logicApi";
import { useConsoleExtensions } from "../../../contexts/ConsoleExtensionsContext";

const TENANT_ERROR_CODES = new Set([
  "TENANT_REQUIRED",
  "TENANT_NOT_FOUND",
  "TENANT_NOT_ACTIVE",
  "TENANT_SCOPE_FORBIDDEN",
  "TENANT_DB_NOT_READY",
]);

type Props = {
  functionName: string;
  source: string;
  tenantId: string;
  onTenantIdChange: (v: string) => void;
  saved: boolean;
};

export function FunctionTestPanel({
  functionName,
  source,
  tenantId,
  onTenantIdChange,
  saved,
}: Props) {
  const { LogicTenantPicker, logicTenantRequired } = useConsoleExtensions();
  const [payloadText, setPayloadText] = useState('{\n  "limit": 10\n}');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<DraftTestResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const tenantMissing = Boolean(logicTenantRequired && !tenantId.trim());

  const tenantAlert = useMemo(() => {
    if (!result?.error_class || !TENANT_ERROR_CODES.has(result.error_class)) {
      return null;
    }
    return {
      code: result.error_class,
      message: result.error || result.error_class,
    };
  }, [result]);

  const resultJson = useMemo(() => {
    if (!result) return "";
    // Keep stable tenant errors in the Alert; omit raw internals from JSON when classified.
    const payload: Record<string, unknown> = {
      ok: result.ok,
      duration_ms: result.duration_ms,
      invocation_id: result.invocation_id,
      response: result.response,
      logs: result.logs,
    };
    if (result.error_class && TENANT_ERROR_CODES.has(result.error_class)) {
      payload.error_class = result.error_class;
    } else {
      payload.error = result.error;
      payload.error_class = result.error_class;
    }
    return JSON.stringify(payload, null, 2);
  }, [result]);

  const onRun = async () => {
    if (!saved) {
      message.warning("Save the draft once before testing so the function exists on the project.");
      return;
    }
    if (tenantMissing) {
      message.warning("Select a tenant to test this function");
      return;
    }
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(payloadText) as Record<string, unknown>;
      setParseError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid JSON";
      setParseError(msg);
      message.error(`Request JSON: ${msg}`);
      return;
    }
    setTesting(true);
    try {
      const out = await testFunctionDraft({
        name: functionName,
        source,
        payload,
        tenantId: tenantId.trim() || undefined,
      });
      setResult(out);
      if (out.ok) message.success(`Draft test ok (${out.duration_ms ?? "?"}ms)`);
      else if (out.error_class && TENANT_ERROR_CODES.has(out.error_class)) {
        message.error(out.error || "Select a tenant to test this function");
      } else {
        message.error(out.error || "Draft test failed");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Draft test failed";
      setResult({ ok: false, error: msg });
      message.error(msg);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="Admin draft test"
        description="Runs the unsaved editor source synchronously. Does not require X-Fn-Hash. For SaaS projects, pick a tenant below so data reads hit the scoped database."
      />
      {LogicTenantPicker ? (
        <div>
          <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
            Tenant{logicTenantRequired ? " (required)" : ""}
          </Typography.Text>
          <LogicTenantPicker
            value={tenantId}
            onChange={onTenantIdChange}
            required={logicTenantRequired}
          />
          {tenantMissing ? (
            <Typography.Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              Select a tenant to test this function
            </Typography.Text>
          ) : null}
        </div>
      ) : null}
      {tenantAlert ? (
        <Alert
          type="warning"
          showIcon
          message={tenantAlert.code}
          description={tenantAlert.message}
        />
      ) : null}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Typography.Text strong>Request payload</Typography.Text>
          {parseError ? (
            <Typography.Text type="danger" style={{ display: "block" }}>
              {parseError}
            </Typography.Text>
          ) : null}
          <LogicCodeEditor
            value={payloadText}
            onChange={setPayloadText}
            language="json"
            height="280px"
            ariaLabel="Test request JSON"
          />
        </Col>
        <Col xs={24} lg={12}>
          <Typography.Text strong>Result</Typography.Text>
          <LogicCodeEditor
            value={resultJson || "{\n  \"hint\": \"Run draft test to see response, duration, logs\"\n}"}
            onChange={() => undefined}
            language="json"
            height="280px"
            readOnly
            ariaLabel="Test result JSON"
          />
        </Col>
      </Row>
      <Button
        type="primary"
        loading={testing}
        onClick={onRun}
        disabled={tenantMissing}
        aria-label="Run draft test"
      >
        {tenantMissing ? "Select a tenant to test this function" : "Run unsaved draft"}
      </Button>
    </Space>
  );
}
