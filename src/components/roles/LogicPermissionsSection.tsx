import React, { useMemo, useState } from 'react';
import { Checkbox, Input, Space, Typography } from 'antd';
import type { LogicPermissionsSectionProps } from '../../types/roles';

const { Text } = Typography;

const SEARCH_THRESHOLD = 8;

const LogicPermissionsSection: React.FC<LogicPermissionsSectionProps> = ({
  functions,
  value = [],
  onChange,
  disabled = false,
}) => {
  const [search, setSearch] = useState('');

  const filteredFunctions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return functions;
    return functions.filter((fn) => fn.toLowerCase().includes(q));
  }, [functions, search]);

  const handleChange = (checkedValues: string[]) => {
    // Preserve selections that are hidden by the current filter
    if (!search.trim()) {
      onChange?.(checkedValues);
      return;
    }
    const hiddenSelected = value.filter(
      (fn) => !filteredFunctions.includes(fn)
    );
    onChange?.([...new Set([...hiddenSelected, ...checkedValues])]);
  };

  const showSearch = functions.length >= SEARCH_THRESHOLD;

  return (
    <div style={{ marginBottom: 8 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Logic Executions
      </Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        {functions.length === 0
          ? 'No functions available'
          : `${value.length} of ${functions.length} functions allowed`}
      </Text>

      {showSearch ? (
        <Input.Search
          allowClear
          placeholder="Filter functions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12, maxWidth: 320 }}
          disabled={disabled}
        />
      ) : null}

      {functions.length > 0 ? (
        <Checkbox.Group
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {filteredFunctions.map((func) => (
              <Checkbox key={func} value={func}>
                {func}
              </Checkbox>
            ))}
            {filteredFunctions.length === 0 ? (
              <Text type="secondary">No functions match this filter</Text>
            ) : null}
          </Space>
        </Checkbox.Group>
      ) : (
        <Text type="secondary">
          No functions available for permission assignment
        </Text>
      )}
    </div>
  );
};

export default LogicPermissionsSection;
