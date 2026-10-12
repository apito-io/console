import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { accountKeys } from "../../lib/queryKeys";
import { fetchUserProfile, updateUserProfile, changePasswordApi, } from "./api";
export function useUserProfileQuery() {
    return useQuery({
        queryKey: accountKeys.profile(),
        queryFn: fetchUserProfile,
    });
}
export function useUpdateProfileMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (values) => updateUserProfile(values),
        onSuccess: (response) => {
            message.success(response.data?.message || "Profile updated successfully");
            void qc.invalidateQueries({ queryKey: accountKeys.all });
        },
        onError: () => {
            message.error("Failed to update profile");
        },
    });
}
export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: changePasswordApi,
        onSuccess: (response) => {
            message.success(response.data?.message || "Password changed successfully");
        },
        onError: () => {
            message.error("Failed to change password");
        },
    });
}
