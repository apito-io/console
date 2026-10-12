import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "../../router/navigation";
import { CloudUpload, Settings } from "lucide-react";
import "../../components/console/ConsoleShell.css";

const StorageSetupEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="storage-setup-shell">
      <Result
        icon={<CloudUpload size={16} strokeWidth={1.75} />}
        title="Configure storage to upload files"
        subTitle="Choose Apito free cloud storage or connect your own S3-compatible bucket in project settings before uploading files."
        extra={
          <Button
            type="primary"
            icon={<Settings size={16} strokeWidth={1.75} />}
            onClick={() => navigate("/console/settings/storage")}
          >
            Go to Storage Settings
          </Button>
        }
      />
    </div>
  );
};

export default StorageSetupEmpty;
