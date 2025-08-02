import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Typography,
  Tabs,
  Space,
  Tag,
  Alert,
  Spin,
  Empty,
  Button,
  Drawer,
  message,
  Divider,
} from "antd";
import {
  LinkOutlined,
  PlusOutlined,
  UserOutlined,
  TagsOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import {
  useGetModelDetailsQuery,
  useGetMultipleDataQuery,
  useUpdateSingleDataMutation,
} from "../../../generated/graphql";
import { capitalize } from "lodash";
import pluralize from "pluralize";

import TableGenerator from "../../../components/common/TableGenerator";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface EditRelationFormProps {
  recordId: string;
  modelName: string;
}

interface ConnectionData {
  model: string;
  relation: string;
  type: string;
  known_as: string;
}

interface RelationSelectionDrawerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  connectionData: ConnectionData | null;
  recordId: string;
  modelName: string;
  onSuccess: () => void;
}

const RelationSelectionDrawer: React.FC<RelationSelectionDrawerProps> = ({
  visible,
  onClose,
  title,
  connectionData,
  recordId,
  modelName,
  onSuccess,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [updateSingleData] = useUpdateSingleDataMutation({
    onCompleted: () => {
      message.success("Relations updated successfully!");
      setSelectedRowKeys([]);
      onSuccess();
      onClose();
    },
    onError: (error) => {
      message.error(`Failed to update relations: ${error.message}`);
    },
  });

  // Fetch available records for selection (intersect=true to exclude already connected ones)
  const {
    data: availableData,
    loading: availableDataLoading,
    error: availableDataError,
    refetch: refetchAvailable,
  } = useGetMultipleDataQuery({
    variables: {
      model: connectionData?.model || "",
      limit: 100,
      page: 1,
      connection: connectionData
        ? {
            _id: recordId,
            model: connectionData.model,
            to_model: modelName,
            relation_type:
              connectionData.type === "one_to_many"
                ? "has_many"
                : connectionData.type === "one_to_one"
                  ? "has_one"
                  : "has_many",
            known_as: connectionData.known_as || "",
            connection_type:
              connectionData.relation === "backward" ? "backward" : "forward",
          }
        : undefined,
      intersect: true, // This will return items that are NOT connected
    },
    skip: !connectionData || !visible,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const availableRecords = useMemo(() => {
    if (!availableData?.getModelData?.results) return [];

    return availableData.getModelData.results
      .filter((item) => item && item.id)
      .map((item) => ({
        id: item!.id!,
        ...item!.data,
        meta: item!.meta,
      }));
  }, [availableData]);

  const handleConnect = async () => {
    if (!connectionData || selectedRowKeys.length === 0) return;

    setLoading(true);
    try {
      const model =
        connectionData.known_as !== ""
          ? connectionData.known_as
          : connectionData.model;
      const key = model.concat(
        connectionData.relation === "has_many" ? "_ids" : "_id"
      );
      const connect = {
        [key]:
          connectionData.relation === "has_many"
            ? selectedRowKeys
            : selectedRowKeys[0],
      };

      await updateSingleData({
        variables: {
          _id: recordId,
          model_name: modelName,
          connect,
        },
      });
    } catch (error) {
      console.error("Connect error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelection = (keys: React.Key[]) => {
    setSelectedRowKeys(keys as string[]);
  };

  if (!connectionData) return null;

  return (
    <Drawer
      title={title}
      width="60%"
      placement="right"
      onClose={onClose}
      open={visible}
      destroyOnClose
      mask={true}
      maskClosable={true}
      style={{ zIndex: 1000 }}
      extra={
        <Button type="link" onClick={onClose}>
          {"< Back"}
        </Button>
      }
    >
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Text strong>Select records to connect:</Text>
          {selectedRowKeys.length > 0 && (
            <>
              <Divider type="vertical" />
              <Button
                type="primary"
                icon={<TagsOutlined />}
                loading={loading}
                onClick={handleConnect}
              >
                {`CONNECT SELECTED ${capitalize(
                  connectionData.relation === "has_many"
                    ? pluralize(connectionData.model)
                    : connectionData.model
                )}`.toUpperCase()}
              </Button>
            </>
          )}
        </Space>
      </div>

      {availableDataLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : availableDataError ? (
        <Alert
          message="Error"
          description={`Failed to load available records: ${availableDataError.message}`}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetchAvailable()}>
              Retry
            </Button>
          }
        />
      ) : (
        <TableGenerator
          data={availableRecords}
          loading={availableDataLoading}
          showRelationButton={false}
          showSelection={true}
          showMetaColumns={true}
          onSelectionChange={handleRowSelection}
          selectedRowKeys={selectedRowKeys}
        />
      )}
    </Drawer>
  );
};

const EditRelationForm: React.FC<EditRelationFormProps> = ({
  recordId,
  modelName,
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [activeConnectionForDrawer, setActiveConnectionForDrawer] =
    useState<ConnectionData | null>(null);

  const [updateSingleData] = useUpdateSingleDataMutation({
    onCompleted: () => {
      message.success("Relations updated successfully!");
      setSelectedRowKeys([]);
      refetchRelationData();
    },
    onError: (error) => {
      message.error(`Failed to update relations: ${error.message}`);
    },
  });

  // Get model details to fetch connections
  const {
    data: modelDetailsData,
    loading: modelLoading,
    error: modelError,
  } = useGetModelDetailsQuery({
    variables: {
      model_name: modelName,
    },
    errorPolicy: "all",
  });

  const modelInfo = modelDetailsData?.projectModelsInfo?.[0];
  const connections: ConnectionData[] = useMemo(() => {
    return (modelInfo?.connections || [])
      .filter((conn): conn is NonNullable<typeof conn> => conn !== null)
      .map((conn) => ({
        model: conn.model ?? "",
        relation: conn.relation ?? "",
        type: conn.type ?? "",
        known_as: conn.known_as ?? "",
      }));
  }, [modelInfo]);

  // Set initial active tab
  useEffect(() => {
    if (connections.length > 0 && !activeTab) {
      setActiveTab(connections[0].model);
    }
  }, [connections, activeTab]);

  // Get the active connection details
  const activeConnection = connections.find((conn) => conn.model === activeTab);

  // Fetch data for the active connection
  const {
    data: relationData,
    loading: relationLoading,
    error: relationError,
    refetch: refetchRelationData,
  } = useGetMultipleDataQuery({
    variables: {
      model: activeTab,
      limit: 50,
      page: 1,
      connection: activeConnection
        ? {
            _id: recordId,
            model: activeConnection.model,
            to_model: modelName,
            relation_type:
              activeConnection.type === "one_to_many"
                ? "has_many"
                : activeConnection.type === "one_to_one"
                  ? "has_one"
                  : "has_many",
            known_as: activeConnection.known_as || "",
            connection_type:
              activeConnection.relation === "backward" ? "backward" : "forward",
          }
        : undefined,
    },
    skip: !activeTab || !recordId || !activeConnection,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // Transform relation data to table format
  const relationTableData = useMemo(() => {
    if (!relationData?.getModelData?.results) return [];

    return relationData.getModelData.results
      .filter((item) => item && item.id)
      .map((item) => ({
        id: item!.id!,
        ...item!.data,
        meta: item!.meta,
      }));
  }, [relationData]);

  const handleAddRelation = (connection: ConnectionData) => {
    const actualRelationName = capitalize(
      connection.relation === "has_many"
        ? pluralize(connection.model)
        : connection.model
    );
    setDrawerTitle(`Add ${actualRelationName} to ${capitalize(modelName)}`);
    setActiveConnectionForDrawer(connection);
    setDrawerVisible(true);
  };

  const handleDisconnectSelected = async () => {
    if (!activeConnection || selectedRowKeys.length === 0) return;

    const model =
      activeConnection.known_as !== ""
        ? activeConnection.known_as
        : activeConnection.model;
    const key = model.concat(
      activeConnection.relation === "has_many" ? "_ids" : "_id"
    );
    const disconnect = {
      [key]:
        activeConnection.relation === "has_many"
          ? selectedRowKeys
          : selectedRowKeys[0],
    };

    try {
      await updateSingleData({
        variables: {
          _id: recordId,
          model_name: modelName,
          disconnect,
        },
      });
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const handleRowSelection = (keys: React.Key[]) => {
    setSelectedRowKeys(keys as string[]);
  };

  const handleDrawerSuccess = () => {
    refetchRelationData();
  };

  if (modelLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (modelError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load model details: ${modelError.message}`}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (!connections.length) {
    return (
      <div style={{ padding: "24px" }}>
        <Empty
          description="No relationships found for this model"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", position: "relative" }}>
      {/* Header Information */}
      <Card size="small" style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title
              level={5}
              style={{ margin: 0, display: "flex", alignItems: "center" }}
            >
              <LinkOutlined style={{ marginRight: "8px" }} />
              Relations for {modelName}
            </Title>
            <Text type="secondary">Record ID: {recordId}</Text>
          </div>
          <Space>
            <Tag icon={<UserOutlined />} color="blue">
              {connections.length} Connection
              {connections.length !== 1 ? "s" : ""}
            </Tag>
          </Space>
        </div>
      </Card>

      {/* Relations Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setSelectedRowKeys([]); // Clear selection when switching tabs
          }}
          type="card"
          tabBarExtraContent={
            <Space>
              {selectedRowKeys.length > 0 && activeConnection && (
                <>
                  <Button
                    danger
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={handleDisconnectSelected}
                  >
                    {`DISCONNECT SELECTED ${capitalize(
                      activeConnection.relation === "has_many"
                        ? pluralize(activeConnection.model)
                        : activeConnection.model
                    )}`.toUpperCase()}
                  </Button>
                  <Divider type="vertical" />
                </>
              )}
              {activeTab && activeConnection && (
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddRelation(activeConnection)}
                >
                  Add {capitalize(activeConnection.model)}
                </Button>
              )}
            </Space>
          }
        >
          {connections.map((connection) => (
            <TabPane
              tab={
                <Space>
                  <span style={{ textTransform: "capitalize" }}>
                    {connection.known_as || connection.model}
                  </span>
                  <Tag color="geekblue">{connection.type}</Tag>
                </Space>
              }
              key={connection.model}
            >
              <div style={{ marginTop: "16px" }}>
                {relationLoading ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <Spin size="large" />
                  </div>
                ) : relationError ? (
                  <Alert
                    message="Error"
                    description={`Failed to load ${connection.model} data: ${relationError.message}`}
                    type="error"
                    showIcon
                    action={
                      <Button
                        size="small"
                        onClick={() => refetchRelationData()}
                      >
                        Retry
                      </Button>
                    }
                  />
                ) : (
                  <TableGenerator
                    data={relationTableData}
                    loading={relationLoading}
                    showRelationButton={false}
                    showSelection={true}
                    showMetaColumns={true}
                    onSelectionChange={handleRowSelection}
                    selectedRowKeys={selectedRowKeys}
                  />
                )}
              </div>
            </TabPane>
          ))}
        </Tabs>
      </Card>

      {/* Relation Selection Drawer */}
      <RelationSelectionDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title={drawerTitle}
        connectionData={activeConnectionForDrawer}
        recordId={recordId}
        modelName={modelName}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
};

export default EditRelationForm;
