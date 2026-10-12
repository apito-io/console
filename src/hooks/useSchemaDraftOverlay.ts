import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "../router/navigation";
import { useAuth } from "../contexts/AuthContext";
import type { SchemaDraftOverlay } from "../types/schemaDraftOverlay";
import { EMPTY_SCHEMA_DRAFT_OVERLAY } from "../types/schemaDraftOverlay";
import { schemaKeys } from "../lib/queryKeys";
import { graphqlFetcher } from "../lib/graphqlFetcher";
import { invalidateSchemaDraft } from "../lib/schemaCache";
import { buildSchemaDraftOverlay } from "../lib/schema-versioning/schemaDraftOverlay";
import {
  SCHEMA_CHANGE_EVENTS,
  SCHEMA_DIFF,
  SCHEMA_PREVIEW,
  SCHEMA_VERSIONING_STATUS,
} from "../graphql/queries/schemaDraft";

type StatusData = {
  schemaVersioningStatus?: {
    enabled?: boolean | null;
    active_version?: number | null;
    has_draft?: boolean | null;
    changeset_id?: string | null;
    pending_operations?: number | null;
  } | null;
};

type PreviewData = { schemaPreview?: string | null };
type DiffData = { schemaDiff?: string | null };
type EventsData = {
  schemaChangeEvents?: Array<{
    event_type?: string | null;
    payload_json?: string | null;
  } | null> | null;
};

function queryLoading(isPending: boolean, isLoading: boolean, fetchStatus: string) {
  return (isPending || isLoading) && fetchStatus !== "idle";
}

export function useSchemaDraftOverlay(): SchemaDraftOverlay {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { decodeTokenData } = useAuth();
  const hasProject = Boolean(decodeTokenData()?.project_id);
  const isProjectScopedRoute = location.pathname.startsWith("/console") && hasProject;

  const statusQuery = useQuery({
    queryKey: schemaKeys.status(),
    queryFn: graphqlFetcher<StatusData, Record<string, never>>(SCHEMA_VERSIONING_STATUS),
    enabled: isProjectScopedRoute,
  });

  const status = isProjectScopedRoute ? statusQuery.data?.schemaVersioningStatus : undefined;
  const enabled = status?.enabled ?? false;
  const hasDraft = status?.has_draft ?? false;
  const changesetId = status?.changeset_id ?? undefined;
  const activeVersion = status?.active_version ?? 0;
  const pendingOperations = status?.pending_operations ?? 0;
  const draftQueriesEnabled = isProjectScopedRoute && enabled && hasDraft;

  const draftPreview = useQuery({
    queryKey: schemaKeys.preview("draft"),
    queryFn: graphqlFetcher<PreviewData, { source: string }>(SCHEMA_PREVIEW, { source: "draft" }),
    enabled: draftQueriesEnabled,
  });
  const livePreview = useQuery({
    queryKey: schemaKeys.preview("live"),
    queryFn: graphqlFetcher<PreviewData, { source: string }>(SCHEMA_PREVIEW, { source: "live" }),
    enabled: draftQueriesEnabled,
  });
  const diffQuery = useQuery({
    queryKey: schemaKeys.diff(changesetId),
    queryFn: graphqlFetcher<DiffData, { changeset_id?: string }>(SCHEMA_DIFF, {
      changeset_id: changesetId,
    }),
    enabled: draftQueriesEnabled && !!changesetId,
  });
  const eventsQuery = useQuery({
    queryKey: schemaKeys.events(changesetId),
    queryFn: graphqlFetcher<EventsData, { changeset_id?: string }>(SCHEMA_CHANGE_EVENTS, {
      changeset_id: changesetId,
    }),
    enabled: draftQueriesEnabled && !!changesetId,
  });

  const overlayLoading =
    (isProjectScopedRoute &&
      queryLoading(statusQuery.isPending, statusQuery.isLoading, statusQuery.fetchStatus)) ||
    (draftQueriesEnabled &&
      (queryLoading(draftPreview.isPending, draftPreview.isLoading, draftPreview.fetchStatus) ||
        queryLoading(livePreview.isPending, livePreview.isLoading, livePreview.fetchStatus) ||
        queryLoading(diffQuery.isPending, diffQuery.isLoading, diffQuery.fetchStatus) ||
        queryLoading(eventsQuery.isPending, eventsQuery.isLoading, eventsQuery.fetchStatus)));

  const built = useMemo(
    () =>
      buildSchemaDraftOverlay({
        enabled,
        hasDraft,
        activeVersion,
        changesetId,
        pendingOperations,
        livePreviewJson: livePreview.data?.schemaPreview,
        draftPreviewJson: draftPreview.data?.schemaPreview,
        diffJson: diffQuery.data?.schemaDiff,
        changeEvents: eventsQuery.data?.schemaChangeEvents
          ?.filter((event): event is NonNullable<typeof event> => event != null)
          .map((event) => ({
            event_type: event.event_type ?? undefined,
            payload_json: event.payload_json ?? undefined,
          })),
      }),
    [
      enabled,
      hasDraft,
      activeVersion,
      changesetId,
      pendingOperations,
      livePreview.data?.schemaPreview,
      draftPreview.data?.schemaPreview,
      diffQuery.data?.schemaDiff,
      eventsQuery.data?.schemaChangeEvents,
    ]
  );

  const refresh = useCallback(async () => {
    await invalidateSchemaDraft(queryClient);
  }, [queryClient]);

  return useMemo<SchemaDraftOverlay>(
    () => ({
      enabled,
      hasDraft,
      loading: overlayLoading,
      ...built,
      refresh,
    }),
    [enabled, hasDraft, overlayLoading, built, refresh]
  );
}

export { EMPTY_SCHEMA_DRAFT_OVERLAY };
