import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  message,
  Skeleton,
  Select,
  Switch,
  Row,
  Col,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetOnlyModelsInfoQuery,
} from "../../../generated/graphql";

const { Option } = Select;

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

  // Fetch current project settings
  const {
    data: settingsData,
    loading: settingsLoading,
    refetch,
  } = useGetSettingsQuery({
    errorPolicy: "all",
  });

  // Fetch models for tenant model selection
  const { data: modelsData, loading: modelsLoading } =
    useGetOnlyModelsInfoQuery({
      errorPolicy: "all",
    });

  // Update settings mutation
  const [updateSettings] = useUpdateSettingsMutation({
    onCompleted: () => {
      message.success("Project settings updated successfully");
      setIsSubmitting(false);
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update settings: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const project = settingsData?.currentProject;
  const models =
    modelsData?.projectModelsInfo?.filter(
      (model) => model && !model.system_generated
    ) || [];

  // Derive initial form values from project
  const initialValues = useMemo(() => {
    if (!project) return undefined;
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      tenant_model_name: project.tenant_model_name,
      settings: {
        locals: project.settings?.locals || [],
        default_locale: project.settings?.default_locale,
        enable_revision_history:
          project.settings?.enable_revision_history || false,
        system_graphql_hooks: project.settings?.system_graphql_hooks || false,
        default_storage_plugin: project.settings?.default_storage_plugin,
        default_function_plugin: project.settings?.default_function_plugin,
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
        variables: {
          name: values.name,
          description: values.description,
          tenant_model_name: values.tenant_model_name,
          settings: values.settings,
        },
      });
    } catch (error) {
      console.error("Update error:", error);
      setIsSubmitting(false);
    }
  };

  const localsOptions = Object.entries(localsData);

  if (settingsLoading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div>
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SettingOutlined />
            Project Information
          </div>
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
                name="tenant_model_name"
                label="Tenant Model"
                tooltip="Select a model to use for multi-tenancy"
              >
                <Select
                  placeholder="Select a model"
                  loading={modelsLoading}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {models.map((model) => (
                    <Option key={model?.name} value={model?.name}>
                      {model?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

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
        </Form>
      </Card>
    </div>
  );
};

export default GeneralSettingsPage;
