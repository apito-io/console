import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Typography,
  Card,
  message,
  Skeleton,
  Avatar,
  Tag,
  Dropdown,
  Space,
  Row,
  Col,
  Checkbox,
  // Popconfirm // Removed unused import
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  TeamOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useGetProjectRolesQuery,
  useGetSettingsTeamsMembersQuery,
  useUpdateSettingTeamsMutation,
  useSearchUsersLazyQuery,
  useGetPermissionsAndScopesQuery,
} from "../../../generated/graphql";


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TeamsSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [_fetching, setFetching] = useState(false);
  const [_searchResults, setSearchResults] = useState<any[]>([]);

  // GraphQL queries and mutations
  const { data: rolesData, loading: rolesLoading } = useGetProjectRolesQuery();
  const { data: roleScopeData, loading: roleScopeLoading } =
    useGetPermissionsAndScopesQuery();
  const {
    data: teamMembersData,
    loading: teamMembersLoading,
    refetch: refetchTeamMembers,
  } = useGetSettingsTeamsMembersQuery();

  const [updateTeams, { loading: updateLoading }] =
    useUpdateSettingTeamsMutation({
      onCompleted: () => {
        message.success("Team member updated successfully!");
        form.resetFields();
        setSearchResults([]);
        refetchTeamMembers();
      },
      onError: (error) => {
        message.error(`Error: ${error.message}`);
      },
    });

  const [_searchUsers] = useSearchUsersLazyQuery({
    onCompleted: (data) => {
      setSearchResults(data?.searchUsers || []);
      setFetching(false);
    },
    onError: (error) => {
      message.error(`Search error: ${error.message}`);
      setFetching(false);
    },
  });



  const onFinish = (values: any) => {
    updateTeams({
      variables: {
        add_team_member: {
          ...values,
        },
      },
    });
  };

  const removeMember = async (memberId: string) => {
    try {
      await updateTeams({
        variables: {
          remove_team_member: { member_id: memberId },
        },
      });
      message.success("Team member removed successfully!");
    } catch (error) {
      message.error("Failed to remove team member");
    }
  };

  // Prepare data
  const rolesList = rolesData?.currentProject?.roles
    ? Object.keys(rolesData.currentProject.roles)
    : [];
  const permissions =
    roleScopeData?.listPermissionsAndScopes?.permissions || [];
  const teamMembers = teamMembersData?.teamMembers || [];

  // Table columns for team members
  const columns = [
    {
      title: "Member",
      dataIndex: "email",
      key: "email",
      render: (email: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{email}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.first_name} {record.last_name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "project_assigned_role",
      key: "role",
      render: (role: string) => (
        <Tag color="blue" style={{ textTransform: "capitalize" }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "project_access_permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <div>
          {permissions?.map((permission, index) => (
            <Tag key={index} color="green" style={{ marginBottom: "4px" }}>
              {permission}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "remove",
                label: "Remove Member",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => removeMember(record.id),
              },
            ],
          }}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title
          level={3}
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TeamOutlined />
          Teams
        </Title>
        <Paragraph type="secondary">
          Invite team members to collaborate on your project and manage their
          roles and permissions
        </Paragraph>
      </div>

      {/* Add Team Member Form */}
      <Card
        title={
          <Space>
            <PlusOutlined />
            Add Team Member
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
                name="email"
                label="Team Member's Email"
                rules={[
                  { required: true, message: "Please enter user email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Enter team member's email" />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                {rolesLoading ? (
                  <Skeleton.Input active style={{ width: "100%" }} />
                ) : (
                  <Select placeholder="Select a role">
                    {rolesList.map((role) => (
                      <Option key={role} value={role}>
                        {role}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col xs={24} lg={16}>
              {roleScopeLoading ? (
                <Skeleton active />
              ) : permissions.length > 0 ? (
                <Form.Item
                  name="administrative_permissions"
                  label="Administrative Permissions"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one permission!",
                    },
                  ]}
                >
                  <Checkbox.Group>
                    <Row gutter={[16, 8]}>
                      {permissions.map((permission) => (
                        <Col key={permission} xs={24} sm={12} md={8}>
                          <Checkbox value={permission}>{permission}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              ) : null}
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              icon={<PlusOutlined />}
            >
              Add Team Member
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Existing Team Members */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            Existing Team Members ({teamMembers.length})
          </Space>
        }
      >
        {teamMembersLoading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns}
            dataSource={teamMembers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} team members`,
            }}
            locale={{
              emptyText:
                "No team members found. Add your first team member above.",
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default TeamsSettingsPage;
