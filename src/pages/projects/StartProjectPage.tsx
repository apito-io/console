import React, { useEffect, useState } from "react";
import { Form, Button, Typography, message, Tooltip, App } from "antd";
import { FolderKanban, Plus } from "lucide-react";
import { useLocation, useNavigate } from "../../router/navigation";
import { httpService } from "../../services/httpService";
import { PROJECT_CREATE } from "../../constants/api";
import {
  findProjectTemplate,
  PROJECT_TEMPLATES,
} from "../../constants/projectTemplates";
import {
  ConsoleCard,
  ConsoleCardTitle,
  ConsoleChip,
  ConsoleChipGroup,
} from "../../components/console";
import ProjectCreateForm from "../../components/project/ProjectCreateForm";
import SaasTenantDataStrategy from "../../components/project/SaasTenantDataStrategy";
import "../../components/console/ConsoleShell.css";
import "./StartProjectPage.css";

const { Text } = Typography;

interface ProjectCreateData {
  id?: string;
  name: string;
  description?: string;
  per_tenant_separate_database?: boolean;
}

type ProjectType = "general" | "saas";

const StartProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notification: notificationApi } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>("general");
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  const perTenantSeparateDb = Form.useWatch(
    "per_tenant_separate_database",
    form,
  );

  useEffect(() => {
    const state = location.state as {
      template?: string;
      project_type?: ProjectType;
    } | null;
    if (state?.project_type === "saas" || state?.project_type === "general") {
      setProjectType(state.project_type);
    }
    const template = findProjectTemplate(state?.template);
    if (template) {
      setSelectedTemplateId(template.id);
      form.setFieldsValue({
        name: template.title,
        description: template.description.slice(0, 200),
      });
    }
  }, [location.state, form]);

  useEffect(() => {
    if (projectType !== "saas") {
      form.setFieldsValue({ per_tenant_separate_database: undefined });
    }
  }, [projectType, form]);

  const handleCreateProject = async (values: ProjectCreateData) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const projectId = String(values.id || "").trim();
      const payload: Record<string, unknown> = {
        name: values.name,
        id: projectId,
        description: values.description,
        project_type: projectType,
        database_type: "sqlite",
        db_config: { file: `apito_${projectId}.sqlite` },
      };
      if (projectType === "saas") {
        payload.per_tenant_separate_database =
          values.per_tenant_separate_database ?? false;
      }

      const response = await httpService.post(PROJECT_CREATE, payload);

      if (response.data.code === 200) {
        message.success("Project created successfully!");
        navigate("/projects");
      } else {
        message.error(response.data.message || "Failed to create project");
      }
    } catch (error: unknown) {
      console.error("Error creating project:", error);

      let errMsg = "Failed to create project. Please try again.";
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
        request?: unknown;
        message?: string;
      };

      if (axiosError.response) {
        errMsg =
          axiosError.response.data?.message ||
          axiosError.response.data?.error ||
          `Server error: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        errMsg = "No response from server. Please check your connection.";
      } else if (axiosError.message) {
        errMsg = axiosError.message;
      }

      setErrorMessage(errMsg);
      notificationApi.error({
        message: "Project Creation Error",
        description: errMsg,
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const saasFieldsOk =
    projectType !== "saas" ||
    (perTenantSeparateDb !== undefined && perTenantSeparateDb !== null);

  const canCreateProject = Boolean(isValidId && saasFieldsOk);

  const selectedTemplate = selectedTemplateId
    ? PROJECT_TEMPLATES.find((tpl) => tpl.id === selectedTemplateId)
    : null;

  const createDisabledReason = (() => {
    if (canCreateProject) return undefined;
    if (projectType === "saas" && !saasFieldsOk) {
      return "SaaS: choose how tenant data is stored (shared DB vs separate DB per tenant)";
    }
    return "Enter a valid project name to generate an available ID";
  })();

  return (
    <div className="console-page create-project-page">
      <Form
        form={form}
        layout="vertical"
        className="create-project-form"
        onFinish={handleCreateProject}
      >
        <div className="create-project-layout">
          <section className="create-project-main" aria-label="Project setup">
            <ConsoleCard
              className="create-project-card create-project-card--project"
              title={
                <ConsoleCardTitle
                  icon={FolderKanban}
                  label="Project & template"
                />
              }
            >
              <div className="create-project-combined">
                <div className="create-project-combined__details">
                  <ProjectCreateForm
                    form={form}
                    projectType={projectType}
                    onProjectTypeChange={setProjectType}
                    isValidId={isValidId}
                    onValidIdChange={setIsValidId}
                    compact
                  />
                  <SaasTenantDataStrategy
                    form={form}
                    visible={projectType === "saas"}
                    compact
                    perTenantAllowed
                  />
                </div>

                <aside
                  className="create-project-combined__template"
                  aria-label="Starter template"
                >
                  <p className="create-project-section-label">
                    Starter template
                  </p>
                  <ConsoleChipGroup>
                    <ConsoleChip
                      active={selectedTemplateId === null}
                      onClick={() => setSelectedTemplateId(null)}
                    >
                      Blank
                    </ConsoleChip>
                    {PROJECT_TEMPLATES.map((tpl) => (
                      <ConsoleChip
                        key={tpl.id}
                        active={selectedTemplateId === tpl.id}
                        onClick={() => {
                          setSelectedTemplateId(tpl.id);
                          form.setFieldsValue({
                            name: tpl.title,
                            description: tpl.description.slice(0, 200),
                          });
                        }}
                      >
                        {tpl.label}
                      </ConsoleChip>
                    ))}
                  </ConsoleChipGroup>
                  <Text
                    type="secondary"
                    className="create-project-template-blurb"
                    ellipsis={{ tooltip: selectedTemplate?.description }}
                  >
                    {selectedTemplate
                      ? selectedTemplate.description
                      : "Blank project, or pick a template to prefill name and description."}
                  </Text>
                </aside>
              </div>
            </ConsoleCard>
          </section>
        </div>

        {errorMessage ? (
          <div
            className="console-alert console-alert--error"
            role="alert"
            style={{ marginTop: 12 }}
          >
            {errorMessage}
          </div>
        ) : null}

        <footer className="create-project-cta" aria-label="Create project">
          <div className="create-project-cta__summary" aria-live="polite">
            <Text strong>
              {projectType === "saas" ? "SaaS project" : "General project"}
              {selectedTemplate ? ` · ${selectedTemplate.label}` : ""}
            </Text>
            <Text type="secondary">
              Stored in a local SQLite file for this engine.
            </Text>
          </div>
          <div className="create-project-cta__actions">
            <Button onClick={() => navigate("/projects")}>Cancel</Button>
            <Tooltip title={createDisabledReason}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!canCreateProject}
                icon={<Plus size={16} strokeWidth={1.75} />}
              >
                Create project
              </Button>
            </Tooltip>
          </div>
        </footer>
      </Form>
    </div>
  );
};

export default StartProjectPage;
