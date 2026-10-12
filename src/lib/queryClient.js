import { QueryClient } from "@tanstack/react-query";
/**
 * Shared QueryClient for the console (pro + open-core). Import this singleton
 * from Auth logout, httpService bridges, and Paddle success handlers.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
            gcTime: 5 * 60000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
