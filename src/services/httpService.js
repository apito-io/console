import axios from 'axios';
import { message } from 'antd';
import { ENV } from '../utils/env';
import { spaUrl } from '../utils/url';
import { deleteAllCookies } from './cookieUtils';
/** Typed 401/403 passthrough for TanStack Query mutations (console / project-switch paths). */
export class UnauthorizedError extends Error {
    constructor(status, messageText) {
        super(messageText ?? 'Unauthorized');
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'UnauthorizedError';
        this.status = status;
    }
}
const httpService = axios.create({
    withCredentials: true,
    baseURL: ENV.VITE_REST_API,
    headers: {
        'X-Use-Cookies': 'true',
    },
});
/**
 * Hard reset when the session is invalid (401/403). Used by Apollo errorLink and
 * can be reused anywhere outside React (AuthProvider) is not available.
 * Skips calling the logout API to avoid loops if that endpoint also returns 403.
 */
export const performAuthFailureRedirect = () => {
    deleteAllCookies();
    try {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }
    catch {
        /* ignore storage errors */
    }
    // Full reload outside React; honor the SPA's BASE_URL so /admin etc. is preserved.
    window.location.href = spaUrl('auth/login');
};
httpService.interceptors.response.use((res) => res, (err) => {
    // Compare against router-relative path (strip the SPA base, e.g. /admin) so /admin/console/... still matches /console/.
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    const fullPath = window.location.pathname;
    const currentPath = base && fullPath.startsWith(base) ? fullPath.slice(base.length) || '/' : fullPath;
    const isLoginRequest = err.config?.url?.includes('/auth/v2/login');
    const isLogoutRequest = err.config?.url?.includes('/auth/v2/logout');
    if (err?.response?.status === 400) {
        message.error(err.message);
    }
    else if (err?.response?.status === 401 || err?.response?.status === 403) {
        // Don't redirect if this is a login request - let the login component handle the error
        if (isLoginRequest) {
            // For login requests, just pass the error through without redirecting
            console.warn('Login failed:', err);
        }
        else if (!currentPath.startsWith('/console/') && !err.config?.url?.includes('project/switch')) {
            // Only redirect to login if we're not in the middle of project switching
            // or if the current path is not already a console route
            performAuthFailureRedirect();
        }
        else {
            // For console routes or project switching, pass a typed error for Query/mutations
            console.warn('Authentication error in console context:', err);
            const status = err?.response?.status === 403 ? 403 : 401;
            return Promise.reject(new UnauthorizedError(status, err?.response?.data?.message));
        }
    }
    else if (err?.response?.status === 409) {
        const url = String(err.config?.url ?? "");
        if (url.includes("project/switch") || url.includes("/system/plugin")) {
            return Promise.reject(err);
        }
        const msg = String(err?.response?.data?.message ?? "");
        if (!/login.?conflict|another person|another device|credential/i.test(msg)) {
            return Promise.reject(err);
        }
        deleteAllCookies();
        try {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        }
        catch {
            /* ignore */
        }
        window.location.href = `${spaUrl('auth/login')}?message=Another person used your credential to login. Please use your own account to login.`;
    }
    else if (err?.response?.status === 500) {
        message.error(err?.response?.data?.message);
    }
    return Promise.reject(err);
});
export { httpService };
export { deleteAllCookies } from './cookieUtils';
