import { httpService } from "../../services/httpService";
import {
  ACCESS_TOKENS_LIST,
  ACCESS_TOKENS_CREATE,
  ACCESS_TOKENS_REVOKE,
  ACCESS_TOKENS_ROTATE,
  ACCESS_TOKENS_CATALOG,
  ACCESS_TOKENS_ADMINISTRABLE_PROJECTS,
} from "../../constants/api";
import type {
  AccessTokenCatalog,
  AccessTokenListResponse,
  AdministrableProjectsResponse,
  CreateAccessTokenPayload,
  MintAccessTokenResponse,
  RevokeAccessTokenPayload,
  RotateAccessTokenPayload,
} from "./types";

export async function fetchAccessTokens(): Promise<AccessTokenListResponse> {
  const response = await httpService.get(ACCESS_TOKENS_LIST);
  return response.data as AccessTokenListResponse;
}

export async function createAccessTokenApi(
  payload: CreateAccessTokenPayload,
): Promise<MintAccessTokenResponse> {
  const response = await httpService.post(ACCESS_TOKENS_CREATE, payload);
  return response.data as MintAccessTokenResponse;
}

export async function revokeAccessTokenApi(payload: RevokeAccessTokenPayload) {
  return httpService.post(ACCESS_TOKENS_REVOKE, payload);
}

export async function rotateAccessTokenApi(
  payload: RotateAccessTokenPayload,
): Promise<MintAccessTokenResponse> {
  const response = await httpService.post(ACCESS_TOKENS_ROTATE, payload);
  return response.data as MintAccessTokenResponse;
}

export async function fetchAccessTokenCatalog(): Promise<AccessTokenCatalog> {
  const response = await httpService.get(ACCESS_TOKENS_CATALOG);
  return response.data as AccessTokenCatalog;
}

export async function fetchAdministrableProjects(): Promise<AdministrableProjectsResponse> {
  const response = await httpService.get(ACCESS_TOKENS_ADMINISTRABLE_PROJECTS);
  return response.data as AdministrableProjectsResponse;
}
