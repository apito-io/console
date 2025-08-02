import React, { useState, useEffect } from "react";
import { Button, Form, Input, Typography, Card, message, Skeleton } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { httpService } from "../../services/httpService";
import { USER_PROFILE, CHANGE_PASSWORD } from "../../constants/api";

const { Title, Text } = Typography;

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

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);

  const tokenData = decodeTokenData();

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      setProfileLoading(true);
      const response = await httpService.get(USER_PROFILE);
      const userData = response.data?.body || {};
      setProfileData(userData);
      profileForm.setFieldsValue(userData);
    } catch (error) {
      message.error("Failed to fetch profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (values: UserProfile) => {
    try {
      setProfileUpdateLoading(true);
      const response = await httpService.post(USER_PROFILE, values);
      message.success(response.data?.message || "Profile updated successfully");
      setProfileData(response.data?.body || values);
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  // Change password
  const changePassword = async (values: PasswordChange) => {
    try {
      setPasswordUpdateLoading(true);
      const response = await httpService.post(CHANGE_PASSWORD, {
        old_password: values.old_password,
        new_password: values.new_password,
      });
      message.success(
        response.data?.message || "Password changed successfully"
      );
      passwordForm.resetFields();
    } catch (error) {
      message.error("Failed to change password");
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div style={{ padding: "0px 24px", margin: "0 auto" }}>
      {/* Profile Settings */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserOutlined />
            Profile Information
          </div>
        }
        style={{ marginTop: "24px" }}
        extra={
          <Button
            type="primary"
            onClick={() => profileForm.submit()}
            loading={profileUpdateLoading}
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
            initialValues={profileData || {}}
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

            {profileData?.project_limit && (
              <Form.Item name="project_limit" label="Project Limit">
                <Input disabled value={profileData.project_limit} />
              </Form.Item>
            )}
          </Form>
        )}
      </Card>

      {/* Password Settings */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LockOutlined />
            Change Password
          </div>
        }
        style={{ marginTop: "24px" }}
        extra={
          <Button
            type="primary"
            onClick={() => passwordForm.submit()}
            loading={passwordUpdateLoading}
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
      </Card>

      {/* User Info Display */}
      {tokenData && (
        <Card title="Current Session" style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
              {tokenData.is_super_admin === "true" ? "Yes" : "No"}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccountsPage;
