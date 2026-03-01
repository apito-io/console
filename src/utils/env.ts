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
            VITE_PADDLE_VENDOR_ID?: string;
            VITE_PADDLE_CLIENT_SIDE_TOKEN?: string;
            VITE_PADDLE_STARTER_PRICE_ID?: string;
            VITE_PADDLE_PRO_PRICE_ID?: string;
            VITE_PADDLE_BUSINESS_PRICE_ID?: string;
        };
    }
}

// Get environment variable - runtime first, then build-time fallback
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
};
