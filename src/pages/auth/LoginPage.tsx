import {
  Button,
  Input,
  Form,
  Typography,
  Divider,
  Space,
  message,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import type { LoginFormData } from "../../types/auth";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#ffffff",
          padding: "48px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 600,
              color: "#000000",
            }}
          >
            Welcome Back
          </Title>
        </div>

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            label={
              <Text style={{ color: "#000000", fontWeight: 500 }}>
                Email
              </Text>
            }
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={
                <MailOutlined style={{ color: "#d32f2f" }} />
              }
              placeholder="name@example.com"
              size="large"
              style={{
                height: "48px",
                border: "1px solid #e0e0e0",
                borderRadius: "0",
                background: "#ffffff",
              }}
            />
          </Form.Item>

          <Form.Item
            name="secret"
            label={
              <Text style={{ color: "#000000", fontWeight: 500 }}>
                Password
              </Text>
            }
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "#d32f2f" }} />
              }
              placeholder="Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone twoToneColor="#d32f2f" /> : <EyeInvisibleOutlined style={{ color: "#d32f2f" }} />
              }
              style={{
                height: "48px",
                border: "1px solid #e0e0e0",
                borderRadius: "0",
                background: "#ffffff",
              }}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: "24px" }}>
            <Link
              style={{
                color: "#000000",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "0",
                fontSize: "16px",
                fontWeight: 600,
                background: "#000000",
                borderColor: "#000000",
                border: "none",
              }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Text style={{ color: "#666666", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link
              style={{
                color: "#000000",
                fontWeight: 600,
              }}
            >
              Sign up
            </Link>
          </Text>
        </div>

        <Divider style={{ margin: "24px 0", borderColor: "#e0e0e0" }}>
          <Text
            style={{
              color: "#999999",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
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
              height: "48px",
              borderRadius: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "15px",
              fontWeight: 500,
              background: "#000000",
              borderColor: "#000000",
              color: "#ffffff",
              border: "none",
            }}
          >
            <FaGoogle style={{ color: "#ffffff", fontSize: "18px" }} />
            Google
          </Button>

          <Button
            onClick={onGithubLogin}
            loading={loading}
            size="large"
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "15px",
              fontWeight: 500,
              background: "#000000",
              borderColor: "#000000",
              color: "#ffffff",
              border: "none",
            }}
          >
            <FaGithub style={{ color: "#ffffff", fontSize: "18px" }} />
            GitHub
          </Button>
        </Space>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Text
            style={{
              color: "#999999",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            By continuing, you agree to our{" "}
            <Link
              style={{
                color: "#666666",
                textDecoration: "underline",
              }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              style={{
                color: "#666666",
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
  );
};

export default LoginPage;
