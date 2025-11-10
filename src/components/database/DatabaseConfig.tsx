import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Alert,
  Space,
  theme,
  message,
} from "antd";
import { DatabaseOutlined, CopyOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import type { FormInstance } from "antd";
import { httpService } from "../../services/httpService";

type ConnectionStatus = "idle" | "success" | "error";

export type DatabaseConfigProps = {
  stage: "setup" | "project";
  form: FormInstance;
  databaseTypeField?: string; // form field name for selected db type
  configField?: string; // form field name for db config object
  defaultType?: string;
  enableTest?: boolean;
  testEndpoint?: string;
  onTypeChange?: (dbType: string) => void;
  onConnectionStatusChange?: (
    status: ConnectionStatus,
    errorMessage?: string
  ) => void;
};

type DatabaseOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const getDatabaseOptions = (token: any): DatabaseOption[] => [
  {
    value: "coreDB",
    label: "Sandbox DB (Dev/Test)",
    icon: <DatabaseOutlined style={{ color: token.colorSuccess }} />,
  },
  {
    value: "sqlite",
    label: "SQLite",
    icon: (
      <Icon
        icon="simple-icons:sqlite"
        style={{ fontSize: 20, color: token.colorPrimary }}
      />
    ),
  },
  {
    value: "postgresql",
    label: "PostgreSQL",
    icon: (
      <Icon
        icon="simple-icons:postgresql"
        style={{ fontSize: 20, color: token.colorPrimary }}
      />
    ),
  },
  {
    value: "mysql",
    label: "MySQL",
    icon: (
      <Icon
        icon="simple-icons:mysql"
        style={{ fontSize: 20, color: token.colorPrimary }}
      />
    ),
  },
  {
    value: "mariadb",
    label: "MariaDB",
    icon: (
      <Icon
        icon="simple-icons:mariadb"
        style={{ fontSize: 20, color: token.colorPrimary }}
      />
    ),
  },
  {
    value: "mongodb",
    label: "MongoDB",
    icon: (
      <Icon
        icon="simple-icons:mongodb"
        style={{ fontSize: 20, color: token.colorSuccess }}
      />
    ),
  },
];

const getDefaultDbConfig = (db: string) => {
  switch (db) {
    case "postgresql":
      return {
        host: "localhost",
        port: 5432,
        database: "apito",
        username: "postgres",
        password: "",
      };
    case "mysql":
    case "mariadb":
      return {
        host: "localhost",
        port: 3306,
        database: "apito",
        username: "root",
        password: "",
      };
    case "mongodb":
      return { uri: "mongodb://localhost:27017/apito" };
    case "sqlite":
      return { file: "apito-project.sqlite" };
    case "coreDB":
      return { file: "apito-project.db" };
    default:
      return {};
  }
};

const getCliCommand = (stage: "setup" | "project", dbType: string): string => {
  switch (dbType) {
    case "postgresql":
      return stage === "setup"
        ? "apito start --db system postgres"
        : "apito start --db project postgres";
    case "mysql":
      return stage === "setup"
        ? "apito start --db system mysql"
        : "apito start --db project mysql";
    case "mariadb":
      return stage === "setup"
        ? "apito start --db system mariadb"
        : "apito start --db projectmariadb";
    case "mongodb":
      return stage === "setup"
        ? "apito start --db system mongodb"
        : "apito start --db projectmongodb";
    default:
      return "";
  }
};

const CliCommand: React.FC<{ command: string; token?: any }> = ({
  command,
  token,
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      message.success("Command copied to clipboard!");
    } catch {
      message.error("Failed to copy command");
    }
  };

  return (
    <div
      style={{
        background: token?.colorFillQuaternary || "#f9fafb",
        border: `1px solid ${token?.colorBorder || "#e5e7eb"}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow:
          token?.boxShadowSecondary || "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={copyToClipboard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          token?.boxShadow || "0 6px 16px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          token?.boxShadowSecondary || "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      }}
    >
      {/* Terminal Header Bar */}
      <div
        style={{
          background: token?.colorFillSecondary || "#f3f4f6",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${token?.colorBorder || "#e5e7eb"}`,
        }}
      >
        {/* Terminal Control Buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: token?.colorError || "#ff4d4f",
              border: `1px solid ${token?.colorErrorBorder || "#ff7875"}`,
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: token?.colorWarning || "#faad14",
              border: `1px solid ${token?.colorWarningBorder || "#ffc53d"}`,
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: token?.colorSuccess || "#52c41a",
              border: `1px solid ${token?.colorSuccessBorder || "#73d13d"}`,
            }}
          />
        </div>

        {/* Terminal Title */}
        <div
          style={{
            color: token?.colorTextSecondary || "#6b7280",
            fontSize: "11px",
            fontWeight: "500",
            marginLeft: "8px",
            flex: 1,
            textAlign: "center",
          }}
        >
          apito-cli
        </div>

        {/* Copy Icon */}
        <CopyOutlined
          style={{
            color: token?.colorTextTertiary || "#9ca3af",
            fontSize: "12px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Terminal Content */}
      <div
        style={{
          padding: "16px",
          fontFamily:
            "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
          fontSize: "13px",
          lineHeight: "1.4",
        }}
      >
        {/* Prompt */}
        <div style={{ marginBottom: "8px" }}>
          <span style={{ color: token?.colorSuccess || "#52c41a" }}>$ </span>
          <span style={{ color: token?.colorTextSecondary || "#6b7280" }}>
            apito
          </span>
          <span
            style={{ color: token?.colorText || "#0f1419", marginLeft: "8px" }}
          >
            {command.split(" ").slice(1).join(" ")}
          </span>
        </div>

        {/* Remove the separate command box */}

        {/* Output hint */}
        <div
          style={{
            marginTop: "8px",
            color: token?.colorTextTertiary || "#9ca3af",
            fontSize: "11px",
          }}
        >
          Click to copy command
        </div>
      </div>
    </div>
  );
};

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({
  stage,
  form,
  databaseTypeField = "database_type",
  configField = "db_config",
  defaultType = "coreDB",
  enableTest = false,
  testEndpoint = "/system/database/check",
  onTypeChange,
  onConnectionStatusChange,
}) => {
  const { token } = theme.useToken();
  const projectId = Form.useWatch("id", form);
  const [selectedDatabase, setSelectedDatabase] = useState<string>(defaultType);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const databaseOptions = getDatabaseOptions(token);

  // Initialize defaults
  useEffect(() => {
    const initialType = form.getFieldValue(databaseTypeField) || defaultType;
    setSelectedDatabase(initialType);
    form.setFieldsValue({
      [databaseTypeField]: initialType,
      [configField]: getDefaultDbConfig(initialType),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When SQLite is selected, auto-populate DB file name using project id
  useEffect(() => {
    if (selectedDatabase !== "sqlite") return;
    const currentProjectId = projectId || form.getFieldValue("id");
    if (!currentProjectId) return;
    const currentCfg = form.getFieldValue(configField) || {};
    const desiredPath = `apito_${currentProjectId}.sqlite`;
    if (currentCfg.file !== desiredPath) {
      form.setFieldsValue({
        [configField]: { ...currentCfg, file: desiredPath },
      });
    }
  }, [projectId, selectedDatabase, form, configField]);

  // When coreDB (Sandbox DB) is selected, auto-populate DB file name using project id
  useEffect(() => {
    if (selectedDatabase !== "coreDB") return;
    const currentProjectId = projectId || form.getFieldValue("id");
    if (!currentProjectId) return;
    const currentCfg = form.getFieldValue(configField) || {};
    const desiredPath = `apito_${currentProjectId}.db`;
    if (currentCfg.file !== desiredPath) {
      form.setFieldsValue({
        [configField]: { ...currentCfg, file: desiredPath },
      });
    }
  }, [projectId, selectedDatabase, form, configField]);

  // For all other DBs, set default database name to apito-{projectId}
  useEffect(() => {
    const currentProjectId = projectId || form.getFieldValue("id");
    if (!currentProjectId) return;
    const currentCfg = form.getFieldValue(configField) || {};

    if (
      selectedDatabase === "postgresql" ||
      selectedDatabase === "mysql" ||
      selectedDatabase === "mariadb"
    ) {
      const desiredDbName = `apito_${currentProjectId}`;
      if (currentCfg.database !== desiredDbName) {
        form.setFieldsValue({
          [configField]: { ...currentCfg, database: desiredDbName },
        });
      }
    }

    if (selectedDatabase === "mongodb") {
      const desiredDbName = `apito_${currentProjectId}`;
      const existingUri: string | undefined = currentCfg.uri;
      if (!existingUri) {
        form.setFieldsValue({
          [configField]: {
            ...currentCfg,
            uri: `mongodb://localhost:27017/${desiredDbName}`,
          },
        });
        return;
      }
      try {
        const qIndex = existingUri.indexOf("?");
        const query = qIndex >= 0 ? existingUri.slice(qIndex) : "";
        const pathPart =
          qIndex >= 0 ? existingUri.slice(0, qIndex) : existingUri;
        const lastSlash = pathPart.lastIndexOf("/");
        if (lastSlash > -1) {
          const base = pathPart.slice(0, lastSlash + 1);
          const newUri = `${base}${desiredDbName}${query}`;
          if (existingUri !== newUri) {
            form.setFieldsValue({
              [configField]: { ...currentCfg, uri: newUri },
            });
          }
        }
      } catch {
        // If parsing fails, fall back to simple default
        const fallback = `mongodb://localhost:27017/${desiredDbName}`;
        if (existingUri !== fallback) {
          form.setFieldsValue({
            [configField]: { ...currentCfg, uri: fallback },
          });
        }
      }
    }
  }, [projectId, selectedDatabase, form, configField]);

  const handleDatabaseSelect = (db: string) => {
    setSelectedDatabase(db);
    form.setFieldsValue({
      [databaseTypeField]: db,
      [configField]: getDefaultDbConfig(db),
    });
    onTypeChange?.(db);
    setStatus("idle");
    setErrorMessage(undefined);
    onConnectionStatusChange?.("idle");
  };

  const testConnection = async () => {
    if (!enableTest) return;
    try {
      setTesting(true);
      setStatus("idle");
      setErrorMessage(undefined);
      const cfg = form.getFieldValue(configField) || {};
      const payload = { type: selectedDatabase, ...cfg };
      const res = await httpService.post(testEndpoint, payload);
      if (res.status === 200) {
        setStatus("success");
        onConnectionStatusChange?.("success");
      } else {
        setStatus("error");
        setErrorMessage("Connection failed");
        onConnectionStatusChange?.("error", "Connection failed");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Connection failed";
      setStatus("error");
      setErrorMessage(message);
      onConnectionStatusChange?.("error", message);
    } finally {
      setTesting(false);
    }
  };

  const renderDbConfigFields = useMemo(() => {
    switch (selectedDatabase) {
      case "postgresql":
      case "mysql":
      case "mariadb":
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={[configField, "host"]}
                  label="Host"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="localhost" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={[configField, "port"]}
                  label="Port"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder={
                      selectedDatabase === "postgresql" ? "5432" : "3306"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={[configField, "database"]}
                  label="Database"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="apito" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={[configField, "username"]}
                  label="Username"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder={
                      selectedDatabase === "postgresql" ? "postgres" : "root"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name={[configField, "password"]} label="Password">
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </>
        );
      case "mongodb":
        return (
          <Form.Item
            name={[configField, "uri"]}
            label="Connection URI"
            rules={[{ required: true }]}
          >
            <Input placeholder="mongodb://localhost:27017/apito" />
          </Form.Item>
        );
      case "sqlite":
        return (
          <Form.Item
            name={[configField, "file"]}
            label="DB File"
            rules={[{ required: true }]}
          >
            <Input placeholder="apito-project.sqlite" />
          </Form.Item>
        );
      case "coreDB":
        return (
          <Form.Item
            name={[configField, "file"]}
            label="DB File"
            rules={[{ required: true }]}
          >
            <Input placeholder="apito-project.db" />
          </Form.Item>
        );
      default:
    }
  }, [selectedDatabase, configField]);

  return (
    <div>
      {/* Cards */}
      <Row gutter={[16, 16]}>
        {databaseOptions.map((db) => (
          <Col xs={24} sm={12} md={8} lg={8} key={db.value}>
            <Card
              hoverable
              size="small"
              onClick={() => handleDatabaseSelect(db.value)}
              style={{
                cursor: "pointer",
                border:
                  selectedDatabase === db.value
                    ? `2px solid ${token.colorPrimary}`
                    : `1px solid ${token.colorBorder}`,
                backgroundColor:
                  selectedDatabase === db.value
                    ? "#f0f7ff"
                    : token.colorBgContainer,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{db.icon}</div>
                <div style={{ fontWeight: 500 }}>{db.label}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Notes */}
      <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
        {selectedDatabase === "postgresql" && (
          <>
            <Alert
              type="info"
              showIcon
              message="Use your own remote database or spin a new one using apito cli"
            />
            <CliCommand
              command={getCliCommand(stage, "postgresql")}
              token={token}
            />
          </>
        )}
        {selectedDatabase === "mysql" && (
          <>
            <Alert
              type="info"
              showIcon
              message="Use your own remote database or spin a new one using apito cli"
            />
            <CliCommand command={getCliCommand(stage, "mysql")} token={token} />
          </>
        )}
        {selectedDatabase === "mariadb" && (
          <>
            <Alert
              type="info"
              showIcon
              message="Use your own remote database or spin a new one using apito cli"
            />
            <CliCommand
              command={getCliCommand(stage, "mariadb")}
              token={token}
            />
          </>
        )}
        {selectedDatabase === "mongodb" && (
          <>
            <Alert
              type="info"
              showIcon
              message="Use your own remote database or spin a new one using apito cli"
            />
            <CliCommand
              command={getCliCommand(stage, "mongodb")}
              token={token}
            />
          </>
        )}
        {selectedDatabase === "sqlite" && (
          <Alert
            type="warning"
            showIcon
            message="SQLite is file-based and great for local development; not recommended for production."
          />
        )}
        {selectedDatabase === "coreDB" && (
          <Alert
            type="warning"
            showIcon
            message="Sandbox DB is file-based and great for local development; not recommended for production."
          />
        )}
      </Space>

      {/* Header with test */}
      {selectedDatabase && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <span style={{ fontWeight: 600, color: token.colorText }}>
            Database Configuration
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: token.colorSplit || token.colorBorder,
            }}
          />
          {enableTest && (
            <Button
              onClick={testConnection}
              loading={testing}
              style={{
                borderRadius: 0,
                borderColor:
                  status === "success"
                    ? token.colorSuccess
                    : status === "error"
                      ? token.colorError
                      : undefined,
                color:
                  status === "success"
                    ? token.colorSuccess
                    : status === "error"
                      ? token.colorError
                      : undefined,
              }}
              danger={status === "error"}
            >
              {testing
                ? "Testing..."
                : status === "success"
                  ? "Connected ✓"
                  : status === "error"
                    ? "Connection Failed"
                    : "Test Connection"}
            </Button>
          )}
        </div>
      )}

      {/* Config fields */}
      <div style={{ marginTop: 8 }}>{renderDbConfigFields}</div>

      {status === "error" && errorMessage && (
        <Alert
          type="error"
          showIcon
          message={errorMessage}
          style={{ marginTop: 8 }}
        />
      )}
    </div>
  );
};

export default DatabaseConfig;
