import React, { useMemo } from "react";
import { Button, Dropdown, Table, Tag, Popconfirm } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExpandAltOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import ExpandedRowContent from "./ExpandedRowContent";
import {
  classifyFields,
  formatFieldName,
  getSimpleDisplayValue,
  splitTitle,
  shouldWrapTitle,
} from "../../utils/dataTypes";

interface TableGeneratorProps {
  data: Record<string, unknown>[];
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (keys: React.Key[]) => void;
  onEdit?: (record: Record<string, unknown>) => void;
  onDelete?: (record: Record<string, unknown>) => void;
  onDuplicate?: (record: Record<string, unknown>) => void;
  onRelation?: (record: Record<string, unknown>) => void;
  showRelationButton?: boolean;
  showSelection?: boolean;
  showMetaColumns?: boolean;
}

const TableGenerator: React.FC<TableGeneratorProps> = ({
  data,
  loading = false,
  selectedRowKeys = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onDuplicate,
  onRelation,
  showRelationButton = false,
  showSelection = true,
  showMetaColumns = true,
}) => {
  // Classify fields into simple and complex types
  const { simpleFields, complexFields } = useMemo(() => {
    return classifyFields(data);
  }, [data]);

  // Generate dynamic columns based on simple data types only
  const columns: ColumnsType<Record<string, unknown>> = useMemo(() => {
    if (data.length === 0) return [];

    // Create columns only for simple data types
    const dynamicColumns: ColumnsType<Record<string, unknown>> =
      simpleFields.map((key) => {
        const formattedTitle = formatFieldName(key);
        const titleLines = shouldWrapTitle(formattedTitle)
          ? splitTitle(formattedTitle)
          : [formattedTitle];

        return {
          title:
            titleLines.length > 1 ? (
              <div style={{ lineHeight: "1.2" }}>
                {titleLines.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            ) : (
              formattedTitle
            ),
          dataIndex: key,
          key: key,
          ellipsis: true,
          render: (value: unknown) => {
            const displayValue = getSimpleDisplayValue(value);

            // Add visual indicators for boolean values
            if (typeof value === "boolean") {
              return <Tag color={value ? "green" : "red"}>{displayValue}</Tag>;
            }

            return displayValue;
          },
        };
      });

    // Add meta columns (fixed position) if enabled
    const metaColumns: ColumnsType<Record<string, unknown>> = showMetaColumns
      ? [
          {
            title: "Created At",
            dataIndex: ["meta", "created_at"],
            key: "created_at",
            fixed: "right",
            render: (value: string) =>
              value ? new Date(value).toLocaleDateString() : "-",
          },
          {
            title: "Status",
            dataIndex: ["meta", "status"],
            key: "status",
            fixed: "right",
            render: (value: string) => (
              <Tag color={value === "published" ? "green" : "orange"}>
                {value || "draft"}
              </Tag>
            ),
          },
        ]
      : [];

    // Build action menu items
    const actionItems: MenuProps["items"] = [];

    if (onEdit) {
      actionItems.push({
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
      });
    }

    if (onDuplicate) {
      actionItems.push({
        key: "duplicate",
        label: "Duplicate",
        icon: <CopyOutlined />,
      });
    }

    // Delete is handled separately with Popconfirm, not in dropdown

    // Add actions column (fixed position)
    const actionsColumn: ColumnsType<Record<string, unknown>> = [
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        render: (_: unknown, record: Record<string, unknown>) => (
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {/* Relation Button */}
            {showRelationButton && onRelation && (
              <Button
                type="text"
                size="small"
                icon={<LinkOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onRelation(record);
                }}
                title="View Relations"
              />
            )}

            {/* Delete Button with Popconfirm */}
            {onDelete && (
              <Popconfirm
                title="Delete Content"
                description="Are you sure you want to delete this item?"
                onConfirm={() => onDelete(record)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  title="Delete"
                  danger
                />
              </Popconfirm>
            )}

            {/* Duplicate Button with Popconfirm */}
            {onDuplicate && (
              <Popconfirm
                title="Duplicate Content"
                description="Are you sure you want to duplicate this item?"
                onConfirm={() => onDuplicate(record)}
                okText="Duplicate"
                cancelText="Cancel"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  title="Duplicate"
                />
              </Popconfirm>
            )}

            {/* Action Menu */}
            {actionItems.length > 0 && (
              <Dropdown
                menu={{
                  items: actionItems,
                  onClick: ({ key, domEvent }) => {
                    domEvent?.stopPropagation();

                    switch (key) {
                      case "edit":
                        onEdit?.(record);
                        break;
                      case "duplicate":
                        onDuplicate?.(record);
                        break;
                      default: {
                        // Handle custom actions
                        break;
                      }
                    }
                  },
                }}
                trigger={["click"]}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            )}
          </div>
        ),
      },
    ];

    return [...dynamicColumns, ...metaColumns, ...actionsColumn];
  }, [
    data,
    simpleFields,
    showMetaColumns,
    onEdit,
    onDelete,
    onDuplicate,
    onRelation,
    showRelationButton,
  ]);

  const rowSelection = showSelection
    ? {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
          onSelectionChange?.(newSelectedRowKeys);
        },
      }
    : undefined;

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      rowSelection={rowSelection}
      scroll={{ x: "max-content" }}
      expandable={{
        expandedRowRender: (record) => (
          <ExpandedRowContent record={record} complexFields={complexFields} />
        ),
        rowExpandable: () => complexFields.length > 0,
        expandIcon: ({ expanded, onExpand, record }) =>
          complexFields.length > 0 ? (
            <Button
              type="text"
              size="small"
              icon={<ExpandAltOutlined rotate={expanded ? 90 : 0} />}
              onClick={(e) => onExpand(record, e)}
              title={expanded ? "Collapse details" : "Expand details"}
            />
          ) : null,
      }}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
    />
  );
};

export default TableGenerator;
