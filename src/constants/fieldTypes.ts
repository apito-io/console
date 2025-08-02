import { Field_Sub_Type_Enum, Field_Type_Enum, Input_Type_Enum } from '../generated/graphql';

export interface FieldTypeOption {
    example_json: unknown;
    root_json_name: string | null;
    field_type: Field_Type_Enum | 'relation';
    field_sub_type?: Field_Sub_Type_Enum;
    input_type?: Input_Type_Enum;
    label: string;
    description: string;
}

export const fieldTypeOptions: FieldTypeOption[] = [
    {
        example_json: {
            id: '2584789256',
            name: 'Harry Porter',
            hasMany: ['authors'],
            hasOne: 'Publishers',
        },
        root_json_name: 'book',
        field_type: 'relation',
        label: 'Model Relationships',
        description: 'Create Relations Between Models',
    },
    {
        example_json: {
            id: '2584789256',
            name: 'Harry Porter',
            published: 1997,
            author: 'JK Rowling',
        },
        root_json_name: 'book',
        field_type: Field_Type_Enum.Object,
        input_type: Input_Type_Enum.Object,
        label: 'Ojbect Schema',
        description: 'Single Object With Multiple Fields',
    },
    {
        example_json: [
            {
                id: '2584789256',
                name: 'Harry Porter',
                published: 1997,
                author: 'JK Rowling',
            },
            {
                id: '892584556',
                name: 'A Journey Through Charms',
                published: 2019,
                author: 'JK Rowling',
            },
        ],
        root_json_name: 'books',
        field_type: Field_Type_Enum.Repeated,
        input_type: Input_Type_Enum.Repeated,
        label: 'Array Schema',
        description: 'List of Objects with Multiple Fields',
    },
    {
        example_json: {
            name: 'Harry Porter',
        },
        root_json_name: null,
        field_type: Field_Type_Enum.Text,
        input_type: Input_Type_Enum.String,
        label: 'Text Field',
        description: 'Single line text Input',
    },
    {
        example_json: {
            description: '<b>HTML</b> & Markup Supported Very long \n And Multiline Text',
        },
        root_json_name: 'product',
        field_type: Field_Type_Enum.Multiline,
        input_type: Input_Type_Enum.String,
        label: 'Rich Text Field',
        description: 'Multiline editor with formatting options',
    },
    {
        example_json: {
            date: '2023-08-21T19:23:28Z',
        },
        root_json_name: null,
        field_type: Field_Type_Enum.Date,
        input_type: Input_Type_Enum.String,
        label: 'DateTime Field',
        description: 'Date & Time input field',
    },
    {
        example_json: ['list item 1', 'list item 2', 'list item 3'],
        root_json_name: 'dynamic_array',
        field_type: Field_Type_Enum.List,
        field_sub_type: Field_Sub_Type_Enum.DynamicList,
        input_type: Input_Type_Enum.String,
        label: 'Dynamic Array',
        description: 'Flexible list allowing multiple items',
    },
    {
        example_json: ['peach', 'apple', 'orange'],
        root_json_name: 'select_one',
        field_type: Field_Type_Enum.List,
        field_sub_type: Field_Sub_Type_Enum.Dropdown,
        input_type: Input_Type_Enum.String,
        label: 'Dropdown Menu',
        description: 'Predefined list for single selection',
    },
    {
        example_json: ['peach', 'apple', 'orange'],
        root_json_name: 'select_multiple',
        field_type: Field_Type_Enum.List,
        field_sub_type: Field_Sub_Type_Enum.MultiSelect,
        input_type: Input_Type_Enum.String,
        label: 'Multi-Checkbox Selector',
        description: 'Allows selecting multiple options from list',
    },
    {
        example_json: {
            available: false,
        },
        root_json_name: 'product',
        field_type: Field_Type_Enum.Boolean,
        input_type: Input_Type_Enum.Bool,
        label: 'Boolean Field',
        description: 'True or False togget input',
    },
    {
        example_json: {
            id: '85547957',
            file_name: 'heart.jpg',
            url: 'https://..../media/heart.jpg',
        },
        root_json_name: 'image',
        field_type: Field_Type_Enum.Media,
        input_type: Input_Type_Enum.String,
        label: 'File Upload',
        description: 'Upload and Tag images or files',
    },
    {
        example_json: {
            quantity: 12,
        },
        root_json_name: 'product',
        field_type: Field_Type_Enum.Number,
        input_type: Input_Type_Enum.Int,
        label: 'Integer Field',
        description: 'Input for whole numbers only',
    },
    {
        example_json: {
            price: 14.99,
        },
        root_json_name: 'product',
        field_type: Field_Type_Enum.Number,
        input_type: Input_Type_Enum.Double,
        label: 'Decimal Field',
        description: 'Input for decimal numbers',
    },
    {
        example_json: {
            lat: 29.5898756,
            lon: 12.66987888,
        },
        root_json_name: 'shop_location',
        field_type: Field_Type_Enum.Geo,
        input_type: Input_Type_Enum.Geo,
        label: 'GeoPoint Field',
        description: 'Latitute & Longitute input',
    },
]; 