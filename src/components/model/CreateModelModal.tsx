import React from "react";
import { Modal, Form, Input, Switch, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { canonicalizeModelName } from "../../utils/apitoNaming";
import { useCreateModelMutation } from "../../generated_gql/tanstack-query";
import { useTourTracking } from "../../hooks/useTourTracking";
import ModelNamePreview from "./ModelNamePreview";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import { invalidateModelQueries } from "../../lib/schemaCache";

interface CreateModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface CreateModelFormData {
  name: string;
  singleRecord: boolean;
  isCommonModel: boolean;
}

const CreateModelModal: React.FC<CreateModelModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateModelFormData>();
  const queryClient = useQueryClient();
  const { trackModelCreated } = useTourTracking();
  const { onSchemaMutationCompleted } = useConsoleExtensions();
  const { mutateAsync: createModelMutation, isPending: loading } =
    useCreateModelMutation();

  const handleSubmit = async (values: CreateModelFormData) => {
    try {
      const canonicalName = canonicalizeModelName(values.name);
      const result = await createModelMutation({
        name: canonicalName,
        single_record: values.singleRecord || false,
        is_common_model: values.isCommonModel || false,
      });

      if (result.addModelToProject) {
        message.success(`Model "${canonicalName}" created successfully`);
        await invalidateModelQueries(queryClient);
        form.resetFields();

        localStorage.removeItem("tour-waiting-for-model");
        trackModelCreated();

        onSuccess();
        await onSchemaMutationCompleted?.();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create model";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();

    if (localStorage.getItem("tour-waiting-for-model") === "true") {
      localStorage.removeItem("tour-waiting-for-model");
      sessionStorage.setItem("tour-should-restart", "true");
    }

    onCancel();
  };

  return (
    <Modal
      title="Create New Model"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
        initialValues={{ singleRecord: false, isCommonModel: false }}
      >
        <Form.Item
          name="name"
          label="Model Name"
          rules={[
            { required: true, message: "Please enter a model name" },
            { min: 2, message: "Model name must be at least 2 characters" },
            { max: 50, message: "Model name must be at most 50 characters" },
            {
              validator: async (_, value) => {
                if (!value || typeof value !== "string") return;
                try {
                  canonicalizeModelName(value);
                } catch (e) {
                  throw new Error(
                    e instanceof Error ? e.message : "Invalid model name"
                  );
                }
              },
            },
          ]}
        >
          <Input
            placeholder="e.g. food order, food_order, or foodOrder"
            autoFocus
          />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const raw = form.getFieldValue("name") as string | undefined;
            return <ModelNamePreview rawName={raw} />;
          }}
        </Form.Item>

        <Form.Item
          name="singleRecord"
          label="Single Record Model"
          valuePropName="checked"
          extra="If enabled, this model will only store a single record (useful for settings, configuration, etc.)"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="isCommonModel"
          label="Common Model"
          valuePropName="checked"
          extra="Project-wide shared rows (no tenant isolation). Use for app_config, release policies, global catalogs. Distinct from Single Record (one document vs many). Applies on SaaS and general projects."
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModelModal;
