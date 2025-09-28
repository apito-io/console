import React from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Typography,
  Card,
  message,
  Skeleton,
  Tag,
  Space,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Alert,
} from "antd";
import {
  CloudSyncOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { useProjectList } from "../../hooks/useProjectList";
import { useSyncToken } from "../../hooks/useSyncToken";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const { Text, Paragraph } = Typography;
const { Option } = Select;

const SyncPage: React.FC = () => {
  const [form] = Form.useForm();

  // Use custom hooks for state management
  const { data: projectData, isLoading: projectLoading } = useProjectList();
  const {
    syncTokens,
    projectSecretKey,
    isLoading: tokenDataLoading,
    isCreating: generateLoading,
    isDeleting: deleteLoading,
    createSyncToken,
    deleteSyncToken,
  } = useSyncToken();

  const onFinish = async (values: any) => {
    const payload = {
      name: values.name,
      duration: values.duration ? values.duration.format("YYYY-MM-DD") : null,
      project_ids: values.projectIds,
      scopes: values.scopes,
    };

    const success = await createSyncToken(payload);
    if (success) {
      form.resetFields();
    }
  };

  const handleDeleteToken = async (token: string, expire: string) => {
    const payload = {
      token,
      duration: expire,
    };

    await deleteSyncToken(payload);
  };

  // Prepare data - ensure unique projects to prevent duplicates
  const projectsListData = projectData?.body
    ? projectData.body.filter(
        (project, index, self) =>
          index === self.findIndex((p) => p.id === project.id)
      )
    : [];

  // Available scopes for sync tokens
  const availableScopes = [
    { value: "system_api_read", label: "System API Read" },
    { value: "system_api_write", label: "System API Write" },
    { value: "plugin_read", label: "Plugin Read" },
    { value: "plugin_write", label: "Plugin Write" },
    { value: "sync_read", label: "Sync Read" },
    { value: "sync_write", label: "Sync Write" },
  ];

  // Table columns for sync tokens
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Projects",
      dataIndex: "project_ids",
      key: "project_ids",
      width: 200,
      render: (project_ids: string[]) => (
        <div>
          {project_ids?.map((id, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: "4px" }}>
              {id}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Scopes",
      dataIndex: "scopes",
      key: "scopes",
      width: 200,
      render: (scopes: string[]) => (
        <div>
          {scopes?.map((scope, index) => (
            <Tag key={index} color="green" style={{ marginBottom: "4px" }}>
              {scope}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Sync Token",
      dataIndex: "token",
      key: "token",
      ellipsis: true,
      render: (token: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {token ? `${token.substring(0, 50)}...` : ""}
        </Text>
      ),
    },
    {
      title: "Expires",
      dataIndex: "expire",
      key: "expire",
      width: 150,
      render: (expire: string) => {
        if (!expire) return <Text type="secondary">Never</Text>;
        const isExpired = dayjs(expire).isBefore(new Date());
        const timeRemaining = dayjs
          .duration(dayjs(expire).diff(new Date()))
          .humanize(true);

        return (
          <Tag color={isExpired ? "red" : "green"}>
            {isExpired ? "Expired" : timeRemaining}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <CopyToClipboard
            text={record.token}
            onCopy={() => message.success("Token copied to clipboard!")}
          >
            <Tooltip title="Copy Token">
              <Button type="text" icon={<CopyOutlined />} size="small" />
            </Tooltip>
          </CopyToClipboard>
          <Popconfirm
            title="Delete Token"
            description="Are you sure you want to delete this sync token?"
            onConfirm={() => handleDeleteToken(record.token, record.expire)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Token">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
                loading={deleteLoading}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", margin: "0 auto" }}>
      {/* Generate New Sync Token */}
      <Card
        title={
          <Space>
            <PlusOutlined />
            Generate New Sync Token
          </Space>
        }
        style={{ marginBottom: "24px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Form.Item
                name="name"
                label="Token Name"
                rules={[
                  { required: true, message: "Please enter a token name!" },
                ]}
                extra="Give your cli token a descriptive name"
              >
                <Input placeholder="e.g. CLI Development Token" />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item
                name="projectIds"
                label="Projects"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one project!",
                  },
                ]}
                extra="Select the projects this token can access"
              >
                {projectLoading ? (
                  <Skeleton.Input active style={{ width: "100%" }} />
                ) : (
                  <Select
                    mode="multiple"
                    placeholder="Select projects"
                    style={{ width: "100%" }}
                  >
                    {projectsListData.map((project: any) => (
                      <Option key={project.id} value={project.id}>
                        {project.name} ({project.id})
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item
                name="scopes"
                label="Scopes"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one scope!",
                  },
                ]}
                extra="Select the permissions for this token"
              >
                <Select
                  mode="multiple"
                  placeholder="Select scopes"
                  style={{ width: "100%" }}
                >
                  {availableScopes.map((scope) => (
                    <Option key={scope.value} value={scope.value}>
                      {scope.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Form.Item
                name="duration"
                label="Token Duration"
                extra="Leave empty for never-expiring token"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  placeholder="Select expiration date"
                  disabledDate={(current) =>
                    current && current < dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={generateLoading}
              icon={<PlusOutlined />}
            >
              Generate CLI Token
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Project Secret Key */}
      {!tokenDataLoading && projectSecretKey && (
        <Card
          title={
            <Space>
              <CloudSyncOutlined />
              Project Secret Key
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Alert
            message="Project Secret Key"
            description={
              <div>
                <Paragraph>
                  This is your project's unique secret key. Keep it secure and
                  never expose it in client-side code.
                </Paragraph>
                <CopyToClipboard
                  text={projectSecretKey}
                  onCopy={() =>
                    message.success("Secret key copied to clipboard!")
                  }
                >
                  <Button icon={<CopyOutlined />} type="primary" ghost>
                    Copy Secret Key
                  </Button>
                </CopyToClipboard>
              </div>
            }
            type="info"
            style={{ marginBottom: "16px" }}
          />
          <Text
            code
            style={{
              backgroundColor: "#f5f5f5",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "block",
              fontSize: "12px",
            }}
          >
            {projectSecretKey}
          </Text>
        </Card>
      )}

      {/* Available CLI Tokens */}
      <Card
        title={
          <Space>
            <CloudSyncOutlined />
            Available CLI Tokens ({syncTokens.length})
          </Space>
        }
      >
        {tokenDataLoading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns}
            dataSource={syncTokens}
            rowKey="token"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} tokens`,
            }}
            locale={{
              emptyText:
                "No CLI tokens found. Generate your first token above.",
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default SyncPage;
