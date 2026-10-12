import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { projectFileKeys } from "../lib/queryKeys";
import {
  deleteProjectFiles,
  listProjectFiles,
  uploadProjectFile,
} from "../lib/systemFilesApi";
import type { ListProjectFilesParams } from "../types/projectFile";

const DEFAULT_PAGE_SIZE = 50;

export function useProjectFilesInfiniteQuery(
  params: Omit<ListProjectFilesParams, "offset"> = {}
) {
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  const fileType = params.fileType;

  return useInfiniteQuery({
    queryKey: projectFileKeys.list({ fileType, limit }),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      listProjectFiles({ fileType, limit, offset: pageParam }),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const loaded = lastPageParam + lastPage.files.length;
      if (loaded >= lastPage.total) {
        return undefined;
      }
      return loaded;
    },
  });
}

export function useUploadProjectFileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      fileType,
    }: {
      file: File;
      fileType?: string;
    }) => uploadProjectFile(file, fileType),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectFileKeys.all });
    },
  });
}

export function useDeleteProjectFilesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteProjectFiles(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectFileKeys.all });
    },
  });
}
