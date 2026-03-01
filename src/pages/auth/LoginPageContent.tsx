import {
  Button,
  Input,
  Form,
  Typography,
  Space,
  message,
  Modal,
  Alert,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { httpService } from "../../services/httpService";
import { FORGET_PASSWORD } from "../../constants/api";
import type { LoginFormData } from "../../types/auth";

const { Title, Text, Link } = Typography;

interface LoginPageContentProps {
  extraSection?: ReactNode;
}

const LoginPageContent = ({ extraSection }: LoginPageContentProps) => {
  const [form] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] =
    useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { handleSigninAPI, loading } = useAuth();

  const handleSubmit = async (values: LoginFormData) => {
    setLoginError(null);
    try {
      const errorMessage = await handleSigninAPI(values);
      if (errorMessage) {
        setLoginError(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred");
    }
  };

  const showForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(true);
  };

  const handleForgotPasswordCancel = () => {
    setIsForgotPasswordModalVisible(false);
    forgotPasswordForm.resetFields();
  };

  const handleForgotPasswordSubmit = async (values: { email: string }) => {
    try {
      setForgotPasswordLoading(true);
      const response = await httpService.post(FORGET_PASSWORD, {
        user: { email: values.email },
      });

      if (response.status === 200) {
        message.success(
          "Password recovery email sent successfully. Please check your inbox."
        );
        setIsForgotPasswordModalVisible(false);
        forgotPasswordForm.resetFields();
      }
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send recovery email. Please try again.";
      message.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <>
      <div
        style={{ width: "100%", maxWidth: "380px", padding: "40px 32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="/logo.svg"
            alt="Apito Logo"
            style={{ width: 48, height: 48, marginBottom: 20 }}
          />
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome Back!
          </Title>
          <Text
            style={{
              display: "block",
              marginTop: "8px",
              color: "#6b7280",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Let's get you signed in securely.
          </Text>
        </div>

        {loginError && (
          <Alert
            message={loginError}
            type="error"
            showIcon
            closable
            onClose={() => setLoginError(null)}
            style={{
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid #fecaca",
              backgroundColor: "#fef2f2",
            }}
          />
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label={
              <Text
                style={{
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Email
              </Text>
            }
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            style={{ marginBottom: "20px" }}
          >
            <Input
              placeholder="Enter Your Email Address"
              size="large"
              onChange={() => setLoginError(null)}
              style={{
                height: "44px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "#ffffff",
                fontSize: "16px",
                fontWeight: 400,
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            />
          </Form.Item>

          <Form.Item
            name="secret"
            label={
              <Text
                style={{
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Password
              </Text>
            }
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
            style={{ marginBottom: "12px" }}
          >
            <Input.Password
              placeholder="Your Password"
              size="large"
              onChange={() => setLoginError(null)}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#6b7280" />
                ) : (
                  <EyeInvisibleOutlined style={{ color: "#6b7280" }} />
                )
              }
              style={{
                height: "44px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "#ffffff",
                fontSize: "16px",
                fontWeight: 400,
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: "24px" }}>
            <Link
              onClick={showForgotPasswordModal}
              style={{
                color: "#3b82f6",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Forgot Your Password?
            </Link>
          </div>

          <Form.Item style={{ marginBottom: "24px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              Log in with Email
            </Button>
          </Form.Item>
        </Form>

        {extraSection}

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Text
            style={{
              color: "#9ca3af",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            Don't Have an Account?{" "}
            <Link
              href="/auth/signup"
              style={{
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign Up
            </Link>
          </Text>
          <br />
          <Text
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              lineHeight: "1.5",
              marginTop: "16px",
              display: "block",
            }}
          >
            By continuing, you agree to our{" "}
            <Link
              href="https://apito.io/terms-of-service"
              style={{
                color: "#6b7280",
                textDecoration: "underline",
              }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://apito.io/privacy-policy"
              style={{
                color: "#6b7280",
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </Link>
            .
          </Text>
        </div>
      </div>

      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ margin: 0, color: "#000000" }}>
              Recover Legacy Password
            </Title>
          </div>
        }
        open={isForgotPasswordModalVisible}
        onCancel={handleForgotPasswordCancel}
        footer={null}
        width={500}
        centered
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              background: "#f6f8fa",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #e1e4e8",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <InfoCircleOutlined
                style={{
                  color: "#0366d6",
                  fontSize: "16px",
                  marginTop: "2px",
                }}
              />
              <div>
                <Text strong style={{ color: "#24292e", fontSize: "14px" }}>
                  Important Note for Legacy Users
                </Text>
                <br />
                <Text
                  style={{
                    color: "#586069",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  This password recovery is only for legacy users (the old
                  order). If your legacy email is associated with Google or
                  GitHub, you don't need to recover your password. You can close
                  this window and continue with Google or GitHub signup.
                </Text>
              </div>
            </div>
          </div>

          <Form
            form={forgotPasswordForm}
            onFinish={handleForgotPasswordSubmit}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label={
                <Text style={{ color: "#000000", fontWeight: 500 }}>
                  Legacy Email Address
                </Text>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your legacy email!",
                },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#d32f2f" }} />}
                placeholder="Enter your legacy email address"
                size="large"
                style={{
                  height: "48px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0",
                  background: "#ffffff",
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "0" }}>
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Button
                  onClick={handleForgotPasswordCancel}
                  size="large"
                  style={{
                    height: "48px",
                    borderRadius: "0",
                    fontSize: "15px",
                    fontWeight: 500,
                    border: "1px solid #d9d9d9",
                    color: "#666666",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={forgotPasswordLoading}
                  size="large"
                  style={{
                    height: "48px",
                    borderRadius: "0",
                    fontSize: "15px",
                    fontWeight: 600,
                    background: "#000000",
                    borderColor: "#000000",
                    border: "none",
                  }}
                >
                  Send Recovery Email
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default LoginPageContent;
