import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Space,
  message,
  Typography,
  Spin,
  Alert,
  Tabs,
  Layout,
  Descriptions,
  Tag,
} from "antd";
import {
  useGetModelDetailsQuery,
  useGetSingleDataQuery,
  useCreateModelDataMutation,
  useUpdateSingleDataMutation,
} from "../../../generated_gql/tanstack-query";
import DynamicFormGenerator from "../../../components/forms/DynamicFormGenerator";
import { useTourTracking } from "../../../hooks/useTourTracking";
import { CloudUpload, Pencil } from "lucide-react";
import "../../../components/console/ConsoleShell.css";

const { Text } = Typography;
const { TabPane } = Tabs;
const { Content, Sider } = Layout;

interface EditAndCreateContentFormProps {
  contentData?: {
    model: string;
    id?: string;
    action: "create" | "edit";
    [key: string]: unknown;
  };
  formType: "create" | "edit";
  onContentCreated?: () => void;
  onContentEdited?: () => void;
}

const EditAndCreateContentForm: React.FC<EditAndCreateContentFormProps> = ({
  contentData,
  formType,
  onContentCreated,
  onContentEdited,
}) => {
  const [form] = Form.useForm();
  const [activeLocale, setActiveLocale] = useState<string>("en");
  const [submitType, setSubmitType] = useState<"publish" | "draft">("publish");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { trackContentAdded } = useTourTracking();

  const modelName = contentData?.model || "";
  const contentId = contentData?.id;
  const isEdit = formType === "edit" && contentId;

  const {
    data: formGenerationData,
    isLoading: formGenerationLoading,
    error: formGenerationError,
  } = useGetModelDetailsQuery(
    { model_name: modelName },
    { enabled: Boolean(modelName) }
  );

  const {
    data: formData,
    isLoading: formDataLoading,
    error: formDataError,
  } = useGetSingleDataQuery(
    {
      _id: contentId ?? "",
      model: modelName,
      local: activeLocale,
      revision: false,
      single_page_data: false,
    },
    { enabled: Boolean(isEdit && contentId && modelName) }
  );

  const { mutateAsync: createData, isPending: createLoading } =
    useCreateModelDataMutation({
      onSuccess: () => {
        message.success(`New ${modelName} created successfully!`);
        trackContentAdded();
        onContentCreated?.();
      },
      onError: (error) => {
        message.error(
          `Failed to create ${modelName}: ${
            error instanceof Error ? error.message : "Create failed"
          }`
        );
      },
    });

  const { mutateAsync: updateData, isPending: updateLoading } =
    useUpdateSingleDataMutation({
      onSuccess: () => {
        message.success(
          `${modelName} ${
            submitType === "draft" ? "saved as draft" : "published"
          } successfully!`
        );
        onContentEdited?.();
      },
      onError: (error) => {
        message.error(
          `Failed to update ${modelName}: ${
            error instanceof Error ? error.message : "Update failed"
          }`
        );
      },
    });

  useEffect(() => {
    if (formData?.getSingleData?.data && isEdit) {
      const initialValues = {
        form: formData.getSingleData.data,
      };

      form.setFieldsValue(initialValues);
    }
  }, [formData, form, isEdit]);

  const modelInfo = formGenerationData?.projectModelsInfo?.[0];
  const fields = (modelInfo as any)?.fields || [];
  const locales = (modelInfo as any)?.locals || ["en"];

  const onUpdate = async ({ status }: { status: string }) => {
    try {
      const { form: newFormData } = await form.validateFields();

      setFormErrors([]);

      if (isEdit) {
        await updateData({
          _id: formData?.getSingleData?._key || contentId || "",
          model_name: modelName,
          local: activeLocale,
          payload: newFormData,
          status,
          single_page_data: Boolean(contentData?.single_page_data),
        });
      } else {
        await createData({
          model_name: modelName,
          local: activeLocale,
          payload: newFormData,
          status,
        });
      }
    } catch (error: any) {
      if (error.errorFields) {
        const errors = error.errorFields
          .map((field: any) => field.errors?.join(", ") || "Validation error")
          .filter(Boolean);
        setFormErrors(errors);
      } else {
        console.error("Form submission error:", error);
      }
    }
  };

  const handleSubmit = async () => {
    await onUpdate({ status: "published" });
  };

  const handleSaveDraft = async () => {
    await onUpdate({ status: "draft" });
  };

  if (formGenerationLoading || (isEdit && formDataLoading)) {
    return (
      <div className="content-form-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (formGenerationError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load form structure: ${formGenerationError instanceof Error ? formGenerationError.message : "Unknown error"}`}
        type="error"
        showIcon
        className="console-mx-inset"
      />
    );
  }

  if (isEdit && formDataError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load content data: ${formDataError instanceof Error ? formDataError.message : "Unknown error"}`}
        type="error"
        showIcon
        className="console-mx-inset"
      />
    );
  }

  if (!modelInfo || !fields.length) {
    return (
      <Alert
        message="No Form Configuration"
        description={`No form fields found for model: ${modelName}`}
        type="warning"
        showIcon
        className="console-mx-inset"
      />
    );
  }

  const renderFormContent = () => {
    if (locales.length > 1) {
      return (
        <Tabs activeKey={activeLocale} onChange={setActiveLocale} type="card">
          {locales.map((locale: string) => (
            <TabPane tab={locale.toUpperCase()} key={locale}>
              <DynamicFormGenerator
                fields={fields}
                form={form}
                disabled={createLoading || updateLoading}
              />
            </TabPane>
          ))}
        </Tabs>
      );
    }

    return (
      <DynamicFormGenerator
        fields={fields}
        form={form}
        disabled={createLoading || updateLoading}
      />
    );
  };

  const renderMetadataSidebar = () => {
    if (!isEdit) return null;

    const contentId = formData?.getSingleData?.id;
    const contentKey = formData?.getSingleData?._key;
    const createdBy = formData?.getSingleData?.meta?.created_by?.first_name;
    const editedBy =
      formData?.getSingleData?.meta?.last_modified_by?.first_name;
    const status = formData?.getSingleData?.meta?.status || "draft";
    const createdAt = formData?.getSingleData?.meta?.created_at;
    const updatedAt = formData?.getSingleData?.meta?.updated_at;

    return (
      <Descriptions
        size="small"
        column={1}
        layout="vertical"
        bordered
        className="content-form-meta"
      >
        <Descriptions.Item
          label={
            <div className="content-form-meta-label">
              <div className="content-form-meta-dot content-form-meta-dot--created" />
              <Text>Created By</Text>
            </div>
          }
        >
          {createdBy ? (
            <Space size={1} direction="vertical">
              <Text strong>{createdBy}</Text>
              <Text type="secondary">
                {createdAt ? new Date(createdAt).toLocaleDateString() : "-"}
              </Text>
            </Space>
          ) : (
            "-"
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <div className="content-form-meta-label">
              <div className="content-form-meta-dot content-form-meta-dot--edited" />
              <Text>Edited By</Text>
            </div>
          }
        >
          {editedBy ? (
            <Space size={1} direction="vertical">
              <Text strong>{editedBy}</Text>
              <Text type="secondary">
                {updatedAt ? new Date(updatedAt).toLocaleDateString() : "-"}
              </Text>
            </Space>
          ) : (
            "-"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={status === "published" ? "green" : "orange"}>
            {status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Localization">
          {locales.map((locale: string) => (
            <Tag key={locale} className="console-capitalize">
              {locale}
            </Tag>
          ))}
        </Descriptions.Item>

        <Descriptions.Item label="Content ID">
          <Text code className="console-text-xs">
            {contentKey || contentId || "-"}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="Revision History">
          <Text type="secondary">No Revision History Found</Text>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <Layout className="content-form-layout">
      <Content className="content-form-layout__main">
        <div className="console-mb-md">
          {formErrors.length > 0 && (
            <div className="console-mb-md">
              {formErrors.map((error, index) => (
                <Alert
                  key={index}
                  message={error}
                  type="error"
                  showIcon
                  className="console-mb-xs"
                />
              ))}
            </div>
          )}

          <div className="content-form-toolbar">
            <Space>
              <Button
                onClick={() => {
                  setSubmitType("draft");
                  handleSaveDraft();
                }}
                icon={<Pencil size={16} strokeWidth={1.75} />}
                loading={
                  submitType === "draft" && (createLoading || updateLoading)
                }
                disabled={
                  submitType === "publish" && (createLoading || updateLoading)
                }
              >
                {isEdit ? "UPDATE DRAFT" : "SAVE AS DRAFT"}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setSubmitType("publish");
                  handleSubmit();
                }}
                icon={<CloudUpload size={16} strokeWidth={1.75} />}
                loading={
                  submitType === "publish" && (createLoading || updateLoading)
                }
                disabled={
                  submitType === "draft" && (createLoading || updateLoading)
                }
              >
                {isEdit ? "PUBLISH" : "PUBLISH"}
              </Button>
            </Space>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          validateMessages={{
            required: "${label} is required!",
            types: {
              email: "${label} is not a valid email!",
              number: "${label} is not a valid number!",
            },
          }}
        >
          <div className="console-mt-xs">{renderFormContent()}</div>
        </Form>
      </Content>

      <Sider className="content-form-layout__sider" width="25%">
        {renderMetadataSidebar()}
      </Sider>
    </Layout>
  );
};

export default EditAndCreateContentForm;
