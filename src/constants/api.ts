import { ENV } from '../utils/env';

export const BASE_URL = ENV.VITE_REST_API;
export const AUTH_VERSION = 'v2';
export const SYSTEM_GRAPHQL_URL = `${BASE_URL}/system/graphql`;
export const CLIENT_GRAPHQL_URL = `${BASE_URL}/secured/graphql`;
export const CLIENT_GRAPHQL_URL_v2 = `${BASE_URL}/secured/graphql/v2`;
export const REST_DOC_URL = `${BASE_URL}/system/doc`;
export const AUTH_URL = `${BASE_URL}/auth/callback`;
export const MEDIA_UPLOAD_URL = `${BASE_URL}/plugin/media/upload`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/auth/refresh/token`;

export const REGISTER_URL = `${BASE_URL}/auth/${AUTH_VERSION}/register`;
export const LOGIN_URL = `${BASE_URL}/auth/${AUTH_VERSION}/login`;
export const LOGOUT_URL = `${BASE_URL}/auth/${AUTH_VERSION}/logout`;

export const GOOGLE_LOGIN_URL = `${BASE_URL}/auth/${AUTH_VERSION}/google/login`;
export const GITHUB_LOGIN_URL = `${BASE_URL}/auth/${AUTH_VERSION}/github/login`;

export const EMAIL_VERIFY = `${BASE_URL}/auth/${AUTH_VERSION}/verify/email`;
export const FORGET_PASSWORD = `${BASE_URL}/auth/${AUTH_VERSION}/forget/password/request`;
export const VERIFY_PASSWORD = `${BASE_URL}/auth/${AUTH_VERSION}/forget/password/verify`;

export const CHANGE_PASSWORD = `${BASE_URL}/auth/${AUTH_VERSION}/change/password`;

export const USER_SUB_FETCH = `${BASE_URL}/system/user/subscription`;
export const USER_SUB_CHECK = `${BASE_URL}/system/user/subscription/check`;

export const PROJECT_NAME_CHECK = `${BASE_URL}/system/project/name/check`;
export const PROJECT_SWITCH = `${BASE_URL}/system/project/switch`;
export const PROJECT_CREATE = `${BASE_URL}/system/project/create`;
export const USER_PROFILE = `${BASE_URL}/system/user/profile`;

export const USER_SYNC_TOKEN = `${BASE_URL}/system/sync/token`;

export const PROJECT_LIMIT_CHECK = `${BASE_URL}/system/project/limit`;
export const PROJECT_LIST = `${BASE_URL}/system/project/list`;
export const PROJECT_DELETE = `${BASE_URL}/system/project/delete`;
export const MEDIA_UPLOAD = `${BASE_URL}/media/upload`;

export const PLUGIN_UPLOAD = `${BASE_URL}/system/plugin/upload`; 