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
import type { ReactNode } from "react";
import { useState } from "react";
import { Link as RouterLink } from "../../router/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { httpService } from "../../services/httpService";
import { FORGET_PASSWORD } from "../../constants/api";
import { assetUrl } from "../../utils/url";
import {
  isSignupDisabled,
  isEmailSignupDisabled,
  isEmailLoginHidden,
  getLogoPath,
  getProductName,
} from "../../utils/env";
import { Eye, EyeOff, Info, Mail } from "lucide-react";
import "../../components/console/ConsoleShell.css";

const { Title, Text, Link } = Typography;

interface LoginPageContentProps {
  extraSection?: ReactNode;
}

interface LoginFormValues {
  email: string;
  secret: string;
}

const LoginPageContent = ({ extraSection }: LoginPageContentProps) => {
  const [form] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] =
    useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { handleSigninAPI, loading } = useAuth();
  const signupDisabled = isSignupDisabled();
  const emailSignupDisabled = isEmailSignupDisabled();
  const emailLoginHidden = isEmailLoginHidden();

  const handleSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      const errorMessage = await handleSigninAPI({
        email: values.email,
        secret: values.secret,
      });
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
      <div className="login-form-shell">
        <div className="login-form-header">
          <img
            src={assetUrl(getLogoPath())}
            alt={`${getProductName()} Logo`}
            className="login-logo"
          />
          <Title level={1} className="login-title">
            Welcome Back!
          </Title>
          <Text className="login-subtitle">
            {emailLoginHidden
              ? "Continue with Google or GitHub."
              : "Let's get you signed in securely."}
          </Text>
        </div>

        {loginError && (
          <Alert
            message={loginError}
            type="error"
            showIcon
            closable
            onClose={() => setLoginError(null)}
            className="login-alert-error"
          />
        )}

        {!emailLoginHidden && (
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label={<Text className="login-label">Email</Text>}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            className="console-mb-md"
          >
            <Input
              placeholder="Enter Your Email Address"
              size="large"
              onChange={() => setLoginError(null)}
              className="login-input-lg"
            />
          </Form.Item>

          <Form.Item
            name="secret"
            label={<Text className="login-label">Password</Text>}
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
            className="console-mb-sm"
          >
            <Input.Password
              placeholder="Your Password"
              size="large"
              onChange={() => setLoginError(null)}
              className="login-input-lg"
              iconRender={(visible) =>
                visible ? (
                  <Eye
                    size={16}
                    strokeWidth={1.75}
                    className="login-icon-muted"
                  />
                ) : (
                  <EyeOff
                    size={16}
                    strokeWidth={1.75}
                    className="login-icon-muted"
                  />
                )
              }
            />
          </Form.Item>

          <div className="login-forgot-row">
            <Link onClick={showForgotPasswordModal} className="login-link">
              Forgot Your Password?
            </Link>
          </div>

          <Form.Item className="login-submit-item">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="login-submit-btn console-btn-primary"
            >
              Log in with Email
            </Button>
          </Form.Item>
        </Form>
        )}

        {extraSection}

        <div className="login-footer">
          {!emailSignupDisabled && (
            <Text className="login-footer-text">
              Don't Have an Account?{" "}
              <RouterLink to="/auth/signup" className="login-footer-link">
                Sign Up
              </RouterLink>
            </Text>
          )}
          <Text className="login-footer-legal">
            By continuing, you agree to our{" "}
            <Link href="https://apito.io/terms-of-service">Terms of Service</Link>{" "}
            and <Link href="https://apito.io/privacy-policy">Privacy Policy</Link>.
          </Text>
        </div>
      </div>

      {!emailLoginHidden && (
      <Modal
        title={
          <div className="login-modal-title">
            <Title level={3} className="login-modal-title-text">
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
        className="login-recover-modal"
      >
        <div className="login-modal-body">
          <div className="login-modal-info">
            <div className="console-inline-row">
              <Info
                size={16}
                strokeWidth={1.75}
                className="login-modal-info-icon"
              />
              <div>
                <Text strong className="login-label">
                  Important Note for Legacy Users
                </Text>
                <br />
                <Text className="console-text-muted-block">
                  This password recovery is only for legacy users (the old
                  order).
                  {!signupDisabled && (
                    <>
                      {" "}
                      If your legacy email is associated with Google or
                      GitHub, you don't need to recover your password. You can
                      close this window and continue with Google or GitHub.
                    </>
                  )}
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
                <Text className="login-modal-label">Legacy Email Address</Text>
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
                prefix={
                  <Mail
                    size={16}
                    strokeWidth={1.75}
                    className="login-modal-prefix-icon"
                  />
                }
                placeholder="Enter your legacy email address"
                size="large"
                className="login-modal-input-lg"
              />
            </Form.Item>

            <Form.Item className="console-form-item-flush">
              <Space className="login-modal-actions">
                <Button
                  onClick={handleForgotPasswordCancel}
                  size="large"
                  className="login-modal-btn"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={forgotPasswordLoading}
                  size="large"
                  className="login-modal-btn-primary console-btn-primary"
                >
                  Send Recovery Email
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      )}
    </>
  );
};

export default LoginPageContent;
