import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Table, Select, Typography } from 'antd';
const { Title } = Typography;
const { Option } = Select;
const ApiPermissionsTable = ({ models, disabled = false, }) => {
    const permissionOptions = [
        { label: 'No Access', value: 'none' },
        { label: 'Everyone', value: 'all' },
        { label: 'Custom Logic', value: 'custom_logic' },
    ];
    const tableData = models.map((model) => ({
        key: model,
        model,
    }));
    const columns = [
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            width: 200,
        },
        {
            title: 'Read',
            key: 'read',
            align: 'center',
            width: 120,
            render: (_, record) => (_jsx(Form.Item, { name: ['api_permissions', record.model, 'read'], initialValue: 'none', noStyle: true, children: _jsx(Select, { disabled: disabled, style: { width: 100 }, children: permissionOptions.map((option) => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) })),
        },
        {
            title: 'Create',
            key: 'create',
            align: 'center',
            width: 120,
            render: (_, record) => (_jsx(Form.Item, { name: ['api_permissions', record.model, 'create'], initialValue: 'none', noStyle: true, children: _jsx(Select, { disabled: disabled, style: { width: 100 }, children: permissionOptions.map((option) => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) })),
        },
        {
            title: 'Update',
            key: 'update',
            align: 'center',
            width: 120,
            render: (_, record) => (_jsx(Form.Item, { name: ['api_permissions', record.model, 'update'], initialValue: 'none', noStyle: true, children: _jsx(Select, { disabled: disabled, style: { width: 100 }, children: permissionOptions.map((option) => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) })),
        },
        {
            title: 'Delete',
            key: 'delete',
            align: 'center',
            width: 120,
            render: (_, record) => (_jsx(Form.Item, { name: ['api_permissions', record.model, 'delete'], initialValue: 'none', noStyle: true, children: _jsx(Select, { disabled: disabled, style: { width: 100 }, children: permissionOptions.map((option) => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) })),
        },
    ];
    return (_jsxs("div", { children: [_jsx(Title, { level: 5, style: { marginBottom: 16 }, children: "API Permissions" }), _jsx(Table, { dataSource: tableData, columns: columns, pagination: false, bordered: true, size: "small", rowKey: "key", scroll: { x: 'max-content' }, locale: {
                    emptyText: 'No models available',
                } })] }));
};
export default ApiPermissionsTable;
