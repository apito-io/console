import {
  Button,
  Input,
  Form,
  Typography,
  Steps,
  Select,
  Space,
  message,
  Row,
  Col,
  Radio,
  Tooltip,
  Tag,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  DatabaseOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { httpService } from "../../services/httpService";

const { Title, Text } = Typography;
const { Option } = Select;

interface SetupData {
  // User information
  email: string;
  password: string;
  confirmPassword: string;

  // Database configuration
  databaseType: string;
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  dbPassword?: string;

  // Firebase configuration
  firebaseConfig?: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  };

  // DynamoDB configuration
  dynamoDBConfig?: {
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };

  // Storage configuration
  storageType: string;
  storageConfig?: {
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    region?: string;
    endpoint?: string;
  };
}

const WelcomePage = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [connectionError, setConnectionError] = useState<string>("");
  const [databaseType, setDatabaseType] = useState<string>("embed");
  const [storageType, setStorageType] = useState<string>("local");
  const [setupData, setSetupData] = useState<Partial<SetupData>>({
    storageType: "local", // Default storage
    databaseType: "embed", // Default database
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from localStorage on mount
    const savedData = localStorage.getItem("apito-setup-data");
    const savedStep = localStorage.getItem("apito-setup-step");

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSetupData(parsedData);
      form.setFieldsValue(parsedData);
      // Update state variables from saved data
      if (parsedData.databaseType) {
        setDatabaseType(parsedData.databaseType);
      }
      if (parsedData.storageType) {
        setStorageType(parsedData.storageType);
      }
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }

    checkJourneyStage();
  }, [form]);

  useEffect(() => {
    // Save current step to localStorage
    localStorage.setItem("apito-setup-step", currentStep.toString());
  }, [currentStep]);

  const checkJourneyStage = async () => {
    try {
      const response = await httpService.get("/journey/start");
      if (response.data.stage === "done") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error checking journey stage:", error);
    }
  };

  const saveCurrentStepData = () => {
    const currentValues = form.getFieldsValue();
    const updatedData = { ...setupData, ...currentValues };
    setSetupData(updatedData);
    localStorage.setItem("apito-setup-data", JSON.stringify(updatedData));
  };

  const nextStep = async () => {
    try {
      await form.validateFields();
      saveCurrentStepData();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const prevStep = () => {
    saveCurrentStepData();
    setCurrentStep(currentStep - 1);
  };

  const testConnection = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      setTestingConnection(true);
      setConnectionStatus("idle");
      setConnectionError("");

      const dbConfig = {
        type: values.databaseType,
        host: values.host,
        port: values.port,
        database: values.database,
        username: values.username,
        password: values.dbPassword,
      };

      const response = await httpService.post("/journey/dbTest", dbConfig);

      if (response.status === 200) {
        setConnectionStatus("success");
        setConnectionError("");
        message.success("Database connection successful!");
      }
    } catch (error: any) {
      setConnectionStatus("error");

      // Extract error message from response
      let errorMessage =
        "Database connection failed. Please check your configuration.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setConnectionError(errorMessage);
      message.error(`Connection failed: ${errorMessage}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const skipStorage = () => {
    const finalData = {
      ...setupData,
      ...form.getFieldsValue(),
      storageType: "local",
    };
    submitSetup(finalData);
  };

  const submitSetup = async (data: any) => {
    setLoading(true);
    try {
      const setupPayload = {
        user: {
          email: data.email,
          password: data.password,
        },
        database: {
          type: data.databaseType,
          host: data.host,
          port: data.port,
          database: data.database,
          username: data.username,
          password: data.dbPassword,
        },
        storage: {
          type: data.storageType,
          config: data.storageConfig || {},
        },
      };

      const response = await httpService.post("/journey/start", setupPayload);

      if (response.status === 200) {
        message.success("Setup completed successfully!");
        // Clear saved data
        localStorage.removeItem("apito-setup-data");
        localStorage.removeItem("apito-setup-step");
        navigate("/login");
      }
    } catch (error) {
      console.error("Setup error:", error);
      message.error("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const finalData = { ...setupData, ...values };

      if (finalData.password !== finalData.confirmPassword) {
        message.error("Passwords do not match!");
        return;
      }

      submitSetup(finalData);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const getDatabaseFields = () => {
    if (databaseType === "embed") {
      return null; // No additional fields for embedded database
    }

    if (databaseType === "sqlite") {
      return (
        <Form.Item
          name="database"
          label="Database Path"
          rules={[{ required: true, message: "Please input database path!" }]}
        >
          <Input
            placeholder="./database.db"
            style={{ height: "40px", borderRadius: "0" }}
          />
        </Form.Item>
      );
    }

    if (databaseType === "firebase") {
      return (
        <>
          <Form.Item
            name={["firebaseConfig", "apiKey"]}
            label="API Key"
            rules={[{ required: true, message: "API Key is required!" }]}
          >
            <Input
              placeholder="YOUR_API_KEY"
              style={{ height: "40px", borderRadius: "0" }}
            />
          </Form.Item>

          <Form.Item
            name={["firebaseConfig", "authDomain"]}
            label="Auth Domain"
            rules={[{ required: true, message: "Auth Domain is required!" }]}
          >
            <Input
              placeholder="your-project.firebaseapp.com"
              style={{ height: "40px", borderRadius: "0" }}
            />
          </Form.Item>

          <Form.Item
            name={["firebaseConfig", "databaseURL"]}
            label="Database URL"
            rules={[{ required: true, message: "Database URL is required!" }]}
          >
            <Input
              placeholder="https://your-project.firebaseio.com"
              style={{ height: "40px", borderRadius: "0" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["firebaseConfig", "projectId"]}
                label="Project ID"
                rules={[{ required: true, message: "Project ID is required!" }]}
              >
                <Input
                  placeholder="your-project-id"
                  style={{ height: "40px", borderRadius: "0" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["firebaseConfig", "storageBucket"]}
                label="Storage Bucket"
                rules={[
                  { required: true, message: "Storage Bucket is required!" },
                ]}
              >
                <Input
                  placeholder="your-project.appspot.com"
                  style={{ height: "40px", borderRadius: "0" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["firebaseConfig", "messagingSenderId"]}
                label="Messaging Sender ID"
                rules={[
                  {
                    required: true,
                    message: "Messaging Sender ID is required!",
                  },
                ]}
              >
                <Input
                  placeholder="SENDER_ID"
                  style={{ height: "40px", borderRadius: "0" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["firebaseConfig", "appId"]}
                label="App ID"
                rules={[{ required: true, message: "App ID is required!" }]}
              >
                <Input
                  placeholder="APP_ID"
                  style={{ height: "40px", borderRadius: "0" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      );
    }

    if (databaseType === "dynamodb") {
      return (
        <>
          <Form.Item
            name={["dynamoDBConfig", "region"]}
            label="Region"
            rules={[{ required: true, message: "Region is required!" }]}
          >
            <Input
              placeholder="your-region (e.g., us-east-1)"
              style={{ height: "40px", borderRadius: "0" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["dynamoDBConfig", "accessKeyId"]}
                label="Access Key ID"
                rules={[
                  { required: true, message: "Access Key ID is required!" },
                ]}
              >
                <Input
                  placeholder="YOUR_KEY"
                  style={{ height: "40px", borderRadius: "0" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["dynamoDBConfig", "secretAccessKey"]}
                label="Secret Access Key"
                rules={[
                  { required: true, message: "Secret Access Key is required!" },
                ]}
              >
                <Input.Password
                  placeholder="YOUR_SECRET"
                  style={{ height: "40px", borderRadius: "0" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      );
    }

    // For traditional SQL databases and others
    const getPortPlaceholder = () => {
      switch (databaseType) {
        case "postgresql":
          return "5432";
        case "mysql":
          return "3306";
        case "sqlServer":
          return "1433";
        case "mongodb":
          return "27017";
        default:
          return "3306";
      }
    };

    return (
      <>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="host"
              label="Host"
              rules={[{ required: true, message: "Please input host!" }]}
            >
              <Input
                placeholder="localhost"
                style={{ height: "40px", borderRadius: "0" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="port"
              label="Port"
              rules={
                databaseType !== "mongodb"
                  ? [{ required: true, message: "Port required!" }]
                  : []
              }
            >
              <Input
                placeholder={getPortPlaceholder()}
                style={{ height: "40px", borderRadius: "0" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="database"
              label="Database"
              rules={[{ required: true, message: "Database name required!" }]}
            >
              <Input
                placeholder="myapp"
                style={{ height: "40px", borderRadius: "0" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username required!" }]}
            >
              <Input
                placeholder="username"
                style={{ height: "40px", borderRadius: "0" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="dbPassword"
          label="Password"
          rules={[{ required: true, message: "Password required!" }]}
        >
          <Input.Password
            placeholder="database password"
            style={{ height: "40px", borderRadius: "0" }}
          />
        </Form.Item>
      </>
    );
  };

  const getStorageFields = () => {
    if (storageType === "local" || storageType === "apito") {
      return null;
    }

    const fields: {
      [key: string]: Array<{
        name: string;
        label: string;
        placeholder: string;
      }>;
    } = {
      s3: [
        {
          name: "accessKey",
          label: "Access Key",
          placeholder: "AWS Access Key",
        },
        {
          name: "secretKey",
          label: "Secret Key",
          placeholder: "AWS Secret Key",
        },
        { name: "bucket", label: "Bucket Name", placeholder: "my-bucket" },
        { name: "region", label: "Region", placeholder: "us-east-1" },
      ],
      "cloudflare-r2": [
        {
          name: "accessKey",
          label: "Access Key",
          placeholder: "R2 Access Key",
        },
        {
          name: "secretKey",
          label: "Secret Key",
          placeholder: "R2 Secret Key",
        },
        { name: "bucket", label: "Bucket Name", placeholder: "my-bucket" },
        {
          name: "endpoint",
          label: "Endpoint",
          placeholder: "https://account.r2.cloudflarestorage.com",
        },
      ],
      cloudinary: [
        {
          name: "accessKey",
          label: "Cloud Name",
          placeholder: "your-cloud-name",
        },
        {
          name: "secretKey",
          label: "API Secret",
          placeholder: "your-api-secret",
        },
        { name: "bucket", label: "API Key", placeholder: "your-api-key" },
      ],
    };

    return fields[storageType]?.map((field) => (
      <Form.Item
        key={field.name}
        name={["storageConfig", field.name]}
        label={field.label}
        rules={[{ required: true, message: `${field.label} is required!` }]}
      >
        <Input
          placeholder={field.placeholder}
          style={{ height: "40px", borderRadius: "0" }}
        />
      </Form.Item>
    ));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: "100%" }} size={20}>
            <Form.Item
              name="email"
              label="Admin Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#d32f2f" }} />}
                placeholder="admin@example.com"
                size="large"
                style={{ height: "48px", borderRadius: "0" }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#d32f2f" }} />}
                placeholder="Password"
                size="large"
                style={{ height: "48px", borderRadius: "0" }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: "Please confirm your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#d32f2f" }} />}
                placeholder="Confirm Password"
                size="large"
                style={{ height: "48px", borderRadius: "0" }}
              />
            </Form.Item>
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Form.Item
              name="databaseType"
              label="Database Type"
              rules={[
                { required: true, message: "Please select a database type!" },
              ]}
            >
              <Select
                size="large"
                placeholder="Select database type"
                style={{ height: "48px" }}
                onChange={(value) => {
                  setDatabaseType(value);
                  setConnectionStatus("idle"); // Reset connection status when changing database type
                  setConnectionError(""); // Reset connection error when changing database type
                }}
              >
                <Option value="embed">
                  <Space>
                    <DatabaseOutlined style={{ color: "#52c41a" }} />
                    Embedded Database
                  </Space>
                </Option>
                <Option value="sqlite">
                  <Space>
                    <Icon
                      icon="simple-icons:sqlite"
                      style={{ fontSize: "16px", color: "#003B57" }}
                    />
                    SQLite
                  </Space>
                </Option>
                <Option value="postgresql">
                  <Space>
                    <Icon
                      icon="simple-icons:postgresql"
                      style={{ fontSize: "16px", color: "#336791" }}
                    />
                    PostgreSQL
                  </Space>
                </Option>
                <Option value="mysql">
                  <Space>
                    <Icon
                      icon="simple-icons:mysql"
                      style={{ fontSize: "16px", color: "#4479A1" }}
                    />
                    MySQL
                  </Space>
                </Option>
                <Option value="mongodb">
                  <Space>
                    <Icon
                      icon="simple-icons:mongodb"
                      style={{ fontSize: "16px", color: "#47A248" }}
                    />
                    MongoDB
                  </Space>
                </Option>
                <Option value="sqlServer">
                  <Space>
                    <Icon
                      icon="simple-icons:microsoftsqlserver"
                      style={{ fontSize: "16px", color: "#CC2927" }}
                    />
                    SQL Server
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            {getDatabaseFields()}
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" style={{ width: "100%" }} size={20}>
            <Form.Item
              name="storageType"
              label="Storage Provider"
              rules={[
                { required: true, message: "Please select a storage type!" },
              ]}
            >
              <Radio.Group onChange={(e) => setStorageType(e.target.value)}>
                <Space direction="vertical" size={12}>
                  <Radio value="local">Local Storage (Default)</Radio>
                  <Radio value="s3">Amazon S3</Radio>
                  <Radio value="apito">Apito Cloud</Radio>
                  <Radio value="cloudflare-r2">Cloudflare R2</Radio>
                  <Radio value="cloudinary">Cloudinary</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            {getStorageFields()}

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>
                You can skip this step and configure storage later
              </Text>
            </div>
          </Space>
        );

      default:
        return null;
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
          maxWidth: "600px",
          background: "#ffffff",
          padding: "40px 32px",
        }}
      >
        {/* Logo and Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ marginBottom: "20px" }}>
            <img
              src="/logo.svg"
              alt="Apito Logo"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 600,
              color: "#000000",
              marginBottom: "8px",
            }}
          >
            Build Your API in Minutes
          </Title>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Set up your Apito workspace and start creating powerful APIs
            instantly
          </Text>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "40px" }}>
          <Steps
            current={currentStep}
            size="small"
            items={[
              {
                title: "User Setup",
                icon: <UserOutlined />,
              },
              {
                title: "Database",
                icon: <DatabaseOutlined />,
              },
              {
                title: "Storage",
                icon: <CloudOutlined />,
              },
            ]}
          />
        </div>

        {/* Form Content */}
        <Form form={form} layout="vertical" initialValues={setupData}>
          <div style={{ minHeight: "300px" }}>{renderStepContent()}</div>
        </Form>

        {connectionStatus === "error" && connectionError && (
          <Tag color="error">{connectionError}</Tag>
        )}

        {/* Navigation */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Space size={16}>
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                style={{
                  borderRadius: "0",
                  width: "120px",
                  height: "48px",
                }}
              >
                Back
              </Button>
            )}

            {/* Test Database Connection Button - Only show on database step for non-embed databases */}
            {currentStep === 1 && databaseType !== "embed" && (
              <div style={{ position: "relative" }}>
                <Button
                  onClick={testConnection}
                  loading={testingConnection}
                  icon={
                    connectionStatus === "success" ? (
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    ) : testingConnection ? (
                      <LoadingOutlined />
                    ) : (
                      <DatabaseOutlined />
                    )
                  }
                  style={{
                    borderRadius: "0",
                    height: "48px",
                    width: "180px",
                    borderColor:
                      connectionStatus === "success"
                        ? "#52c41a"
                        : connectionStatus === "error"
                          ? "#ff4d4f"
                          : "#d9d9d9",
                    color:
                      connectionStatus === "success"
                        ? "#52c41a"
                        : connectionStatus === "error"
                          ? "#ff4d4f"
                          : undefined,
                  }}
                  title={
                    connectionStatus === "error" && connectionError
                      ? connectionError
                      : undefined
                  }
                >
                  {testingConnection
                    ? "Testing..."
                    : connectionStatus === "success"
                      ? "Connected ✓"
                      : connectionStatus === "error"
                        ? "Connection Failed"
                        : "Test Connection"}
                </Button>
              </div>
            )}

            {currentStep < 2 && (
              <>
                {currentStep === 1 &&
                databaseType !== "embed" &&
                connectionStatus !== "success" ? (
                  <Tooltip
                    title="Please test database connection first"
                    placement="top"
                  >
                    <Button
                      type="primary"
                      disabled={true}
                      style={{
                        borderRadius: "0",
                        background: "#d9d9d9",
                        borderColor: "#d9d9d9",
                        width: "120px",
                        height: "48px",
                        cursor: "not-allowed",
                      }}
                    >
                      Next
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    type="primary"
                    onClick={nextStep}
                    style={{
                      borderRadius: "0",
                      background: "#000000",
                      borderColor: "#000000",
                      width: "120px",
                      height: "48px",
                    }}
                  >
                    Next
                  </Button>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <Button
                  onClick={skipStorage}
                  style={{
                    borderRadius: "0",
                    width: "120px",
                    height: "48px",
                  }}
                >
                  Skip
                </Button>
                <Button
                  type="primary"
                  onClick={handleFinish}
                  loading={loading}
                  style={{
                    borderRadius: "0",
                    background: "#000000",
                    borderColor: "#000000",
                    width: "150px",
                    height: "48px",
                  }}
                >
                  Start Building
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
