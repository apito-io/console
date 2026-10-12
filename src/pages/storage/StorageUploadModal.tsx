import React, { useCallback, useState } from "react";
import {
  Modal,
  Upload,
  Select,
  List,
  Progress,
  Typography,
  message,
} from "antd";
import type { UploadFile } from "antd";
import { useUploadProjectFileMutation } from "../../hooks/useProjectFiles";
import { formatBytes, UPLOAD_FILE_TYPE_OPTIONS } from "./storageUtils";
import { Inbox } from "lucide-react";
import "../../components/console/ConsoleShell.css";

const { Dragger } = Upload;
const { Text } = Typography;

interface StorageUploadModalProps {
  open: boolean;
  onClose: () => void;
  defaultFileType?: string;
}

type UploadStatus = "pending" | "uploading" | "done" | "error";

interface QueueItem {
  uid: string;
  file: File;
  status: UploadStatus;
  error?: string;
}

const StorageUploadModal: React.FC<StorageUploadModalProps> = ({
  open,
  onClose,
  defaultFileType = "media",
}) => {
  const [fileType, setFileType] = useState(defaultFileType);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadProjectFileMutation();

  const reset = useCallback(() => {
    setQueue([]);
    setUploading(false);
    setFileType(defaultFileType);
  }, [defaultFileType]);

  const handleClose = () => {
    if (uploading) {
      return;
    }
    reset();
    onClose();
  };

  const handleFilesSelected = (fileList: UploadFile[]) => {
    const next: QueueItem[] = fileList
      .map((item) => item.originFileObj)
      .filter((file): file is File => file instanceof File)
      .map((file) => ({
        uid: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        status: "pending" as const,
      }));
    setQueue(next);
    return false;
  };

  const runUploads = async () => {
    if (queue.length === 0) {
      message.warning("Select at least one file");
      return;
    }
    setUploading(true);
    let successCount = 0;

    for (const item of queue) {
      setQueue((prev) =>
        prev.map((row) =>
          row.uid === item.uid ? { ...row, status: "uploading", error: undefined } : row
        )
      );
      try {
        await uploadFile({ file: item.file, fileType: fileType || undefined });
        successCount += 1;
        setQueue((prev) =>
          prev.map((row) =>
            row.uid === item.uid ? { ...row, status: "done" } : row
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setQueue((prev) =>
          prev.map((row) =>
            row.uid === item.uid ? { ...row, status: "error", error: msg } : row
          )
        );
      }
    }

    setUploading(false);
    if (successCount > 0) {
      message.success(
        successCount === 1
          ? "Uploaded 1 file"
          : `Uploaded ${successCount} files`
      );
    }
    if (successCount === queue.length) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      title="Upload files"
      open={open}
      onCancel={handleClose}
      onOk={() => void runUploads()}
      okText={uploading ? "Uploading..." : "Upload"}
      confirmLoading={uploading}
      destroyOnClose
      width={640}
    >
      <div className="storage-upload-modal-section">
        <Text type="secondary">Default file type</Text>
        <Select
          className="storage-upload-modal-full"
          value={fileType}
          options={UPLOAD_FILE_TYPE_OPTIONS.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          onChange={setFileType}
          disabled={uploading}
        />
      </div>

      <Dragger
        multiple
        beforeUpload={() => false}
        onChange={(info) => handleFilesSelected(info.fileList)}
        showUploadList={false}
        disabled={uploading}
      >
        <p className="ant-upload-drag-icon">
          <Inbox size={16} strokeWidth={1.75} />
        </p>
        <p className="ant-upload-text">Click or drag files here to upload</p>
        <p className="ant-upload-hint">
          Files are stored in your project bucket via /secured/files/upload
        </p>
      </Dragger>

      {queue.length > 0 && (
        <List
          className="storage-upload-modal-stack"
          size="small"
          dataSource={queue}
          renderItem={(item) => (
            <List.Item>
              <div className="storage-upload-file-row">
                <div className="storage-upload-file-meta">
                  <Text ellipsis className="storage-upload-file-name">
                    {item.file.name}
                  </Text>
                  <Text type="secondary">{formatBytes(item.file.size)}</Text>
                </div>
                {item.status === "uploading" && (
                  <Progress percent={70} status="active" showInfo={false} />
                )}
                {item.status === "done" && (
                  <Progress percent={100} status="success" showInfo={false} />
                )}
                {item.status === "error" && (
                  <Text type="danger" className="storage-upload-error">
                    {item.error}
                  </Text>
                )}
              </div>
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default StorageUploadModal;
