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
  Relation_Type_Enum,
  useGetModelDetailsQuery,
  useGetMultipleDataQuery,
  useUpdateSingleDataMutation,
} from "../../../generated_gql/tanstack-query";
import { capitalize } from "lodash";
import pluralize from "pluralize";

import TableGenerator from "../../../components/common/TableGenerator";
import { Link, Minus, Plus, Tags, User } from "lucide-react";
import "../../../components/console/ConsoleShell.css";
import "../../../components/console/ConsoleShell.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface TagRelationFormProps {
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

  const { mutateAsync: updateSingleData } = useUpdateSingleDataMutation({
    onSuccess: () => {
      message.success("Relations updated successfully!");
      setSelectedRowKeys([]);
      onSuccess();
      onClose();
    },
    onError: (error) => {
      message.error(
        `Failed to update relations: ${
          error instanceof Error ? error.message : "Update failed"
        }`
      );
    },
  });

  const {
    data: availableData,
    isLoading: availableDataLoading,
    error: availableDataError,
    refetch: refetchAvailable,
  } = useGetMultipleDataQuery(
    {
      model: connectionData?.model || "",
      limit: 100,
      page: 1,
      connection: connectionData
        ? {
            _id: recordId,
            model: connectionData.model,
            to_model: modelName,
            relation_type: connectionData.relation,
            known_as: connectionData.known_as || "",
            connection_type: connectionData.type,
          }
        : undefined,
      intersect: true,
    },
    { enabled: Boolean(connectionData && visible) }
  );

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
        _id: recordId,
        model_name: modelName,
        connect,
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
      className="console-drawer-raised"
      extra={
        <Button type="link" onClick={onClose}>
          {"< Back"}
        </Button>
      }
    >
      <div className="console-mb-md">
        <Space>
          <Text strong>Select records to connect:</Text>
          {selectedRowKeys.length > 0 && (
            <>
              <Divider type="vertical" />
              <Button
                type="primary"
                icon={<Tags size={16} strokeWidth={1.75} />}
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
        <div className="console-center-pad--lg">
          <Spin size="large" />
        </div>
      ) : availableDataError ? (
        <Alert
          message="Error"
          description={`Failed to load available records: ${availableDataError instanceof Error ? availableDataError.message : "Unknown error"}`}
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

const TagRelationForm: React.FC<TagRelationFormProps> = ({
  recordId,
  modelName,
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");

  const { mutateAsync: updateSingleData } = useUpdateSingleDataMutation({
    onSuccess: () => {
      message.success("Relations updated successfully!");
      setSelectedRowKeys([]);
      void refetchRelationData();
    },
    onError: (error) => {
      message.error(
        `Failed to update relations: ${
          error instanceof Error ? error.message : "Update failed"
        }`
      );
    },
  });

  const {
    data: modelDetailsData,
    isLoading: modelLoading,
    error: modelError,
  } = useGetModelDetailsQuery(
    { model_name: modelName },
    { enabled: Boolean(modelName) }
  );

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
    isLoading: relationLoading,
    error: relationError,
    refetch: refetchRelationData,
  } = useGetMultipleDataQuery(
    {
      model: activeTab,
      limit: 50,
      page: 1,
      connection: activeConnection
        ? {
            _id: recordId,
            model: activeConnection.model,
            to_model: modelName,
            relation_type: activeConnection.relation,
            known_as: activeConnection.known_as || "",
            connection_type: activeConnection.type,
          }
        : undefined,
    },
    { enabled: Boolean(activeTab && recordId && activeConnection) }
  );

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
        _id: recordId,
        model_name: modelName,
        disconnect,
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
      <div className="console-pad-md console-text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (modelError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load model details: ${modelError instanceof Error ? modelError.message : "Unknown error"}`}
        type="error"
        showIcon
        className="console-pad-md"
      />
    );
  }

  if (!connections.length) {
    return (
      <div className="console-pad-md">
        <Empty
          description="No relationships found for this model"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="console-pad-sm console-relative">
      <Card size="small" className="relation-header-card">
        <div className="console-flex-between">
          <div>
            <Title level={5} className="relation-header-title">
              <Link size={16} strokeWidth={1.75} className="console-icon-gap" />
              Relations for {modelName}
            </Title>
            <Text type="secondary">Record ID: {recordId}</Text>
          </div>
          <Space>
            <Tag icon={<User size={16} strokeWidth={1.75} />} color="blue">
              {connections.length} Connection
              {connections.length !== 1 ? "s" : ""}
            </Tag>
          </Space>
        </div>
      </Card>

      {/* Relations Tabs */}
      <Card className="console-surface-card">
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
                    icon={<Minus size={16} strokeWidth={1.75} />}
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
                  icon={<Plus size={16} strokeWidth={1.75} />}
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
                  <span className="console-capitalize">
                    {connection.known_as || connection.model}
                  </span>
                  <Tag color="geekblue">{connection.type}</Tag>
                </Space>
              }
              key={connection.model}
            >
              <div className="console-mt-md">
                {relationLoading ? (
                  <div className="console-center-pad--lg">
                    <Spin size="large" />
                  </div>
                ) : relationError ? (
                  <Alert
                    message="Error"
                    description={`Failed to load ${connection.model} data: ${relationError instanceof Error ? relationError.message : "Unknown error"}`}
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
        connectionData={activeConnection || null}
        recordId={recordId}
        modelName={modelName}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
};

export default TagRelationForm;
