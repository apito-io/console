import { httpService } from "../../services/httpService";
import { USER_PROFILE, CHANGE_PASSWORD } from "../../constants/api";

export async function fetchUserProfile() {
  const response = await httpService.get(USER_PROFILE);
  return response.data?.body ?? {};
}

export async function updateUserProfile(values: Record<string, unknown>) {
  return httpService.post(USER_PROFILE, values);
}

export async function changePasswordApi(payload: {
  old_password: string;
  new_password: string;
}) {
  return httpService.post(CHANGE_PASSWORD, payload);
}
