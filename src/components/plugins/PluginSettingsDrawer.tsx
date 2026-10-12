import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Drawer,
  Alert,
  message,
  Input,
  Divider,
  Space,
  Modal,
  Empty,
} from "antd";
import {
  useUpsertPluginDetailsMutation,
  useRemoveProjectSpecificPluginMutation,
  useGetSystemPluginsQuery,
  Plugin_Activation_Type_Enum,
  type PluginConfigEnvVarsPayload,
} from "../../generated_gql/tanstack-query";
import type { PluginDetailsRow } from "./pluginTypes";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getRestUrl } from "../../constants/api";
import { mergePluginEnvVars } from "../../plugins/envDefaults";
import { useQueryClient } from "@tanstack/react-query";
import { refreshPluginRegistry } from "../../plugins/queries";
import pluginRegistry from "../../plugins/PluginRegistry";
import ContributionBadges from "./ContributionBadges";

const { Title, Text } = Typography;

const formatLoadStatus = (status: string | null | undefined) => {
  if (!status) return "—";
  return String(status)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export type PluginSettingsDrawerVariant = "system" | "project";

export interface PluginSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedPlugin: PluginDetailsRow | null;
  variant: PluginSettingsDrawerVariant;
  onAfterMutation?: () => void | Promise<void>;
}

const PluginSettingsDrawer: React.FC<PluginSettingsDrawerProps> = ({
  open,
  onClose,
  selectedPlugin,
  variant,
  onAfterMutation,
}) => {
  const [envVarsVisible, setEnvVarsVisible] = useState<Record<string, boolean>>(
    {}
  );
  const [envVarsValues, setEnvVarsValues] = useState<
    Record<string, { key: string; value: string }>
  >({});
  const { mutateAsync: upsertPluginDetails, isPending: saving } =
    useUpsertPluginDetailsMutation();
  const { mutateAsync: removeProjectSpecificPlugin, isPending: removing } =
    useRemoveProjectSpecificPluginMutation();
  const [deactivating, setDeactivating] = useState(false);
  const [newEnvKey, setNewEnvKey] = useState("");
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";
  const queryClient = useQueryClient();
  const { data: systemPluginsData } = useGetSystemPluginsQuery(
    { limit: 100, page: 1 },
    { enabled: open && !!selectedPlugin?.id },
  );

  useEffect(() => {
    if (!open || !selectedPlugin) {
      setEnvVarsVisible({});
      setEnvVarsValues({});
      setNewEnvKey("");
      return;
    }
    const yamlTemplates =
      (systemPluginsData?.getSystemPlugins ?? []).find(
        (row) => row?.id === selectedPlugin.id,
      )?.env_vars ?? [];
    const merged = mergePluginEnvVars(
      selectedPlugin.id,
      selectedPlugin.env_vars,
      yamlTemplates,
    );
    const initialVisibility: Record<string, boolean> = {};
    const initialValues: Record<string, { key: string; value: string }> = {};
    merged.forEach((envVar) => {
      initialVisibility[envVar.key] = false;
      initialValues[envVar.key] = {
        key: envVar.key,
        value: envVar.value || "",
      };
    });
    setEnvVarsVisible(initialVisibility);
    setEnvVarsValues(initialValues);
  }, [open, selectedPlugin, systemPluginsData]);

  const toggleEnvVarVisibility = (key: string) => {
    setEnvVarsVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateEnvVarValue = (key: string, value: string) => {
    setEnvVarsValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const addEnvVar = () => {
    const key = newEnvKey.trim();
    if (!key || envVarsValues[key]) {
      return;
    }
    setEnvVarsValues((prev) => ({
      ...prev,
      [key]: { key, value: "" },
    }));
    setEnvVarsVisible((prev) => ({ ...prev, [key]: false }));
    setNewEnvKey("");
  };

  const handleSaveSettings = async () => {
    if (!selectedPlugin?.id) return;

    try {
      const envVarsPayload: PluginConfigEnvVarsPayload[] = Object.values(
        envVarsValues
      ).map((envVar) => ({
        key: envVar.key,
        value: envVar.value,
      }));

      await upsertPluginDetails({
        id: selectedPlugin.id,
        env_vars: envVarsPayload,
      });

      message.success("Plugin settings updated successfully");
      await refreshPluginRegistry(queryClient, projectId);
      await onAfterMutation?.();
      onClose();
    } catch (error) {
      console.error("Failed to update plugin settings:", error);
      message.error("Failed to update plugin settings");
    }
  };

  const handleDeactivate = async () => {
    if (!selectedPlugin?.id) return;
    setDeactivating(true);
    try {
      await upsertPluginDetails({
        id: selectedPlugin.id,
        activate_status: Plugin_Activation_Type_Enum.Deactivated,
      });
      message.success("Plugin deactivated");
      await refreshPluginRegistry(queryClient, projectId);
      await onAfterMutation?.();
      onClose();
    } catch (error) {
      console.error("Failed to deactivate plugin:", error);
      message.error("Failed to deactivate plugin");
    } finally {
      setDeactivating(false);
    }
  };

  const handleRemove = () => {
    if (!selectedPlugin?.id) return;
    Modal.confirm({
      title: "Remove plugin from project?",
      content:
        "This removes the plugin from this project. You can add it again from the catalog later.",
      okText: "Remove",
      okType: "danger",
      onOk: async () => {
        try {
          await removeProjectSpecificPlugin({ id: selectedPlugin.id! });
          message.success("Plugin removed");
          await refreshPluginRegistry(queryClient, projectId);
          await onAfterMutation?.();
          onClose();
        } catch (error) {
          console.error("Failed to remove plugin:", error);
          message.error("Failed to remove plugin");
        }
      },
    });
  };

  return (
    <Drawer
      title={
        selectedPlugin
          ? `${selectedPlugin.title || selectedPlugin.id} Settings`
          : "Plugin Settings"
      }
      placement="right"
      width={500}
      closable
      onClose={onClose}
      open={open}
      footer={
        selectedPlugin ? (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSaveSettings}
              loading={saving}
            >
              Save Settings
            </Button>
          </div>
        ) : null
      }
    >
      {selectedPlugin ? (
        <div>
          <Alert
            message="Plugin Configuration"
            description="Per-project env vars. Saved on this project, used for GraphQL/REST calls. Keys come from the plugin config.yml. Open a project first — Administrator Install does not activate the plugin."
            type="info"
            showIcon
            style={{ marginBottom: "24px" }}
          />

          {selectedPlugin.id === "hc-stripe-plugin" && projectId ? (
            <Alert
              message="Stripe webhook URL"
              description={
                <Text copyable style={{ fontSize: 13 }}>
                  {getRestUrl(
                    `/plugin/hc-stripe-plugin/webhook?project_id=${encodeURIComponent(projectId)}`,
                  )}
                </Text>
              }
              type="success"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          ) : null}

          {selectedPlugin.id === "hc-discord-plugin" ? (
            <Alert
              message="Discord events"
              description="Set DISCORD_WEBHOOK_URL and DISCORD_EVENTS (order,signup,error,publish). Optional DISCORD_MODELS filters order notifications."
              type="success"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          ) : null}

          {variant === "project" && (
            <Space
              direction="vertical"
              style={{ width: "100%", marginBottom: "24px" }}
              size="middle"
            >
              <Space wrap>
                <Button
                  onClick={handleDeactivate}
                  loading={deactivating}
                  disabled={removing}
                >
                  Deactivate
                </Button>
                <Button
                  danger
                  onClick={handleRemove}
                  loading={removing}
                  disabled={deactivating}
                >
                  Remove
                </Button>
              </Space>
            </Space>
          )}

          <div style={{ marginBottom: "24px" }}>
            <Title level={5} style={{ marginBottom: "16px" }}>
              Plugin Details
            </Title>

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ marginBottom: "12px" }}>
              <Text strong>Plugin ID:</Text>
              <br />
              <Text code style={{ fontSize: "13px" }}>
                {selectedPlugin.id}
              </Text>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <ContributionBadges
                contributions={
                  pluginRegistry.getPlugin(selectedPlugin.id ?? "")?.config
                    .contributions
                }
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <Text strong>Load status:</Text>
              <br />
              <Text style={{ fontSize: "13px" }}>
                {formatLoadStatus(selectedPlugin.load_status ?? undefined)}
              </Text>
            </div>

            {selectedPlugin.description && (
              <div style={{ marginBottom: "12px" }}>
                <Text strong>Description:</Text>
                <br />
                <Text style={{ fontSize: "13px" }}>
                  {selectedPlugin.description}
                </Text>
              </div>
            )}

            {selectedPlugin.version && (
              <div style={{ marginBottom: "12px" }}>
                <Text strong>Version:</Text>
                <br />
                <Text style={{ fontSize: "13px" }}>
                  {selectedPlugin.version}
                </Text>
              </div>
            )}

            {selectedPlugin.author && (
              <div style={{ marginBottom: "12px" }}>
                <Text strong>Author:</Text>
                <br />
                <Text style={{ fontSize: "13px" }}>
                  {selectedPlugin.author}
                </Text>
              </div>
            )}
          </div>

          <Divider />

          <div>
            <Title level={5} style={{ marginBottom: "16px" }}>
              Environment Variables
            </Title>

            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
              <Input
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                onPressEnter={addEnvVar}
                placeholder="Add variable name"
                aria-label="New environment variable name"
              />
              <Button
                icon={<Plus size={16} strokeWidth={1.75} />}
                onClick={addEnvVar}
                disabled={!newEnvKey.trim()}
              >
                Add
              </Button>
            </Space.Compact>

            {Object.keys(envVarsValues).length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {Object.values(envVarsValues).map((envVar) => {
                  if (!envVar?.key) return null;
                  const isVisible = envVarsVisible[envVar.key] || false;
                  const currentValue = envVar.value ?? "";

                  return (
                    <div
                      key={envVar.key}
                      style={{
                        padding: "12px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong style={{ fontSize: "13px" }}>
                          {envVar.key}
                        </Text>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            isVisible ? (
                              <EyeOff size={16} strokeWidth={1.75} />
                            ) : (
                              <Eye size={16} strokeWidth={1.75} />
                            )
                          }
                          onClick={() => toggleEnvVarVisibility(envVar.key!)}
                        >
                          {isVisible ? "Hide" : "Show"}
                        </Button>
                      </div>
                      <Input
                        type={isVisible ? "text" : "password"}
                        value={currentValue}
                        onChange={(e) =>
                          updateEnvVarValue(envVar.key!, e.target.value)
                        }
                        placeholder="Enter value"
                        style={{ fontSize: "13px" }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <Text type="secondary" style={{ fontSize: "13px" }}>
                No keys in plugin config.yml yet. Add a variable name above.
              </Text>
            )}
          </div>
        </div>
      ) : (
        <Empty description="No plugin selected" />
      )}
    </Drawer>
  );
};

export default PluginSettingsDrawer;
