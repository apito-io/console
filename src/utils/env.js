// Runtime environment configuration
// Priority: window.env (runtime) > import.meta.env (build-time)
// This allows Docker containers to inject config at startup via env.js
// Get environment variable - runtime first, then build-time fallback
function getEnv(key) {
    // Runtime config from env.js (injected by Docker at container start)
    if (typeof window !== 'undefined' && window.env && window.env[key]) {
        return window.env[key];
    }
    // Build-time fallback
    return import.meta.env[key] || '';
}
// Export as getters for lazy evaluation
export const ENV = {
    get VITE_REST_API() { return getEnv('VITE_REST_API'); },
    get VITE_GRAPH_API() { return getEnv('VITE_GRAPH_API'); },
    get VITE_GRAPH_SUBS_API() { return getEnv('VITE_GRAPH_SUBS_API'); },
    get VITE_AUTH_PROVIDER() { return getEnv('VITE_AUTH_PROVIDER'); },
    get VITE_PUBLIC_GRAPH_API() { return getEnv('VITE_PUBLIC_GRAPH_API'); },
    get VITE_COOKIE_DOMAIN() { return getEnv('VITE_COOKIE_DOMAIN'); },
    get VITE_PUBLIC_POSTHOG_KEY() { return getEnv('VITE_PUBLIC_POSTHOG_KEY'); },
    get VITE_DISABLE_SIGNUP() { return getEnv('VITE_DISABLE_SIGNUP') || getEnv('DISABLE_SIGNUP'); },
    get VITE_HIDE_EMAIL_LOGIN() { return getEnv('VITE_HIDE_EMAIL_LOGIN') || getEnv('HIDE_EMAIL_LOGIN'); },
    get VITE_PRODUCT() { return getEnv('VITE_PRODUCT'); },
};
function isTruthyEnv(value) {
    return /^(1|true|yes)$/i.test(String(value || '').trim());
}
/** Invite-only (Udbhabon): hide email signup AND Google/GitHub. */
export function isSignupDisabled() {
    return isTruthyEnv(ENV.VITE_DISABLE_SIGNUP);
}
export function isEmailLoginHidden() {
    return isTruthyEnv(ENV.VITE_HIDE_EMAIL_LOGIN);
}
export function isSqliteBuilderProduct() {
    return false;
}
export function isApitoProduct() {
    return ENV.VITE_PRODUCT === 'apito';
}
export function isEmailSignupDisabled() {
    if (isSignupDisabled() || isEmailLoginHidden()) return true;
    return isApitoProduct() || isSqliteBuilderProduct();
}
