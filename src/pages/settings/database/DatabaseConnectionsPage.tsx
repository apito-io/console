import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Input, Space, Tabs, Tag, Typography } from "antd";
import { Database } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../../components/console";
import {
  fetchDatabaseConnections,
  saveDatabaseConnection,
  testDatabaseConnection,
  type ConnectionTestResult,
  type DatabaseConnection,
  type DatabaseConnectionInput,
  type DatabaseEngine,
} from "./api";

const { Text } = Typography;

const TABS: { key: DatabaseEngine; label: string }[] = [
  { key: "sqlite", label: "SQLite" },
  { key: "postgresql", label: "PostgreSQL" },
  { key: "mysql", label: "MySQL" },
  { key: "mongodb", label: "MongoDB" },
];

const FIELDS: (keyof DatabaseConnectionInput)[] = [
  "uri",
  "host",
  "port",
  "database",
  "username",
  "password",
];

/** Stable key for "these exact form values passed a test". */
export function connectionValuesKey(values: DatabaseConnectionInput): string {
  return JSON.stringify(FIELDS.map((k) => String(values[k] ?? "").trim()));
}

function checkedLabel(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function StatusLine({ row }: { row?: DatabaseConnection }) {
  if (!row) return null;
  const version = row.server_version ? ` · ${row.server_version}` : "";
  const checked = checkedLabel(row.checked_at);
  if (row.connected) {
    return (
      <Space size={8} wrap>
        <Tag color="green">Active</Tag>
        <Text type="secondary">
          {row.source === "env"
            ? "From the engine configuration (.env)"
            : row.source === "embedded"
              ? "Embedded, always available"
              : "Saved connection"}
          {version}
          {checked ? ` · checked ${checked}` : ""}
        </Text>
      </Space>
    );
  }
  if (row.last_error) {
    return (
      <Space size={8} wrap>
        <Tag color="red">Failing</Tag>
        <Text type="secondary">{row.last_error}</Text>
      </Space>
    );
  }
  return (
    <Space size={8} wrap>
      <Tag>Not set up</Tag>
      <Text type="secondary">Test the connection, then save it.</Text>
    </Space>
  );
}

function resultText(engineLabel: string, res: ConnectionTestResult): string {
  const c = res.check;
  const parts = [`Connected to ${engineLabel}`];
  if (c?.server_version) parts.push(c.server_version);
  if (typeof c?.latency_ms === "number") parts.push(`${c.latency_ms} ms`);
  return parts.join(" · ");
}

type PanelProps = {
  engine: DatabaseEngine;
  label: string;
  row?: DatabaseConnection;
  onChanged: () => Promise<void>;
};

const ConnectionPanel: React.FC<PanelProps> = ({ engine, label, row, onChanged }) => {
  const [form] = Form.useForm<DatabaseConnectionInput>();
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passedKey, setPassedKey] = useState("");
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fromEnv = row?.source === "env";

  useEffect(() => {
    form.setFieldsValue({
      host: row?.host ?? "",
      port: row?.port ?? "",
      database: row?.database ?? "",
      username: row?.username ?? "",
      password: "",
      uri: "",
    });
    setPassedKey("");
  }, [form, row?.host, row?.port, row?.database, row?.username, row?.source]);

  const values = Form.useWatch([], form) as DatabaseConnectionInput | undefined;
  const currentKey = useMemo(() => connectionValuesKey(values ?? {}), [values]);
  const canSave = !fromEnv && passedKey !== "" && passedKey === currentKey;

  const onTest = async () => {
    setResult(null);
    setPassedKey("");
    let input: DatabaseConnectionInput | undefined;
    if (!fromEnv) {
      try {
        input = await form.validateFields();
      } catch {
        return;
      }
    }
    setTesting(true);
    try {
      const res = await testDatabaseConnection(engine, input);
      setResult({ type: "success", text: resultText(label, res) });
      if (input) setPassedKey(connectionValuesKey(input));
      if (fromEnv) await onChanged();
    } catch (err) {
      setResult({ type: "error", text: err instanceof Error ? err.message : "Connection failed" });
      if (fromEnv) await onChanged();
    } finally {
      setTesting(false);
    }
  };

  const onSave = async () => {
    const input = form.getFieldsValue();
    setSaving(true);
    try {
      await saveDatabaseConnection(engine, input);
      setResult({
        type: "success",
        text: `Saved. ${label} is now available when you create a project.`,
      });
      setPassedKey("");
      await onChanged();
    } catch (err) {
      setResult({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <StatusLine row={row} />
      {fromEnv ? (
        <Alert
          style={{ marginTop: 12 }}
          type="info"
          showIcon
          title="This connection comes from the engine's environment (MANAGED_PROJECT_* variables). Change it there; you can still test it here."
        />
      ) : null}
      <Form
        form={form}
        name={`connection-${engine}`}
        layout="vertical"
        style={{ marginTop: 12 }}
        disabled={fromEnv}
        onValuesChange={() => setResult(null)}
      >
        {engine === "mongodb" ? (
          <Form.Item
            name="uri"
            label="Connection string (optional)"
            extra="Overrides the fields below. Leave blank to keep the stored one."
          >
            <Input placeholder="mongodb://user:pass@localhost:27017/apito" autoComplete="off" />
          </Form.Item>
        ) : null}
        <Form.Item
          name="host"
          label="Host"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (String(value ?? "").trim() || (engine === "mongodb" && String(getFieldValue("uri") ?? "").trim())) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Host is required"));
              },
            }),
          ]}
        >
          <Input autoComplete="off" placeholder="localhost" />
        </Form.Item>
        <Form.Item name="port" label="Port">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="database"
          label="Database"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (engine === "mongodb" && String(getFieldValue("uri") ?? "").trim()) return Promise.resolve();
                return String(value ?? "").trim()
                  ? Promise.resolve()
                  : Promise.reject(new Error("Database is required"));
              },
            }),
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="username" label="User">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="password" label="Password">
          <Input.Password
            autoComplete="new-password"
            placeholder={row?.has_password ? "Stored — leave blank to keep it" : ""}
          />
        </Form.Item>
      </Form>
      {result ? (
        <Alert style={{ marginBottom: 12 }} type={result.type} showIcon title={result.text} />
      ) : null}
      <Space>
        <Button onClick={() => void onTest()} loading={testing}>
          Test connection
        </Button>
        {!fromEnv ? (
          <Button type="primary" onClick={() => void onSave()} loading={saving} disabled={!canSave}>
            Save
          </Button>
        ) : null}
        {!fromEnv && !canSave ? (
          <Text type="secondary">Save unlocks after these exact values pass a test.</Text>
        ) : null}
      </Space>
    </div>
  );
};

type DatabaseConnectionsPageProps = {
  /** Optional edition content shown under the tabs (for example, where to get a server). */
  footer?: React.ReactNode;
};

const DatabaseConnectionsPage: React.FC<DatabaseConnectionsPageProps> = ({ footer }) => {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [engine, setEngine] = useState<DatabaseEngine>("sqlite");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetchDatabaseConnections();
      setConnections(res.connections);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load connections");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ConsoleCard title={<ConsoleCardTitle icon={Database} label="Connections" />}>
      <Text type="secondary">
        SQLite is always available. Test a PostgreSQL, MySQL or MongoDB server, save it, and it
        appears when you create a project. Tests run on the server, through the same driver the
        project will use.
      </Text>
      {error ? <Alert type="error" showIcon title={error} style={{ marginTop: 12 }} /> : null}
      <Tabs
        activeKey={engine}
        onChange={(key) => setEngine(key as DatabaseEngine)}
        style={{ marginTop: 12 }}
        items={TABS.map((tab) => {
          const row = connections.find((item) => item.engine === tab.key);
          return {
            key: tab.key,
            label: (
              <Space size={6}>
                {tab.label}
                {row?.connected ? <Tag color="green" style={{ marginInlineEnd: 0 }}>Active</Tag> : null}
              </Space>
            ),
            children:
              tab.key === "sqlite" ? (
                <Space orientation="vertical">
                  <StatusLine row={row ?? { engine: "sqlite", label: "SQLite", connected: true, source: "embedded" }} />
                  <Text>Embedded SQLite. Nothing to configure.</Text>
                </Space>
              ) : (
                <ConnectionPanel engine={tab.key} label={tab.label} row={row} onChanged={load} />
              ),
          };
        })}
      />
      {footer ? <div style={{ marginTop: 16 }}>{footer}</div> : null}
    </ConsoleCard>
  );
};

export default DatabaseConnectionsPage;
