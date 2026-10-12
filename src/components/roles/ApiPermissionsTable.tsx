import React, { useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  Typography,
  Dropdown,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Filter, Layers } from 'lucide-react';
import type {
  ApiPermissions,
  ApiPermissionsTableProps,
  CreatePermissionLevel,
  CrudOperation,
  ModelPermissions,
  PermissionLevel,
  PermissionPresetId,
} from '../../types/roles';
import {
  CREATE_PERMISSION_OPTIONS,
  CRUD_PERMISSION_OPTIONS,
  EMPTY_MODEL_PERMISSIONS,
  PERMISSION_PRESETS,
} from '../../types/roles';

const { Text } = Typography;

interface ModelRow {
  key: string;
  model: string;
}

const PAGE_SIZE_THRESHOLD = 50;

function isReadable(level: PermissionLevel | undefined): boolean {
  return Boolean(level && level !== 'none');
}

function isWritable(perms: ModelPermissions | undefined): boolean {
  if (!perms) return false;
  return (
    (perms.create && perms.create !== 'none') ||
    (perms.update && perms.update !== 'none') ||
    (perms.delete && perms.delete !== 'none')
  );
}

const ApiPermissionsTable: React.FC<ApiPermissionsTableProps> = ({
  models,
  disabled = false,
}) => {
  const form = Form.useFormInstance();
  const [search, setSearch] = useState('');
  const [presetId, setPresetId] = useState<PermissionPresetId | undefined>();

  const apiPermissions =
    (Form.useWatch('api_permissions', form) as ApiPermissions | undefined) || {};

  const filteredModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => m.toLowerCase().includes(q));
  }, [models, search]);

  const tableData: ModelRow[] = useMemo(
    () => filteredModels.map((model) => ({ key: model, model })),
    [filteredModels]
  );

  const summary = useMemo(() => {
    let readable = 0;
    let writable = 0;
    for (const model of models) {
      const perms = apiPermissions[model];
      if (isReadable(perms?.read)) readable += 1;
      if (isWritable(perms)) writable += 1;
    }
    return { total: models.length, readable, writable };
  }, [models, apiPermissions]);

  const applyPermissionsToModels = (
    targetModels: string[],
    patch: Partial<ModelPermissions> | ModelPermissions
  ) => {
    const current =
      (form.getFieldValue('api_permissions') as ApiPermissions | undefined) ||
      {};
    const next: ApiPermissions = { ...current };
    for (const model of targetModels) {
      next[model] = {
        ...EMPTY_MODEL_PERMISSIONS,
        ...next[model],
        ...patch,
      };
    }
    form.setFieldsValue({ api_permissions: next });
  };

  const handleApplyPresetToFiltered = () => {
    if (!presetId || filteredModels.length === 0) return;
    const preset = PERMISSION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    applyPermissionsToModels(filteredModels, preset.permissions);
  };

  const handleSetColumnForFiltered = (
    operation: CrudOperation,
    value: PermissionLevel | CreatePermissionLevel
  ) => {
    if (filteredModels.length === 0) return;
    applyPermissionsToModels(filteredModels, { [operation]: value });
  };

  const renderScopeSelect = (
    model: string,
    operation: CrudOperation,
    options: { label: string; value: string }[]
  ) => (
    <Form.Item
      name={['api_permissions', model, operation]}
      initialValue={'none'}
      noStyle
    >
      <Select
        disabled={disabled}
        options={options}
        style={{ width: '100%', minWidth: 132 }}
        popupMatchSelectWidth={false}
        aria-label={`${model} ${operation}`}
      />
    </Form.Item>
  );

  const columnSetAllMenu = (operation: CrudOperation) => {
    const options =
      operation === 'create'
        ? CREATE_PERMISSION_OPTIONS
        : CRUD_PERMISSION_OPTIONS;
    return {
      items: options.map((opt) => ({
        key: opt.value,
        label: `Set filtered → ${opt.label}`,
        disabled: disabled || filteredModels.length === 0,
        onClick: () => handleSetColumnForFiltered(operation, opt.value),
      })),
    };
  };

  const columns: ColumnsType<ModelRow> = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      fixed: 'left',
      width: 180,
      render: (model: string) => (
        <Text code style={{ fontSize: 12 }}>
          {model}
        </Text>
      ),
    },
    {
      title: (
        <Space size={4}>
          <span>Read</span>
          <Dropdown menu={columnSetAllMenu('read')} trigger={['click']}>
            <Button
              type="text"
              size="small"
              disabled={disabled || filteredModels.length === 0}
              icon={<Filter size={12} strokeWidth={1.75} />}
              aria-label="Set read for filtered models"
            />
          </Dropdown>
        </Space>
      ),
      key: 'read',
      align: 'center',
      width: 160,
      render: (_: unknown, record) =>
        renderScopeSelect(record.model, 'read', CRUD_PERMISSION_OPTIONS),
    },
    {
      title: (
        <Space size={4}>
          <span>Create</span>
          <Dropdown menu={columnSetAllMenu('create')} trigger={['click']}>
            <Button
              type="text"
              size="small"
              disabled={disabled || filteredModels.length === 0}
              icon={<Filter size={12} strokeWidth={1.75} />}
              aria-label="Set create for filtered models"
            />
          </Dropdown>
        </Space>
      ),
      key: 'create',
      align: 'center',
      width: 160,
      render: (_: unknown, record) =>
        renderScopeSelect(record.model, 'create', CREATE_PERMISSION_OPTIONS),
    },
    {
      title: (
        <Space size={4}>
          <span>Update</span>
          <Dropdown menu={columnSetAllMenu('update')} trigger={['click']}>
            <Button
              type="text"
              size="small"
              disabled={disabled || filteredModels.length === 0}
              icon={<Filter size={12} strokeWidth={1.75} />}
              aria-label="Set update for filtered models"
            />
          </Dropdown>
        </Space>
      ),
      key: 'update',
      align: 'center',
      width: 160,
      render: (_: unknown, record) =>
        renderScopeSelect(record.model, 'update', CRUD_PERMISSION_OPTIONS),
    },
    {
      title: (
        <Space size={4}>
          <span>Delete</span>
          <Dropdown menu={columnSetAllMenu('delete')} trigger={['click']}>
            <Button
              type="text"
              size="small"
              disabled={disabled || filteredModels.length === 0}
              icon={<Filter size={12} strokeWidth={1.75} />}
              aria-label="Set delete for filtered models"
            />
          </Dropdown>
        </Space>
      ),
      key: 'delete',
      align: 'center',
      width: 160,
      render: (_: unknown, record) =>
        renderScopeSelect(record.model, 'delete', CRUD_PERMISSION_OPTIONS),
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        API Permissions
      </Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        {summary.total} models · {summary.readable} readable ·{' '}
        {summary.writable} writable
        {search.trim()
          ? ` · showing ${filteredModels.length} filtered`
          : null}
      </Text>

      <Space wrap style={{ width: '100%', marginBottom: 12 }} size="middle">
        <Input.Search
          allowClear
          placeholder="Filter models"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
          disabled={disabled}
        />
        <Select
          allowClear
          placeholder="Permission preset"
          value={presetId}
          onChange={(v) => setPresetId(v)}
          style={{ width: 220 }}
          disabled={disabled}
          options={PERMISSION_PRESETS.map((p) => ({
            value: p.id,
            label: p.label,
          }))}
        />
        <Button
          icon={<Layers size={14} strokeWidth={1.75} />}
          onClick={handleApplyPresetToFiltered}
          disabled={disabled || !presetId || filteredModels.length === 0}
        >
          Apply to filtered
        </Button>
      </Space>

      <Table<ModelRow>
        className="mono-table"
        dataSource={tableData}
        columns={columns}
        pagination={
          filteredModels.length > PAGE_SIZE_THRESHOLD
            ? {
                pageSize: 25,
                showSizeChanger: true,
                pageSizeOptions: [25, 50, 100],
                showTotal: (total) => `${total} models`,
              }
            : false
        }
        bordered
        size="small"
        rowKey="key"
        scroll={{ x: 840, y: 420 }}
        sticky
        locale={{
          emptyText: search.trim()
            ? 'No models match this filter'
            : 'No models available',
        }}
      />
    </div>
  );
};

export default ApiPermissionsTable;
