import React, { useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  Radio,
  Switch,
  Typography,
  message,
} from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import {
  useGetProjectStorageQuery,
  useUpdateProjectStorageSettingsMutation,
} from "../../../generated_gql/tanstack-query";
import { settingsKeys } from "../../../lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { ConsoleCard, ConsoleCardTitle } from "../../../components/console";
import { Cloud, Database } from "lucide-react";

const { Paragraph } = Typography;

type StorageMode = "free" | "custom";

type StorageSettingsPayload = {
  use_free_cloud_storage: boolean;
  endpoint?: string | null;
  region?: string | null;
  bucket?: string | null;
  access_key_id?: string | null;
  has_secret_access_key: boolean;
  public_base_url?: string | null;
  force_path_style?: boolean | null;
};

type UpdateProjectStorageInput = {
  use_free_cloud_storage?: boolean | null;
  endpoint?: string | null;
  region?: string | null;
  bucket?: string | null;
  access_key_id?: string | null;
  secret_access_key?: string | null;
  public_base_url?: string | null;
  force_path_style?: boolean | null;
};

const StorageSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();
  const projectId = tokenData?.project_id ?? "";

  const { data, isLoading: loading } = useGetProjectStorageQuery(
    { _id: projectId },
    { enabled: Boolean(projectId) }
  );

  const { mutateAsync: saveSettings, isPending: saving } =
    useUpdateProjectStorageSettingsMutation({
      onSuccess: () => {
        message.success("Storage settings saved");
        void queryClient.invalidateQueries({
          queryKey: settingsKeys.storage(),
        });
        if (projectId) {
          void queryClient.invalidateQueries({
            queryKey: useGetProjectStorageQuery.getKey({ _id: projectId }),
          });
        }
      },
      onError: (e) =>
        message.error(
          e instanceof Error ? e.message : "Failed to save storage settings"
        ),
    });

  const snapshot = data?.getProject?.storage_settings as
    | StorageSettingsPayload
    | undefined;

  const initial = useMemo(() => {
    const useFree = snapshot?.use_free_cloud_storage ?? true;
    return {
      storage_mode: (useFree ? "free" : "custom") as StorageMode,
      endpoint: snapshot?.endpoint ?? "",
      region: snapshot?.region ?? "",
      bucket: snapshot?.bucket ?? "",
      access_key_id: snapshot?.access_key_id ?? "",
      public_base_url: snapshot?.public_base_url ?? "",
      force_path_style: Boolean(snapshot?.force_path_style),
    };
  }, [snapshot]);

  useEffect(() => {
    form.setFieldsValue(initial);
  }, [form, initial]);

  const storageMode = Form.useWatch("storage_mode", form) as
    | StorageMode
    | undefined;
  const isFreeMode = storageMode !== "custom";

  const onFinish = async (values: Record<string, unknown>) => {
    const mode = String(values.storage_mode || "free") as StorageMode;
    const useFree = mode === "free";

    if (useFree) {
      await saveSettings({
        input: { use_free_cloud_storage: true },
      });
      return;
    }

    const endpoint = String(values.endpoint ?? "").trim();
    const bucket = String(values.bucket ?? "").trim();
    const accessKeyId = String(values.access_key_id ?? "").trim();
    const secret = String(values.secret_access_key ?? "").trim();

    if (!endpoint || !bucket || !accessKeyId) {
      message.error(
        "Endpoint, bucket, and access key are required for custom storage."
      );
      return;
    }
    if (!snapshot?.has_secret_access_key && !secret) {
      message.error(
        "Secret access key is required for first-time custom storage setup."
      );
      return;
    }

    const input: UpdateProjectStorageInput = {
      use_free_cloud_storage: false,
      endpoint,
      bucket,
      access_key_id: accessKeyId,
      region: String(values.region ?? "").trim() || null,
      public_base_url: String(values.public_base_url ?? "").trim() || null,
      force_path_style: Boolean(values.force_path_style),
    };
    if (secret !== "") {
      input.secret_access_key = secret;
    }
    await saveSettings({ input });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      disabled={loading && !snapshot}
      className="console-page console-stack"
    >
      <ConsoleCard
        title={<ConsoleCardTitle icon={Cloud} label="Upload backend" />}
      >
        <Form.Item name="storage_mode" label="Storage provider">
          <Radio.Group>
            <Radio value="free">Use Apito free cloud storage</Radio>
            <Radio value="custom">Custom S3-compatible storage</Radio>
          </Radio.Group>
        </Form.Item>
        {isFreeMode ? (
          <Paragraph type="secondary" className="console-mb-0">
            Uploads use the platform Cloudflare R2 bucket configured on the
            engine. No per-project S3 credentials are stored. Free cloud
            projects share a 500 MB storage quota per project.
          </Paragraph>
        ) : null}
      </ConsoleCard>

      <ConsoleCard
        title={<ConsoleCardTitle icon={Database} label="S3-compatible credentials" />}
        className={isFreeMode ? "console-card-body-muted" : undefined}
      >
        <Form.Item
          name="endpoint"
          label="Endpoint"
          rules={
            isFreeMode
              ? []
              : [{ required: true, message: "Endpoint is required" }]
          }
        >
          <Input
            disabled={isFreeMode}
            placeholder="https://s3.amazonaws.com or https://minio.example.com"
          />
        </Form.Item>
        <Form.Item name="region" label="Region">
          <Input disabled={isFreeMode} placeholder="e.g. us-east-1" />
        </Form.Item>
        <Form.Item
          name="bucket"
          label="Bucket"
          rules={
            isFreeMode
              ? []
              : [{ required: true, message: "Bucket is required" }]
          }
        >
          <Input disabled={isFreeMode} placeholder="my-uploads" />
        </Form.Item>
        <Form.Item
          name="access_key_id"
          label="Access key ID"
          rules={
            isFreeMode
              ? []
              : [{ required: true, message: "Access key is required" }]
          }
        >
          <Input disabled={isFreeMode} placeholder="AKIA..." />
        </Form.Item>
        <Form.Item
          name="secret_access_key"
          label="Secret access key"
          extra={
            snapshot?.has_secret_access_key
              ? "Leave blank to keep the existing secret."
              : "Required when configuring custom storage for the first time."
          }
        >
          <Input.Password
            disabled={isFreeMode}
            placeholder="Leave blank to keep existing"
          />
        </Form.Item>
        <Form.Item name="public_base_url" label="Public base URL (optional)">
          <Input
            disabled={isFreeMode}
            placeholder="https://cdn.example.com"
          />
        </Form.Item>
        <Form.Item
          name="force_path_style"
          label="Force path-style URLs"
          valuePropName="checked"
          extra="Enable for MinIO and some S3-compatible providers."
        >
          <Switch disabled={isFreeMode} />
        </Form.Item>
      </ConsoleCard>

      <Button type="primary" htmlType="submit" loading={saving}>
        Save
      </Button>
    </Form>
  );
};

export default StorageSettingsPage;
