import React, { useState, useMemo } from "react";
import { Form, Input, Button, Row, Col, Space } from "antd";
import { FormInstance } from "antd";
import { httpService } from "../../services/httpService";
import { PROJECT_NAME_CHECK } from "../../constants/api";
import debounce from "lodash/debounce";

type ProjectType = "general" | "saas";

interface ProjectCreateFormProps {
  form: FormInstance;
  projectType: ProjectType;
  onProjectTypeChange: (type: ProjectType) => void;
  isValidId: boolean | null;
  onValidIdChange: (valid: boolean | null) => void;
}

const generateRandomId = (length: number): string => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const normalizeName = (value: string): string =>
  value
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .replace(/[^0-9a-zA-Z_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const makeProjectIdFromName = (name: string): string =>
  `${normalizeName(name).toLowerCase()}_${generateRandomId(5)}`;

const ProjectCreateForm: React.FC<ProjectCreateFormProps> = ({
  form,
  projectType,
  onProjectTypeChange,
  isValidId,
  onValidIdChange,
}) => {
  const debouncedCheck = useMemo(
    () =>
      debounce(async (id: string) => {
        try {
          await httpService.post(PROJECT_NAME_CHECK, { name: id, id });
          onValidIdChange(true);
        } catch {
          onValidIdChange(false);
        }
      }, 1000),
    [onValidIdChange]
  );

  const onNameChange = (value: string) => {
    if (!value) {
      form.setFieldsValue({ id: undefined });
      onValidIdChange(null);
      return;
    }
    const newId = makeProjectIdFromName(value);
    form.setFieldsValue({ id: newId });
    debouncedCheck(newId);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[
              { required: true, message: "Please enter a project name" },
              {
                min: 3,
                message: "Project name must be at least 3 characters",
              },
              {
                max: 50,
                message: "Project name must be less than 50 characters",
              },
              {
                pattern: /^[a-zA-Z0-9\s-_]+$/,
                message:
                  "Project name can only contain letters, numbers, spaces, hyphens, and underscores",
              },
            ]}
          >
            <Input
              placeholder="Enter your project name"
              size="large"
              onChange={(e) => onNameChange(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="id"
            label="Project ID (Auto-generated)"
            rules={[{ required: true, message: "Project ID is required" }]}
            hasFeedback
            validateStatus={
              isValidId === null ? "" : isValidId ? "success" : "error"
            }
            help={
              isValidId === false
                ? "This project ID is already taken. Please adjust the name."
                : undefined
            }
          >
            <Input
              readOnly
              disabled
              placeholder="Generated from project name"
            />
          </Form.Item>
        </Col>

        {/* Project Type */}
        <Col span={24}>
          <Form.Item label="Project Type" name="project_type">
            <Space>
              <Button
                type={projectType === "general" ? "primary" : "default"}
                onClick={() => onProjectTypeChange("general")}
              >
                General
              </Button>
              <Button
                type={projectType === "saas" ? "primary" : "default"}
                onClick={() => onProjectTypeChange("saas")}
              >
                SaaS
              </Button>
            </Space>
          </Form.Item>
        </Col>

        {projectType === "saas" && (
          <Col span={24}>
            <Form.Item
              name="tenant_model_name"
              label="Tenant Model Name"
              rules={[
                {
                  required: true,
                  message: "Tenant model name is required",
                },
              ]}
              extra="The base entity that represents a single tenant in your multi-tenant SaaS. For example: 'Restaurant' for a restaurant management SaaS, 'Shop' for an e-commerce platform, or 'Organization' for a business tool."
            >
              <Input placeholder="Ex. Shop, Institution, Vendor etc." />
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea
              placeholder="Describe your project..."
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ProjectCreateForm;
