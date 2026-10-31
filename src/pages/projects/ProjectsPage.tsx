import {
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Empty,
  Input,
  Modal,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import { useNavigate } from "../../router/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import {
  useProjectsQuery,
  useSwitchProjectMutation,
  useDeleteProjectMutation,
} from "./queries";
import type { Project } from "../../types/project";
import { Icon } from "@iconify/react";
import { canOfferRemoteDatabaseDelete } from "./remoteDatabaseDelete";
import { useProjectSpaceMeta } from "../../contexts/ProjectSpaceMetaContext";
import ProjectStartGuide from "./ProjectStartGuide";
import { MonoTableCard } from "../../components/console";
import "../../components/console/ConsoleShell.css";
import {
  CircleAlert,
  Database,
  Download,
  Ellipsis,
  Eye,
  Rocket,
  Settings,
  Trash2,
  Users,
} from "lucide-react";

const { Title, Text } = Typography;

type ProjectRowMenuItem = NonNullable<MenuProps["items"]>[number];

const ProjectsPage: React.FC<{
  createAction?: React.ReactNode;
  quotaBanner?: React.ReactNode;
  extraRowMenuItems?: (project: Project) => ProjectRowMenuItem[];
}> = ({ createAction, quotaBanner, extraRowMenuItems }) => {
  const navigate = useNavigate();
  const { decodeTokenData } = useAuth();
  const projectsQuery = useProjectsQuery();
  const switchMutation = useSwitchProjectMutation();
  const deleteMutation = useDeleteProjectMutation();
  const data = projectsQuery.data ?? null;
  const isLoading = projectsQuery.isPending || projectsQuery.isLoading;
  const error = projectsQuery.error ? projectsQuery.error.message : null;
  const refetch = () => projectsQuery.refetch();
  const switchProject = (id: string) => switchMutation.mutateAsync(id);
  const deleteProject = (payload: { id: string; delete_database?: boolean }) =>
    deleteMutation.mutateAsync(payload);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteRemoteDatabase, setDeleteRemoteDatabase] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const tokenData = decodeTokenData();
  const projects = data?.body || [];
  const { onBeforeProjectSwitch, resolveConsoleEntryPath } =
    useConsoleExtensions();

  const getDatabaseIcon = (db: string | undefined) => {
    const dbLower = (db || "").toLowerCase();
    const brand = (icon: string, color: string, label: string) => (
      <Icon icon={icon} width={16} height={16} color={color} aria-label={label} />
    );
    if (dbLower.includes("sqlite")) {
      return brand("simple-icons:sqlite", "#003B57", "SQLite");
    }
    if (dbLower.includes("postgres")) {
      return brand("simple-icons:postgresql", "#4169E1", "PostgreSQL");
    }
    if (dbLower.includes("mariadb")) {
      return brand("simple-icons:mariadb", "#003545", "MariaDB");
    }
    if (dbLower.includes("mysql")) {
      return brand("simple-icons:mysql", "#4479A1", "MySQL");
    }
    if (dbLower.includes("mongo")) {
      return brand("simple-icons:mongodb", "#47A248", "MongoDB");
    }
    return <Database size={16} strokeWidth={1.75} className="console-icon-muted" aria-label="Database" />;
  };

  const getDatabaseName = (db: string | undefined) => {
    if (!db || db.toLowerCase().includes("coredb")) {
      return "Apito Managed DB";
    }
    return db;
  };

  const handleActiveProject = (id: string) => {
    setActiveProjectId(id);
    setSettingsDrawerOpen(true);
  };

  const handleStartNewProject = (projectType: "general" | "saas") => {
    navigate("/projects/new", { state: { project_type: projectType } });
  };

  const headerActions = useMemo(
    () => (
      <>
        {createAction ?? (
          <>
            <Tooltip
              title="One product and one database, with no customer separation. Example: a company blog, or a notebook like Todo Notes."
            >
              <Button
                type="primary"
                icon={<Rocket size={16} strokeWidth={1.75} />}
                onClick={() => handleStartNewProject("general")}
              >
                Create General Project
              </Button>
            </Tooltip>
            <Tooltip
              title="One product used by many customers. Each customer is a tenant and only sees their own data. Example: gym software where each gym is a tenant."
            >
              <Button
                icon={<Users size={16} strokeWidth={1.75} />}
                onClick={() => handleStartNewProject("saas")}
              >
                Create SaaS Project
              </Button>
            </Tooltip>
          </>
        )}
        <Button
          icon={<Download size={16} strokeWidth={1.75} />}
          href="https://apito.io/docs/cli-getting-started/"
          target="_blank"
          rel="noopener noreferrer"
          className="mono-icon-btn"
        >
          Install CLI
        </Button>
      </>
    ),
    [handleStartNewProject, createAction],
  );

  useProjectSpaceMeta({ fullWidth: true });

  const showDeleteConfirmation = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmText("");
    setDeleteRemoteDatabase(false);
    setDeleteModalVisible(true);
  };

  const resetDeleteModal = () => {
    setDeleteModalVisible(false);
    setProjectToDelete(null);
    setDeleteConfirmText("");
    setDeleteRemoteDatabase(false);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) {
      return;
    }
    if (deleteConfirmText.trim() !== projectToDelete.id) {
      message.error(
        `Please type the project id (${projectToDelete.id}) to confirm`,
      );
      return;
    }

    try {
      setDeletingProject(true);
      const response = await deleteProject({
        id: projectToDelete.id,
        delete_database: deleteRemoteDatabase,
      });
      const warning = response.data?.message;
      if (warning) {
        message.warning(warning);
      }
      message.success("Project deleted successfully");
      resetDeleteModal();
    } catch (err: unknown) {
      const apiMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data
              .message
          : err instanceof Error
            ? err.message
            : "Failed to delete project";
      message.error(apiMessage);
    } finally {
      setDeletingProject(false);
    }
  };

  const handleCardClick = async (project: Project) => {
    try {
      onBeforeProjectSwitch?.(project);

      await switchProject(project.id);
      message.success(`Switched to ${project.name}`);
      const entryPath =
        resolveConsoleEntryPath?.(project) ?? "/console/content";
      navigate(entryPath);
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
    if (diffInDays < 365) {
      const months = Math.max(1, Math.floor(diffInDays / 30));
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  };

  const getMenuItems = (project: Project, isDemoProject = false): ProjectRowMenuItem[] => [
    {
      key: "settings",
      label: "Project Settings",
      icon: <Settings size={16} strokeWidth={1.75} />,
      onClick: () => handleActiveProject(project.id),
      disabled: isDemoProject,
    },
    ...(extraRowMenuItems?.(project) || []),
    {
      key: "delete",
      label: "Delete Project",
      icon: <Trash2 size={16} strokeWidth={1.75} />,
      onClick: () => showDeleteConfirmation(project),
      disabled: isDemoProject,
      danger: true,
    },
  ];

  const getProjectColumns = (
    isDemoSection = false,
  ): ColumnsType<Project> => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 260,
      fixed: "left" as const,
      ellipsis: true,
      render: (name: string, project: Project) => (
        <div className="console-cell-row">
          <div className="mono-avatar-wrap">
            <div className="mono-avatar">
              {project.avatar || name.substring(0, 2).toUpperCase()}
            </div>
            {project.status === "LIVE" ? (
              <span className="mono-avatar--live-dot" />
            ) : null}
          </div>
          <div className="console-cell-body">
            <Tooltip title={name}>
              <div className="mono-cell-title">{name}</div>
            </Tooltip>
            {project.description ? (
              <Tooltip title={project.description}>
                <div className="mono-cell-subtitle">{project.description}</div>
              </Tooltip>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      title: "Database",
      dataIndex: "db",
      key: "database",
      width: 132,
      render: (db: string) => (
        <div className="console-cell-row console-cell-row--sm">
          <div className="console-db-icon-wrap">{getDatabaseIcon(db)}</div>
          <span className="console-cell-text">{getDatabaseName(db)}</span>
        </div>
      ),
    },
    {
      title: "Project Type",
      dataIndex: "project_type",
      key: "project_type",
      width: 96,
      align: "center",
      render: (project_type: number | undefined) => (
        <span className="mono-badge">
          {project_type === 1 ? "SaaS" : "General"}
        </span>
      ),
    },
    {
      title: "Tenant model",
      key: "tenant_model_name",
      width: 100,
      render: (_: unknown, project: Project) =>
        project.project_type === 1 && project.tenant_model_name ? (
          <span className="mono-badge">{project.tenant_model_name}</span>
        ) : (
          <span className="mono-cell-subtitle">—</span>
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 88,
      align: "center",
      render: (role: string | undefined) =>
        role ? (
          <span className="mono-badge">{role}</span>
        ) : (
          <span className="mono-cell-subtitle">—</span>
        ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created",
      width: 118,
      render: (date: string) => (
        <span className="console-cell-text">{getRelativeTime(date)}</span>
      ),
    },
    {
      title: "Unique ID",
      dataIndex: "id",
      key: "id",
      width: 148,
      render: (id: string) => (
        <Tooltip title={id}>
          <code className="console-id-code">{id}</code>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 96,
      align: "center",
      render: (status: string) => (
        <span
          className={`mono-badge${
            status === "LIVE" ? " mono-badge--live" : ""
          }`}
        >
          {status || "Active"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 52,
      fixed: "right" as const,
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
                icon={<Ellipsis size={16} strokeWidth={1.75} />}
                size="small"
                className="mono-icon-btn"
              />
            </Dropdown>
          ) : (
            <Tooltip title="Demo project - view only">
              <Button
                type="text"
                icon={<Eye size={16} strokeWidth={1.75} />}
                size="small"
                className="mono-icon-btn"
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="console-loading-state">
        <Title level={3}>Error loading projects</Title>
        <Text type="danger">{error}</Text>
        <div className="console-loading-state-text">
          <Button type="primary" onClick={refetch}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="console-page">
      {quotaBanner}
      <div className="console-page-toolbar">{headerActions}</div>
      <MonoTableCard
        className="mono-table-section"
        tableProps={{
          columns: getProjectColumns(),
          dataSource: projects.length > 0 ? projects : [],
          loading: isLoading,
          rowKey: "id",
          tableLayout: "fixed",
          scroll: { x: 1280 },
          size: "small",
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} projects`,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 20,
            size: "small",
          },
          locale: {
            emptyText: (
              <Empty
                description={
                  <span>
                    You haven&apos;t started any projects yet. Click{" "}
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
          },
          onRow: (record) => ({
            className: "console-table-clickable",
            onClick: () => handleCardClick(record),
          }),
        }}
      />

      <ProjectStartGuide />

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
        {settingsDrawerOpen ? (
          <div>
            <Text>Project settings for: {activeProjectId}</Text>
            <div className="console-settings-stack">
              <Text type="secondary">
                User: {tokenData?.email || "Unknown"}
              </Text>
            </div>
            <div className="console-settings-stack--sm">
              <Text type="secondary">
                Role: {tokenData?.project_role || "Unknown"}
              </Text>
            </div>
            <div className="console-settings-stack--sm">
              <Text type="secondary">
                Current Project: {tokenData?.project_id || "None"}
              </Text>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        title="Delete Project"
        open={deleteModalVisible}
        onCancel={resetDeleteModal}
        footer={[
          <Button key="cancel" onClick={resetDeleteModal}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={deletingProject}
            disabled={
              !projectToDelete ||
              deleteConfirmText.trim() !== projectToDelete.id
            }
            onClick={handleDeleteConfirm}
          >
            Delete Project
          </Button>,
        ]}
      >
        <div className="console-alert console-alert--error console-delete-warning">
          <div className="console-inline-row">
            <CircleAlert
              size={16}
              strokeWidth={1.75}
              className="console-icon-danger"
            />
            <Text className="console-text-medium">
              This action cannot be undone. This will permanently delete project{" "}
              <Tag className="mono-badge--danger">{projectToDelete?.name}</Tag>
              and all of its data.
            </Text>
          </div>
        </div>

        <div className="console-mb-md">
          <Text>
            Please type the project id{" "}
            <Text code strong>
              {projectToDelete?.id}
            </Text>{" "}
            to confirm:
          </Text>
        </div>

        <Input
          placeholder={
            projectToDelete ? `Type ${projectToDelete.id}` : "Project id"
          }
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          onPressEnter={handleDeleteConfirm}
          className="console-monospace-input"
        />

        {canOfferRemoteDatabaseDelete(projectToDelete) ? (
          <Checkbox
            checked={deleteRemoteDatabase}
            onChange={(e) => setDeleteRemoteDatabase(e.target.checked)}
          >
            Also delete remote database
          </Checkbox>
        ) : null}
        {canOfferRemoteDatabaseDelete(projectToDelete) ? (
          <div className="console-settings-stack--sm">
            <Text type="secondary" className="console-text-caption">
              Permanently removes the hosted Turso, Neon, or SQL database. This
              cannot be undone.
            </Text>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
