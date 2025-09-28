import {
  CloudServerOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  GoldOutlined,
  HddOutlined,
  MoreOutlined,
  RocketOutlined,
  SettingOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Drawer,
  Dropdown,
  Empty,
  Input,
  Modal,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useProjectList } from "../../hooks/useProjectList";
import type { Project } from "../../types/project";

const { Title, Text } = Typography;

// Demo project data for now - will be replaced with real data
const PROJECT_TEMPLATES = [
  {
    id: "template-1",
    name: "E-commerce Platform",
    description:
      "Complete online store with product catalog, cart, and payment processing",
    project_type: "saas" as const,
    db: "postgresql",
    status: "TEMPLATE" as const,
    avatar: "EC",
    color: "#1890ff",
  },
  {
    id: "template-2",
    name: "SaaS Dashboard",
    description:
      "Multi-tenant SaaS application with user management and analytics",
    project_type: "saas" as const,
    db: "postgresql",
    status: "TEMPLATE" as const,
    avatar: "SD",
    color: "#52c41a",
  },
  {
    id: "template-3",
    name: "Content Management",
    description: "Blog and content management system with rich text editor",
    project_type: "general" as const,
    db: "postgresql",
    status: "TEMPLATE" as const,
    avatar: "CM",
    color: "#722ed1",
  },
  {
    id: "template-4",
    name: "Task Management",
    description: "Project and task tracking with team collaboration features",
    project_type: "general" as const,
    db: "postgresql",
    status: "TEMPLATE" as const,
    avatar: "TM",
    color: "#fa8c16",
  },
  {
    id: "template-5",
    name: "Inventory System",
    description: "Warehouse and inventory management with barcode scanning",
    project_type: "general" as const,
    db: "postgresql",
    status: "TEMPLATE" as const,
    avatar: "IS",
    color: "#eb2f96",
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
    // Default Apito Managed DB icon
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
      return "Apito Managed DB";
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

  const handleCopyTemplate = (template: any) => {
    message.info(`Starting new project from ${template.name} template...`);
    // Navigate to new project page with template pre-selected
    navigate("/projects/new", {
      state: {
        template: template.name,
        project_type: template.project_type,
      },
    });
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

  // Define table columns matching the database view design
  const getProjectColumns = (isDemoSection = false): ColumnsType<Project> => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (name: string, project: Project) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Avatar
              size={40}
              style={{
                backgroundColor:
                  project.color || generateAvatarColor(project.name),
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              {project.avatar || name.substring(0, 2).toUpperCase()}
            </Avatar>
            {project.status === "LIVE" && (
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: token.colorSuccess,
                  border: `2px solid ${token.colorBgContainer}`,
                }}
              />
            )}
          </div>
          <div>
            <div
              style={{
                fontWeight: 500,
                color: token.colorText,
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              {name}
            </div>
            {project.description && (
              <div
                style={{
                  color: token.colorTextSecondary,
                  fontSize: 12,
                  lineHeight: 1.4,
                  marginTop: 2,
                }}
              >
                {project.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Database",
      dataIndex: "db",
      key: "database",
      width: "20%",
      render: (db: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              backgroundColor: token.colorBgTextHover,
            }}
          >
            {getDatabaseIcon(db)}
          </div>
          <span style={{ fontSize: 14, color: token.colorText }}>
            {getDatabaseName(db)}
          </span>
        </div>
      ),
    },
    {
      title: "Project Type",
      dataIndex: "project_type",
      key: "project_type",
      width: "15%",
      render: (project_type: number) => (
        <Tag
          color={
            project_type === 1 ? "blue" : "green"
          }
          style={{
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 4,
            textTransform: "capitalize",
          }}
        >
          {project_type === 1 ? "SaaS" : "General"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created",
      width: "15%",
      render: (date: string) => (
        <div style={{ fontSize: 14, color: token.colorText }}>
          {getRelativeTime(date)}
        </div>
      ),
    },
    {
      title: "Unique ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (id: string) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag
          color={status === "LIVE" ? "green" : "orange"}
          style={{ fontSize: 12, fontWeight: 500, borderRadius: 4 }}
        >
          {status || "Active"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      render: (_, project) => (
        <div onClick={(e) => e.stopPropagation()}>
          {!isDemoSection ? (
            <Dropdown
              menu={{ items: getMenuItems(project, isDemoSection) }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
                style={{
                  color: token.colorTextTertiary,
                  width: 32,
                  height: 32,
                }}
              />
            </Dropdown>
          ) : (
            <Tooltip title="Demo project - view only">
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                style={{
                  color: token.colorTextTertiary,
                  width: 32,
                  height: 32,
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  // Define template columns for project templates
  const getTemplateColumns = (): ColumnsType<any> => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "35%",
      render: (name: string, template: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Avatar
              size={40}
              style={{
                backgroundColor: template.color,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              {template.avatar}
            </Avatar>
          </div>
          <div>
            <div
              style={{
                fontWeight: 500,
                color: token.colorText,
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              {name}
            </div>
            {template.description && (
              <div
                style={{
                  color: token.colorTextSecondary,
                  fontSize: 12,
                  lineHeight: 1.4,
                  marginTop: 2,
                }}
              >
                {template.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Database",
      dataIndex: "db",
      key: "database",
      width: "20%",
      render: (db: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              backgroundColor: token.colorBgTextHover,
            }}
          >
            {getDatabaseIcon(db)}
          </div>
          <span style={{ fontSize: 14, color: token.colorText }}>
            {getDatabaseName(db)}
          </span>
        </div>
      ),
    },
    {
      title: "Project Type",
      dataIndex: "project_type",
      key: "project_type",
      width: "20%",
      render: (type: string) => (
        <Tag
          color={type === "saas" ? "blue" : "green"}
          style={{
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 4,
            textTransform: "capitalize",
          }}
        >
          {type === "saas" ? "SaaS" : "General"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: string) => (
        <Tag
          color="purple"
          style={{ fontSize: 12, fontWeight: 500, borderRadius: 4 }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      render: (_, template) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            type="primary"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyTemplate(template)}
            style={{
              padding: "4px 12px",
              fontSize: 12,
              height: 28,
            }}
          >
            Copy This
          </Button>
        </div>
      ),
    },
  ];

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
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Breadcrumb Navigation - like Turso */}
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb
          style={{ fontSize: "14px" }}
          items={[
            {
              title: (
                <span style={{ color: token.colorTextSecondary }}>
                  Projects
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Action Buttons Row - like Turso's Create Database/Create Group */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={handleStartNewProject}
        >
          Create Project
        </Button>
        <Button
          icon={<DownloadOutlined />}
          href="https://apito.io/docs/cli"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install Apito CLI
        </Button>
      </div>

      {/* Projects Table - No card wrapper to match Turso design */}
      <div style={{ marginBottom: 48 }}>
        <Table
          columns={getProjectColumns()}
          dataSource={projects.length > 0 ? projects : []}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 800 }}
          size="middle"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} projects`,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 20,
            style: { padding: "16px 24px" },
            responsive: true,
            size: "default",
          }}
          locale={{
            emptyText: (
              <Empty
                imageStyle={{ height: 80 }}
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
            ),
          }}
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onClick: () => handleCardClick(record),
          })}
        />
      </div>

      {/* Project Templates Section */}
      <div style={{ marginTop: 48 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0, marginBottom: "8px" }}>
            Project Templates
          </Title>
          <Text type="secondary">Start with proven project structures</Text>
        </div>
        <div>
          <Table
            columns={getTemplateColumns()}
            dataSource={PROJECT_TEMPLATES}
            rowKey="id"
            pagination={false}
            size="middle"
            scroll={{ x: 800 }}
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: "8px",
            }}
          />
        </div>
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ExclamationCircleOutlined style={{ color: "#cf1322", fontSize: 20, marginRight: 8 }} />
          <Text style={{ color: "#cf1322", fontWeight: 500 }}>
            This action cannot be undone. This will permanently delete project{" "}
            <Tag color="red" style={{ fontWeight: 600 }}>{projectToDelete?.name}</Tag>
            and all of its data.
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
