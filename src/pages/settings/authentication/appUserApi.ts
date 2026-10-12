export type AppUserRow = {
  id?: string | null;
  email?: string | null;
  username?: string | null;
  phone?: string | null;
  role?: string | null;
  provider?: string | null;
  tenant_id?: string | null;
  /** True when catalog tenant is missing/soft-deleted — orphan for manual cleanup. */
  tenant_missing?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SearchUsersVariables = {
  project_id: string;
  limit?: number;
  offset?: number;
  q?: string;
  tenant_id?: string;
};

export type CreateUserVariables = {
  project_id: string;
  password: string;
  email?: string;
  phone?: string;
  role?: string;
  tenant_id?: string;
};

export type UpdateUserVariables = {
  user_id: string;
  email?: string;
  phone?: string;
  role?: string;
  tenant_id?: string;
};

/** Hook bundle for AppUsersTab — swap open-core vs pro codegen implementations. */
export type AppUsersApi = {
  useSearchUsersQuery: (
    variables: SearchUsersVariables,
    options?: { enabled?: boolean }
  ) => {
    data?: {
      searchUsers?: {
        count?: number | null;
        users?: Array<AppUserRow | null> | null;
      } | null;
    };
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => Promise<unknown>;
  };
  useCreateUserMutation: (options?: {
    onSuccess?: () => void;
    onError?: (e: unknown) => void;
  }) => {
    mutateAsync: (variables: CreateUserVariables) => Promise<unknown>;
    isPending: boolean;
  };
  useUpdateUserMutation: (options?: {
    onSuccess?: () => void;
    onError?: (e: unknown) => void;
  }) => {
    mutateAsync: (variables: UpdateUserVariables) => Promise<unknown>;
    isPending: boolean;
  };
  useDeleteUserMutation: (options?: {
    onSuccess?: () => void;
    onError?: (e: unknown) => void;
  }) => {
    mutateAsync: (variables: { user_id: string }) => Promise<unknown>;
  };
  useResetUserPasswordMutation: (options?: {
    onSuccess?: () => void;
    onError?: (e: unknown) => void;
  }) => {
    mutateAsync: (variables: {
      user_id: string;
      password: string;
    }) => Promise<unknown>;
    isPending: boolean;
  };
  invalidateSearch: () => void;
};
