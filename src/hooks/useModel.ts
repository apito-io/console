import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import type {
  ModelType,
  ModelField,
  ModelConnection,
  FieldFormData,
  RelationFormData,
  ModelFormData
} from '../types/model';
import {
  useCreateModelMutation,
  useUpdateModelMutation,
  useUpsertFieldToModelMutation,
  useUpdateModelRelationMutation,
  useModelFieldOperationMutation,
  useRearrangeFieldSerialMutation,
  useGetOnlyModelsInfoQuery,
  Input_Type_Enum,
  UpdateModelTypeEnum,
  Field_Operation_Type_Enum,
} from '../generated_gql/tanstack-query';
import { invalidateModelQueries } from '../lib/schemaCache';

export interface UseModelReturn {
  models: ModelType[];
  currentModel: ModelType | null;
  loading: boolean;
  error: string | null;

  createModel: (data: ModelFormData) => Promise<boolean>;
  updateModel: (modelName: string, data: Partial<ModelFormData>) => Promise<boolean>;
  deleteModel: (modelName: string) => Promise<boolean>;
  selectModel: (modelName: string) => void;

  createField: (modelName: string, data: FieldFormData) => Promise<boolean>;
  updateField: (modelName: string, fieldName: string, data: Partial<FieldFormData>) => Promise<boolean>;
  deleteField: (modelName: string, fieldName: string) => Promise<boolean>;
  reorderField: (modelName: string, fieldName: string, newSerial: number, oldSerial: number, parentField?: string) => Promise<boolean>;

  createRelation: (data: RelationFormData) => Promise<boolean>;
  updateRelation: (relationId: string, data: Partial<RelationFormData>) => Promise<boolean>;
  deleteRelation: (relationId: string) => Promise<boolean>;

  refreshModels: () => Promise<void>;
  getFieldsByModel: (modelName: string) => ModelField[];
  getRelationsByModel: (modelName: string) => ModelConnection[];
}

export const useModel = (): UseModelReturn => {
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: modelsData,
    isLoading: modelsLoading,
    error: modelsError,
    refetch: refetchModels,
  } = useGetOnlyModelsInfoQuery();

  const { mutateAsync: createModelMutation } = useCreateModelMutation();
  const { mutateAsync: updateModelMutation } = useUpdateModelMutation();
  const { mutateAsync: upsertFieldMutation } = useUpsertFieldToModelMutation();
  const { mutateAsync: updateRelationMutation } = useUpdateModelRelationMutation();
  const { mutateAsync: fieldOperationMutation } = useModelFieldOperationMutation();
  const { mutateAsync: updateFieldSerialMutation } = useRearrangeFieldSerialMutation();

  const models: ModelType[] = useMemo(() => {
    return modelsData?.projectModelsInfo?.map((model) => ({
      id: model?.name ?? '',
      name: model?.name ?? '',
      singlePage: model?.single_page ?? undefined,
      singlePageUuid: model?.single_page_uuid ?? undefined,
      systemGenerated: model?.system_generated ?? undefined,
      hasConnections: model?.has_connections ?? undefined,
      enableRevision: model?.enable_revision ?? undefined,
      revisionFilter: model?.revision_filter
        ?.filter((item): item is NonNullable<typeof item> => item != null)
        .map((item) => ({
          key: item?.key ?? "",
          value: item?.value ?? "",
        })),
      fields: [],
      connections: [],
    })) || [];
  }, [modelsData]);

  const loading = modelsLoading;

  const invalidateModels = useCallback(async (modelName?: string) => {
    await invalidateModelQueries(queryClient, modelName);
    await refetchModels();
  }, [queryClient, refetchModels]);

  const createModel = useCallback(async (data: ModelFormData): Promise<boolean> => {
    try {
      setError(null);
      const result = await createModelMutation({
        name: data.name,
        single_record: data.singleRecord || false,
        is_common_model: data.isCommonModel || false,
      });

      if (result.addModelToProject) {
        message.success(`Model "${data.name}" created successfully`);
        await invalidateModels(data.name);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create model';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [createModelMutation, invalidateModels]);

  const updateModel = useCallback(async (modelName: string, data: Partial<ModelFormData>): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateModelMutation({
        model_name: modelName,
        type: UpdateModelTypeEnum.Rename,
        new_name: data.name,
      });

      if (result.updateModel) {
        message.success(`Model "${modelName}" updated successfully`);
        await invalidateModels(data.name ?? modelName);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update model';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateModelMutation, invalidateModels]);

  const deleteModel = useCallback(async (modelName: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateModelMutation({
        model_name: modelName,
        type: UpdateModelTypeEnum.Delete,
      });

      if (result.updateModel) {
        message.success(`Model "${modelName}" deleted successfully`);
        await invalidateModels();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete model';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateModelMutation, invalidateModels]);

  const selectModel = useCallback((modelName: string) => {
    const model = models.find(m => m.name === modelName);
    setCurrentModel(model || null);
  }, [models]);

  const createField = useCallback(async (modelName: string, data: FieldFormData): Promise<boolean> => {
    try {
      setError(null);
      const result = await upsertFieldMutation({
        model_name: modelName,
        field_label: data.label,
        field_type: data.fieldType.toUpperCase() as never,
        field_sub_type: data.subType?.toUpperCase() as never,
        input_type: data.inputType as unknown as Input_Type_Enum,
        field_description: data.description,
        validation: data.validation,
        parent_field: data.parent_field,
      });

      if (result.upsertFieldToModel) {
        message.success(`Field "${data.label}" created successfully`);
        await invalidateModels(modelName);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [upsertFieldMutation, invalidateModels]);

  const updateField = useCallback(async (modelName: string, fieldName: string, data: Partial<FieldFormData>): Promise<boolean> => {
    try {
      setError(null);
      const result = await upsertFieldMutation({
        model_name: modelName,
        field_label: data.label || fieldName,
        field_description: data.description,
        is_update: true,
        validation: data.validation,
        parent_field: data.parent_field,
      });

      if (result.upsertFieldToModel) {
        message.success(`Field "${fieldName}" updated successfully`);
        await invalidateModels(modelName);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [upsertFieldMutation, invalidateModels]);

  const deleteField = useCallback(async (modelName: string, fieldName: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await fieldOperationMutation({
        type: Field_Operation_Type_Enum.Delete,
        model_name: modelName,
        field_name: fieldName,
      });

      if (result.modelFieldOperation) {
        message.success(`Field "${fieldName}" deleted successfully`);
        await invalidateModels(modelName);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [fieldOperationMutation, invalidateModels]);

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
        model_name: modelName,
        field_name: fieldName,
        new_position: newSerial,
        move_type: "reorder",
        parent_id: parentField || undefined,
      });

      if (result.rearrangeSerialOfField) {
        message.success('Field order updated successfully');
        await invalidateModels(modelName);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder field';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateFieldSerialMutation, invalidateModels]);

  const createRelation = useCallback(async (data: RelationFormData): Promise<boolean> => {
    try {
      setError(null);
      const result = await updateRelationMutation({
        from: data.fromModel,
        to: data.toModel,
        forward_connection_type: data.forwardConnectionType.toUpperCase() as never,
        reverse_connection_type: data.reverseConnectionType.toUpperCase() as never,
        known_as: data.knownAs,
      });

      if (result.upsertConnectionToModel) {
        message.success('Relationship created successfully');
        await invalidateModels(data.fromModel);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create relationship';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    }
  }, [updateRelationMutation, invalidateModels]);

  const updateRelation = useCallback(async (_relationId: string, _data: Partial<RelationFormData>): Promise<boolean> => {
    return false;
  }, []);

  const deleteRelation = useCallback(async (_relationId: string): Promise<boolean> => {
    return false;
  }, []);

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
    error: error || (modelsError instanceof Error ? modelsError.message : null),

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
