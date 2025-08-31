import { useState, useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { message } from 'antd';
import type {
  ModelType,
  ModelField,
  ModelConnection,
  FieldFormData,
  RelationFormData,
  ModelFormData
} from '../types/model';
import {
  // GET_ALL_MODELS, // Commented out - not exported from module
  // GET_SELECTED_MODEL_LIST_DETAILED, // Commented out - unused
} from '../graphql/queries/models';
import {
  CREATE_MODEL,
  UPDATE_MODEL,
  UPSERT_FIELD_TO_MODEL,
  UPDATE_MODEL_RELATION,
  MODEL_FIELD_OPERATION,
  UPDATE_FIELD_SERIAL,
} from '../graphql/mutations/models';

export interface UseModelReturn {
  // Data
  models: ModelType[];
  currentModel: ModelType | null;
  loading: boolean;
  error: string | null;

  // Model operations
  createModel: (data: ModelFormData) => Promise<boolean>;
  updateModel: (modelName: string, data: Partial<ModelFormData>) => Promise<boolean>;
  deleteModel: (modelName: string) => Promise<boolean>;
  selectModel: (modelName: string) => void;

  // Field operations
  createField: (modelName: string, data: FieldFormData) => Promise<boolean>;
  updateField: (modelName: string, fieldName: string, data: Partial<FieldFormData>) => Promise<boolean>;
  deleteField: (modelName: string, fieldName: string, isRelation?: boolean) => Promise<boolean>;
  reorderField: (modelName: string, fieldName: string, newSerial: number, oldSerial: number, parentField?: string) => Promise<boolean>;

  // Relationship operations
  createRelation: (data: RelationFormData) => Promise<boolean>;
  updateRelation: (relationId: string, data: Partial<RelationFormData>) => Promise<boolean>;
  deleteRelation: (relationId: string) => Promise<boolean>;

  // Utility functions
  refreshModels: () => Promise<void>;
  getFieldsByModel: (modelName: string) => ModelField[];
  getRelationsByModel: (modelName: string) => ModelConnection[];
}

export const useModel = (): UseModelReturn => {
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Queries
  const {
    data: modelsData,
    loading: modelsLoading,
    error: modelsError,
    refetch: refetchModels
  } = {} as any; // useQuery(GET_ALL_MODELS); // Commented out - query not available

  // Mutations
  const [createModelMutation] = useMutation(CREATE_MODEL);
  const [updateModelMutation] = useMutation(UPDATE_MODEL);
  const [upsertFieldMutation] = useMutation(UPSERT_FIELD_TO_MODEL);
  const [updateRelationMutation] = useMutation(UPDATE_MODEL_RELATION);
  const [_fieldOperationMutation] = useMutation(MODEL_FIELD_OPERATION);
  const [updateFieldSerialMutation] = useMutation(UPDATE_FIELD_SERIAL);

  // Transform GraphQL data to our types
  const models: ModelType[] = useMemo(() => {
    return modelsData?.projectModelsInfo?.map((model: any) => ({
      id: model.name,
      name: model.name,
      singlePage: model.single_page,
      singlePageUuid: model.single_page_uuid,
      systemGenerated: model.system_generated,
      hasConnections: model.has_connections,
      isTenantModel: model.is_tenant_model,
      isCommonModel: model.is_common_model,
      enableRevision: model.enable_revision,
      revisionFilter: model.revision_filter,
      fields: [],
      connections: [],
    })) || [];
  }, [modelsData]);

  const loading = modelsLoading;

  // Model operations
  const createModel = useCallback(async (data: ModelFormData): Promise<boolean> => {
    try {
      setError(null);
      const result = await createModelMutation({
        variables: {
          name: data.name,
          single_record: data.singleRecord || false,
        },
      });

      if (result.data?.addModelToProject) {
        message.success(`Model "${data.name}" created successfully`);
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create model';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [createModelMutation, refetchModels]);

  const updateModel = useCallback(async (modelName: string, data: Partial<ModelFormData>): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateModelMutation({
        variables: {
          model_name: modelName,
          type: 'RENAME',
          new_name: data.name,
        },
      });

      if (result.data?.updateModel) {
        message.success(`Model "${modelName}" updated successfully`);
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update model';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateModelMutation, refetchModels]);

  const deleteModel = useCallback(async (modelName: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateModelMutation({
        variables: {
          model_name: modelName,
          type: 'DELETE',
        },
      });

      if (result.data?.updateModel) {
        message.success(`Model "${modelName}" deleted successfully`);
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete model';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateModelMutation, refetchModels]);

  const selectModel = useCallback((modelName: string) => {
    const model = models.find(m => m.name === modelName);
    setCurrentModel(model || null);
  }, [models]);

  // Field operations
  const createField = useCallback(async (modelName: string, data: FieldFormData): Promise<boolean> => {
    try {
      setError(null);
      const result = await upsertFieldMutation({
        variables: {
          model_name: modelName,
          field_label: data.label,
          field_type: data.fieldType.toUpperCase(),
          field_sub_type: data.subType?.toUpperCase(),
          input_type: data.inputType,
          field_description: data.description,
          validation: data.validation,
          parent_field: data.parent_field,
        },
      });

      if (result.data?.upsertFieldToModel) {
        message.success(`Field "${data.label}" created successfully`);
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [upsertFieldMutation, refetchModels]);

  const updateField = useCallback(async (modelName: string, fieldName: string, data: Partial<FieldFormData>): Promise<boolean> => {
    try {
      setError(null);
      const result = await upsertFieldMutation({
        variables: {
          model_name: modelName,
          field_label: data.label || fieldName,
          field_description: data.description,
          is_update: true,
          validation: data.validation,
          parent_field: data.parent_field,
        },
      });

      if (result.data?.upsertFieldToModel) {
        message.success(`Field "${fieldName}" updated successfully`);
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [upsertFieldMutation, refetchModels]);

  const deleteField = useCallback(async (modelName: string, fieldName: string, isRelation = false): Promise<boolean> => {
    try {
      setError(null);
      const result = await _fieldOperationMutation({
        variables: {
          model_name: modelName,
          field_name: fieldName,
          operation: 'DELETE',
          is_relation: isRelation,
        },
      });

      if (result.data?.modelFieldOperation) {
        message.success(`Field "${fieldName}" deleted successfully`);
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [_fieldOperationMutation, refetchModels]);

  const reorderField = useCallback(async (
    modelName: string,
    fieldName: string,
    newSerial: number,
    oldSerial: number,
    parentField = ''
  ): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateFieldSerialMutation({
        variables: {
          model_name: modelName,
          field_name: fieldName,
          new_serial: newSerial,
          old_serial: oldSerial,
          parent_field: parentField,
        },
      });

      if (result.data?.rearrangeSerialOfField) {
        message.success('Field order updated successfully');
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateFieldSerialMutation, refetchModels]);

  // Relationship operations
  const createRelation = useCallback(async (data: RelationFormData): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateRelationMutation({
        variables: {
          from: data.fromModel,
          to: data.toModel,
          forward_connection_type: data.forwardConnectionType.toUpperCase(),
          reverse_connection_type: data.reverseConnectionType.toUpperCase(),
          known_as: data.knownAs,
        },
      });

      if (result.data?.upsertConnectionToModel) {
        message.success('Relationship created successfully');
        await refetchModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create relationship';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateRelationMutation, refetchModels]);

  const updateRelation = useCallback(async (_relationId: string, _data: Partial<RelationFormData>): Promise<boolean> => {
    // Implementation for updating relations
    // This would require additional API endpoints
    return false;
  }, []);

  const deleteRelation = useCallback(async (_relationId: string): Promise<boolean> => {
    // Implementation for deleting relations
    // This would require additional API endpoints
    return false;
  }, []);

  // Utility functions
  const refreshModels = useCallback(async () => {
    await refetchModels();
  }, [refetchModels]);

  const getFieldsByModel = useCallback((modelName: string): ModelField[] => {
    const model = models.find(m => m.name === modelName);
    return model?.fields || [];
  }, [models]);

  const getRelationsByModel = useCallback((modelName: string): ModelConnection[] => {
    const model = models.find(m => m.name === modelName);
    return model?.connections || [];
  }, [models]);

  return {
    models,
    currentModel,
    loading,
    error: error || (modelsError?.message || null),

    createModel,
    updateModel,
    deleteModel,
    selectModel,

    createField,
    updateField,
    deleteField,
    reorderField,

    createRelation,
    updateRelation,
    deleteRelation,

    refreshModels,
    getFieldsByModel,
    getRelationsByModel,
  };
}; 