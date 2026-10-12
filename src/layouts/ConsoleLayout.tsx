import React, { useState, useEffect, useReducer } from "react";
import { Layout } from "antd";
import { useLocation, useNavigate, useParams } from "../router/navigation";
import {
  useGetOnlyModelsInfoQuery,
  type ModelType,
} from "../generated_gql/tanstack-query";
import { useModelDocumentCountsQuery } from "../hooks/useModelDocumentCounts";
import ConsoleTopBar from "../components/console/ConsoleTopBar";
import ConsoleSidebar from "../components/console/ConsoleSidebar";
import ConsoleMainOutlet from "../components/console/ConsoleMainOutlet";
import MobileMenuButton from "../components/mobile/MobileMenuButton";
import MobileNavDrawer from "../components/mobile/MobileNavDrawer";
import { useMobileShellNav } from "../components/mobile/useMobileShellNav";
import { ContentContext, ContentReducer } from "../contexts/ContentContext";
import { ConsoleRouteProvider } from "../contexts/ConsoleRouteContext";
import { useConsoleExtensions } from "../contexts/ConsoleExtensionsContext";
import CreateModelModal from "../components/model/CreateModelModal";
import { TourProvider } from "../contexts/TourContext";
import Tour from "../components/tour/Tour";
import "../components/console/ConsoleShell.css";

const { Content } = Layout;

interface Model {
  id: string;
  name: string;
  fields: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
  overlayKind?: "live" | "added" | "modified" | "removed";
  previousName?: string;
}

const ConsoleLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const {
    sidebarHeaderExtra,
    modelMenuDecorator,
    insideTourProvider,
    settingsSidebarItems = [],
    schemaDraftOverlay,
    onSchemaMutationCompleted,
    consoleTopBarExtra,
    extraPrimaryNavItems = [],
    filterSidebarModels,
    topBarTrailing,
    showHelpSupport,
  } = useConsoleExtensions();

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isCreateModelModalVisible, setIsCreateModelModalVisible] =
    useState(false);
  const [contentState, contentDispatch] = useReducer(ContentReducer, {
    target: "",
  });

  const currentPath =
    location.pathname.replace("/console/", "").split("/")[0] || "content";

  const { data, isLoading: loading, error, refetch } = useGetOnlyModelsInfoQuery();

  const models: Model[] = React.useMemo(() => {
    if (
      currentPath === "model" &&
      schemaDraftOverlay?.hasDraft &&
      schemaDraftOverlay.models.length > 0
    ) {
      return schemaDraftOverlay.models.map((model, index) => ({
        id: (index + 1).toString(),
        name: model.name,
        fields: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        overlayKind: model.overlayMeta.kind,
        previousName: model.overlayMeta.previousName,
      }));
    }

    if (!data?.projectModelsInfo) {
      return [];
    }

    const filtered = data.projectModelsInfo.filter(
      (model: ModelType | null) =>
        model && !model.system_generated && model.name,
    );

    return filtered.map((model: ModelType | null, index: number) => ({
      id: (index + 1).toString(),
      name: model?.name || `Model ${index + 1}`,
      fields: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }, [data, currentPath, schemaDraftOverlay]);

  const contentModels = React.useMemo(() => {
    if (filterSidebarModels) {
      return filterSidebarModels(models, "content");
    }
    return models;
  }, [models, filterSidebarModels]);

  const modelModels = React.useMemo(() => {
    if (filterSidebarModels) {
      return filterSidebarModels(models, "model");
    }
    return models;
  }, [models, filterSidebarModels]);

  const visibleModelNames = React.useMemo(
    () => modelModels.map((model) => model.name).filter(Boolean),
    [modelModels],
  );

  const { data: modelCountsData } = useModelDocumentCountsQuery(
    { models: visibleModelNames },
    {
      enabled: visibleModelNames.length > 0,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );

  const documentCountByModel = React.useMemo(() => {
    const counts = new Map<string, number>();
    modelCountsData?.modelDocumentCounts?.forEach((item) => {
      if (item?.model) {
        counts.set(item.model, item.count ?? 0);
      }
    });
    return counts;
  }, [modelCountsData]);

  useEffect(() => {
    if (params.model) {
      setSelectedModel(params.model);
      return;
    }

    if (models.length === 0) {
      return;
    }

    const modelsForRedirect =
      currentPath === "content" ? contentModels : models;
    if (modelsForRedirect.length === 0) {
      return;
    }

    const firstModel = modelsForRedirect[0].name;
    setSelectedModel(firstModel);

    const modelData =
      schemaDraftOverlay?.getModelOverlay(firstModel) ??
      data?.projectModelsInfo?.find(
        (model) => model?.name?.toLowerCase() === firstModel.toLowerCase(),
      );

    if (modelData) {
      contentDispatch({
        type: "SET_TARGET",
        payload: {
          target: modelData.name || firstModel,
          single_page: modelData.single_page || false,
          single_page_uuid: modelData.single_page_uuid || "",
          has_connections: modelData.has_connections || false,
          enable_revision: modelData.enable_revision || false,
        },
      });
    }

    if (currentPath === "model" && location.pathname === "/console/model") {
      navigate(`/console/model/${firstModel}`, { replace: true });
    } else if (
      currentPath === "content" &&
      location.pathname === "/console/content" &&
      contentModels.length > 0
    ) {
      navigate(`/console/content/${contentModels[0].name}`, { replace: true });
    }
  }, [
    params.model,
    models,
    contentModels,
    currentPath,
    location.pathname,
    navigate,
    data,
    contentDispatch,
    schemaDraftOverlay,
  ]);

  const handleModelClick = (
    modelName: string,
    section: "content" | "model" = currentPath === "content" ? "content" : "model",
  ) => {
    setSelectedModel(modelName);

    const overlayModel = schemaDraftOverlay?.getModelOverlay(modelName);
    const modelData =
      overlayModel ??
      data?.projectModelsInfo?.find(
        (model) => model?.name?.toLowerCase() === modelName.toLowerCase(),
      );

    if (modelData) {
      contentDispatch({
        type: "SET_TARGET",
        payload: {
          target: modelData.name || modelName,
          single_page: modelData.single_page || false,
          single_page_uuid: modelData.single_page_uuid || "",
          has_connections: modelData.has_connections || false,
          enable_revision: modelData.enable_revision || false,
        },
      });
    }

    if (section === "content") {
      navigate(`/console/content/${modelName}`);
    } else {
      navigate(`/console/model/${modelName}`);
    }
  };

  const handleModelUpdated = async () => {
    await refetch();
    await onSchemaMutationCompleted?.();
  };

  const { compact, navOpen, setNavOpen } = useMobileShellNav();

  const sidebar = (
    <ConsoleSidebar
      contentModels={contentModels}
      modelModels={modelModels}
      loading={loading}
      error={error}
      selectedModel={selectedModel}
      documentCountByModel={documentCountByModel}
      sidebarHeaderExtra={sidebarHeaderExtra}
      modelMenuDecorator={modelMenuDecorator}
      schemaDraftOverlay={schemaDraftOverlay}
      settingsSidebarItems={settingsSidebarItems}
      extraPrimaryNavItems={extraPrimaryNavItems}
      showHelpSupport={showHelpSupport}
      onModelClick={handleModelClick}
      onCreateModel={() => setIsCreateModelModalVisible(true)}
      onModelUpdated={handleModelUpdated}
    />
  );

  return (
    <TourProvider>
      {insideTourProvider}
      <ContentContext.Provider
        value={{
          state: contentState,
          dispatch: contentDispatch,
        }}
      >
        <div
          className={
            compact ? "console-shell console-shell--compact" : "console-shell"
          }
        >
          {compact ? (
            <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
              {sidebar}
            </MobileNavDrawer>
          ) : (
            sidebar
          )}

          <div className="console-main">
            <ConsoleTopBar
              selectedModel={selectedModel}
              leading={
                compact ? (
                  <MobileMenuButton onClick={() => setNavOpen(true)} />
                ) : undefined
              }
              trailing={topBarTrailing}
            />
            {consoleTopBarExtra}

            <div className="console-route-outlet">
              <Content className="console-content">
                <ConsoleRouteProvider
                  selectedModel={selectedModel}
                  models={models}
                  contentState={contentState}
                >
                  <ConsoleMainOutlet />
                </ConsoleRouteProvider>
              </Content>
            </div>
          </div>

          <CreateModelModal
            visible={isCreateModelModalVisible}
            onCancel={() => setIsCreateModelModalVisible(false)}
            onSuccess={async () => {
              setIsCreateModelModalVisible(false);
              await handleModelUpdated();
            }}
          />

          <Tour />
        </div>
      </ContentContext.Provider>
    </TourProvider>
  );
};

export default ConsoleLayout;
