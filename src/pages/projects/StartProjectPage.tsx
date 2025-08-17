import React, { useState, useMemo } from "react";
import {
  Card,
  Form,
  Input,
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
import { PROJECT_CREATE, PROJECT_NAME_CHECK } from "../../constants/api";
import debounce from "lodash/debounce";
import DatabaseConfig from "../../components/database/DatabaseConfig";

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

const generateRandomId = (length: number): string => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const normalizeName = (value: string): string =>
  value
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .replace(/[^0-9a-zA-Z_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const makeProjectIdFromName = (name: string): string =>
  `${normalizeName(name).toLowerCase()}_${generateRandomId(5)}`;

const StartProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>("general");
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const debouncedCheck = useMemo(
    () =>
      debounce(async (id: string) => {
        try {
          await httpService.post(PROJECT_NAME_CHECK, { name: id, id });
          setIsValidId(true);
        } catch {
          setIsValidId(false);
        }
      }, 1000),
    []
  );

  const onNameChange = (value: string) => {
    if (!value) {
      form.setFieldsValue({ id: undefined });
      setIsValidId(null);
      return;
    }
    const newId = makeProjectIdFromName(value);
    form.setFieldsValue({ id: newId });
    debouncedCheck(newId);
  };

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
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Project Name"
                rules={[
                  { required: true, message: "Please enter a project name" },
                  {
                    min: 3,
                    message: "Project name must be at least 3 characters",
                  },
                  {
                    max: 50,
                    message: "Project name must be less than 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z0-9\s-_]+$/,
                    message:
                      "Project name can only contain letters, numbers, spaces, hyphens, and underscores",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your project name"
                  size="large"
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="id"
                label="Project ID (Auto-generated)"
                rules={[{ required: true, message: "Project ID is required" }]}
                hasFeedback
                validateStatus={
                  isValidId === null ? "" : isValidId ? "success" : "error"
                }
                help={
                  isValidId === false
                    ? "This project ID is already taken. Please adjust the name."
                    : undefined
                }
              >
                <Input
                  readOnly
                  disabled
                  placeholder="Generated from project name"
                />
              </Form.Item>
            </Col>

            {/* Project Type */}
            <Col span={24}>
              <Form.Item label="Project Type" name="project_type">
                <Space>
                  <Button
                    type={projectType === "general" ? "primary" : "default"}
                    onClick={() => setProjectType("general")}
                  >
                    General
                  </Button>
                  <Button
                    type={projectType === "saas" ? "primary" : "default"}
                    onClick={() => setProjectType("saas")}
                  >
                    SaaS
                  </Button>
                </Space>
              </Form.Item>
            </Col>

            {projectType === "saas" && (
              <Col span={24}>
                <Form.Item
                  name="tenant_model_name"
                  label="Tenant Model Name"
                  rules={[
                    {
                      required: true,
                      message: "Tenant model name is required",
                    },
                  ]}
                >
                  <Input placeholder="Ex. Shop, Institution, Vendor etc." />
                </Form.Item>
              </Col>
            )}

            <Col span={24}>
              <Form.Item name="description" label="Description (Optional)">
                <Input.TextArea
                  placeholder="Describe your project..."
                  rows={3}
                  maxLength={200}
                  showCount
                />
              </Form.Item>
            </Col>

            {/* Reusable DatabaseConfig */}
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
