import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { projectKeys } from "../../lib/queryKeys";
import { fetchProjectList, switchProjectApi, deleteProjectApi, } from "./api";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
export function useProjectsQuery() {
    return useQuery({
        queryKey: projectKeys.list(),
        queryFn: fetchProjectList,
    });
}
export function useSwitchProjectMutation() {
    const qc = useQueryClient();
    const { onBeforeProjectSwitch } = useConsoleExtensions();
    return useMutation({
        mutationFn: async (projectId) => {
            const response = await switchProjectApi(projectId);
            if (response.data.code !== 200) {
                throw new Error("Failed to switch project");
            }
            return response;
        },
        onMutate: async (projectId) => {
            const list = qc.getQueryData(projectKeys.list());
            const project = list?.body?.find((p) => p.id === projectId);
            if (project && onBeforeProjectSwitch) {
                onBeforeProjectSwitch(project);
            }
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: projectKeys.all });
        },
    });
}
export function useDeleteProjectMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const response = await deleteProjectApi(payload);
            if (response.data.code !== 200) {
                throw new Error(response.data.message || "Failed to delete project");
            }
            return response;
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: projectKeys.all });
        },
    });
}
/**
 * @deprecated Prefer useProjectsQuery + mutations directly. Kept for SyncPage
 * until callers migrate; shares the same TanStack Query cache.
 */
export function useProjectList() {
    const q = useProjectsQuery();
    const switchM = useSwitchProjectMutation();
    const deleteM = useDeleteProjectMutation();
    return {
        data: q.data ?? null,
        isLoading: q.isPending || q.isLoading,
        error: q.error ? (q.error.message ?? "Failed to fetch projects") : null,
        refetch: () => q.refetch(),
        switchProject: async (projectId) => {
            await switchM.mutateAsync(projectId);
        },
        deleteProject: async (projectId) => {
            await deleteM.mutateAsync({ id: projectId });
        },
    };
}
