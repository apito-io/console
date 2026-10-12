import { Navigate } from "../../router/navigation";
import { useGetOnlyModelsInfoQuery } from "../../generated_gql/tanstack-query";
import { Spin } from "antd";

interface ModelRedirectProps {
  basePath: "content" | "model";
}

const ModelRedirect = ({ basePath }: ModelRedirectProps) => {
  const { data, isLoading: loading, error } = useGetOnlyModelsInfoQuery(
    undefined,
    { staleTime: 0 }
  );

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
