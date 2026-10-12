import React, { useState } from "react";
import {
  Button,
  Typography,
  message,
  Space,
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
} from "antd";
import { Pencil, Plus, Trash2, Webhook } from "lucide-react";
import {
  useGetSettingsWebhooksQuery,
  // Add other webhook mutations as needed
} from "../../../generated_gql/tanstack-query";
import {
  ConsoleCardTitle,
  MonoTableCard,
} from "../../../components/console";

const { Text } = Typography;
const { Option } = Select;

const WebhooksSettingsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // GraphQL queries
  const { data, isLoading: loading, refetch } = useGetSettingsWebhooksQuery();

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
        <div className="console-tag-list">
          {events?.map((event, index) => (
            <span key={index} className="mono-badge">
              {event}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <span
          className={`mono-badge${active ? " mono-badge--live" : " mono-badge--danger"}`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<Pencil size={16} strokeWidth={1.75} />} size="small">
            Edit
          </Button>
          <Popconfirm
            title="Delete Webhook"
            description="Are you sure you want to delete this webhook?"
            onConfirm={() => handleDeleteWebhook(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<Trash2 size={16} strokeWidth={1.75} />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="console-page">
      <MonoTableCard
        title={
          <ConsoleCardTitle
            icon={Webhook}
            label={`Webhooks (${webhooks.length})`}
          />
        }
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} strokeWidth={1.75} />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Add Webhook
          </Button>
        }
        tableProps={{
          columns,
          dataSource: webhooks,
          rowKey: "id",
          loading,
          pagination: {
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} webhooks`,
          },
          locale: {
            emptyText:
              "No webhooks configured. Add your first webhook above.",
          },
        }}
      />

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
