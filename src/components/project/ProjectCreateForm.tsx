import React, { useEffect, useMemo } from "react";
import { Form, Input, Row, Col, Segmented, Typography } from "antd";
import { FormInstance } from "antd";
import { httpService } from "../../services/httpService";
import { PROJECT_NAME_CHECK } from "../../constants/api";
import debounce from "lodash/debounce";

export type ProjectCreateFormProjectType = "general" | "saas";

interface ProjectCreateFormProps {
  form: FormInstance;
  isValidId: boolean | null;
  onValidIdChange: (valid: boolean | null) => void;
  /** When set with onProjectTypeChange, shows General vs SaaS (pro create flow). */
  projectType?: ProjectCreateFormProjectType;
  onProjectTypeChange?: (t: ProjectCreateFormProjectType) => void;
  /** Dense create-flow layout (name/id side-by-side, shorter description). */
  compact?: boolean;
  /** Remaining slots shown next to General / SaaS. -1 = unlimited. */
  generalRemaining?: number;
  saasRemaining?: number;
  instanceMode?: boolean;
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

const { Text } = Typography;

const ProjectCreateForm: React.FC<ProjectCreateFormProps> = ({
  form,
  isValidId,
  onValidIdChange,
  projectType,
  onProjectTypeChange,
  compact = false,
  instanceMode = false,
  generalRemaining,
  saasRemaining,
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

  const watchedName = Form.useWatch("name", form);

  /** Keeps project id + availability check in sync whenever `name` changes (typing or e.g. template fill). */
  useEffect(() => {
    const value = typeof watchedName === "string" ? watchedName.trim() : "";
    if (!value) {
      form.setFieldsValue({ id: undefined });
      onValidIdChange(null);
      return;
    }
    const newId = makeProjectIdFromName(value);
    form.setFieldsValue({ id: newId });
    debouncedCheck(newId);
  }, [watchedName, debouncedCheck, form, onValidIdChange]);

  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const showProjectType =
    projectType !== undefined && onProjectTypeChange !== undefined;

  const gutter = compact ? ([8, 8] as [number, number]) : ([16, 16] as [number, number]);
  const inputSize = compact ? "middle" : "large";

  return (
    <div className={compact ? "project-create-form--compact" : undefined}>
      <Row gutter={gutter}>
        {showProjectType && (
          <Col span={24}>
            <Form.Item
              label="Project type"
              required
              style={compact ? { marginBottom: 8 } : undefined}
            >
              <Segmented
                block
                size={compact ? "middle" : "large"}
                value={projectType}
                onChange={(v) =>
                  onProjectTypeChange(v as ProjectCreateFormProjectType)
                }
                options={[
                  {
                    label:
                      generalRemaining === undefined
                        ? "General"
                        : generalRemaining < 0
                          ? "General backend, unlimited"
                          : `General backend, ${generalRemaining} remaining`,
                    value: "general",
                    disabled: generalRemaining === 0,
                  },
                  {
                    label:
                      saasRemaining === undefined
                        ? compact
                          ? "SaaS"
                          : "SaaS (multi-tenant)"
                        : saasRemaining < 0
                          ? compact
                            ? "SaaS, unlimited"
                            : "SaaS backend, unlimited"
                          : compact
                            ? `SaaS, ${saasRemaining} remaining`
                            : `SaaS backend, ${saasRemaining} remaining`,
                    value: "saas",
                    disabled: saasRemaining === 0,
                  },
                ]}
              />
              {!compact ? (
                <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                  SaaS projects are multi-tenant; you choose shared tables vs a
                  separate database per tenant in the next step.
                </Text>
              ) : null}
            </Form.Item>
          </Col>
        )}
        <Col xs={24} md={compact ? 14 : 24}>
          <Form.Item
            name="name"
            label={instanceMode ? "Instance name" : "Project Name"}
            style={compact ? { marginBottom: 8 } : undefined}
            rules={[
              {
                required: true,
                message: instanceMode
                  ? "Please enter an instance name"
                  : "Please enter a project name",
              },
              {
                min: 3,
                message: instanceMode
                  ? "Instance name must be at least 3 characters"
                  : "Project name must be at least 3 characters",
              },
              {
                max: 50,
                message: instanceMode
                  ? "Instance name must be less than 50 characters"
                  : "Project name must be less than 50 characters",
              },
              {
                pattern: /^[a-zA-Z0-9\s-_]+$/,
                message:
                  "Name can only contain letters, numbers, spaces, hyphens, and underscores",
              },
            ]}
          >
            <Input
              placeholder={
                instanceMode
                  ? "e.g. Production Apito"
                  : "Enter your project name"
              }
              size={inputSize}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={compact ? 10 : 24}>
          <Form.Item
            name="id"
            label={instanceMode ? "Instance ID" : "Project ID"}
            style={compact ? { marginBottom: instanceMode ? 0 : 8 } : undefined}
            rules={[
              {
                required: true,
                message: instanceMode
                  ? "Instance ID is required"
                  : "Project ID is required",
              },
            ]}
            hasFeedback
            validateStatus={
              isValidId === null ? "" : isValidId ? "success" : "error"
            }
            help={
              isValidId === false
                ? instanceMode
                  ? "This instance ID is already taken. Please adjust the name."
                  : "This project ID is already taken. Please adjust the name."
                : undefined
            }
          >
            <Input
              readOnly
              placeholder={
                instanceMode
                  ? "Generated from instance name"
                  : "Generated from project name"
              }
              size={inputSize}
            />
          </Form.Item>
        </Col>

        {!instanceMode ? (
          <Col span={24}>
            <Form.Item
              name="description"
              label={compact ? "Description" : "Description (Optional)"}
              style={compact ? { marginBottom: 0 } : undefined}
            >
              {compact ? (
                <Input
                  placeholder="Optional short description"
                  maxLength={200}
                  showCount
                  size={inputSize}
                />
              ) : (
                <Input.TextArea
                  placeholder="Describe your project..."
                  rows={3}
                  maxLength={200}
                  showCount
                />
              )}
            </Form.Item>
          </Col>
        ) : null}
      </Row>
    </div>
  );
};

export default ProjectCreateForm;
