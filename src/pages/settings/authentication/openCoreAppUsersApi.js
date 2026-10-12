import { useQueryClient } from "@tanstack/react-query";
import { useCreateUserMutation, useDeleteUserMutation, useResetUserPasswordMutation, useSearchUsersQuery, useUpdateUserMutation, } from "../../../generated_gql/tanstack-query";
/** Open-core codegen hooks (TypedDocumentString — works with graphqlFetcher). */
export function useOpenCoreAppUsersApi() {
    const queryClient = useQueryClient();
    return {
        useSearchUsersQuery: (variables, options) => useSearchUsersQuery(variables, options),
        useCreateUserMutation: (options) => useCreateUserMutation(options),
        useUpdateUserMutation: (options) => useUpdateUserMutation(options),
        useDeleteUserMutation: (options) => useDeleteUserMutation(options),
        useResetUserPasswordMutation: (options) => useResetUserPasswordMutation(options),
        invalidateSearch: () => {
            void queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
        },
    };
}
