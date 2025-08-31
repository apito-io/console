import {
  Button,
  Input,
  Form,
  Typography,
  Divider,
  Space,
  message,
  Modal,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import SchemaToApiIllustration from "../../components/illustrations/SchemaToApiIllustration";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { httpService } from "../../services/httpService";
import type { LoginFormData } from "../../types/auth";
import { useState } from "react";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] =
    useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const { handleSigninAPI, handleGoogleLogin, handleGithubLogin, loading } =
    useAuth();

  const handleSubmit = async (values: LoginFormData) => {
    try {
      const errorMessage = await handleSigninAPI(values);
      if (errorMessage) {
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An unexpected error occurred");
    }
  };

  const onGoogleLogin = async () => {
    try {
      await handleGoogleLogin();
    } catch (error) {
      console.error("Google login error:", error);
      message.error("Google login failed. Please try again.");
    }
  };

  const onGithubLogin = async () => {
    try {
      await handleGithubLogin();
    } catch (error) {
      console.error("GitHub login error:", error);
      message.error("GitHub login failed. Please try again.");
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
      const response = await httpService.post(
        "/auth/v2/forget/password/request",
        {
          user: { email: values.email },
        }
      );

      if (response.status === 200) {
        message.success(
          "Password recovery email sent successfully. Please check your inbox."
        );
        setIsForgotPasswordModalVisible(false);
        forgotPasswordForm.resetFields();
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send recovery email. Please try again.";
      message.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        background: "#ffffff",
        padding: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "none",
          display: "flex",
          gap: 0,
          alignItems: "stretch",
        }}
      >
        {/* Left login column */}
        <div
          style={{
            flex: "1",
            background: "#ffffff",
            padding: "0",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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

            {/* <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Text style={{ color: "#666666", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link
              style={{
                color: "#000000",
                fontWeight: 600,
              }}
            >
              Sign up with Google or Github
            </Link>
          </Text>
        </div> */}

            <Divider style={{ margin: "24px 0", borderColor: "#e5e7eb" }}>
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                OR CONTINUE WITH
              </Text>
            </Divider>

            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Button
                onClick={onGoogleLogin}
                loading={loading}
                size="large"
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontSize: "15px",
                  fontWeight: 500,
                  background: "#ffffff",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "4px" }}
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={onGithubLogin}
                loading={loading}
                size="large"
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontSize: "15px",
                  fontWeight: 500,
                  background: "#ffffff",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                <FaGithub style={{ color: "#24292e", fontSize: "18px" }} />
                Continue with GitHub
              </Button>
            </Space>

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
        </div>

        {/* Right illustration column */}
        <div
          style={{
            flex: 1,
            backgroundImage: "radial-gradient(#ebedf0 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            border: "1px solid #f0f0f0",
            padding: "32px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100vh",
          }}
        >
          <SchemaToApiIllustration />
        </div>

        {/* Forgot Password Modal */}
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
                    GitHub, you don't need to recover your password. You can
                    close this window and continue with Google or GitHub signup.
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
        {/* Close wrapper */}
      </div>
    </div>
  );
};

export default LoginPage;
