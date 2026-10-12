import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateModelMutation, useUpdateModelMutation, useUpsertFieldToModelMutation, useUpdateModelRelationMutation, useModelFieldOperationMutation, useRearrangeFieldSerialMutation, useGetOnlyModelsInfoQuery, UpdateModelTypeEnum, Field_Operation_Type_Enum, } from '../generated_gql/tanstack-query';
import { invalidateModelQueries } from '../lib/schemaCache';
export const useModel = () => {
    const [currentModel, setCurrentModel] = useState(null);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const { data: modelsData, isLoading: modelsLoading, error: modelsError, refetch: refetchModels, } = useGetOnlyModelsInfoQuery();
    const { mutateAsync: createModelMutation } = useCreateModelMutation();
    const { mutateAsync: updateModelMutation } = useUpdateModelMutation();
    const { mutateAsync: upsertFieldMutation } = useUpsertFieldToModelMutation();
    const { mutateAsync: updateRelationMutation } = useUpdateModelRelationMutation();
    const { mutateAsync: fieldOperationMutation } = useModelFieldOperationMutation();
    const { mutateAsync: updateFieldSerialMutation } = useRearrangeFieldSerialMutation();
    const models = useMemo(() => {
        return modelsData?.projectModelsInfo?.map((model) => ({
            id: model?.name ?? '',
            name: model?.name ?? '',
            singlePage: model?.single_page ?? undefined,
            singlePageUuid: model?.single_page_uuid ?? undefined,
            systemGenerated: model?.system_generated ?? undefined,
            hasConnections: model?.has_connections ?? undefined,
            enableRevision: model?.enable_revision ?? undefined,
            revisionFilter: model?.revision_filter
                ?.filter((item) => item != null)
                .map((item) => ({
                key: item?.key ?? "",
                value: item?.value ?? "",
            })),
            fields: [],
            connections: [],
        })) || [];
    }, [modelsData]);
    const loading = modelsLoading;
    const invalidateModels = useCallback(async (modelName) => {
        await invalidateModelQueries(queryClient, modelName);
        await refetchModels();
    }, [queryClient, refetchModels]);
    const createModel = useCallback(async (data) => {
        try {
            setError(null);
            const result = await createModelMutation({
                name: data.name,
                single_record: data.singleRecord || false,
            });
            if (result.addModelToProject) {
                message.success(`Model "${data.name}" created successfully`);
                await invalidateModels(data.name);
                return true;
            }
            return false;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create model';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [createModelMutation, invalidateModels]);
    const updateModel = useCallback(async (modelName, data) => {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update model';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [updateModelMutation, invalidateModels]);
    const deleteModel = useCallback(async (modelName) => {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete model';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [updateModelMutation, invalidateModels]);
    const selectModel = useCallback((modelName) => {
        const model = models.find(m => m.name === modelName);
        setCurrentModel(model || null);
    }, [models]);
    const createField = useCallback(async (modelName, data) => {
        try {
            setError(null);
            const result = await upsertFieldMutation({
                model_name: modelName,
                field_label: data.label,
                field_type: data.fieldType.toUpperCase(),
                field_sub_type: data.subType?.toUpperCase(),
                input_type: data.inputType,
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create field';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [upsertFieldMutation, invalidateModels]);
    const updateField = useCallback(async (modelName, fieldName, data) => {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update field';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [upsertFieldMutation, invalidateModels]);
    const deleteField = useCallback(async (modelName, fieldName) => {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete field';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [fieldOperationMutation, invalidateModels]);
    const reorderField = useCallback(async (modelName, fieldName, newSerial, oldSerial, parentField = '') => {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reorder field';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [updateFieldSerialMutation, invalidateModels]);
    const createRelation = useCallback(async (data) => {
        try {
            setError(null);
            const result = await updateRelationMutation({
                from: data.fromModel,
                to: data.toModel,
                forward_connection_type: data.forwardConnectionType.toUpperCase(),
                reverse_connection_type: data.reverseConnectionType.toUpperCase(),
                known_as: data.knownAs,
            });
            if (result.upsertConnectionToModel) {
                message.success('Relationship created successfully');
                await invalidateModels(data.fromModel);
                return true;
            }
            return false;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create relationship';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        }
    }, [updateRelationMutation, invalidateModels]);
    const updateRelation = useCallback(async (_relationId, _data) => {
        return false;
    }, []);
    const deleteRelation = useCallback(async (_relationId) => {
        return false;
    }, []);
    const refreshModels = useCallback(async () => {
        await refetchModels();
    }, [refetchModels]);
    const getFieldsByModel = useCallback((modelName) => {
        const model = models.find(m => m.name === modelName);
        return model?.fields || [];
    }, [models]);
    const getRelationsByModel = useCallback((modelName) => {
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
