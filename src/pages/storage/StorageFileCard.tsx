import React, { useMemo, useState } from "react";
import {
  Card,
  Dropdown,
  Image,
  Modal,
  Typography,
  message,
} from "antd";
import type { MenuProps } from "antd";
import type { ProjectFile } from "../../types/projectFile";
import {
  displayFileName,
  formatBytes,
  formatRelativeTime,
  isImageFile,
} from "./storageUtils";
import {
  Copy,
  Ellipsis,
  ExternalLink,
  File,
  FileText,
  FileType,
  Trash2,
} from "lucide-react";
import "../../components/console/ConsoleShell.css";

const { Text } = Typography;

interface StorageFileCardProps {
  file: ProjectFile;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

const StorageFileCard: React.FC<StorageFileCardProps> = ({
  file,
  onDelete,
  deleting,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = isImageFile(file) && file.url && !imageFailed;

  const icon = useMemo(() => {
    if (file.file_type === "pdf") {
      return (
        <FileType size={48} strokeWidth={1.75} className="storage-file-icon-lg" />
      );
    }
    if (file.file_type === "document") {
      return (
        <FileText size={48} strokeWidth={1.75} className="storage-file-icon-lg" />
      );
    }
    return <File size={48} strokeWidth={1.75} className="storage-file-icon-lg" />;
  }, [file.file_type]);

  const copyUrl = async () => {
    if (!file.url) {
      return;
    }
    await navigator.clipboard.writeText(file.url);
    message.success("URL copied to clipboard");
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete this file?",
      content: "This removes the file from storage and the project library.",
      okText: "Delete",
      okButtonProps: { danger: true, loading: deleting },
      onOk: () => onDelete(file.id),
    });
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "copy",
      icon: <Copy size={16} strokeWidth={1.75} />,
      label: "Copy URL",
      onClick: () => {
        void copyUrl();
      },
    },
    {
      key: "open",
      icon: <ExternalLink size={16} strokeWidth={1.75} />,
      label: "Open in new tab",
      onClick: () => {
        if (file.url) {
          window.open(file.url, "_blank", "noopener,noreferrer");
        }
      },
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <Trash2 size={16} strokeWidth={1.75} />,
      label: "Delete",
      danger: true,
      onClick: confirmDelete,
    },
  ];

  return (
    <Card className="storage-file-card" styles={{ body: { padding: 0, height: "100%" } }}>
      <div className="storage-file-preview">
        {showImage ? (
          <Image
            src={file.url}
            alt={displayFileName(file)}
            preview={{ mask: "Preview" }}
            className="storage-file-preview-image"
            onError={() => setImageFailed(true)}
          />
        ) : (
          icon
        )}
      </div>
      <div className="storage-file-footer">
        <div className="storage-file-card-body">
          <Text strong ellipsis title={displayFileName(file)}>
            {displayFileName(file)}
          </Text>
          <div>
            <Text type="secondary" className="storage-file-meta">
              {formatRelativeTime(file.created_at)}
            </Text>
          </div>
          <div>
            <Text type="secondary" className="storage-file-meta">
              {formatBytes(file.size)}
            </Text>
          </div>
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Ellipsis
            size={18}
            strokeWidth={1.75}
            className="storage-file-menu-icon"
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      </div>
    </Card>
  );
};

export default StorageFileCard;
