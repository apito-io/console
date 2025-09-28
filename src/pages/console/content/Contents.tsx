import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Drawer,
  Dropdown,
  Empty,
  message,
  Typography,
  Space,
  Card,
  Spin,
} from "antd";
import { PlusCircleOutlined, TagsOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  useGetMultipleDataQuery,
  useGetModelDetailsQuery,
  useDeleteModelDataMutation,
  useDuplicateModelDataMutation,
} from "../../../generated/graphql";
import { useContentContext } from "../../../contexts/ContentContext";
import type { MenuProps } from "antd";
import EditAndCreateContentForm from "./EditAndCreateContentForm";
import FakeContentForm from "./FakeContentForm";
import TableGenerator from "../../../components/common/TableGenerator";
import TagRelationForm from "./TagRelationForm";

const { Title, Text } = Typography;

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
  const { state: contentState } = useContentContext();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>("");
  const [drawerComponent, setDrawerComponent] = useState<React.ReactNode>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [relationDrawerVisible, setRelationDrawerVisible] = useState(false);
  const [relationRecord, setRelationRecord] = useState<any>(null);

  // Delete mutation hook
  const [deleteModelData] = useDeleteModelDataMutation({
    onCompleted: () => {
      message.success("Content deleted successfully!");
      refetch(); // Refresh the table data
    },
    onError: (error) => {
      message.error(`Failed to delete content: ${error.message}`);
    },
  });

  // Duplicate mutation hook
  const [duplicateModelData] = useDuplicateModelDataMutation({
    onCompleted: () => {
      message.success("Content duplicated successfully!");
      refetch(); // Refresh the table data
    },
    onError: (error) => {
      message.error(`Failed to duplicate content: ${error.message}`);
    },
  });

  // Use the selected model from ContentContext or props
  const currentModel = contentState.target || modelName;

  // Check if this is a single page model
  const isSinglePageModel =
    contentState.single_page || !!contentState.single_page_uuid;

  // Fetch model details to check for connections
  const { data: modelDetailsData } = useGetModelDetailsQuery({
    variables: {
      model_name: currentModel,
    },
    skip: !currentModel,
    errorPolicy: "all",
  });

  // Fetch content data using generated hook (only for table models)
  const {
    data: contentData,
    loading,
    error,
    refetch,
  } = useGetMultipleDataQuery({
    variables: {
      model: currentModel,
      limit: 50,
      page: 1,
    },
    skip: !currentModel || isSinglePageModel, // Skip query if no model selected or if it's a single page model
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

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
        onContentCreated={() => {
          refetch(); // Refetch data after creating new content
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
        onContentEdited={() => {
          refetch(); // Refetch data after editing content
          setDrawerVisible(false);
        }}
      />
    );
    setDrawerVisible(true);
  };

  const handleDelete = async (record: ContentRecord) => {
    await deleteModelData({
      variables: {
        model_name: currentModel,
        _id: record.id as string,
      },
    });
  };

  const handleDuplicate = async (record: ContentRecord) => {
    await duplicateModelData({
      variables: {
        model_name: currentModel,
        _id: record.id as string,
      },
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
            onContentCreated={() => {
              refetch(); // Refetch data after generating fake content
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

  // Handle loading state
  if (loading) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Handle error state
  if (error && !contentData) {
    return (
      <div style={{ padding: "16px" }}>
        <Empty
          description="Failed to load content data"
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
      <div style={{ padding: "24px" }}>
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
      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, textTransform: "capitalize" }}>
              {currentModel}
            </Title>
            <Text type="secondary">Single Page Document</Text>
          </div>
        </div>

        {/* Form Card */}
        <Card
          style={{
            background: "#ffffff",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
          }}
        >
          <EditAndCreateContentForm
            contentData={{
              model: currentModel,
              id: contentState.single_page_uuid,
              action: contentState.single_page_uuid ? "edit" : "create",
            }}
            formType={contentState.single_page_uuid ? "edit" : "create"}
            onContentCreated={() => {
              // Refresh the page or update context as needed
              message.success(`${currentModel} created successfully`);
            }}
            onContentEdited={() => {
              // Refresh the page or update context as needed
              message.success(`${currentModel} updated successfully`);
            }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, textTransform: "capitalize" }}>
            {currentModel}
          </Title>
          <Text type="secondary">Manage your {currentModel} content</Text>
        </div>

        <Space>
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<TagsOutlined />}
              loading={loadingTag}
              onClick={() => {
                message.info(
                  "Tag selected items functionality will be implemented"
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
            icon={<PlusCircleOutlined />}
            onClick={handleCreate}
            data-tour="create-content-button"
          >
            CREATE NEW {modelName.toUpperCase()}
          </Button>
        </Space>
      </div>

      {/* Table Card */}
      <Card
        style={{
          background: "#ffffff",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: 0 }}
      >
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
        />
      </Card>

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
    </div>
  );
};

export default Contents;
