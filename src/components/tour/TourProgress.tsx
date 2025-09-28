import React from "react";
import { Progress, Typography, Space, Button, theme } from "antd";
import { CheckCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useTour } from "../../contexts/TourContext";

const { Text } = Typography;

const TourProgress: React.FC = () => {
  const { token } = theme.useToken();
  const {
    tourProgress,
    projectStatus,
    shouldShowTour,
    isTourActive,
    startTour,
  } = useTour();

  // Don't show if tour is not needed or already completed
  if (!shouldShowTour && tourProgress.isCompleted) {
    return null;
  }

  const completedCount = tourProgress.completedSteps.length;
  const progressPercentage = (completedCount / tourProgress.totalSteps) * 100;

  const getStepStatus = () => {
    if (tourProgress.isCompleted) {
      return { text: "Setup Complete!", color: token.colorSuccess };
    }
    return {
      text: `Setup Progress: ${completedCount}/${tourProgress.totalSteps}`,
      color: token.colorPrimary,
    };
  };

  const getStepDetails = () => {
    const steps = [
      {
        key: "hasModel",
        label: "Create Model",
        completed: projectStatus.hasModel,
      },
      {
        key: "modelHasFields",
        label: "Add Fields",
        completed: projectStatus.modelHasFields,
      },
      {
        key: "modelHasContent",
        label: "Add Content",
        completed: projectStatus.modelHasContent,
      },
      {
        key: "hasRunQuery",
        label: "Test API",
        completed: projectStatus.hasRunQuery,
      },
    ];

    return steps;
  };

  const status = getStepStatus();
  const steps = getStepDetails();

  return (
    <div
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        padding: "12px 16px",
        marginBottom: "16px",
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space align="center">
            <Text strong style={{ color: status.color }}>
              {status.text}
            </Text>
            {tourProgress.isCompleted && (
              <CheckCircleOutlined style={{ color: token.colorSuccess }} />
            )}
          </Space>

          {!tourProgress.isCompleted && !isTourActive && (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={startTour}
            >
              Start Guide
            </Button>
          )}
        </div>

        <Progress
          percent={progressPercentage}
          showInfo={false}
          strokeColor={
            tourProgress.isCompleted ? token.colorSuccess : token.colorPrimary
          }
          size="small"
        />

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {steps.map((step, index) => (
            <Space key={step.key} align="center" size="small">
              <CheckCircleOutlined
                style={{
                  color: step.completed
                    ? token.colorSuccess
                    : token.colorTextTertiary,
                  fontSize: "14px",
                }}
              />
              <Text
                style={{
                  color: step.completed
                    ? token.colorText
                    : token.colorTextSecondary,
                  fontSize: "12px",
                }}
              >
                {step.label}
              </Text>
            </Space>
          ))}
        </div>
      </Space>
    </div>
  );
};

export default TourProgress;
