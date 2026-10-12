import { httpService } from "../../services/httpService";
import { USER_PROFILE, CHANGE_PASSWORD } from "../../constants/api";
export async function fetchUserProfile() {
    const response = await httpService.get(USER_PROFILE);
    return response.data?.body ?? {};
}
export async function updateUserProfile(values) {
    return httpService.post(USER_PROFILE, values);
}
export async function changePasswordApi(payload) {
    return httpService.post(CHANGE_PASSWORD, payload);
}
