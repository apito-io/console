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
import { EditOutlined, CloudUploadOutlined } from "@ant-design/icons";
import {
  useGetModelDetailsQuery,
  useGetSingleDataLazyQuery,
  useCreateModelDataMutation,
  useUpdateSingleDataMutation,
} from "../../../generated/graphql";
import DynamicFormGenerator from "../../../components/forms/DynamicFormGenerator";

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

  const modelName = contentData?.model || "";
  const contentId = contentData?.id;
  const isEdit = formType === "edit" && contentId;

  // Get form generation data (field definitions)
  const {
    data: formGenerationData,
    loading: formGenerationLoading,
    error: formGenerationError,
  } = useGetModelDetailsQuery({
    variables: {
      model_name: modelName,
    },
    skip: !modelName,
    errorPolicy: "all",
  });

  // Get existing content data for edit mode
  const [
    getFormData,
    { data: formData, loading: formDataLoading, error: formDataError },
  ] = useGetSingleDataLazyQuery({
    errorPolicy: "all",
  });

  // Create mutation hook
  const [createData, { loading: createLoading }] = useCreateModelDataMutation({
    onCompleted: (_data) => {
      message.success(`New ${modelName} created successfully!`);
      if (onContentCreated) {
        onContentCreated();
      }
    },
    onError: (error) => {
      message.error(`Failed to create ${modelName}: ${error.message}`);
    },
  });

  // Update mutation hook
  const [updateData, { loading: updateLoading }] = useUpdateSingleDataMutation({
    onCompleted: (_data) => {
      message.success(
        `${modelName} ${submitType === "draft" ? "saved as draft" : "published"} successfully!`
      );
      if (onContentEdited) {
        onContentEdited();
      }
    },
    onError: (error) => {
      message.error(`Failed to update ${modelName}: ${error.message}`);
    },
  });

  // Load existing data when editing
  useEffect(() => {
    if (isEdit && contentId) {
      getFormData({
        variables: {
          _id: contentId,
          model: modelName,
          local: activeLocale,
          revision: false,
          single_page_data: false,
        },
      });
    }
  }, [isEdit, contentId, modelName, activeLocale, getFormData]);

  // Set form initial values when data is loaded
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

      // Clear any previous errors
      setFormErrors([]);

      if (isEdit) {
        // Update existing content
        await updateData({
          variables: {
            _id: formData?.getSingleData?._key || contentId || "",
            model_name: modelName,
            local: activeLocale,
            payload: newFormData,
            status,
                         single_page_data: Boolean(contentData?.single_page_data),
          },
        });
      } else {
        // Create new content
        await createData({
          variables: {
            model_name: modelName,
            local: activeLocale,
            payload: newFormData,
            status,
          },
        });
      }
    } catch (error: any) {
      if (error.errorFields) {
        // Handle form validation errors
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



  // Loading state
  if (formGenerationLoading || (isEdit && formDataLoading)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (formGenerationError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load form structure: ${formGenerationError.message}`}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (isEdit && formDataError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load content data: ${formDataError.message}`}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  // No model info
  if (!modelInfo || !fields.length) {
    return (
      <Alert
        message="No Form Configuration"
        description={`No form fields found for model: ${modelName}`}
        type="warning"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  const renderFormContent = () => {
    if (locales.length > 1) {
      // Multi-locale form with tabs
      return (
        <Tabs activeKey={activeLocale} onChange={setActiveLocale} type="card">
          {locales.map((locale: string) => (
            <TabPane tab={locale.toUpperCase()} key={locale}>
              <DynamicFormGenerator
                fields={fields}
                form={form}
                disabled={createLoading || updateLoading}
                //parentPath={[locale]}
              />
            </TabPane>
          ))}
        </Tabs>
      );
    } else {
      // Single locale form
      return (
        <DynamicFormGenerator fields={fields} form={form} disabled={createLoading || updateLoading} />
      );
    }
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
      <Descriptions size="small" column={1} layout="vertical" bordered>
        <Descriptions.Item
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#1890ff",
                  marginRight: "8px",
                }}
              />
              <Text>Created By</Text>
            </div>
          }
          labelStyle={{ fontWeight: "700" }}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#faad14",
                  marginRight: "8px",
                }}
              />
              <Text>Edited By</Text>
            </div>
          }
          labelStyle={{ fontWeight: "700" }}
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

        <Descriptions.Item label="Status" labelStyle={{ fontWeight: "700" }}>
          <Tag color={status === "published" ? "green" : "orange"}>
            {status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label="Localization"
          labelStyle={{ fontWeight: "700" }}
        >
          {locales.map((locale: string) => (
            <Tag key={locale} style={{ textTransform: "capitalize" }}>
              {locale}
            </Tag>
          ))}
        </Descriptions.Item>

        <Descriptions.Item
          label="Content ID"
          labelStyle={{ fontWeight: "700" }}
        >
          <Text code style={{ fontSize: "12px" }}>
            {contentKey || contentId || "-"}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item
          label="Revision History"
          labelStyle={{ fontWeight: "700" }}
        >
          <Text type="secondary">No Revision History Found</Text>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <Layout style={{ minHeight: "100%", backgroundColor: "white" }}>
      <Content style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              {formErrors.map((error, index) => (
                <Alert
                  key={index}
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: "8px" }}
                />
              ))}
            </div>
          )}
          
          <div
            style={{
              display: "flex",
              alignItems: "right",
              marginBottom: "10px",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Space>
              <Button
                onClick={() => {
                  setSubmitType('draft');
                  handleSaveDraft();
                }}
                icon={<EditOutlined />}
                loading={submitType === 'draft' && (createLoading || updateLoading)}
                disabled={submitType === 'publish' && (createLoading || updateLoading)}
              >
                {isEdit ? "UPDATE DRAFT" : "SAVE AS DRAFT"}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setSubmitType('publish');
                  handleSubmit();
                }}
                icon={<CloudUploadOutlined />}
                loading={submitType === 'publish' && (createLoading || updateLoading)}
                disabled={submitType === 'draft' && (createLoading || updateLoading)}
              >
                {isEdit ? "PUBLISH" : "PUBLISH"}
              </Button>
            </Space>
          </div>
        </div>

        {/* Form */}
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
          <div style={{ marginTop: "5px" }}>{renderFormContent()}</div>
        </Form>
      </Content>

      {/* Metadata Sidebar */}
      <Sider
        style={{
          marginLeft: "25px",
          backgroundColor: "white",
        }}
        width="25%"
      >
        {renderMetadataSidebar()}
      </Sider>
    </Layout>
  );
};

export default EditAndCreateContentForm;
