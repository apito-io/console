import React, { useState } from "react";
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
} from "antd";
import { ProjectOutlined, RocketOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { httpService } from "../../services/httpService";
import { PROJECT_CREATE } from "../../constants/api";
import DatabaseConfig from "../../components/database/DatabaseConfig";
import ProjectCreateForm from "../../components/project/ProjectCreateForm";

const { Title, Paragraph } = Typography;

type ProjectType = "general" | "saas";

type DbConfig = Record<string, unknown>;

interface ProjectCreateData {
  id?: string;
  name: string;
  description?: string;
  database_type: string;
  project_type?: ProjectType;
  tenant_model_name?: string;
  db_config?: DbConfig;
}

const StartProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>("general");
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleCreateProject = async (values: ProjectCreateData) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
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
    } catch (error) {
      console.error("Error creating project:", error);
      message.error("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isValidId === true && connectionStatus === "success";

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <RocketOutlined
          style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }}
        />
        <Title level={2}>Start Your New Project</Title>
        <Paragraph type="secondary">
          Create a new Apito project with your preferred database and
          configuration. Get started in minutes with our powerful GraphQL
          backend.
        </Paragraph>
      </div>

      <Card
        title={
          <Space>
            <ProjectOutlined />
            Project Configuration
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateProject}
          initialValues={{ database_type: "postgresql" }}
        >
          {/* Reusable ProjectCreateForm */}
          <ProjectCreateForm
            form={form}
            projectType={projectType}
            onProjectTypeChange={setProjectType}
            isValidId={isValidId}
            onValidIdChange={setIsValidId}
          />

          {/* Reusable DatabaseConfig */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <DatabaseConfig
                stage="project"
                form={form}
                databaseTypeField="database_type"
                configField="db_config"
                enableTest={true}
                onConnectionStatusChange={(status, _errorMessage) => {
                  setConnectionStatus(status);
                }}
              />
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: "center" }}>
            <Space size="middle">
              <Button size="large" onClick={() => navigate("/projects")}>
                Cancel
              </Button>
              <Tooltip
                title={
                  connectionStatus !== "success"
                    ? "Please test database connection first"
                    : undefined
                }
              >
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  disabled={!isFormValid}
                >
                  Create Project
                </Button>
              </Tooltip>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StartProjectPage;
