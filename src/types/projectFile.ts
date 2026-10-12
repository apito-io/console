export type ProjectFileType = "media" | "pdf" | "document" | "other";

export interface ProjectFile {
  id: string;
  file_type: ProjectFileType | string;
  file_name: string;
  file_extension?: string;
  content_type?: string;
  size: number;
  url: string;
  created_by?: string;
  created_at?: string;
}

export interface ProjectFilesListResponse {
  success: boolean;
  files: ProjectFile[];
  total: number;
  message?: string;
}

export interface ProjectFileUploadResponse {
  success: boolean;
  file?: ProjectFile;
  message?: string;
}

export interface ProjectFilesDeleteResponse {
  success: boolean;
  message?: string;
}

export interface ListProjectFilesParams {
  fileType?: string;
  limit?: number;
  offset?: number;
}
