import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Tag,
  Button,
  message,
  Space,
  Alert,
  Divider,
} from "antd";
import {
  CloudSyncOutlined,
  CopyOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { httpService } from "../../services/httpService";
import { USER_SYNC_TOKEN } from "../../constants/api";

const { Title, Text, Paragraph } = Typography;

const SyncPage: React.FC = () => {
  const { decodeTokenData } = useAuth();
  const [syncToken, setSyncToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tokenData = decodeTokenData();

  // Fetch sync token
  const fetchSyncToken = async () => {
    try {
      setLoading(true);
      const response = await httpService.post(USER_SYNC_TOKEN, {});
      const token = response.data?.token || "";
      setSyncToken(token);
    } catch (error) {
      message.error("Failed to fetch sync token");
    } finally {
      setLoading(false);
    }
  };

  // Refresh sync token
  const refreshSyncToken = async () => {
    try {
      setRefreshing(true);
      const response = await httpService.post(USER_SYNC_TOKEN, {});
      const token = response.data?.token || "";
      setSyncToken(token);
      message.success("Sync token refreshed successfully");
    } catch (error) {
      message.error("Failed to refresh sync token");
    } finally {
      setRefreshing(false);
    }
  };

  // Copy token to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(syncToken);
      message.success("Token copied to clipboard");
    } catch (error) {
      message.error("Failed to copy token");
    }
  };

  useEffect(() => {
    fetchSyncToken();
  }, []);

  const setupInstructions = [
    {
      step: 1,
      title: "Install Apito CLI",
      description: "Install the Apito CLI tool on your local machine",
      command: "npm install -g @apito/cli",
    },
    {
      step: 2,
      title: "Configure Token",
      description: "Set up your sync token in the CLI configuration",
      command: "apito config set token <your-sync-token>",
    },
    {
      step: 3,
      title: "Initialize Project",
      description: "Initialize your local project for cloud sync",
      command: "apito init",
    },
    {
      step: 4,
      title: "Push to Cloud",
      description: "Push your local project to the cloud",
      command: "apito push",
    },
  ];

  return (
    <div style={{ padding: "24px", margin: "0 auto" }}>
      {/* Sync Token Card */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CloudSyncOutlined />
            Sync Token
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={refreshSyncToken}
              loading={refreshing}
              size="small"
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              disabled={!syncToken}
              size="small"
            >
              Copy
            </Button>
          </Space>
        }
        style={{ marginBottom: "24px" }}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Paragraph>
            Use this token to authenticate your local CLI with the cloud
            service.
          </Paragraph>
          {loading ? (
            <div>Loading token...</div>
          ) : (
            <div style={{ margin: "16px 0" }}>
              <Tag
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {syncToken || "No token available"}
              </Tag>
            </div>
          )}
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Keep this token secure and don't share it publicly
          </Text>
        </div>
      </Card>

      {/* User Information */}
      {tokenData && (
        <Card title="Current User Information" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Text>
              <strong>Email:</strong> {tokenData.email}
            </Text>
            <Text>
              <strong>Project:</strong> {tokenData.project_id}
            </Text>
            <Text>
              <strong>Role:</strong> {tokenData.project_role}
            </Text>
            <Text>
              <strong>Plan:</strong> {tokenData.project_plan}
            </Text>
          </div>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <InfoCircleOutlined />
            Setup Instructions
          </div>
        }
        style={{ marginBottom: "24px" }}
      >
        <Alert
          message="Prerequisites"
          description="Make sure you have Node.js installed on your system before proceeding."
          type="info"
          style={{ marginBottom: "24px" }}
        />

        {setupInstructions.map((instruction, index) => (
          <div key={index} style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#1890ff",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {instruction.step}
              </div>
              <Title level={5} style={{ margin: 0 }}>
                {instruction.title}
              </Title>
            </div>
            <Paragraph style={{ marginLeft: "36px", marginBottom: "8px" }}>
              {instruction.description}
            </Paragraph>
            <div
              style={{
                marginLeft: "36px",
                backgroundColor: "#f6f8fa",
                padding: "12px",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "14px",
                border: "1px solid #e1e4e8",
              }}
            >
              {instruction.command}
            </div>
            {index < setupInstructions.length - 1 && <Divider />}
          </div>
        ))}
      </Card>

      {/* Additional Resources */}
      <Card title="Additional Resources">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <Text strong>Documentation:</Text>
            <br />
            <a
              href="https://docs.apito.io/cli"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apito CLI Documentation
            </a>
          </div>
          <div>
            <Text strong>Support:</Text>
            <br />
            <Text>
              If you encounter any issues, please contact support at{" "}
              <a href="mailto:support@apito.io">support@apito.io</a>
            </Text>
          </div>
          <div>
            <Text strong>Community:</Text>
            <br />
            <Text>
              Join our Discord community for help and discussions:{" "}
              <a
                href="https://discord.gg/4ehRp3nk"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SyncPage;
