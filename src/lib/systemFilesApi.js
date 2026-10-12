import { FILES_DELETE_PATH, FILES_LIST_PATH, FILES_UPLOAD_PATH, } from "../constants/api";
import { httpService } from "../services/httpService";
function extractErrorMessage(err) {
    if (err && typeof err === "object" && "response" in err) {
        const data = err.response
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
export async function listProjectFiles(params = {}) {
    const { fileType, limit = 50, offset = 0 } = params;
    try {
        const res = await httpService.get(FILES_LIST_PATH, {
            params: {
                ...(fileType ? { file_type: fileType } : {}),
                limit,
                offset,
            },
        });
        return res.data;
    }
    catch (err) {
        throw new Error(extractErrorMessage(err));
    }
}
export async function uploadProjectFile(file, fileType) {
    const form = new FormData();
    form.append("file", file);
    if (fileType) {
        form.append("file_type", fileType);
    }
    try {
        const res = await httpService.post(FILES_UPLOAD_PATH, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data.success) {
            throw new Error(res.data.message ?? "Upload failed");
        }
        return res.data;
    }
    catch (err) {
        throw new Error(extractErrorMessage(err));
    }
}
export async function deleteProjectFiles(ids) {
    try {
        const res = await httpService.post(FILES_DELETE_PATH, { ids });
        if (!res.data.success) {
            throw new Error(res.data.message ?? "Delete failed");
        }
        return res.data;
    }
    catch (err) {
        throw new Error(extractErrorMessage(err));
    }
}
