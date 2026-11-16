import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Input, Tabs, Typography } from "antd";
import { Database } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../../components/console";
import {
  fetchDatabaseConnections,
  saveDatabaseConnection,
  spawnDatabaseInstance,
  testDatabaseConnection,
  type DatabaseConnection,
  type DatabaseEngine,
} from "./api";

const { Text } = Typography;

const TABS: { key: DatabaseEngine; label: string }[] = [
  { key: "sqlite", label: "SQLite" },
  { key: "postgresql", label: "PostgreSQL" },
  { key: "mysql", label: "MySQL" },
  { key: "mongodb", label: "MongoDB" },
];

export type SpawnSlotProps = {
  engine: DatabaseEngine;
};

const DefaultSpawn: React.FC<{ engine: DatabaseEngine }> = ({ engine }) => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  return (
    <div>
      <Text>e2-small · us-central1 · 60 GB · about $45/mo</Text>
      <div>
        <Button
          style={{ marginTop: 8 }}
          loading={busy}
          onClick={() => {
            setBusy(true);
            setError("");
            setResult("");
            const slug = `${engine}-instance-${Date.now().toString(36)}`.slice(0, 48);
            void spawnDatabaseInstance({
              database: engine,
              slug,
              tier: "starter",
              region: "us-central1",
            })
              .then((order) => setResult(`Queued ${order.id || "order"} as ${order.status || "pending"}.`))
              .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not queue the instance"))
              .finally(() => setBusy(false));
          }}
        >
          Spawn instance
        </Button>
      </div>
      {result ? <Alert style={{ marginTop: 12 }} type="success" showIcon message={result} /> : null}
      {error ? <Alert style={{ marginTop: 12 }} type="error" showIcon message={error} /> : null}
    </div>
  );
};

type DatabaseConnectionsPageProps = {
  renderSpawn?: (props: SpawnSlotProps) => React.ReactNode;
};

const DatabaseConnectionsPage: React.FC<DatabaseConnectionsPageProps> = ({
  renderSpawn,
}) => {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [engine, setEngine] = useState<DatabaseEngine>("sqlite");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    const data = await fetchDatabaseConnections();
    setConnections(data.connections);
    return data.connections;
  };

  useEffect(() => {
    void load().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not load connections");
    });
  }, []);

  const current = connections.find((row) => row.engine === engine);

  useEffect(() => {
    form.setFieldsValue({
      host: current?.host ?? "",
      port: current?.port ?? "",
      database: current?.database ?? "",
      username: current?.username ?? "",
      password: "",
      uri: "",
    });
  }, [current?.host, current?.port, current?.database, current?.username, engine, form]);

  const onSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await saveDatabaseConnection(engine, values);
      await load();
      setNotice("Connection saved. Test it to mark it active.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onTest = async () => {
    setTesting(true);
    setError("");
    setNotice("");
    try {
      await testDatabaseConnection(engine);
      await load();
      setNotice("Connection is active.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
      await load().catch(() => undefined);
    } finally {
      setTesting(false);
    }
  };

  return (
    <ConsoleCard title={<ConsoleCardTitle icon={Database} label="Connections" />}>
      <Text type="secondary">
        SQLite is always available. Postgres, MySQL, and MongoDB appear on
        create project after a connection is active.
      </Text>
      {error ? (
        <Alert type="error" showIcon message={error} style={{ marginTop: 12 }} />
      ) : null}
      {notice ? (
        <Alert type="success" showIcon message={notice} style={{ marginTop: 12 }} />
      ) : null}
      <Tabs
        activeKey={engine}
        onChange={(key) => setEngine(key as DatabaseEngine)}
        style={{ marginTop: 12 }}
        items={TABS.map((tab) => {
          const row = connections.find((item) => item.engine === tab.key);
          return {
            key: tab.key,
            label: tab.label,
            children:
              tab.key === "sqlite" ? (
                <Text>
                  Embedded SQLite. No host to configure.
                  {row?.connected ? " This connection is active." : ""}
                </Text>
              ) : (
                <>
                  <Text type="secondary">
                    {row?.source === "env"
                      ? "Detected from the engine configuration."
                      : row?.connected
                        ? "Saved connection is active."
                        : "Not active yet."}
                  </Text>
                  <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
                    {tab.key === "mongodb" ? (
                      <Form.Item name="uri" label="URI">
                        <Input placeholder="mongodb://localhost:27017/apito" autoComplete="off" />
                      </Form.Item>
                    ) : null}
                    <Form.Item name="host" label="Host" rules={[{ required: tab.key !== "mongodb" }]}>
                      <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item name="port" label="Port">
                      <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item name="database" label="Database">
                      <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item name="username" label="User">
                      <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                      <Input.Password
                        autoComplete="new-password"
                        placeholder={row?.has_password ? "Stored" : ""}
                      />
                    </Form.Item>
                    <Button type="primary" onClick={() => void onSave()} loading={saving}>
                      Save
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => void onTest()} loading={testing}>
                      Test
                    </Button>
                  </Form>
                  <div style={{ marginTop: 16 }}>
                    {renderSpawn ? renderSpawn({ engine: tab.key }) : <DefaultSpawn engine={tab.key} />}
                  </div>
                </>
              ),
          };
        })}
      />
    </ConsoleCard>
  );
};

export default DatabaseConnectionsPage;
