import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Typography } from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface DeleteConfirmModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  handleModelConfirm?: () => void;
  loader: boolean;
  confirmText?: string;
  title?: string;
  description?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isVisible,
  setIsVisible,
  handleModelConfirm,
  loader,
  confirmText = "DELETE",
  title = "Are You Sure?",
  description = "Write DELETE in the box to confirm!",
}) => {
  const [inpStr, setInpStr] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (inpStr) {
      errorCheck();
    }
  }, [inpStr]);

  const errorCheck = () => {
    if (inpStr !== confirmText) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const hideModal = () => {
    setInpStr("");
    setError(false);
    setIsVisible(false);
  };

  const onDelete = () => {
    if (inpStr === confirmText) {
      handleModelConfirm?.();
    } else {
      errorCheck();
    }
  };

  const ModalFooter = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "0 8px",
      }}
    >
      <Button
        icon={loader ? <LoadingOutlined spin /> : undefined}
        onClick={() => {
          return !loader ? onDelete() : null;
        }}
        type="primary"
        danger
      >
        YES DO IT
      </Button>
      <Button onClick={hideModal}>CANCEL</Button>
    </div>
  );

  return (
    <Modal
      title={
        <span style={{ textAlign: "center" }}>
          <ExclamationCircleOutlined /> {title}
        </span>
      }
      open={isVisible}
      onCancel={hideModal}
      footer={<ModalFooter />}
    >
      <div>
        <Text>
          {description} <b>{confirmText}</b> in the box to confirm!
        </Text>
        <Input
          style={{ margin: "5px 0" }}
          value={inpStr}
          allowClear={true}
          onChange={(e) => setInpStr(e.target.value)}
        />
        {error && inpStr !== "" ? (
          <Text type="danger">
            You need to type '{confirmText}' in the box to delete
          </Text>
        ) : null}
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal; 