import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient for the console (pro + open-core). Import this singleton
 * from Auth logout and httpService bridges.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
