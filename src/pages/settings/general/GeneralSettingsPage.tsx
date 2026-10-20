import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
  Select,
  Switch,
  Row,
  Col,
  Modal,
  Typography,
} from "antd";
import { useTour } from "../../../contexts/TourContext";
import { useAuth } from "../../../contexts/AuthContext";
import { CirclePlay, Clock, Puzzle, Settings } from "lucide-react";
import {
  useGetSettingsQuery,
  useGetProjectPluginsQuery,
  useUpdateSettingsMutation,
} from "../../../generated_gql/tanstack-query";
import { ConsoleCard, ConsoleCardTitle } from "../../../components/console";
import { useNavigate } from "../../../router/navigation";

const { Option } = Select;
const { confirm } = Modal;
const { Text } = Typography;
const MIN_IDLE_TENANT_RETENTION_DAYS = 90;

const RUNTIME_PLATFORMS = [
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
  { id: "web", label: "Web" },
] as const;

type ExtraRow = { name?: string; value?: string };
type RuntimePlatformForm = {
  min_version_name?: string;
  min_build_number?: number;
  force_update?: boolean;
  store_url?: string;
  message_en?: string;
  message_bn?: string;
  maintenance?: boolean;
  maintenance_hours?: number;
  extra_rows?: ExtraRow[];
};

function extrasToRows(extras: unknown): ExtraRow[] {
  if (!Array.isArray(extras)) return [];
  const rows: ExtraRow[] = [];
  for (const item of extras) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    for (const [name, value] of Object.entries(item as Record<string, unknown>)) {
      rows.push({ name, value: value == null ? "" : String(value) });
    }
  }
  return rows;
}

function rowsToExtras(rows: ExtraRow[] | undefined): Array<Record<string, string>> {
  const out: Array<Record<string, string>> = [];
  for (const row of rows ?? []) {
    const name = row.name?.trim() ?? "";
    if (!name) continue;
    out.push({ [name]: row.value ?? "" });
  }
  return out;
}

function platformForm(raw: unknown): RuntimePlatformForm {
  const value = (raw ?? {}) as Record<string, unknown>;
  return {
    min_version_name:
      typeof value.min_version_name === "string" && value.min_version_name
        ? value.min_version_name
        : "0.0.0",
    min_build_number: Number(value.min_build_number ?? 0) || 0,
    force_update: value.force_update === true,
    store_url: typeof value.store_url === "string" ? value.store_url : "",
    message_en: typeof value.message_en === "string" ? value.message_en : "",
    message_bn: typeof value.message_bn === "string" ? value.message_bn : "",
    maintenance: value.maintenance === true,
    maintenance_hours: Number(value.maintenance_hours ?? 0) || 0,
    extra_rows: extrasToRows(value.extras),
  };
}

function readClientRuntime(settings: unknown) {
  const runtime = (settings as { client_runtime?: Record<string, unknown> | null } | null)
    ?.client_runtime;
  return {
    android: platformForm(runtime?.android),
    ios: platformForm(runtime?.ios),
    web: platformForm(runtime?.web),
  };
}

function wireClientRuntime(raw: Record<string, RuntimePlatformForm> | undefined) {
  const source = raw ?? {};
  const wire: Record<string, unknown> = {};
  for (const platform of RUNTIME_PLATFORMS) {
    const block = source[platform.id] ?? {};
    wire[platform.id] = {
      min_version_name: block.min_version_name || "0.0.0",
      min_build_number: Number(block.min_build_number ?? 0) || 0,
      force_update: block.force_update === true,
      store_url: block.store_url?.trim() ?? "",
      message_en: block.message_en ?? "",
      message_bn: block.message_bn ?? "",
      maintenance: block.maintenance === true,
      maintenance_hours: Number(block.maintenance_hours ?? 0) || 0,
      extras: rowsToExtras(block.extra_rows),
    };
  }
  return wire;
}

// Sample locale data - you might want to move this to a constants file
const localsData = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
};

const GeneralSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkProjectStatus } = useTour();
  const { decodeTokenData } = useAuth();
  const navigate = useNavigate();
  const isSaaSProject = decodeTokenData()?.project_type === 1;
  const iconWatch = Form.useWatch("project_icon", form);

  const { data: pluginData } = useGetProjectPluginsQuery({ limit: 100, page: 1 });
  const enabledExtensionCount = (pluginData?.getProjectPlugins ?? []).filter(
    (plugin) => plugin?.enable,
  ).length;

  // Fetch current project settings
  const {
    data: settingsData,
    isLoading: settingsLoading,
    refetch,
  } = useGetSettingsQuery();

  const { mutateAsync: updateSettings } = useUpdateSettingsMutation({
    onSuccess: () => {
      message.success("Project settings updated successfully");
      setIsSubmitting(false);
      void refetch();
    },
    onError: (error) => {
      message.error(
        `Failed to update settings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsSubmitting(false);
    },
  });

  const project = settingsData?.currentProject;

  // Derive initial form values from project
  const initialValues = useMemo(() => {
    if (!project) return undefined;
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      project_icon: (project as { project_icon?: string | null }).project_icon || "",
      settings: {
        locals: project.settings?.locals || [],
        default_locale: project.settings?.default_locale,
        enable_revision_history:
          project.settings?.enable_revision_history || false,
        system_graphql_hooks: project.settings?.system_graphql_hooks || false,
        default_storage_plugin: project.settings?.default_storage_plugin,
        default_function_plugin: project.settings?.default_function_plugin,
        idle_tenant_retention_days:
          project.settings?.idle_tenant_retention_days ??
          MIN_IDLE_TENANT_RETENTION_DAYS,
        auto_soft_delete_idle_tenants:
          project.settings?.auto_soft_delete_idle_tenants ?? false,
        client_runtime: readClientRuntime(project.settings),
      },
    };
  }, [project]);

  // Whenever project changes, reset and populate the form
  useEffect(() => {
    if (initialValues) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await updateSettings({
        name: values.name,
        description: values.description,
        project_icon: values.project_icon?.trim() || "",
        settings: {
          ...values.settings,
          client_runtime: wireClientRuntime(values.settings?.client_runtime),
        } as typeof values.settings,
      });
    } catch (error) {
      console.error("Update error:", error);
      setIsSubmitting(false);
    }
  };

  const handleResetTour = () => {
    confirm({
      title: "Reset Quick Start Journey",
      content:
        "This will clear your progress and restart the onboarding tour from the beginning. Are you sure you want to continue?",
      okText: "Reset Journey",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        // Clear all tour-related localStorage flags
        localStorage.removeItem("tour-dismissed");
        localStorage.removeItem("tour-completed");
        localStorage.removeItem("tour-waiting-for-model");
        localStorage.removeItem("tour-waiting-for-tenant");
        localStorage.removeItem("tour-waiting-for-fields");
        localStorage.removeItem("tour-waiting-for-content");
        localStorage.removeItem("tour-waiting-for-query");
        localStorage.removeItem("tour-skip-tenant-step");
        localStorage.removeItem("project-has-fields");
        localStorage.removeItem("project-has-content");
        localStorage.removeItem("project-has-run-query");

        // Clear session storage
        sessionStorage.clear();

        message.success(
          "Quick Start Journey has been reset! Navigate to any console page to begin again."
        );

        // Refresh tour status
        setTimeout(() => {
          checkProjectStatus();
        }, 500);
      },
    });
  };

  const localsOptions = Object.entries(localsData);

  if (settingsLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div>
      <ConsoleCard
        title={
          <ConsoleCardTitle icon={Settings} label="Project Information" />
        }
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isSubmitting}
          >
            Save Settings
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          preserve={false}
          initialValues={initialValues}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="id" label="Project ID">
                <Input disabled placeholder="Project ID" />
              </Form.Item>

              <Form.Item
                name="name"
                label="Project Name"
                rules={[
                  { required: true, message: "Project name is required" },
                ]}
              >
                <Input placeholder="Enter project name" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Project Description"
                rules={[
                  {
                    required: true,
                    message: "Project description is required",
                  },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter project description"
                />
              </Form.Item>

              <Form.Item
                name="project_icon"
                label="Project icon URL"
                tooltip="Used on tenant invoice / receipt PDFs"
                extra={
                  iconWatch ? (
                    <img
                      src={iconWatch}
                      alt="Project icon preview"
                      style={{
                        marginTop: 8,
                        maxHeight: 64,
                        maxWidth: 160,
                        objectFit: "contain",
                      }}
                    />
                  ) : null
                }
              >
                <Input placeholder="https://…/logo.png" />
              </Form.Item>

              <Form.Item
                name={["settings", "locals"]}
                label="Content Languages"
                tooltip="Select the languages your content will support"
              >
                <Select
                  mode="multiple"
                  placeholder="Select languages"
                  loading={settingsLoading}
                  showSearch
                  optionFilterProp="children"
                >
                  {localsOptions.map(([code, name]) => (
                    <Option key={code} value={code}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name={["settings", "default_locale"]}
                label="Default Content Language"
                tooltip="The default language for content creation"
              >
                <Select
                  placeholder="Select default language"
                  loading={settingsLoading}
                  showSearch
                  optionFilterProp="children"
                >
                  {(form.getFieldValue(["settings", "locals"]) || []).map(
                    (locale: string) => (
                      <Option key={locale} value={locale}>
                        {localsData[locale as keyof typeof localsData]}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={["settings", "default_storage_plugin"]}
                label="Default Storage Plugin"
                tooltip="Default plugin for file storage"
              >
                <Input placeholder="Storage plugin name" />
              </Form.Item>

              <Form.Item
                name={["settings", "default_function_plugin"]}
                label="Default Function Plugin"
                tooltip="Default plugin for serverless functions"
              >
                <Input placeholder="Function plugin name" />
              </Form.Item>

              <Form.Item
                name={["settings", "enable_revision_history"]}
                label="Enable Document History"
                tooltip="Track changes to documents over time"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name={["settings", "system_graphql_hooks"]}
                label="Enable System GraphQL Hooks"
                tooltip="Allow system-level GraphQL hook execution"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {isSaaSProject ? (
            <>
              <div className="console-mt-lg console-mb-md">
                <ConsoleCardTitle icon={Clock} label="Idle tenant cleanup" />
              </div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={["settings", "idle_tenant_retention_days"]}
                    label="Idle retention (days)"
                    tooltip="Tenants with no login within this window appear on the Idle Tenants tab"
                    rules={[
                      {
                        required: true,
                        message: "Retention days is required",
                      },
                      {
                        type: "number",
                        min: MIN_IDLE_TENANT_RETENTION_DAYS,
                        message: `Minimum ${MIN_IDLE_TENANT_RETENTION_DAYS} days`,
                      },
                    ]}
                  >
                    <InputNumber
                      min={MIN_IDLE_TENANT_RETENTION_DAYS}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["settings", "auto_soft_delete_idle_tenants"]}
                    label="Auto soft-delete idle free tenants"
                    tooltip="Daily job soft-deletes free-tier idle tenants. Paid plans are excluded. Never hard-deletes."
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Text type="secondary">
                The Idle Tenants tab uses this retention window. Auto
                soft-delete only marks catalog rows as deleted — it never
                hard-deletes. Paid plans are excluded from automatic
                soft-delete.
              </Text>
            </>
          ) : null}

          <div className="console-mt-lg console-mb-md">
            <ConsoleCardTitle icon={Settings} label="App release and maintenance" />
          </div>
          <Text type="secondary">
            Each platform is independent. Android can be in maintenance while web stays open.
            Extra values are saved as one-key objects, such as min_corridor_m = 50.
            Suggested extras: min_corridor_m, max_corridor_m, accuracy_pad_m, max_accuracy_m,
            station_yard_pending_m, ad_skip_on_fill_fail, hide_shop, hide_food_orders.
          </Text>
          {RUNTIME_PLATFORMS.map((platform) => (
            <div key={platform.id} style={{ marginTop: 24 }}>
              <Text strong>{platform.label}</Text>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "min_version_name"]}
                    label="Minimum version"
                  >
                    <Input placeholder="0.0.0" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "min_build_number"]}
                    label="Minimum build"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "maintenance_hours"]}
                    label="Maintenance hours"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "force_update"]}
                    label="Force update"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "maintenance"]}
                    label="Maintenance"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name={["settings", "client_runtime", platform.id, "store_url"]}
                label="Store URL"
              >
                <Input placeholder="https://" />
              </Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "message_en"]}
                    label="Message (English)"
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["settings", "client_runtime", platform.id, "message_bn"]}
                    label="Message (Bangla)"
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.List name={["settings", "client_runtime", platform.id, "extra_rows"]}>
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map((field) => (
                      <Row gutter={12} key={field.key}>
                        <Col span={8}>
                          <Form.Item
                            name={[field.name, "name"]}
                            label="Extra name"
                            rules={[
                              {
                                pattern: /^[a-z][a-z0-9_]{0,63}$/,
                                message: "Use a lowercase name such as min_corridor_m",
                              },
                            ]}
                          >
                            <Input placeholder="min_corridor_m" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name={[field.name, "value"]} label="Value">
                            <Input placeholder="50" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label=" ">
                            <Button onClick={() => remove(field.name)}>Remove</Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                    <Button onClick={() => add({ name: "", value: "" })}>
                      Add extra
                    </Button>
                  </div>
                )}
              </Form.List>
            </div>
          ))}
        </Form>
      </ConsoleCard>

      <ConsoleCard
        className="console-card-spaced-top"
        title={<ConsoleCardTitle icon={Puzzle} label="Extensions" />}
      >
        <div className="console-row-between">
          <Text>
            Extensions: {enabledExtensionCount} enabled
          </Text>
          <Button onClick={() => navigate("/console/settings/plugins")}>
            Manage plugins
          </Button>
        </div>
      </ConsoleCard>

      <ConsoleCard
        className="console-card-spaced-top"
        title={
          <ConsoleCardTitle icon={CirclePlay} label="Quick Start Journey" />
        }
      >
        <div className="console-row-between">
          <div>
            <div className="console-text-medium">Restart Onboarding Tour</div>
            <Text type="secondary">
              Reset your progress and experience the guided setup journey again.
              This will clear all tour progress and start fresh.
            </Text>
          </div>
          <Button
            type="primary"
            danger
            icon={<CirclePlay size={16} strokeWidth={1.75} />}
            onClick={handleResetTour}
            className="console-row-action"
          >
            Start Again
          </Button>
        </div>
      </ConsoleCard>
    </div>
  );
};

export default GeneralSettingsPage;
