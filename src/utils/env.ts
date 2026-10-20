// Runtime environment configuration
// Priority: window.env (runtime) > import.meta.env (build-time)
// This allows Docker containers to inject config at startup via env.js

declare global {
    interface Window {
        env?: {
            VITE_REST_API?: string;
            VITE_GRAPH_API?: string;
            VITE_GRAPH_SUBS_API?: string;
            VITE_AUTH_PROVIDER?: string;
            VITE_PUBLIC_GRAPH_API?: string;
            VITE_COOKIE_DOMAIN?: string;
            VITE_DISABLE_SIGNUP?: string;
            DISABLE_SIGNUP?: string;
            VITE_HIDE_EMAIL_LOGIN?: string;
            HIDE_EMAIL_LOGIN?: string;
            VITE_PUBLIC_POSTHOG_KEY?: string;
            VITE_PUBLIC_POSTHOG_HOST?: string;
            VITE_PRODUCT?: string;
            VITE_CONSOLE_DOMAIN?: string;
            VITE_APP_TITLE?: string;
            VITE_SUPPORT_EMAIL?: string;
            VITE_ENTERPRISE_EMAIL?: string;
        };
    }
}

function getEnv(key: string): string {
    // Runtime config from env.js (injected by Docker at container start)
    if (typeof window !== 'undefined' && window.env && window.env[key as keyof Window['env']]) {
        return window.env[key as keyof Window['env']] as string;
    }
    // Build-time fallback
    return (import.meta.env as Record<string, string>)[key] || '';
}

// Export as getters for lazy evaluation
export const ENV = {
    get VITE_REST_API() { return getEnv('VITE_REST_API'); },
    get VITE_GRAPH_API() { return getEnv('VITE_GRAPH_API'); },
    get VITE_GRAPH_SUBS_API() { return getEnv('VITE_GRAPH_SUBS_API'); },
    get VITE_AUTH_PROVIDER() { return getEnv('VITE_AUTH_PROVIDER'); },
    get VITE_PUBLIC_GRAPH_API() { return getEnv('VITE_PUBLIC_GRAPH_API'); },
    get VITE_COOKIE_DOMAIN() { return getEnv('VITE_COOKIE_DOMAIN'); },
    get VITE_DISABLE_SIGNUP() {
        return getEnv('VITE_DISABLE_SIGNUP') || getEnv('DISABLE_SIGNUP');
    },
    get VITE_HIDE_EMAIL_LOGIN() {
        return getEnv('VITE_HIDE_EMAIL_LOGIN') || getEnv('HIDE_EMAIL_LOGIN');
    },
    get VITE_PRODUCT() { return getEnv('VITE_PRODUCT'); },
    get VITE_CONSOLE_DOMAIN() { return getEnv('VITE_CONSOLE_DOMAIN'); },
    get VITE_APP_TITLE() { return getEnv('VITE_APP_TITLE'); },
    get VITE_PUBLIC_POSTHOG_KEY() { return getEnv('VITE_PUBLIC_POSTHOG_KEY'); },
    get VITE_SUPPORT_EMAIL() { return getEnv('VITE_SUPPORT_EMAIL'); },
    get VITE_ENTERPRISE_EMAIL() { return getEnv('VITE_ENTERPRISE_EMAIL'); },
};

function isTruthyEnv(value: string): boolean {
    return /^(1|true|yes)$/i.test(value.trim());
}

/** Invite-only (Udbhabon): hide email signup AND Google/GitHub. */
export function isSignupDisabled(): boolean {
    return isTruthyEnv(ENV.VITE_DISABLE_SIGNUP);
}

/** Hide email/password login + forgot-password. Google/GitHub stay. */
export function isEmailLoginHidden(): boolean {
    return isTruthyEnv(ENV.VITE_HIDE_EMAIL_LOGIN);
}

/** Public console is Apito. A host build may brand itself separately. */
export function isSqliteBuilderProduct(): boolean {
    return false;
}

export function isApitoProduct(): boolean {
    return ENV.VITE_PRODUCT === 'apito';
}

/**
 * Hide the email/password Sign Up page and "Don't Have an Account?" link.
 * Cloud consoles (Apito + SQLite Builder): no public email Sign Up.
 * SQLite Builder also hides email login (`isEmailLoginHidden`).
 * Udbhabon Studio uses isSignupDisabled() (hides social too).
 */
export function isEmailSignupDisabled(): boolean {
    if (isSignupDisabled() || isEmailLoginHidden()) return true;
    return isApitoProduct() || isSqliteBuilderProduct();
}

export function getProductName(): string {
    return 'Apito';
}

/** public/ filename for the product mark. */
export function getLogoPath(): string {
    return 'logo.svg';
}

export function getConsoleDomain(): string {
    const fromEnv = ENV.VITE_CONSOLE_DOMAIN.trim();
    if (fromEnv) return fromEnv;
    return 'app.apito.io';
}

const DEFAULT_SUPPORT_EMAIL = 'support@apito.io';
const DEFAULT_ENTERPRISE_EMAIL = 'enterprise@apito.io';

/** Same Apito inboxes on every product unless a build overrides them. */
export function getSupportEmail(): string {
    return ENV.VITE_SUPPORT_EMAIL.trim() || DEFAULT_SUPPORT_EMAIL;
}

export function getEnterpriseEmail(): string {
    return ENV.VITE_ENTERPRISE_EMAIL.trim() || DEFAULT_ENTERPRISE_EMAIL;
}
