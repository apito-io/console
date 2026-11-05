import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { TypedDocumentString } from "../../lib/typedDocumentString";
import { graphqlFetcher } from "../../lib/graphqlFetcher";
import { tenantKeys } from "../../lib/queryKeys";

export type TenantSearchRow = {
  id?: string | null;
  name?: string | null;
  status?: string | null;
  domain?: string | null;
};

type SearchTenantsQuery = {
  searchTenants?: {
    count?: number | null;
    tenants?: Array<TenantSearchRow | null> | null;
  } | null;
};

type SearchTenantsVariables = {
  project_id: string;
  limit?: number | null;
  offset?: number | null;
  q?: string | null;
  status?: string | null;
};

const SearchTenantsDocument = new TypedDocumentString<
  SearchTenantsQuery,
  SearchTenantsVariables
>(`
  query searchTenants(
    $project_id: String!
    $limit: Int
    $offset: Int
    $q: String
    $status: String
  ) {
    searchTenants(
      project_id: $project_id
      limit: $limit
      offset: $offset
      q: $q
      status: $status
    ) {
      count
      tenants {
        id
        name
        status
        domain
      }
    }
  }
`);

/** List tenants for a SaaS project (scopes session via X-Apito-Project-Id). */
export function useProjectTenantsQuery(projectId: string, enabled = true) {
  const id = projectId.trim();
  return useQuery({
    queryKey: tenantKeys.search(id),
    enabled: enabled && id.length > 0,
    staleTime: 60 * 1000,
    queryFn: graphqlFetcher<SearchTenantsQuery, SearchTenantsVariables>(
      SearchTenantsDocument,
      {
        project_id: id,
        limit: 200,
        offset: 0,
        status: "active",
      },
      { "X-Apito-Project-Id": id },
    ),
  });
}

export type TenantLabel = {
  id: string;
  name: string;
  domain: string | null;
};

/** Name, else domain, else the id. status=all so a soft-deleted tenant still resolves. */
export async function fetchTenantLabel(
  projectId: string,
  tenantId: string,
): Promise<TenantLabel> {
  const pid = projectId.trim();
  const tid = tenantId.trim();
  const data = await graphqlFetcher<SearchTenantsQuery, SearchTenantsVariables>(
    SearchTenantsDocument,
    {
      project_id: pid,
      limit: 25,
      offset: 0,
      q: tid,
      status: "all",
    },
    { "X-Apito-Project-Id": pid },
  )();
  const rows = data?.searchTenants?.tenants ?? [];
  const exact = rows.find((t) => t && String(t.id ?? "").trim() === tid) ?? null;
  if (!exact) {
    return { id: tid, name: tid, domain: null };
  }
  const name = String(exact.name ?? "").trim();
  const domain = String(exact.domain ?? "").trim();
  return {
    id: tid,
    name: name || domain || tid,
    domain: domain || null,
  };
}

/**
 * Resolve a single catalog tenant label (name → domain → id) for display.
 * Uses searchTenants with status=all so soft-deleted tenants still resolve.
 */
export function useTenantLabelQuery(
  projectId: string,
  tenantId: string | null | undefined,
  enabled = true
) {
  const pid = projectId.trim();
  const tid = String(tenantId ?? "").trim();
  return useQuery({
    queryKey: [...tenantKeys.search(pid, tid), "label"] as const,
    enabled: enabled && pid.length > 0 && tid.length > 0,
    staleTime: 60 * 1000,
    queryFn: () => fetchTenantLabel(pid, tid),
  });
}

/** Names for the tenant ids on the current page. Shares the label query cache. */
export function useTenantNameMap(
  projectId: string,
  tenantIds: string[],
  enabled = true,
) {
  const pid = projectId.trim();
  const ids = useMemo(
    () => [...new Set(tenantIds.map((id) => id.trim()).filter(Boolean))].sort(),
    [tenantIds],
  );
  const queries = useQueries({
    queries: ids.map((tid) => ({
      queryKey: [...tenantKeys.search(pid, tid), "label"] as const,
      enabled: enabled && pid.length > 0,
      staleTime: 60 * 1000,
      queryFn: () => fetchTenantLabel(pid, tid),
    })),
  });
  const names = new Map<string, string>();
  let loading = false;
  queries.forEach((query, index) => {
    if (query.isLoading || query.isFetching) loading = true;
    const id = ids[index];
    const name = query.data?.name?.trim();
    if (id && name) names.set(id, name);
  });
  return { names, loading };
}
