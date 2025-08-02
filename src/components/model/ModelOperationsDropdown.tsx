import React, { useState } from "react";
import { Dropdown, Button, Modal, Form, Input, message } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useLazyQuery } from "@apollo/client";
import { UPDATE_MODEL } from "../../graphql/mutations/models";
import { GET_MODEL_DETAILS } from "../../graphql/queries/models";
import type { MenuProps } from "antd";
import { UpdateModelTypeEnum } from "../../generated/graphql";

interface ModelOperationsDropdownProps {
  modelName: string;
  onModelUpdated: () => void;
}

interface RenameFormData {
  newName: string;
}

interface DuplicateFormData {
  sourceModel: string;
  duplicateName: string;
}

interface DeleteConfirmData {
  confirmText: string;
}

const ModelOperationsDropdown: React.FC<ModelOperationsDropdownProps> = ({
  modelName,
  onModelUpdated,
}) => {
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [renameForm] = Form.useForm<RenameFormData>();
  const [duplicateForm] = Form.useForm<DuplicateFormData>();
  const [deleteForm] = Form.useForm<DeleteConfirmData>();

  const [updateModelMutation] = useMutation(UPDATE_MODEL);

  const [getModelDetails] = useLazyQuery(GET_MODEL_DETAILS);

  const handleRename = async (values: RenameFormData) => {
    setLoading(true);
    try {
      const result = await updateModelMutation({
        variables: {
          model_name: modelName,
          type: UpdateModelTypeEnum.Rename,
          new_name: values.newName,
        },
      });

      if (result.data?.updateModel) {
        message.success(
          `Model "${modelName}" renamed to "${values.newName}" successfully`
        );
        setIsRenameModalVisible(false);
        renameForm.resetFields();
        onModelUpdated();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to rename model";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (_values: DeleteConfirmData) => {
    setLoading(true);
    try {
      const result = await updateModelMutation({
        variables: {
          model_name: modelName,
          type: UpdateModelTypeEnum.Delete,
        },
      });

      if (result.data?.updateModel) {
        message.success(`Model "${modelName}" deleted successfully`);
        setIsDeleteModalVisible(false);
        deleteForm.resetFields();
        onModelUpdated();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete model";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDuplicateSubmit = async (values: DuplicateFormData) => {
    setLoading(true);
    try {
      const { data: modelDetailsData } = await getModelDetails({
        variables: { model_name: modelName },
      });

      const modelInfo = modelDetailsData?.projectModelsInfo?.[0];
      if (!modelInfo) {
        throw new Error("Could not fetch model details");
      }

      const result = await updateModelMutation({
        variables: {
          model_name: values.sourceModel,
          single_page_model: modelInfo.single_page || false,
          new_name: values.duplicateName,
          type: UpdateModelTypeEnum.Duplicate,
        },
      });

      if (result.data?.updateModel) {
        message.success(
          `Model "${modelName}" duplicated as "${values.duplicateName}" successfully`
        );
        setIsDuplicateModalVisible(false);
        duplicateForm.resetFields();
        onModelUpdated();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to duplicate model";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = () => {
    setIsDuplicateModalVisible(true);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "rename",
      label: "Rename",
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent?.stopPropagation();
        setIsRenameModalVisible(true);
      },
    },
    {
      key: "duplicate",
      label: "Duplicate",
      icon: <CopyOutlined />,
      onClick: (e) => {
        e.domEvent?.stopPropagation();
        handleDuplicate();
      },
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent?.stopPropagation();
        handleDelete();
      },
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          type="text"
          icon={<MoreOutlined />}
          size="small"
          style={{
            border: "none",
            boxShadow: "none",
            padding: "4px",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>

      {/* Rename Modal */}
      <Modal
        title={`Rename Model: ${modelName}`}
        open={isRenameModalVisible}
        onCancel={() => {
          setIsRenameModalVisible(false);
          renameForm.resetFields();
        }}
        onOk={() => renameForm.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={renameForm}
          layout="vertical"
          onFinish={handleRename}
          preserve={false}
          initialValues={{ newName: modelName }}
        >
          <Form.Item
            name="newName"
            label="New Model Name"
            rules={[
              { required: true, message: "Please enter a new model name" },
              { min: 2, message: "Model name must be at least 2 characters" },
              { max: 50, message: "Model name must be at most 50 characters" },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message:
                  "Model name must start with a letter and contain only letters, numbers, and underscores",
              },
            ]}
          >
            <Input placeholder="Enter new model name" autoFocus />
          </Form.Item>
        </Form>
      </Modal>

      {/* Duplicate Model Modal */}
      <Modal
        title={`Duplicate Model: ${modelName}`}
        open={isDuplicateModalVisible}
        onCancel={() => {
          setIsDuplicateModalVisible(false);
          duplicateForm.resetFields();
        }}
        onOk={() => duplicateForm.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={duplicateForm}
          layout="vertical"
          onFinish={handleDuplicateSubmit}
          preserve={false}
          initialValues={{
            sourceModel: modelName,
            duplicateName: `${modelName}_copy`,
          }}
        >
          <Form.Item name="sourceModel" label="Source Model">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="duplicateName"
            label="Duplicate Model Name"
            rules={[
              {
                required: true,
                message: "Please enter a duplicate model name",
              },
              { min: 2, message: "Model name must be at least 2 characters" },
              { max: 50, message: "Model name must be at most 50 characters" },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message:
                  "Model name must start with a letter and contain only letters, numbers, and underscores",
              },
            ]}
          >
            <Input placeholder="Enter duplicate model name" autoFocus />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Model"
        open={isDeleteModalVisible}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          deleteForm.resetFields();
        }}
        onOk={() => deleteForm.submit()}
        confirmLoading={loading}
        okType="danger"
        okText="Delete"
        destroyOnClose
      >
        <Form
          form={deleteForm}
          layout="vertical"
          onFinish={handleDeleteSubmit}
          preserve={false}
        >
          <p>
            Are you sure you want to delete the model{" "}
            <strong>"{modelName}"</strong>?
          </p>
          <p
            style={{ color: "#ff4d4f", fontSize: "14px", marginBottom: "16px" }}
          >
            This action cannot be undone and will permanently delete all data
            associated with this model.
          </p>

          <Form.Item
            name="confirmText"
            label={`Type "DELETE" to confirm deletion`}
            rules={[
              { required: true, message: "Please type DELETE to confirm" },
              {
                validator: (_, value) =>
                  value === "DELETE"
                    ? Promise.resolve()
                    : Promise.reject(new Error("You must type DELETE exactly")),
              },
            ]}
          >
            <Input placeholder="Type DELETE to confirm" autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModelOperationsDropdown;
