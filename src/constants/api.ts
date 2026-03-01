import { ENV } from '../utils/env';

export const AUTH_VERSION = 'v2';

// Base URL getter
export const getBaseUrl = () => ENV.VITE_REST_API;

// Full URL for a path (for redirects, iframe src, etc.)
export const getRestUrl = (path: string) => {
  const base = ENV.VITE_REST_API || '';
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base.replace(/\/$/, '')}${p}` : p;
};

// For backward compatibility
export const BASE_URL = ENV.VITE_REST_API;

// GraphQL endpoints (full URLs)
export const SYSTEM_GRAPHQL_URL = ENV.VITE_GRAPH_API;
export const CLIENT_GRAPHQL_URL = ENV.VITE_PUBLIC_GRAPH_API;
export const CLIENT_GRAPHQL_URL_v2 = getRestUrl('/secured/graphql/v2');

// Paths relative to REST base - use with httpService (axios baseURL is set to VITE_REST_API)
// So request URL = baseURL + path = e.g. /api + /auth/v2/login = /api/auth/v2/login
export const REST_DOC_PATH = '/system/doc';
export const AUTH_CALLBACK_PATH = '/auth/callback';
export const MEDIA_UPLOAD_PATH = '/plugin/media/upload';
export const TOKEN_REFRESH_PATH = '/auth/refresh/token';

export const REGISTER_PATH = `/auth/${AUTH_VERSION}/register`;
export const LOGIN_PATH = `/auth/${AUTH_VERSION}/login`;
export const LOGOUT_PATH = `/auth/${AUTH_VERSION}/logout`;
export const EMAIL_VERIFY_PATH = `/auth/${AUTH_VERSION}/verify/email`;
export const FORGET_PASSWORD_PATH = `/auth/${AUTH_VERSION}/forget/password/request`;
export const VERIFY_PASSWORD_PATH = `/auth/${AUTH_VERSION}/forget/password/verify`;
export const CHANGE_PASSWORD_PATH = `/auth/${AUTH_VERSION}/change/password`;

export const USER_SUB_FETCH_PATH = '/system/user/subscription';
export const USER_SUB_CHECK_PATH = '/system/user/subscription/check';
export const PROJECT_NAME_CHECK_PATH = '/system/project/name/check';
export const PROJECT_SWITCH_PATH = '/system/project/switch';
export const PROJECT_CREATE_PATH = '/system/project/create';
export const USER_PROFILE_PATH = '/system/user/profile';
export const SYNC_TOKEN_LIST_PATH = '/system/sync/token/list';
export const SYNC_TOKEN_CREATE_PATH = '/system/sync/token/create';
export const SYNC_TOKEN_DELETE_PATH = '/system/sync/token/delete';
export const PROJECT_LIMIT_CHECK_PATH = '/system/project/limit';
export const PROJECT_LIST_PATH = '/system/project/list';
export const PROJECT_DELETE_PATH = '/system/project/delete';
export const MEDIA_UPLOAD_PATH_MEDIA = '/media/upload';
export const PLUGIN_UPLOAD_PATH = '/system/plugin/upload';

// Full URLs for redirects / external use
export const REST_DOC_URL = getRestUrl(REST_DOC_PATH);
export const AUTH_URL = getRestUrl(AUTH_CALLBACK_PATH);

// Aliases for httpService calls (path-only to avoid baseURL + url doubling)
export const REGISTER_URL = REGISTER_PATH;
export const LOGIN_URL = LOGIN_PATH;
export const LOGOUT_URL = LOGOUT_PATH;
export const EMAIL_VERIFY = EMAIL_VERIFY_PATH;
export const FORGET_PASSWORD = FORGET_PASSWORD_PATH;
export const VERIFY_PASSWORD = VERIFY_PASSWORD_PATH;
export const CHANGE_PASSWORD = CHANGE_PASSWORD_PATH;
export const USER_SUB_FETCH = USER_SUB_FETCH_PATH;
export const USER_SUB_CHECK = USER_SUB_CHECK_PATH;
export const PROJECT_NAME_CHECK = PROJECT_NAME_CHECK_PATH;
export const PROJECT_SWITCH = PROJECT_SWITCH_PATH;
export const PROJECT_CREATE = PROJECT_CREATE_PATH;
export const USER_PROFILE = USER_PROFILE_PATH;
export const SYNC_TOKEN_LIST = SYNC_TOKEN_LIST_PATH;
export const SYNC_TOKEN_CREATE = SYNC_TOKEN_CREATE_PATH;
export const SYNC_TOKEN_DELETE = SYNC_TOKEN_DELETE_PATH;
export const PROJECT_LIMIT_CHECK = PROJECT_LIMIT_CHECK_PATH;
export const PROJECT_LIST = PROJECT_LIST_PATH;
export const PROJECT_DELETE = PROJECT_DELETE_PATH;
export const MEDIA_UPLOAD = MEDIA_UPLOAD_PATH_MEDIA;
export const PLUGIN_UPLOAD = PLUGIN_UPLOAD_PATH;
export const MEDIA_UPLOAD_URL = MEDIA_UPLOAD_PATH;
export const TOKEN_REFRESH_URL = TOKEN_REFRESH_PATH;
