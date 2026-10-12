import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Button,
  Drawer,
  Dropdown,
  Empty,
  message,
  Typography,
  Space,
} from "antd";
import { useNavigate } from "../../../router/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMultipleDataQuery,
  useGetModelDetailsQuery,
  useDeleteModelDataMutation,
  useDuplicateModelDataMutation,
} from "../../../generated_gql/tanstack-query";
import { useContentContext } from "../../../contexts/ContentContext";
import type { MenuProps } from "antd";
import EditAndCreateContentForm from "./EditAndCreateContentForm";
import FakeContentForm from "./FakeContentForm";
import TableGenerator from "../../../components/common/TableGenerator";
import TagRelationForm from "./TagRelationForm";
import { invalidateContentQueries } from "../../../lib/schemaCache";
import ConsolePageHeader from "../../../components/console/ConsolePageHeader";
import ConsoleCard from "../../../components/console/ConsoleCard";
import "../../../components/console/ConsoleShell.css";
import { CirclePlus, Tags } from "lucide-react";

const { Title, Text } = Typography;

const DEFAULT_PAGE_SIZE = 50;

interface ContentsProps {
  modelName: string;
  fetchNewSelectedRowKeys?: (keys: React.Key[]) => void;
  loadingTag?: boolean;
}

interface ContentRecord {
  id: string;
  [key: string]: unknown;
}

const Contents: React.FC<ContentsProps> = ({
  modelName,
  fetchNewSelectedRowKeys,
  loadingTag,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state: contentState } = useContentContext();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>("");
  const [drawerComponent, setDrawerComponent] = useState<React.ReactNode>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [relationDrawerVisible, setRelationDrawerVisible] = useState(false);
  const [relationRecord, setRelationRecord] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const refreshContentQueries = useCallback(async () => {
    await invalidateContentQueries(queryClient);
  }, [queryClient]);

  const { mutateAsync: deleteModelData } = useDeleteModelDataMutation({
    onSuccess: async () => {
      message.success("Content deleted successfully!");
      await refreshContentQueries();
    },
    onError: (error) => {
      message.error(
        `Failed to delete content: ${
          error instanceof Error ? error.message : "Delete failed"
        }`
      );
    },
  });

  const { mutateAsync: duplicateModelData } = useDuplicateModelDataMutation({
    onSuccess: async () => {
      message.success("Content duplicated successfully!");
      await refreshContentQueries();
    },
    onError: (error) => {
      message.error(
        `Failed to duplicate content: ${
          error instanceof Error ? error.message : "Duplicate failed"
        }`
      );
    },
  });

  // Use the selected model from ContentContext or props
  const currentModel = contentState.target || modelName;

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [currentModel]);

  // Check if this is a single page model
  const isSinglePageModel =
    contentState.single_page || !!contentState.single_page_uuid;

  // Fetch model details to check for connections
  const { data: modelDetailsData } = useGetModelDetailsQuery(
    { model_name: currentModel },
    { enabled: Boolean(currentModel) }
  );

  const {
    data: contentData,
    isLoading: loading,
    error,
    refetch,
  } = useGetMultipleDataQuery(
    {
      model: currentModel,
      limit: pageSize,
      page,
    },
    { enabled: Boolean(currentModel) && !isSinglePageModel }
  );

  const total = contentData?.getModelData?.count ?? 0;

  // Transform GraphQL data to table format
  const tableData = useMemo(() => {
    if (!contentData?.getModelData?.results) return [];

    return contentData.getModelData.results
      .filter((item) => item && item.id)
      .map((item) => ({
        id: item!.id!,
        ...item!.data,
        meta: item!.meta,
      }));
  }, [contentData]);

  // Update selected row keys when prop changes
  useEffect(() => {
    if (fetchNewSelectedRowKeys) {
      fetchNewSelectedRowKeys(selectedRowKeys);
    }
  }, [selectedRowKeys, fetchNewSelectedRowKeys]);

  const onDrawerClose = () => {
    setDrawerVisible(false);
    setDrawerComponent(null);
  };

  const handleCreate = () => {
    setDrawerTitle(`Create New ${currentModel}`);
    setDrawerComponent(
      <EditAndCreateContentForm
        contentData={{ model: currentModel, action: "create" }}
        formType="create"
        onContentCreated={async () => {
          await refreshContentQueries();
          setDrawerVisible(false);
        }}
      />
    );
    setDrawerVisible(true);
  };

  const handleEdit = (record: ContentRecord) => {
    setDrawerTitle(`Edit ${currentModel}`);
    setDrawerComponent(
      <EditAndCreateContentForm
        contentData={{ model: currentModel, id: record.id, action: "edit" }}
        formType="edit"
        onContentEdited={async () => {
          await refreshContentQueries();
          setDrawerVisible(false);
        }}
      />
    );
    setDrawerVisible(true);
  };

  const handleDelete = async (record: ContentRecord) => {
    await deleteModelData({
      model_name: currentModel,
      _id: record.id as string,
    });
  };

  const handleDuplicate = async (record: ContentRecord) => {
    await duplicateModelData({
      model_name: currentModel,
      _id: record.id as string,
    });
  };

  const handleRelation = (record: ContentRecord) => {
    setRelationRecord(record);
    setRelationDrawerVisible(true);
  };

  const onRelationDrawerClose = () => {
    setRelationDrawerVisible(false);
    setRelationRecord(null);
  };

  const handleBulkMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "csv_template":
        message.info("CSV Template download will be implemented");
        break;
      case "csv_upload":
        message.info("CSV Upload will be implemented");
        break;
      case "fake_data":
        setDrawerTitle(`Generate Fake Data for ${currentModel}`);
        setDrawerComponent(
          <FakeContentForm
            contentData={{ model: currentModel }}
            onContentCreated={async () => {
              await refreshContentQueries();
              setDrawerVisible(false);
            }}
          />
        );
        setDrawerVisible(true);
        break;
    }
  };

  const bulkMenuItems: MenuProps["items"] = [
    {
      label: "CSV Template Download",
      key: "csv_template",
    },
    {
      label: "CSV Data Upload",
      key: "csv_upload",
    },
    {
      label: "Fake Data Generator",
      key: "fake_data",
    },
  ];

  // Handle error state (keep table shell visible while paginating)
  if (error && !contentData) {
    const graphqlMessage =
      error instanceof Error
        ? error.message
        : typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Failed to load content data";
    return (
      <div className="console-pad-sm">
        <Empty
          description={graphqlMessage}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </Empty>
      </div>
    );
  }

  // Check if current model has connections for relation button
  const modelInfo = modelDetailsData?.projectModelsInfo?.[0];
  const modelConnections = modelInfo?.connections || [];
  const hasConnections =
    contentState.has_connections || modelConnections.length > 0;

  if (!modelName) {
    return (
      <div className="console-pad-md">
        <Empty
          description="No Model Selected"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate("/console/model")}>
            Go to Models
          </Button>
        </Empty>
      </div>
    );
  }

  // Render single page model form directly
  if (isSinglePageModel) {
    return (
      <div className="console-page-body">
        <div className="console-flex-between console-mb-lg">
          <div>
            <Title level={4} className="console-capitalize">
              {currentModel}
            </Title>
            <Text type="secondary">Single Page Document</Text>
          </div>
        </div>

        <ConsoleCard>
          <EditAndCreateContentForm
            contentData={{
              model: currentModel,
              id: contentState.single_page_uuid,
              action: contentState.single_page_uuid ? "edit" : "create",
            }}
            formType={contentState.single_page_uuid ? "edit" : "create"}
            onContentCreated={async () => {
              message.success(`${currentModel} created successfully`);
              await refreshContentQueries();
            }}
            onContentEdited={async () => {
              message.success(`${currentModel} updated successfully`);
              await refreshContentQueries();
            }}
          />
        </ConsoleCard>
      </div>
    );
  }

  return (
    <>
      <ConsolePageHeader
        title={<span className="console-capitalize">{currentModel}</span>}
        description={`Manage records for the ${currentModel} model.`}
        actions={
          <Space>
            {selectedRowKeys.length > 0 && (
              <Button
                icon={<Tags size={16} strokeWidth={1.75} />}
                loading={loadingTag}
                onClick={() => {
                  message.info(
                    "Tag selected items functionality will be implemented",
                  );
                }}
              >
                TAG SELECTED ({selectedRowKeys.length})
              </Button>
            )}

            <Dropdown
              menu={{
                items: bulkMenuItems,
                onClick: handleBulkMenuClick,
              }}
              trigger={["click"]}
            >
              <Button>BULK DATA UPLOAD</Button>
            </Dropdown>

            <Button
              type="primary"
              icon={<CirclePlus size={16} strokeWidth={1.75} />}
              onClick={handleCreate}
              data-tour="create-content-button"
              className="console-btn-primary"
            >
              Create New {modelName}
            </Button>
          </Space>
        }
      />

      <div className="console-page-body">
        <div className="console-card">
          <TableGenerator
          data={tableData}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={(keys) => {
            setSelectedRowKeys(keys);
            if (fetchNewSelectedRowKeys) {
              fetchNewSelectedRowKeys(keys);
            }
          }}
          onEdit={(record) => handleEdit(record as ContentRecord)}
          onDelete={(record) => handleDelete(record as ContentRecord)}
          onDuplicate={(record) => handleDuplicate(record as ContentRecord)}
          onRelation={(record) => handleRelation(record as ContentRecord)}
          showRelationButton={hasConnections}
          showSelection={true}
          showMetaColumns={true}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (itemTotal, range) =>
              `${range[0]}-${range[1]} of ${itemTotal} items`,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              if (nextPageSize !== pageSize) {
                setPageSize(nextPageSize);
                setPage(1);
              }
            },
          }}
        />
        </div>
      </div>

      <Drawer
        title={drawerTitle}
        width="75%"
        placement="right"
        onClose={onDrawerClose}
        open={drawerVisible}
        destroyOnClose
        extra={
          <Button type="link" onClick={onDrawerClose}>
            &lt; Back
          </Button>
        }
      >
        {drawerComponent}
      </Drawer>

      {/* Relation Drawer */}
      <Drawer
        title="Manage Relations"
        width="85%"
        placement="right"
        onClose={onRelationDrawerClose}
        open={relationDrawerVisible}
        destroyOnClose
        extra={
          <Button type="link" onClick={onRelationDrawerClose}>
            &lt; Back
          </Button>
        }
      >
        {relationRecord && (
          <TagRelationForm
            recordId={relationRecord.id}
            modelName={currentModel}
          />
        )}
      </Drawer>
    </>
  );
};

export default Contents;
