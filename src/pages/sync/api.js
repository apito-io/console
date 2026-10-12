import { httpService } from "../../services/httpService";
import { SYNC_TOKEN_CREATE, SYNC_TOKEN_DELETE, SYNC_TOKEN_LIST, } from "../../constants/api";
export async function fetchSyncTokens() {
    const response = await httpService.get(SYNC_TOKEN_LIST);
    return response.data;
}
export async function createSyncTokenApi(payload) {
    return httpService.post(SYNC_TOKEN_CREATE, payload);
}
export async function deleteSyncTokenApi(payload) {
    return httpService.post(SYNC_TOKEN_DELETE, payload);
}
