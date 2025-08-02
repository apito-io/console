import React, { useState } from "react";
import { Modal, Form, Input, Switch, message } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_MODEL } from "../../graphql/mutations/models";
import { useGetOnlyModelsInfoQuery } from "../../generated/graphql";

interface CreateModelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface CreateModelFormData {
  name: string;
  singleRecord: boolean;
}

const CreateModelModal: React.FC<CreateModelModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateModelFormData>();
  const [loading, setLoading] = useState(false);

  const [createModelMutation] = useMutation(CREATE_MODEL);
  const { refetch: refetchModels } = useGetOnlyModelsInfoQuery();

  const handleSubmit = async (values: CreateModelFormData) => {
    setLoading(true);
    try {
      const result = await createModelMutation({
        variables: {
          name: values.name,
          single_record: values.singleRecord || false,
        },
      });

      if (result.data?.addModelToProject) {
        message.success(`Model "${values.name}" created successfully`);
        await refetchModels();
        form.resetFields();
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create model";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
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
      >
        <Form.Item
          name="name"
          label="Model Name"
          rules={[
            { required: true, message: "Please enter a model name" },
            { min: 2, message: "Model name must be at least 2 characters" },
            { max: 50, message: "Model name must be at most 50 characters" },
            {
              pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
              message: "Model name must start with a letter and contain only letters, numbers, and underscores",
            },
          ]}
        >
          <Input
            placeholder="Enter model name (e.g., User, Product, Article)"
            autoFocus
          />
        </Form.Item>

        <Form.Item
          name="singleRecord"
          label="Single Record Model"
          valuePropName="checked"
          extra="If enabled, this model will only store a single record (useful for settings, configuration, etc.)"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModelModal; 