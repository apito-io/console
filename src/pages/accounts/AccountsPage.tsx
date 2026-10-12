import React, { useEffect } from "react";
import { Button, Form, Input, Typography, message, Skeleton } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { isSuperAdminFromToken } from "../../utils/superAdmin";
import { Lock, User, ShieldCheck } from "lucide-react";
import {
  useUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "./queries";
import {
  ConsoleCard,
  ConsoleCardTitle,
} from "../../components/console";
import "../../components/console/ConsoleShell.css";

const { Text } = Typography;

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  project_limit?: number;
}

interface PasswordChange {
  old_password: string;
  new_password: string;
  confirm: string;
}

const AccountsPage: React.FC = () => {
  const { decodeTokenData } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const profileQuery = useUserProfileQuery();
  const updateProfileM = useUpdateProfileMutation();
  const changePasswordM = useChangePasswordMutation();

  const tokenData = decodeTokenData();

  useEffect(() => {
    if (profileQuery.data) {
      profileForm.setFieldsValue(profileQuery.data);
    }
  }, [profileQuery.data, profileForm]);

  const updateProfile = async (values: UserProfile) => {
    await updateProfileM.mutateAsync(values as unknown as Record<string, unknown>);
  };

  const changePassword = async (values: PasswordChange) => {
    await changePasswordM.mutateAsync({
      old_password: values.old_password,
      new_password: values.new_password,
    });
    passwordForm.resetFields();
  };

  useEffect(() => {
    if (profileQuery.isError) {
      message.error("Failed to fetch profile data");
    }
  }, [profileQuery.isError]);

  const profileLoading = profileQuery.isPending || profileQuery.isLoading;

  return (
    <div className="console-page">
      <div className="console-stack">
        <ConsoleCard
          title={
            <ConsoleCardTitle icon={User} label="Profile Information" />
          }
          extra={
            <Button
              type="primary"
              onClick={() => profileForm.submit()}
              loading={updateProfileM.isPending}
            >
              Update Profile
            </Button>
          }
        >
          {profileLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={updateProfile}
              initialValues={profileQuery.data || {}}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input disabled placeholder="your@email.com" />
              </Form.Item>

              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="Your first name" />
              </Form.Item>

              <Form.Item name="last_name" label="Last Name">
                <Input placeholder="Your last name" />
              </Form.Item>

              {(profileQuery.data as UserProfile | undefined)?.project_limit ? (
                <Form.Item name="project_limit" label="Project Limit">
                  <Input
                    disabled
                    value={(profileQuery.data as UserProfile).project_limit}
                  />
                </Form.Item>
              ) : null}
            </Form>
          )}
        </ConsoleCard>

        <ConsoleCard
          title={<ConsoleCardTitle icon={Lock} label="Change Password" />}
          extra={
            <Button
              type="primary"
              onClick={() => passwordForm.submit()}
              loading={changePasswordM.isPending}
            >
              Change Password
            </Button>
          }
        >
          <Form form={passwordForm} layout="vertical" onFinish={changePassword}>
            <Form.Item
              name="old_password"
              label="Current Password"
              rules={[
                { required: true, message: "Current password is required" },
              ]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item
              name="new_password"
              label="New Password"
              rules={[
                { required: true, message: "New password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm New Password"
              dependencies={["new_password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>
          </Form>
        </ConsoleCard>

        {tokenData ? (
          <ConsoleCard
            title={
              <ConsoleCardTitle icon={ShieldCheck} label="Current Session" />
            }
          >
            <div className="console-stack console-stack--md">
              <Text>
                <strong>Email:</strong> {tokenData.email}
              </Text>
              <Text>
                <strong>Project Role:</strong> {tokenData.project_role}
              </Text>
              <Text>
                <strong>Current Project:</strong> {tokenData.project_id}
              </Text>
              <Text>
                <strong>Is Super Admin:</strong>{" "}
                {isSuperAdminFromToken(tokenData) ? "Yes" : "No"}
              </Text>
            </div>
          </ConsoleCard>
        ) : null}
      </div>
    </div>
  );
};

export default AccountsPage;
