import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { print } from "graphql";
import { graphqlFetcher } from "../lib/graphqlFetcher";
import { MODEL_DOCUMENT_COUNTS } from "../graphql/queries/models";

export type ModelDocumentCountItem = {
  model: string;
  count: number;
};

export type ModelDocumentCountsQuery = {
  modelDocumentCounts?: Array<ModelDocumentCountItem | null> | null;
};

export type ModelDocumentCountsQueryVariables = {
  models?: string[] | null;
};

const modelDocumentCountsFetcher = graphqlFetcher<
  ModelDocumentCountsQuery,
  ModelDocumentCountsQueryVariables
>(print(MODEL_DOCUMENT_COUNTS));

export const modelDocumentCountsQueryKey = (
  variables?: ModelDocumentCountsQueryVariables
) =>
  variables === undefined
    ? (["modelDocumentCounts"] as const)
    : (["modelDocumentCounts", variables] as const);

/** Batch per-model document counts for console sidebar badges. */
export function useModelDocumentCountsQuery<
  TData = ModelDocumentCountsQuery,
  TError = unknown,
>(
  variables?: ModelDocumentCountsQueryVariables,
  options?: Omit<
    UseQueryOptions<ModelDocumentCountsQuery, TError, TData>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<ModelDocumentCountsQuery, TError, TData>({
    queryKey: modelDocumentCountsQueryKey(variables),
    queryFn: modelDocumentCountsFetcher(variables),
    ...options,
  });
}

useModelDocumentCountsQuery.getKey = modelDocumentCountsQueryKey;
