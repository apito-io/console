import React, { useState } from "react";
import {
  Button,
  Table,
  Typography,
  Card,
  message,
  Skeleton,
  Space,
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
  Tag,
} from "antd";
import {
  ApiOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  useGetSettingsWebhooksQuery,
  // Add other webhook mutations as needed
} from "../../../generated/graphql";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WebhooksSettingsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // GraphQL queries
  const { data, loading, refetch } = useGetSettingsWebhooksQuery();

  const handleAddWebhook = (_values: any) => {
    // TODO: Implement webhook creation
    message.success("Webhook created successfully!");
    form.resetFields();
    setIsDrawerOpen(false);
    refetch();
  };

  const handleDeleteWebhook = (_id: string) => {
    // TODO: Implement webhook deletion
    message.success("Webhook deleted successfully!");
    refetch();
  };

  const webhooks = data?.listWebHooks || [];

  // Table columns for webhooks
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      ellipsis: true,
      render: (url: string) => <Text code>{url}</Text>,
    },
    {
      title: "Events",
      dataIndex: "events",
      key: "events",
      render: (events: string[]) => (
        <div>
          {events?.map((event, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: "4px" }}>
              {event}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Popconfirm
            title="Delete Webhook"
            description="Are you sure you want to delete this webhook?"
            onConfirm={() => handleDeleteWebhook(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Webhooks Table */}
      <Card
        title={
          <Space>
            <ApiOutlined />
            Webhooks ({webhooks.length})
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Add Webhook
          </Button>
        }
      >
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns}
            dataSource={webhooks}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} webhooks`,
            }}
            locale={{
              emptyText:
                "No webhooks configured. Add your first webhook above.",
            }}
          />
        )}
      </Card>

      {/* Add Webhook Drawer */}
      <Drawer
        title="Add Webhook"
        width={440}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddWebhook}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Webhook Name"
            rules={[
              { required: true, message: "Please enter a webhook name!" },
            ]}
          >
            <Input placeholder="e.g. User Registration Hook" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Webhook URL"
            rules={[
              { required: true, message: "Please enter webhook URL!" },
              { type: "url", message: "Please enter a valid URL!" },
            ]}
          >
            <Input placeholder="https://example.com/webhook" />
          </Form.Item>

          <Form.Item
            name="events"
            label="Events"
            rules={[
              { required: true, message: "Please select at least one event!" },
            ]}
          >
            <Select mode="multiple" placeholder="Select events to listen for">
              <Option value="create">Create</Option>
              <Option value="update">Update</Option>
              <Option value="delete">Delete</Option>
              <Option value="user.created">User Created</Option>
              <Option value="user.updated">User Updated</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="active"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Webhook
              </Button>
              <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default WebhooksSettingsPage;
