import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useGetProjectStorageQuery } from "../../generated_gql/tanstack-query";
import { isProjectStorageConfigured } from "../../lib/storageConfigured";
import StorageGallery from "./StorageGallery";
import StorageSetupEmpty from "./StorageSetupEmpty";
const StoragePage = () => {
    const { decodeTokenData } = useAuth();
    const projectId = decodeTokenData()?.project_id ?? "";
    const { data, isLoading, isFetching } = useGetProjectStorageQuery({ _id: projectId }, {
        enabled: Boolean(projectId),
        refetchOnWindowFocus: true,
    });
    const configured = useMemo(() => isProjectStorageConfigured(data?.getProject?.storage_settings), [data]);
    if (!projectId || isLoading || (isFetching && !data)) {
        return (_jsx("div", { style: { padding: 48, textAlign: "center" }, children: _jsx(Spin, { size: "large" }) }));
    }
    if (!configured) {
        return _jsx(StorageSetupEmpty, {});
    }
    return _jsx(StorageGallery, {});
};
export default StoragePage;
