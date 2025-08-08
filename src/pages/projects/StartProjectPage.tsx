import React, { useState } from "react";
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
} from "antd";
import {
  ProjectOutlined,

  RocketOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { httpService } from "../../services/httpService";
import { PROJECT_CREATE } from "../../constants/api";

const { Title, Paragraph } = Typography;

interface ProjectCreateData {
  name: string;
  description?: string;
  database_type: string;
}

interface DatabaseOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  specialNote?: string;
}

const StartProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] =
    useState<string>("postgresql");

  const handleCreateProject = async (values: ProjectCreateData) => {
    try {
      setLoading(true);
      const response = await httpService.post(PROJECT_CREATE, values);

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

  const databaseOptions: DatabaseOption[] = [
    {
      value: "embed",
      label: "Embed",
      icon: <Icon icon="mdi:database" style={{ color: "#1890ff" }} />,
    },
    {
      value: "sqlite",
      label: "SQLite",
      icon: <Icon icon="simple-icons:sqlite" style={{ color: "#003B57", fontSize: "24px" }} />,
    },
    {
      value: "mysql",
      label: "MySQL",
      icon: <Icon icon="logos:mysql" style={{ fontSize: "24px" }} />,
    },
    {
      value: "mariadb",
      label: "MariaDB",
      icon: <Icon icon="logos:mariadb" style={{ fontSize: "24px" }} />,
    },
    {
      value: "postgresql",
      label: "PostgreSQL",
      icon: <Icon icon="logos:postgresql" style={{ fontSize: "24px" }} />,
    },
    {
      value: "mongo",
      label: "MongoDB",
      icon: <Icon icon="logos:mongodb" style={{ fontSize: "24px" }} />,
    },
  ];

  const handleDatabaseSelect = (databaseValue: string) => {
    setSelectedDatabase(databaseValue);
    form.setFieldsValue({ database_type: databaseValue });
  };

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

      {/* Project Creation Form */}
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
          initialValues={{
            database_type: "postgresql",
          }}
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
                <Input placeholder="Enter your project name" size="large" />
              </Form.Item>
            </Col>

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

            <Col span={24}>
              <Form.Item
                name="database_type"
                label="Database Type"
                rules={[
                  { required: true, message: "Please select a database type" },
                ]}
              >
                <div>
                  <Row gutter={[16, 16]}>
                    {databaseOptions.map((db) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={db.value}>
                        <Card
                          hoverable
                          size="small"
                          style={{
                            cursor: "pointer",
                            border:
                              selectedDatabase === db.value
                                ? "2px solid #1890ff"
                                : "1px solid #d9d9d9",
                            backgroundColor:
                              selectedDatabase === db.value
                                ? "#f0f8ff"
                                : "#fff",
                          }}
                          onClick={() => handleDatabaseSelect(db.value)}
                        >
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{ fontSize: "24px", marginBottom: "8px" }}
                            >
                              {db.icon}
                            </div>
                            <div
                              style={{ fontWeight: 500, marginBottom: "4px" }}
                            >
                              {db.label}
                            </div>
                            {db.specialNote && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#ff4d4f",
                                  marginTop: "4px",
                                  fontStyle: "italic",
                                }}
                              >
                                {db.specialNote}
                              </div>
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: "32px", textAlign: "center" }}>
            <Space size="middle">
              <Button size="large" onClick={() => navigate("/projects")}>
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<RocketOutlined />}
              >
                Create Project
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StartProjectPage;
