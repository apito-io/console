import { ENV } from '../utils/env';

export const AUTH_VERSION = 'v2';

// All URLs are computed dynamically via ENV getters
// ENV reads from window.env (runtime) first, then import.meta.env (build-time)

// Base URL getter
export const getBaseUrl = () => ENV.VITE_REST_API;

// For backward compatibility - these use the getter indirectly
export const BASE_URL = ENV.VITE_REST_API;

// GraphQL endpoints
export const SYSTEM_GRAPHQL_URL = ENV.VITE_GRAPH_API;
export const CLIENT_GRAPHQL_URL = ENV.VITE_PUBLIC_GRAPH_API;
export const CLIENT_GRAPHQL_URL_v2 = `${ENV.VITE_REST_API}/secured/graphql/v2`;

// REST endpoints
export const REST_DOC_URL = `${ENV.VITE_REST_API}/system/doc`;
export const AUTH_URL = `${ENV.VITE_REST_API}/auth/callback`;
export const MEDIA_UPLOAD_URL = `${ENV.VITE_REST_API}/plugin/media/upload`;
export const TOKEN_REFRESH_URL = `${ENV.VITE_REST_API}/auth/refresh/token`;

// Auth endpoints
export const REGISTER_URL = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/register`;
export const LOGIN_URL = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/login`;
export const LOGOUT_URL = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/logout`;

export const EMAIL_VERIFY = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/verify/email`;
export const FORGET_PASSWORD = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/forget/password/request`;
export const VERIFY_PASSWORD = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/forget/password/verify`;

export const CHANGE_PASSWORD = `${ENV.VITE_REST_API}/auth/${AUTH_VERSION}/change/password`;

// User/Subscription endpoints
export const USER_SUB_FETCH = `${ENV.VITE_REST_API}/system/user/subscription`;
export const USER_SUB_CHECK = `${ENV.VITE_REST_API}/system/user/subscription/check`;

// Project endpoints
export const PROJECT_NAME_CHECK = `${ENV.VITE_REST_API}/system/project/name/check`;
export const PROJECT_SWITCH = `${ENV.VITE_REST_API}/system/project/switch`;
export const PROJECT_CREATE = `${ENV.VITE_REST_API}/system/project/create`;
export const USER_PROFILE = `${ENV.VITE_REST_API}/system/user/profile`;

// Sync endpoints
export const SYNC_TOKEN_LIST = `${ENV.VITE_REST_API}/system/sync/token/list`;
export const SYNC_TOKEN_CREATE = `${ENV.VITE_REST_API}/system/sync/token/create`;
export const SYNC_TOKEN_DELETE = `${ENV.VITE_REST_API}/system/sync/token/delete`;

// Other endpoints
export const PROJECT_LIMIT_CHECK = `${ENV.VITE_REST_API}/system/project/limit`;
export const PROJECT_LIST = `${ENV.VITE_REST_API}/system/project/list`;
export const PROJECT_DELETE = `${ENV.VITE_REST_API}/system/project/delete`;
export const MEDIA_UPLOAD = `${ENV.VITE_REST_API}/media/upload`;

export const PLUGIN_UPLOAD = `${ENV.VITE_REST_API}/system/plugin/upload`;
