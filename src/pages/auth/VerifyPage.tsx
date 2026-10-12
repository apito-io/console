import { Alert, Button, Form, Input, Typography } from "antd";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "../../router/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { assetUrl } from "../../utils/url";
import { isEmailSignupDisabled, getLogoPath, getProductName } from "../../utils/env";
import LoginLayout from "./LoginLayout";
import "../../components/console/ConsoleShell.css";

const { Title, Text } = Typography;

interface VerifyFormValues {
  email: string;
  code: string;
}

const VerifyPage = () => {
  const storedEmail =
    typeof window !== "undefined"
      ? window.localStorage.getItem("verifyEmail") || ""
      : "";
  const [form] = Form.useForm<VerifyFormValues>();
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const { handleEmailVerifyAPI, loading } = useAuth();

  const initialValues = useMemo(
    () => ({
      email: storedEmail,
      code: "",
    }),
    [storedEmail],
  );

  const handleSubmit = async (values: VerifyFormValues) => {
    setVerifyError(null);
    try {
      const errorMessage = await handleEmailVerifyAPI({
        email: values.email,
        code: values.code,
      });
      if (errorMessage) {
        setVerifyError(errorMessage);
      }
    } catch (error) {
      console.error("Verify error:", error);
      setVerifyError("An unexpected error occurred");
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
            Verify your email
          </Title>
          <Text className="login-subtitle">
            Enter the code we sent to your inbox to finish signing up.
          </Text>
        </div>

        {verifyError ? (
          <Alert
            message={verifyError}
            type="error"
            showIcon
            closable
            onClose={() => setVerifyError(null)}
            className="login-alert-error"
          />
        ) : null}

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          initialValues={initialValues}
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
              onChange={() => setVerifyError(null)}
              className="login-input-lg"
            />
          </Form.Item>

          <Form.Item
            name="code"
            label={<Text className="login-label">Verification code</Text>}
            rules={[
              { required: true, message: "Please input your verification code!" },
            ]}
            className="console-mb-sm"
          >
            <Input
              placeholder="Enter the code from your email"
              size="large"
              onChange={() => setVerifyError(null)}
              className="login-input-lg"
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
              Verify email
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text className="login-footer-text">
            {isEmailSignupDisabled() ? null : (
              <>
                Wrong email?{" "}
                <RouterLink to="/auth/signup" className="login-footer-link">
                  Sign up again
                </RouterLink>
                {" · "}
              </>
            )}
            <RouterLink to="/auth/login" className="login-footer-link">
              Log in
            </RouterLink>
          </Text>
        </div>
      </div>
    </LoginLayout>
  );
};

export default VerifyPage;
