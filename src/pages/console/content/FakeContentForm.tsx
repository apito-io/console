import React, { useState } from "react";
import { CirclePlay, Square } from "lucide-react";
import {
  Form,
  Button,
  InputNumber,
  Space,
  message,
  Typography,
  Alert,
  Divider,
  List,
  Tag,
} from "antd";
import ConsoleCard from "../../../components/console/ConsoleCard";
import "../../../components/console/ConsoleShell.css";

const { Title, Text } = Typography;

interface FakeContentFormProps {
  contentData?: {
    model: string;
    [key: string]: unknown;
  };
  onContentCreated?: (data: Record<string, unknown>[]) => void;
}

const FakeContentForm: React.FC<FakeContentFormProps> = ({
  contentData,
  onContentCreated,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<Record<string, unknown>[]>(
    []
  );

  const modelName = contentData?.model || "";

  const generateFakeData = (count: number): Record<string, unknown>[] => {
    const fakeData: Record<string, unknown>[] = [];

    for (let i = 1; i <= count; i++) {
      let record: Record<string, unknown>;

      switch (modelName.toLowerCase()) {
        case "institute":
          record = {
            id: `inst_${Date.now()}_${i}`,
            name: `Sample Institute ${i}`,
            email: `institute${i}@example.com`,
            phone: `+123456789${i}`,
            address: `Address for Institute ${i}`,
            established_year: 1990 + Math.floor(Math.random() * 30),
            status: Math.random() > 0.5 ? "Active" : "Inactive",
            is_verified: Math.random() > 0.3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          break;

        case "student": {
          const firstNames = [
            "John",
            "Jane",
            "Alice",
            "Bob",
            "Charlie",
            "Diana",
            "Eve",
            "Frank",
          ];
          const lastNames = [
            "Smith",
            "Johnson",
            "Williams",
            "Brown",
            "Jones",
            "Garcia",
            "Miller",
          ];
          const grades = ["A", "B", "C", "D", "F"];

          record = {
            id: `std_${Date.now()}_${i}`,
            first_name:
              firstNames[Math.floor(Math.random() * firstNames.length)],
            last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
            email: `student${i}@example.com`,
            phone: `+123456789${i}`,
            date_of_birth: new Date(
              1990 + Math.floor(Math.random() * 15),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28)
            )
              .toISOString()
              .split("T")[0],
            grade: grades[Math.floor(Math.random() * grades.length)],
            is_active: Math.random() > 0.2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          break;
        }

        case "teacher": {
          const teacherFirstNames = [
            "Michael",
            "Sarah",
            "David",
            "Emma",
            "James",
            "Lisa",
            "Robert",
          ];
          const teacherLastNames = [
            "Anderson",
            "Thompson",
            "Wilson",
            "Davis",
            "Martinez",
            "Taylor",
          ];
          const subjects = [
            "Mathematics",
            "Science",
            "English",
            "History",
            "Physics",
            "Chemistry",
            "Biology",
          ];

          record = {
            id: `tch_${Date.now()}_${i}`,
            first_name:
              teacherFirstNames[
                Math.floor(Math.random() * teacherFirstNames.length)
              ],
            last_name:
              teacherLastNames[
                Math.floor(Math.random() * teacherLastNames.length)
              ],
            email: `teacher${i}@example.com`,
            phone: `+123456789${i}`,
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            experience_years: 1 + Math.floor(Math.random() * 25),
            is_active: Math.random() > 0.1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          break;
        }

        default:
          record = {
            id: `item_${Date.now()}_${i}`,
            name: `Sample ${modelName} ${i}`,
            description: `This is a sample description for ${modelName} ${i}`,
            status: Math.random() > 0.5 ? "Active" : "Inactive",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
      }

      fakeData.push(record);
    }

    return fakeData;
  };

  const handleGenerate = async (values: { count: number }) => {
    if (!values.count || values.count <= 0) {
      message.error("Please enter a valid count");
      return;
    }

    if (values.count > 100) {
      message.error("Maximum 100 records allowed at once");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fakeRecords = generateFakeData(values.count);
      setGeneratedData(fakeRecords);

      message.success(`Generated ${values.count} fake ${modelName} records!`);
      onContentCreated?.(fakeRecords);
    } catch {
      message.error("Failed to generate fake data");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setGeneratedData([]);
    form.resetFields();
  };

  return (
    <div className="console-pad-md">
      <ConsoleCard>
        <div className="console-mb-lg">
          <Title level={4} className="console-title-flush">
            Generate Fake Data for {modelName}
          </Title>
          <Text type="secondary">
            Create sample data for testing and development purposes
          </Text>
        </div>

        <Alert
          message="Fake Data Generator"
          description={`This tool will generate realistic fake data for your ${modelName} model. The data is randomly generated and can be used for testing purposes.`}
          type="info"
          showIcon
          className="console-mb-lg"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerate}
          initialValues={{ count: 10 }}
        >
          <Form.Item
            name="count"
            label="Number of Records"
            rules={[
              { required: true, message: "Please enter the number of records" },
              {
                type: "number",
                min: 1,
                max: 100,
                message: "Please enter a number between 1 and 100",
              },
            ]}
          >
            <InputNumber
              className="console-w-input-sm"
              placeholder="Enter count"
              min={1}
              max={100}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item className="console-mb-0">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<CirclePlay size={16} strokeWidth={1.75} />}
              >
                Generate Fake Data
              </Button>

              {generatedData.length > 0 && (
                <Button
                  htmlType="button"
                  onClick={handleClear}
                  disabled={loading}
                  icon={<Square size={16} strokeWidth={1.75} />}
                >
                  Clear Data
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>

        {generatedData.length > 0 && (
          <>
            <Divider />

            <div className="console-mb-md">
              <Title level={5}>
                Generated Records ({generatedData.length})
              </Title>
              <Text type="secondary">Preview of the generated fake data</Text>
            </div>

            <List
              dataSource={generatedData.slice(0, 5)}
              renderItem={(item, index) => (
                <List.Item>
                  <div className="console-w-full">
                    <div className="console-flex-between-start">
                      <div>
                        <Text strong>Record #{index + 1}</Text>
                        <div className="console-mt-xs">
                          {Object.entries(item)
                            .filter(
                              ([key]) =>
                                !["id", "created_at", "updated_at"].includes(
                                  key
                                )
                            )
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <Tag key={key} className="console-mb-xs">
                                {key}: {String(value)}
                              </Tag>
                            ))}
                        </div>
                      </div>
                      <Text type="secondary" className="console-text-xs">
                        ID: {String(item.id)}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />

            {generatedData.length > 5 && (
              <Text type="secondary" className="console-font-italic">
                ... and {generatedData.length - 5} more records
              </Text>
            )}
          </>
        )}
      </ConsoleCard>
    </div>
  );
};

export default FakeContentForm;
