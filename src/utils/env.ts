// Utility to get environment variables with runtime override support
function getEnvVar(key: string): string {
    // First try to get from runtime env (window.env)
    const runtimeEnv = (window as any)?.env;
    if (runtimeEnv && runtimeEnv[key]) {
        return runtimeEnv[key];
    }

    // Fallback to build-time environment variables
    return (import.meta.env as any)[key] || '';
}

export const ENV = {
    VITE_REST_API: getEnvVar('VITE_REST_API'),
    VITE_GRAPH_API: getEnvVar('VITE_GRAPH_API'),
    VITE_GRAPH_SUBS_API: getEnvVar('VITE_GRAPH_SUBS_API'),
    VITE_AUTH_PROVIDER: getEnvVar('VITE_AUTH_PROVIDER'),
    VITE_PUBLIC_GRAPH_API: getEnvVar('VITE_PUBLIC_GRAPH_API'),
    VITE_COOKIE_DOMAIN: getEnvVar('VITE_COOKIE_DOMAIN'),
};

// Re-export for backward compatibility
export const BASE_URL = ENV.VITE_REST_API; 