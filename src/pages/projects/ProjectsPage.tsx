import React, { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Empty,
  Row,
  Typography,
  Card,
  Tag,
  Avatar,
  message,
  Dropdown,
  Modal,
  Input,
  Space,
  Tooltip,
  theme,
  Badge,
} from "antd";
import {
  PlusCircleOutlined,
  SettingOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  DatabaseOutlined,
  CalendarOutlined,
  CloudServerOutlined,
  HddOutlined,
  GoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAuth } from "../../contexts/AuthContext";
import { useProjectList } from "../../hooks/useProjectList";
import type { Project } from "../../types/project";

const { Title, Text } = Typography;

// Demo project data for now - will be replaced with real data
const DEMO_PROJECT_DATA = [
  {
    id: "demo-1",
    name: "Prosno Bank",
    description: "Banking Application",
    created_at: "2024-01-01",
    plan: "free" as const,
    db: "postgresql",
    status: "LIVE" as const,
    avatar: "PK",
    color: "#f56a00",
  },
  {
    id: "demo-2",
    name: "Restaurant Management",
    description: "Food Service Platform",
    created_at: "2023-08-01",
    plan: "free" as const,
    db: "postgresql",
    status: "LIVE" as const,
    avatar: "RO",
    color: "#87d068",
  },
  {
    id: "demo-3",
    name: "Vendor Inventory Management",
    description: "Supply Chain System",
    created_at: "2023-07-01",
    plan: "free" as const,
    db: "postgresql",
    status: "LIVE" as const,
    avatar: "MS",
    color: "#108ee9",
  },
  {
    id: "demo-4",
    name: "Cloth Shop Management",
    description: "Retail Management System",
    created_at: "2023-08-01",
    plan: "free" as const,
    db: "postgresql",
    status: "LIVE" as const,
    avatar: "BU",
    color: "#f50",
  },
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { decodeTokenData } = useAuth();
  const { data, isLoading, error, refetch, switchProject, deleteProject } =
    useProjectList();
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const tokenData = decodeTokenData();
  const projects = data?.body || [];
  const [, , removeCookie] = useCookies(["temp_tenant_id"]);

  // Function to get database icon based on driver type
  const getDatabaseIcon = (db: string | undefined) => {
    if (!db || db.toLowerCase().includes("embed")) {
      return (
        <img
          src="/logo.svg"
          alt="Apito"
          style={{ width: "16px", height: "16px" }}
        />
      );
    }

    const dbLower = db.toLowerCase();
    if (dbLower.includes("postgres") || dbLower.includes("postgresql")) {
      return <CloudServerOutlined style={{ color: "#336791" }} />;
    }
    if (dbLower.includes("mongo") || dbLower.includes("mongodb")) {
      return <HddOutlined style={{ color: "#47A248" }} />;
    }
    if (dbLower.includes("arango") || dbLower.includes("arangodb")) {
      return <GoldOutlined style={{ color: "#DDA76A" }} />;
    }
    if (dbLower.includes("mysql")) {
      return <DatabaseOutlined style={{ color: "#00618A" }} />;
    }
    // Default Apito Cloud DB icon
    return (
      <img
        src="/logo.svg"
        alt="Apito"
        style={{ width: "16px", height: "16px" }}
      />
    );
  };

  // Function to get database display name
  const getDatabaseName = (db: string | undefined) => {
    if (!db || db.toLowerCase().includes("embed")) {
      return "Apito Cloud DB";
    }
    return db;
  };

  // Function to generate consistent avatar color based on project name
  const generateAvatarColor = (name: string) => {
    // Simple hash function to ensure consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Predefined nice colors for avatars
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#2db7f5",
      "#722ed1",
      "#eb2f96",
      "#52c41a",
      "#fa8c16",
      "#1890ff",
      "#fa541c",
      "#13c2c2",
      "#a0d911",
      "#cf1322",
      "#531dab",
      "#c41d7f",
      "#096dd9",
      "#ad4e00",
      "#08979c",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const handleActiveProject = (id: string) => {
    setActiveProjectId(id);
    setSettingsDrawerOpen(true);
  };

  const handleStartNewProject = () => {
    navigate("/projects/new");
  };

  const showDeleteConfirmation = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmText("");
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== "DELETE" || !projectToDelete) {
      message.error("Please type DELETE to confirm");
      return;
    }

    try {
      setDeletingProject(true);
      await deleteProject(projectToDelete.id);
      message.success("Project deleted successfully");
      setDeleteModalVisible(false);
      setProjectToDelete(null);
      setDeleteConfirmText("");
    } catch {
      message.error("Failed to delete project");
    } finally {
      setDeletingProject(false);
    }
  };

  const handleCardClick = async (project: Project) => {
    try {
      // Remove temp_tenant_id cookie if switching to non-SaaS project
      if (project.project_type !== 1) {
        removeCookie("temp_tenant_id", { path: "/" });
      }

      await switchProject(project.id);
      message.success(`Switched to ${project.name}`);
      // Redirect to console content after successful project switch
      navigate("/console/content");
    } catch {
      message.error("Failed to switch project");
    }
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getMenuItems = (project: Project, isDemoProject = false) => [
    {
      key: "settings",
      label: "Project Settings",
      icon: <SettingOutlined />,
      onClick: () => handleActiveProject(project.id),
      disabled: isDemoProject,
    },
    {
      key: "delete",
      label: "Delete Project",
      icon: <DeleteOutlined />,
      onClick: () => showDeleteConfirmation(project),
      disabled: isDemoProject,
      danger: true,
    },
  ];

  const renderProjectCard = (project: Project, isDemoProject = false) => {
    const cardContent = (
      <Card
        key={project.id}
        hoverable
        style={{
          marginBottom: "16px",
          borderRadius: "12px",
          border: `1px solid ${token.colorBorder}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        bodyStyle={{ padding: "20px" }}
        onClick={() => !isDemoProject && handleCardClick(project)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              flex: 1,
            }}
          >
            <Avatar
              size={48}
              style={{
                backgroundColor:
                  project.color || generateAvatarColor(project.name),
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              {project.avatar || project.name.substring(0, 2).toUpperCase()}
            </Avatar>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: token.colorTextHeading,
                  }}
                  ellipsis={{ tooltip: project.name }}
                >
                  {project.name}
                </Typography.Title>
                {/* <Tag
                  color={project.status === "LIVE" ? "success" : "processing"}
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {project.status || "LIVE"}
                </Tag> */}
              </div>

              <Text
                type="secondary"
                style={{
                  fontSize: "13px",
                  lineHeight: "18px",
                  display: "block",
                  marginBottom: "12px",
                }}
                ellipsis={{ tooltip: project.description }}
              >
                {project.description}
              </Text>

              <Space size="middle" style={{ fontSize: "12px" }}>
                <Tooltip title="Database">
                  <Space size={4}>
                    {getDatabaseIcon(project.db)}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {getDatabaseName(project.db)}
                    </Text>
                  </Space>
                </Tooltip>

                <Tooltip title="Created">
                  <Space size={4}>
                    <CalendarOutlined
                      style={{ color: token.colorTextTertiary }}
                    />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {getRelativeTime(project.created_at)}
                    </Text>
                  </Space>
                </Tooltip>

                <Tooltip title="Plan">
                  <Tag
                    color={
                      project.plan === "enterprise"
                        ? "purple"
                        : project.plan === "pro"
                          ? "gold"
                          : "blue"
                    }
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      border: "none",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {project.plan}
                  </Tag>
                </Tooltip>
              </Space>
            </div>
          </div>

          {!isDemoProject && (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown
                menu={{ items: getMenuItems(project, isDemoProject) }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  size="small"
                  style={{
                    color: token.colorTextTertiary,
                    border: "none",
                    boxShadow: "none",
                  }}
                />
              </Dropdown>
            </div>
          )}

          {isDemoProject && (
            <Tooltip title="Demo project - view only">
              <EyeOutlined
                style={{
                  color: token.colorTextTertiary,
                  fontSize: "16px",
                }}
              />
            </Tooltip>
          )}
        </div>
      </Card>
    );

    // Check if project is SaaS (project_type === 1)
    const isSaaSProject = project.project_type === 1;

    return isSaaSProject ? (
      <Badge.Ribbon text="SaaS" color="purple">
        {cardContent}
      </Badge.Ribbon>
    ) : (
      cardContent
    );
  };

  if (error) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={3}>Error loading projects</Title>
        <Text type="danger">{error}</Text>
        <div style={{ marginTop: "16px" }}>
          <Button type="primary" onClick={refetch}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Projects
          </Title>
          <Text type="secondary">carpe diem!</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a
            href="https://docs.apito.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1890ff" }}
          >
            Apito Documentation
          </a>
          {projects.length > 0 && (
            <>
              <Divider type="vertical" />
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleStartNewProject}
              >
                START ANOTHER PROJECT
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "64px" }}>
          <Text>Loading projects...</Text>
        </div>
      ) : (
        <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} key={project.id}>
                {renderProjectCard(project)}
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty
                imageStyle={{
                  height: 80,
                }}
                description={
                  <span>
                    You haven't started any projects yet. Click{" "}
                    <a
                      href="https://apito.io/docs/build-api-quick-start-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>{" "}
                    to get started
                  </span>
                }
              >
                <Button type="primary" onClick={handleStartNewProject}>
                  Start Your First Project
                </Button>
              </Empty>
            </Col>
          )}
        </Row>
      )}

      {/* Demo Projects Section */}
      <div style={{ marginTop: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Demo Projects</Title>
          <Text type="secondary">Explore Sample Projects Instantly</Text>
        </div>
        <Row gutter={[24, 24]}>
          {DEMO_PROJECT_DATA.map((project) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={project.id}>
              {renderProjectCard(project, true)}
            </Col>
          ))}
        </Row>
      </div>

      {/* Settings Drawer */}
      <Drawer
        title="Update project settings"
        placement="right"
        width={600}
        open={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        extra={
          <Button type="link" onClick={() => setSettingsDrawerOpen(false)}>
            {"< Back"}
          </Button>
        }
      >
        {settingsDrawerOpen && (
          <div>
            <Text>Project settings for: {activeProjectId}</Text>
            <div style={{ marginTop: "16px" }}>
              <Text type="secondary">
                User: {tokenData?.email || "Unknown"}
              </Text>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">
                Role: {tokenData?.project_role || "Unknown"}
              </Text>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">
                Current Project: {tokenData?.project_id || "None"}
              </Text>
            </div>
            {/* This will be replaced with actual project settings form */}
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Project"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setProjectToDelete(null);
          setDeleteConfirmText("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setDeleteModalVisible(false);
              setProjectToDelete(null);
              setDeleteConfirmText("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={deletingProject}
            disabled={deleteConfirmText !== "DELETE"}
            onClick={handleDeleteConfirm}
          >
            Delete Project
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "16px" }}>
          <Text type="secondary">
            This action cannot be undone. This will permanently delete the
            project <Text strong>{projectToDelete?.name}</Text> and all of its
            data.
          </Text>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Text>
            Please type{" "}
            <Text code strong>
              DELETE
            </Text>{" "}
            to confirm:
          </Text>
        </div>

        <Input
          placeholder="Type DELETE to confirm"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          onPressEnter={handleDeleteConfirm}
          style={{ fontFamily: "monospace" }}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
