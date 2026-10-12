import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { projectKeys } from "../../lib/queryKeys";
import {
  fetchProjectList,
  switchProjectApi,
  deleteProjectApi,
} from "./api";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import type { ProjectDeleteRequest, ProjectListResponse } from "../../types/project";

export function useProjectsQuery(): UseQueryResult<ProjectListResponse, Error> {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjectList,
  });
}

export function useSwitchProjectMutation() {
  const qc = useQueryClient();
  const { onBeforeProjectSwitch } = useConsoleExtensions();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await switchProjectApi(projectId);
      if (response.data.code !== 200) {
        throw new Error("Failed to switch project");
      }
      return response;
    },
    onMutate: async (projectId: string) => {
      const list = qc.getQueryData<ProjectListResponse>(projectKeys.list());
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
    mutationFn: async (payload: ProjectDeleteRequest) => {
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
    switchProject: async (projectId: string) => {
      await switchM.mutateAsync(projectId);
    },
    deleteProject: async (projectId: string) => {
      await deleteM.mutateAsync({ id: projectId });
    },
  };
}
