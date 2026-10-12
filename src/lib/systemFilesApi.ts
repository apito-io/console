import {
  FILES_DELETE_PATH,
  FILES_LIST_PATH,
  FILES_UPLOAD_PATH,
} from "../constants/api";
import { httpService } from "../services/httpService";
import type {
  ListProjectFilesParams,
  ProjectFileUploadResponse,
  ProjectFilesDeleteResponse,
  ProjectFilesListResponse,
} from "../types/projectFile";

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string } } }).response
      ?.data;
    if (data?.message) {
      return data.message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Request failed";
}

export async function listProjectFiles(
  params: ListProjectFilesParams = {}
): Promise<ProjectFilesListResponse> {
  const { fileType, limit = 50, offset = 0 } = params;
  try {
    const res = await httpService.get<ProjectFilesListResponse>(FILES_LIST_PATH, {
      params: {
        ...(fileType ? { file_type: fileType } : {}),
        limit,
        offset,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function uploadProjectFile(
  file: File,
  fileType?: string
): Promise<ProjectFileUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  if (fileType) {
    form.append("file_type", fileType);
  }
  try {
    const res = await httpService.post<ProjectFileUploadResponse>(
      FILES_UPLOAD_PATH,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (!res.data.success) {
      throw new Error(res.data.message ?? "Upload failed");
    }
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function deleteProjectFiles(
  ids: string[]
): Promise<ProjectFilesDeleteResponse> {
  try {
    const res = await httpService.post<ProjectFilesDeleteResponse>(
      FILES_DELETE_PATH,
      { ids }
    );
    if (!res.data.success) {
      throw new Error(res.data.message ?? "Delete failed");
    }
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}
