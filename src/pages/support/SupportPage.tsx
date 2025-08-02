import React from "react";
import { Typography, Card, Button, Row, Col, Space } from "antd";
import {
  QuestionCircleOutlined,
  MessageOutlined,
  BookOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const SupportPage: React.FC = () => {
  const supportChannels = [
    {
      icon: <MailOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      title: "Email Support",
      description: "Get help via email for any queries or issues",
      action: "support@apito.io",
      link: "mailto:support@apito.io",
      buttonText: "Send Email",
    },
    {
      icon: <MessageOutlined style={{ fontSize: "24px", color: "#7289da" }} />,
      title: "Discord Community",
      description: "Join our active Discord community for real-time help",
      action: "Join Discord",
      link: "https://discord.gg/4ehRp3nk",
      buttonText: "Join Discord",
    },
    {
      icon: <BookOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      title: "Documentation",
      description: "Comprehensive guides and API documentation",
      action: "Browse Docs",
      link: "https://docs.apito.io",
      buttonText: "View Docs",
    },
    {
      icon: <GlobalOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
      title: "Website",
      description: "Visit our website for more information",
      action: "Visit Website",
      link: "https://apito.io",
      buttonText: "Visit Site",
    },
  ];

  const faqs = [
    {
      question: "How do I get started with Apito?",
      answer:
        "Start by creating your first project and follow our quick start guide in the documentation.",
    },
    {
      question: "What are the API rate limits?",
      answer:
        "Rate limits vary by plan. Free plan includes 10K API calls per month, while paid plans offer higher limits.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Currently, Apito is available as a web application. Mobile apps are in our roadmap.",
    },
    {
      question: "How do I reset my password?",
      answer:
        'Use the "Forgot Password" link on the login page or contact support for assistance.',
    },
  ];

  return (
    <div style={{ padding: "24px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <Title level={2}>Help & Support</Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          We're here to help you succeed with Apito. Choose the support option
          that works best for you.
        </Text>
      </div>

      {/* Support Channels */}
      <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
        {supportChannels.map((channel, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              style={{ height: "100%", textAlign: "center" }}
              bodyStyle={{ padding: "24px" }}
            >
              <div style={{ marginBottom: "16px" }}>{channel.icon}</div>
              <Title level={4} style={{ marginBottom: "8px" }}>
                {channel.title}
              </Title>
              <Paragraph style={{ marginBottom: "20px", minHeight: "48px" }}>
                {channel.description}
              </Paragraph>
              <Button
                type="primary"
                block
                onClick={() => window.open(channel.link, "_blank")}
              >
                {channel.buttonText}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Discord Widget */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageOutlined />
            Live Discord Community
          </div>
        }
        style={{ marginBottom: "48px" }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={12}>
            <div>
              <Title level={4}>Join Our Discord Community</Title>
              <Paragraph>
                Connect with other developers, get real-time help, and stay
                updated with the latest Apito news. Our community and support
                channels are active 24/7.
              </Paragraph>
              <Space>
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={() =>
                    window.open("https://discord.gg/4ehRp3nk", "_blank")
                  }
                >
                  Join Discord
                </Button>
                <Button
                  icon={<GlobalOutlined />}
                  onClick={() => window.open("https://docs.apito.io", "_blank")}
                >
                  View Documentation
                </Button>
              </Space>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div style={{ textAlign: "center" }}>
              <iframe
                title="discord-widget"
                src="https://discord.com/widget?id=794883412636467221&theme=dark"
                width="100%"
                height="400"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* FAQ Section */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <QuestionCircleOutlined />
            Frequently Asked Questions
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          {faqs.map((faq, index) => (
            <Col xs={24} key={index}>
              <div style={{ marginBottom: "24px" }}>
                <Title level={5} style={{ marginBottom: "8px" }}>
                  {faq.question}
                </Title>
                <Text type="secondary">{faq.answer}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Contact Information */}
      <Card
        title="Still Need Help?"
        style={{ marginTop: "24px", textAlign: "center" }}
      >
        <Paragraph>
          If you couldn't find what you're looking for, don't hesitate to reach
          out directly:
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={() => window.open("mailto:support@apito.io", "_blank")}
          >
            Email Support
          </Button>
          <Button
            icon={<MessageOutlined />}
            onClick={() => window.open("https://discord.gg/4ehRp3nk", "_blank")}
          >
            Discord Chat
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default SupportPage;
