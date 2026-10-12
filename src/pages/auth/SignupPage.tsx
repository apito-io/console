import { Alert, Button, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link as RouterLink, Navigate } from "../../router/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { assetUrl } from "../../utils/url";
import { isEmailSignupDisabled, getLogoPath, getProductName } from "../../utils/env";
import LoginLayout from "./LoginLayout";
import { useRedirectIfAuthenticated } from "./useRedirectIfAuthenticated";
import "../../components/console/ConsoleShell.css";

const { Title, Text, Link } = Typography;

interface SignupFormValues {
  email: string;
  password: string;
  confirmSecret: string;
}

const SignupPage = () => {
  useRedirectIfAuthenticated();
  const [form] = Form.useForm<SignupFormValues>();
  const [signupError, setSignupError] = useState<string | null>(null);
  const { handleSignupAPI, loading } = useAuth();
  if (isEmailSignupDisabled()) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleSubmit = async (values: SignupFormValues) => {
    setSignupError(null);
    try {
      const errorMessage = await handleSignupAPI({
        email: values.email,
        password: values.password,
        confirmSecret: values.confirmSecret,
      });
      if (errorMessage) {
        setSignupError(errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("An unexpected error occurred");
    }
  };

  return (
    <LoginLayout>
      <div className="login-form-shell">
        <div className="login-form-header">
          <img
            src={assetUrl(getLogoPath())}
            alt={`${getProductName()} Logo`}
            className="login-logo"
          />
          <Title level={1} className="login-title">
            Create your account
          </Title>
          <Text className="login-subtitle">
            Sign up with email to start building on {getProductName()}.
          </Text>
        </div>

        {signupError ? (
          <Alert
            message={signupError}
            type="error"
            showIcon
            closable
            onClose={() => setSignupError(null)}
            className="login-alert-error"
          />
        ) : null}

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
              onChange={() => setSignupError(null)}
              className="login-input-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text className="login-label">Password</Text>}
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
            className="console-mb-md"
          >
            <Input.Password
              placeholder="Your Password"
              size="large"
              onChange={() => setSignupError(null)}
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

          <Form.Item
            name="confirmSecret"
            label={<Text className="login-label">Confirm password</Text>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match!"),
                  );
                },
              }),
            ]}
            className="console-mb-sm"
          >
            <Input.Password
              placeholder="Confirm Your Password"
              size="large"
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

          <Form.Item className="login-submit-item">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="login-submit-btn console-btn-primary"
            >
              Create account
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text className="login-footer-text">
            Already have an account?{" "}
            <RouterLink to="/auth/login" className="login-footer-link">
              Log in
            </RouterLink>
          </Text>
          <Text className="login-footer-legal">
            By continuing, you agree to our{" "}
            <Link href="https://apito.io/terms-of-service">Terms of Service</Link>{" "}
            and <Link href="https://apito.io/privacy-policy">Privacy Policy</Link>
            .
          </Text>
        </div>
      </div>
    </LoginLayout>
  );
};

export default SignupPage;
