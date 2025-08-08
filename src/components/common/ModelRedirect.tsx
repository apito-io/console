// React import removed as it's not used in this file
import { Navigate } from "react-router-dom";
import { useGetOnlyModelsInfoQuery } from "../../generated/graphql";
import { Spin } from "antd";

interface ModelRedirectProps {
  basePath: "content" | "model";
}

const ModelRedirect = ({ basePath }: ModelRedirectProps) => {
  const { data, loading, error } = useGetOnlyModelsInfoQuery({
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data?.projectModelsInfo) {
    return <Navigate to="/console" replace />;
  }

  // Find first non-system model
  const firstModel = data.projectModelsInfo
    .filter((model) => model && !model.system_generated && model.name)
    .find((model) => model?.name);

  if (!firstModel?.name) {
    return <Navigate to="/console" replace />;
  }

  const modelName = firstModel.name;
  return <Navigate to={`/console/${basePath}/${modelName}`} replace />;
};

export default ModelRedirect;
