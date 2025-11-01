import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Typography,
  Space,
  Row,
  Col,
  message,
  Tooltip,
  App,
} from "antd";
import {
  ProjectOutlined,
  CloudOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { httpService } from "../../services/httpService";
import { PROJECT_CREATE } from "../../constants/api";

import ProjectCreateForm from "../../components/project/ProjectCreateForm";
import DatabaseConfig from "../../components/database/DatabaseConfig";

const { Title, Text } = Typography;

interface ProjectCreateData {
  id?: string;
  name: string;
  description?: string;
  database_type?: string;
  project_type?: ProjectType;
  tenant_model_name?: string;
  db_config?: DbConfig;
}

type ProjectType = "general" | "saas";

type DbConfig = Record<string, unknown>;

const StartProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notification: notificationApi } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("embed");
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [projectType, setProjectType] = useState<ProjectType>("general");
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle template state from navigation
  useEffect(() => {
    const state = location.state as any;
    if (state?.template && state?.project_type) {
      console.log("Template received:", state.template);
      console.log("Template project type:", state.project_type);

      // Set the project type if provided
      if (state.project_type === "saas" || state.project_type === "general") {
        setProjectType(state.project_type as ProjectType);
      }
    }
  }, [location.state]);

  const handleCreateProject = async (values: ProjectCreateData) => {
    try {
      setLoading(true);
      setErrorMessage(""); // Clear any previous error messages

      // Prepare payload
      const payload = {
        ...values,
        database_type: selectedDatabase,
        project_type: projectType,
        tenant_model_name:
          projectType === "saas" ? values.tenant_model_name : undefined,
      };

      const response = await httpService.post(PROJECT_CREATE, payload);

      if (response.data.code === 200) {
        message.success("Project created successfully!");
        navigate("/projects");
      } else {
        message.error(response.data.message || "Failed to create project");
      }
    } catch (error: any) {
      console.error("Error creating project:", error);

      // Extract error message from Axios error response
      let errorMessage = "Failed to create project. Please try again.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "An unexpected error occurred.";
      }

      // Set error message in state for UI display
      setErrorMessage(errorMessage);

      // Show Ant Design message and notification
      notificationApi.error({
        message: "Project Creation Error",
        description: errorMessage,
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (selectedDatabase === "embed") {
      return isValidId === true;
    }
    return isValidId === true && connectionStatus === "success";
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              backgroundColor: "#f0f7ff",
              borderRadius: "12px",
            }}
          >
            <RocketOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
          </div>
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
                color: "#262626",
              }}
            >
              Start New Project
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: "14px", color: "#8c8c8c", margin: 0 }}
            >
              Create a new Apito project with your preferred database
              configuration
            </Text>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateProject}
        initialValues={{
          database_type: "postgresql",
        }}
      >
        <Row gutter={32}>
          {/* Left Column - Project Configuration Form */}
          <Col span={10}>
            <Card
              title={
                <Space>
                  <ProjectOutlined />
                  Project Configuration
                </Space>
              }
              style={{
                background: "#ffffff",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                height: "fit-content",
              }}
            >
              {/* Reusable ProjectCreateForm */}
              <ProjectCreateForm
                form={form}
                projectType={projectType}
                onProjectTypeChange={setProjectType}
                isValidId={isValidId}
                onValidIdChange={setIsValidId}
              />

              {/* Action Buttons */}
              <Form.Item style={{ marginTop: "24px", marginBottom: 0 }}>
                <Space
                  size="middle"
                  direction="vertical"
                  style={{ width: "100%" }}
                >
                  <Space
                    size="middle"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Button size="large" onClick={() => navigate("/projects")}>
                      Cancel
                    </Button>

                    <Tooltip
                      title={
                        !isFormValid()
                          ? selectedDatabase !== "embed" &&
                            connectionStatus !== "success"
                            ? "Please test database connection first"
                            : !isValidId
                              ? "Please enter a valid project ID"
                              : undefined
                          : undefined
                      }
                    >
                      <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={loading}
                        disabled={!isFormValid()}
                        icon={<RocketOutlined />}
                      >
                        Create Project
                      </Button>
                    </Tooltip>
                  </Space>

                  {/* Error Message Display */}
                  {errorMessage && (
                    <div
                      style={{
                        marginBottom: "16px",
                        padding: "12px 16px",
                        backgroundColor: "#fff2f0",
                        border: "1px solid #ffccc7",
                        borderRadius: "6px",
                        color: "#cf1322",
                      }}
                    >
                      <strong>Error:</strong> {errorMessage}
                    </div>
                  )}
                </Space>
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column - Database Configuration */}
          <Col span={14}>
            <Card
              title="Database Configuration"
              style={{
                background: "#ffffff",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                height: "fit-content",
              }}
            >
              <DatabaseConfig
                stage="project"
                form={form}
                databaseTypeField="database_type"
                configField="db_config"
                enableTest={true}
                onTypeChange={(dbType) => {
                  setSelectedDatabase(dbType);
                }}
                onConnectionStatusChange={(status, _errorMessage) => {
                  setConnectionStatus(status);
                }}
              />
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Quick Stats */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "16px 20px",
          marginTop: "24px",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#52c41a",
              borderRadius: "50%",
            }}
          />
          <div style={{ fontSize: "13px", color: "#8c8c8c" }}>
            <span style={{ fontWeight: "600", color: "#262626" }}>Free</span>{" "}
            Open Source
          </div>
        </div>
        <div
          style={{ width: "1px", height: "20px", backgroundColor: "#e8e8e8" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#1890ff",
              borderRadius: "50%",
            }}
          />
          <div style={{ fontSize: "13px", color: "#8c8c8c" }}>
            <span style={{ fontWeight: "600", color: "#262626" }}>99.9%</span>{" "}
            Uptime
          </div>
        </div>
        <div
          style={{ width: "1px", height: "20px", backgroundColor: "#e8e8e8" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#722ed1",
              borderRadius: "50%",
            }}
          />
          <div style={{ fontSize: "13px", color: "#8c8c8c" }}>
            <span style={{ fontWeight: "600", color: "#262626" }}>24/7</span>{" "}
            Support
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <Card title="What you'll get" style={{ marginTop: "24px" }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              <Icon
                icon="mdi:database"
                style={{
                  fontSize: "24px",
                  color: "#52c41a",
                  marginBottom: "8px",
                }}
              />
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                Database Ready
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                Connect your own database or use the embedded option
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              <CloudOutlined
                style={{
                  fontSize: "24px",
                  color: "#1890ff",
                  marginBottom: "8px",
                }}
              />
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                GraphQL API
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                Auto-generated GraphQL API based on your data models
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              <ProjectOutlined
                style={{
                  fontSize: "24px",
                  color: "#722ed1",
                  marginBottom: "8px",
                }}
              />
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                Admin Console
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                Full-featured admin interface for managing your data
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StartProjectPage;
