// API-based field structure matching GraphQL schema
export interface FieldValidation {
  as_title?: boolean;
  char_limit?: number;
  double_range_limit?: { min?: number; max?: number };
  fixed_list_elements?: string[];
  fixed_list_element_type?: string;
  hide?: boolean;
  is_email?: boolean;
  is_gallery?: boolean;
  is_multi_choice?: boolean;
  is_password?: boolean;
  int_range_limit?: { min?: number; max?: number };
  locals?: string[];
  placeholder?: string;
  required?: boolean;
  unique?: boolean;
}

export interface SubFieldInfo {
  serial?: number;
  identifier?: string;
  label?: string;
  input_type?: string;
  field_type?: string;
  field_sub_type?: string;
  description?: string;
  system_generated?: boolean;
  parent_field?: string;
  validation?: FieldValidation;
  sub_field_info?: SubFieldInfo[];
}

export interface FieldInfo {
  serial?: number;
  identifier?: string;
  label?: string;
  input_type?: string;
  field_type?: string;
  field_sub_type?: string;
  description?: string;
  system_generated?: boolean;
  parent_field?: string;
  validation?: FieldValidation;
  sub_field_info?: SubFieldInfo[];
  id?: string; // For drag and drop functionality
}

export interface ConnectionInfo {
  model?: string;
  relation?: string;
  type?: string;
  known_as?: string;
}

export interface ModelInfo {
  name?: string;
  locals?: string[];
  single_page?: boolean;
  single_page_uuid?: string;
  system_generated?: boolean;
  fields?: FieldInfo[];
  connections?: ConnectionInfo[];
}

// Legacy interfaces for backward compatibility
export interface ModelField {
  id: string;
  identifier: string;
  label: string;
  description?: string;
  fieldName: string;
  type: FieldType;
  subType?: FieldSubType;
  inputType: InputType;
  serial: number;
  isSystem?: boolean;
  isRequired?: boolean;
  validation?: ModelFieldValidation;
  repeatedGroupIdentifier?: string;
  parentField?: string;
  systemGenerated?: boolean;
}

export interface ModelFieldValidation {
  required?: boolean;
  locals?: string[];
  isMultiChoice?: boolean;
  intRangeLimit?: {
    min?: number;
    max?: number;
  };
  hide?: boolean;
  fixedListElements?: string[];
  fixedListElementType?: string;
  doubleRangeLimit?: {
    min?: number;
    max?: number;
  };
  charLimit?: {
    min?: number;
    max?: number;
  };
  asTitle?: boolean;
  isEmail?: boolean;
  unique?: boolean;
  placeholder?: string;
  isGallery?: boolean;
}

export interface ModelConnection {
  id: string;
  name: string;
  description: string;
  type: RelationType;
  model: string;
  knownAs?: string;
  forwardConnectionType: RelationType;
  reverseConnectionType: RelationType;
}

export interface ModelType {
  id: string;
  name: string;
  description?: string;
  fields: ModelField[];
  connections: ModelConnection[];
  singlePage?: boolean;
  singlePageUuid?: string;
  systemGenerated?: boolean;
  hasConnections?: boolean;
  isTenantModel?: boolean;
  enableRevision?: boolean;
  revisionFilter?: {
    key: string;
    value: string;
  }[];
}

export type FieldType =
  | 'text'
  | 'richtext'
  | 'datetime'
  | 'file'
  | 'boolean'
  | 'number'
  | 'array'
  | 'object'
  | 'relation'
  | 'repeated';

export type FieldSubType =
  | 'string'
  | 'integer'
  | 'float'
  | 'double'
  | 'long'
  | 'email'
  | 'password'
  | 'url'
  | 'phone'
  | 'textarea'
  | 'markdown'
  | 'html'
  | 'json'
  | 'single_select'
  | 'multi_select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'color'
  | 'date'
  | 'time'
  | 'image'
  | 'video'
  | 'audio'
  | 'document';

export type InputType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'RICHTEXT'
  | 'NUMBER'
  | 'EMAIL'
  | 'PASSWORD'
  | 'URL'
  | 'PHONE'
  | 'DATE'
  | 'TIME'
  | 'DATETIME'
  | 'BOOLEAN'
  | 'SELECT'
  | 'MULTI_SELECT'
  | 'CHECKBOX'
  | 'RADIO'
  | 'FILE'
  | 'IMAGE'
  | 'ARRAY'
  | 'OBJECT'
  | 'RELATION';

export type RelationType =
  | 'hasOne'
  | 'hasMany'
  | 'belongsTo'
  | 'belongsToMany'
  | 'morphOne'
  | 'morphMany';

export type FieldOperationType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'RENAME'
  | 'MOVE';

export interface FieldTypeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fieldType: FieldType;
  inputType: InputType;
  subType?: FieldSubType;
  validation?: Partial<ModelFieldValidation>;
}

export interface ModelFormData {
  name: string;
  description?: string;
  singleRecord?: boolean;
}

export interface FieldFormData {
  label: string;
  description?: string;
  fieldType: FieldType;
  inputType: InputType;
  subType?: FieldSubType;
  validation?: ModelFieldValidation;
  parent_field?: string;
}

export interface RelationFormData {
  fromModel: string;
  toModel: string;
  forwardConnectionType: RelationType;
  reverseConnectionType: RelationType;
  knownAs?: string;
}

// Drag and Drop interfaces
export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'field' | 'relation';
        item: ModelField | ModelConnection;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        accepts: ('field' | 'relation')[];
      };
    };
  } | null;
}

export interface SortableItemData {
  type: 'field' | 'relation';
  item: ModelField | ModelConnection | FieldInfo;
  accepts?: ('field' | 'relation')[];
}

// Drawer interfaces for model operations
export interface DrawerParam {
  field: FieldInfo;
  type: 'duplicate' | 'rename' | 'delete' | 'configure';
  objectIdentifier: string;
} 