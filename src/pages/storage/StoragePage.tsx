import React, { useMemo } from "react";
import { Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useGetProjectStorageQuery } from "../../generated_gql/tanstack-query";
import { isProjectStorageConfigured } from "../../lib/storageConfigured";
import StorageGallery from "./StorageGallery";
import StorageSetupEmpty from "./StorageSetupEmpty";

const StoragePage: React.FC = () => {
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";

  const { data, isLoading, isFetching } = useGetProjectStorageQuery(
    { _id: projectId },
    {
      enabled: Boolean(projectId),
      refetchOnWindowFocus: true,
    }
  );

  const configured = useMemo(
    () => isProjectStorageConfigured(data?.getProject?.storage_settings),
    [data]
  );

  if (!projectId || isLoading || (isFetching && !data)) {
    return (
      <div className="console-loading-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!configured) {
    return <StorageSetupEmpty />;
  }

  return <StorageGallery />;
};

export default StoragePage;
