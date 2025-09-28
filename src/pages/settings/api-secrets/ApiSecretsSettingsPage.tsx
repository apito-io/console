import React, { useState, useEffect } from "react";
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
  KeyOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  ApiOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useGetProjectRolesQuery,
  useGenerateProjectTokenMutation,
  useGetCurrentProjectTokensLazyQuery,
  useDeleteProjectTokenMutation,
} from "../../../generated/graphql";
import { CopyToClipboard } from "react-copy-to-clipboard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const { Text, Paragraph } = Typography;
const { Option } = Select;

const ApiSecretsSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [projectTokenList, setProjectTokenList] = useState<any[]>([]);

  // GraphQL queries and mutations
  const { data: rolesData, loading: rolesLoading } = useGetProjectRolesQuery();
  const [
    getProjectTokens,
    { loading: tokenDataLoading, data: currentProjectData },
  ] = useGetCurrentProjectTokensLazyQuery({
    fetchPolicy: "cache-and-network",
  });

  const [generateAPIKey, { loading: generateLoading }] =
    useGenerateProjectTokenMutation({
      onCompleted: () => {
        message.success("API Token generated successfully!");
        form.resetFields();
        getProjectTokens();
      },
      onError: (error) => {
        message.error(`Error generating token: ${error.message}`);
      },
    });

  const [deleteToken, { loading: deleteLoading }] =
    useDeleteProjectTokenMutation({
      onCompleted: () => {
        message.success("Token deleted successfully!");
        getProjectTokens();
      },
      onError: (error) => {
        message.error(`Error deleting token: ${error.message}`);
      },
    });

  const onFinish = (values: any) => {
    generateAPIKey({
      variables: {
        ...values,
        duration: values.duration ? values.duration.format("YYYY-MM-DD") : null,
      },
    });
  };

  const handleDeleteToken = (token: string, expire: string) => {
    deleteToken({
      variables: {
        token,
        duration: expire,
      },
    });
  };

  useEffect(() => {
    if (currentProjectData) {
      const tokenList = currentProjectData?.currentProject?.tokens ?? [];
      setProjectTokenList([...tokenList]);
    } else {
      getProjectTokens();
    }
  }, [currentProjectData, getProjectTokens]);

  // Prepare data
  const rolesObj = rolesData?.currentProject?.roles ?? {};
  const roleList = rolesObj ? Object.keys(rolesObj) : [];
  const projectSecretKey =
    currentProjectData?.currentProject?.project_secret_key;

  // API endpoints
  const graphqlEndpoint =
    import.meta.env.REACT_APP_GRAPHQL_ENDPOINT ||
    "https://api.apito.io/graphql";
  const restEndpoint =
    import.meta.env.REACT_APP_REST_API_ENDPOINT || "https://api.apito.io/rest";

  // Table columns for API tokens
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "API Token",
      dataIndex: "token",
      key: "token",
      ellipsis: true,
      render: (token: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {token ? `${token.substring(0, 20)}...` : ""}
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
            description="Are you sure you want to delete this token?"
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
    <div>

      {/* Generate New Token */}
      <Card
        title={
          <Space>
            <PlusOutlined />
            Generate New API Token
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
                extra="Give your token a descriptive name"
              >
                <Input placeholder="e.g. Mobile App Access" />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
                extra="The role determines the token's permissions"
              >
                {rolesLoading ? (
                  <Skeleton.Input active style={{ width: "100%" }} />
                ) : (
                  <Select placeholder="Select a role">
                    {roleList.map((role) => (
                      <Option key={role} value={role}>
                        {role}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

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
              Generate Token
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Project Secret Key */}
      {!tokenDataLoading && projectSecretKey && (
        <Card
          title={
            <Space>
              <KeyOutlined />
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

      {/* API Endpoints */}
      <Card
        title={
          <Space>
            <ApiOutlined />
            API Endpoints
          </Space>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>GraphQL API Endpoint:</Text>
              <Text
                code
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "block",
                  marginTop: "4px",
                  fontSize: "12px",
                }}
              >
                {graphqlEndpoint}
              </Text>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>REST API Endpoint:</Text>
              <Text
                code
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "block",
                  marginTop: "4px",
                  fontSize: "12px",
                }}
              >
                {restEndpoint}
              </Text>
            </div>
          </Col>
        </Row>
        <Alert
          message="Authentication"
          description="Use Bearer token authentication: Authorization: Bearer <your-token>"
          type="info"
          showIcon
        />
      </Card>

      {/* Available Tokens */}
      <Card
        title={
          <Space>
            <KeyOutlined />
            Available API Tokens ({projectTokenList.length})
          </Space>
        }
      >
        {tokenDataLoading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns}
            dataSource={projectTokenList}
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
                "No API tokens found. Generate your first token above.",
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ApiSecretsSettingsPage;
