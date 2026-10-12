import React from "react";
import { Typography } from "antd";
import { Plus } from "lucide-react";
import "../../components/console/ConsoleShell.css";

const { Text } = Typography;

interface StorageUploadCardProps {
  onClick: () => void;
}

const StorageUploadCard: React.FC<StorageUploadCardProps> = ({ onClick }) => {
  return (
    <button type="button" className="storage-upload-card" onClick={onClick}>
      <div className="storage-upload-card-inner">
        <div className="storage-upload-card-icon">
          <Plus size={24} strokeWidth={1.75} />
        </div>
        <Text strong>Upload new file</Text>
      </div>
    </button>
  );
};

export default StorageUploadCard;
