import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { syncKeys } from "../../lib/queryKeys";
import { fetchSyncTokens, createSyncTokenApi, deleteSyncTokenApi, } from "./api";
export function useSyncTokensQuery() {
    return useQuery({
        queryKey: syncKeys.tokens(),
        queryFn: fetchSyncTokens,
    });
}
export function useCreateSyncTokenMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => createSyncTokenApi(payload),
        onSuccess: async () => {
            message.success("Access token generated successfully!");
            await qc.invalidateQueries({ queryKey: syncKeys.all });
        },
        onError: (err) => {
            message.error(`Error generating access token: ${err.message}`);
        },
    });
}
export function useDeleteSyncTokenMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => deleteSyncTokenApi(payload),
        onSuccess: async () => {
            message.success("Access token deleted successfully!");
            await qc.invalidateQueries({ queryKey: syncKeys.all });
        },
        onError: (err) => {
            message.error(`Error deleting access token: ${err.message}`);
        },
    });
}
/**
 * @deprecated Prefer useSyncTokensQuery + mutations. Same shape as legacy hook.
 */
export function useSyncToken() {
    const q = useSyncTokensQuery();
    const createM = useCreateSyncTokenMutation();
    const deleteM = useDeleteSyncTokenMutation();
    return {
        syncTokens: q.data?.tokens ?? [],
        projectSecretKey: q.data?.project_secret_key ?? "",
        isLoading: q.isPending || q.isLoading,
        isCreating: createM.isPending,
        isDeleting: deleteM.isPending,
        error: q.error ? q.error.message : null,
        createSyncToken: async (payload) => {
            try {
                await createM.mutateAsync(payload);
                return true;
            }
            catch {
                return false;
            }
        },
        deleteSyncToken: async (payload) => {
            try {
                await deleteM.mutateAsync(payload);
                return true;
            }
            catch {
                return false;
            }
        },
        refetch: () => q.refetch(),
    };
}
