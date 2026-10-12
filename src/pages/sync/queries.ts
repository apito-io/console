import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { accessTokenKeys } from "../../lib/queryKeys";
import {
  fetchAccessTokens,
  createAccessTokenApi,
  revokeAccessTokenApi,
  rotateAccessTokenApi,
  fetchAccessTokenCatalog,
  fetchAdministrableProjects,
} from "./api";
import type {
  CreateAccessTokenPayload,
  RevokeAccessTokenPayload,
  RotateAccessTokenPayload,
} from "./types";

export function useAccessTokensQuery() {
  return useQuery({
    queryKey: accessTokenKeys.list(),
    queryFn: fetchAccessTokens,
  });
}

export function useAccessTokenCatalogQuery() {
  return useQuery({
    queryKey: accessTokenKeys.catalog(),
    queryFn: fetchAccessTokenCatalog,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdministrableProjectsQuery() {
  return useQuery({
    queryKey: accessTokenKeys.administrableProjects(),
    queryFn: fetchAdministrableProjects,
    staleTime: 60 * 1000,
  });
}

export function useCreateAccessTokenMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAccessTokenPayload) =>
      createAccessTokenApi(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: accessTokenKeys.list() });
    },
    onError: (err: Error) => {
      message.error(`Error generating access token: ${err.message}`);
    },
  });
}

export function useRevokeAccessTokenMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RevokeAccessTokenPayload) =>
      revokeAccessTokenApi(payload),
    onSuccess: async () => {
      message.success("Access token revoked.");
      await qc.invalidateQueries({ queryKey: accessTokenKeys.list() });
    },
    onError: (err: Error) => {
      message.error(`Error revoking access token: ${err.message}`);
    },
  });
}

export function useRotateAccessTokenMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RotateAccessTokenPayload) =>
      rotateAccessTokenApi(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: accessTokenKeys.list() });
    },
    onError: (err: Error) => {
      message.error(`Error rotating access token: ${err.message}`);
    },
  });
}
