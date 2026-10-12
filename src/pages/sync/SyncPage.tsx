import React, { useMemo, useState } from "react";
import { Skeleton, message } from "antd";
import { useProjectsQuery } from "../projects/queries";
import {
  useAccessTokensQuery,
  useAccessTokenCatalogQuery,
  useAdministrableProjectsQuery,
  useCreateAccessTokenMutation,
  useRevokeAccessTokenMutation,
  useRotateAccessTokenMutation,
} from "./queries";
import { AccessTokensTable } from "./AccessTokensTable";
import { CreateAccessTokenForm, type SimpleProjectOption } from "./CreateAccessTokenForm";
import { RevealTokenModal } from "./RevealTokenModal";
import type { CreateAccessTokenPayload } from "./types";
import { KeyRound } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import "../../components/console/ConsoleShell.css";

const SyncPage: React.FC = () => {
  const { data: tokenData, isLoading: tokensLoading } = useAccessTokensQuery();
  const { data: catalog, isLoading: catalogLoading } = useAccessTokenCatalogQuery();
  const { data: administrableData, isLoading: administrableLoading } =
    useAdministrableProjectsQuery();
  const { data: projectListData, isLoading: projectListLoading } = useProjectsQuery();

  const createMutation = useCreateAccessTokenMutation();
  const revokeMutation = useRevokeAccessTokenMutation();
  const rotateMutation = useRotateAccessTokenMutation();

  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{ open: boolean; token: string | null; name?: string }>({
    open: false,
    token: null,
  });

  const administrableProjects = useMemo(
    () =>
      administrableData?.projects.filter(
        (p, i, self) => i === self.findIndex((x) => x.id === p.id),
      ) ?? [],
    [administrableData],
  );

  const projectTypeById = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projectListData?.body ?? []) {
      map.set(p.id, p.project_type ?? 0);
    }
    return map;
  }, [projectListData]);

  const projectOptions: SimpleProjectOption[] = useMemo(() => {
    // Prefer full membership list for the picker; administrable is a subset for "all admin".
    const fromList = (projectListData?.body ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      isSaas: projectTypeById.get(p.id) === 1,
    }));
    if (fromList.length > 0) {
      return fromList.filter(
        (p, i, self) => i === self.findIndex((x) => x.id === p.id),
      );
    }
    return administrableProjects.map((p) => ({
      id: p.id,
      name: p.name,
      isSaas: projectTypeById.get(p.id) === 1,
    }));
  }, [administrableProjects, projectListData, projectTypeById]);

  const projectNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of projectOptions) map[p.id] = p.name;
    return map;
  }, [projectOptions]);

  const projectsLoading = administrableLoading || projectListLoading;
  const tokens = tokenData?.tokens ?? [];

  const handleCreate = async (payload: CreateAccessTokenPayload) => {
    try {
      const result = await createMutation.mutateAsync(payload);
      message.success(result.message || "Access token created.");
      setReveal({ open: true, token: result.token, name: payload.name });
    } catch {
      // error surfaced via mutation's onError
    }
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeMutation.mutateAsync({ id });
    } finally {
      setRevokingId(null);
    }
  };

  const handleRotate = async (id: string) => {
    setRotatingId(id);
    try {
      const result = await rotateMutation.mutateAsync({ id });
      message.success(result.message || "Access token rotated.");
      setReveal({ open: true, token: result.token, name: result.record?.name });
    } finally {
      setRotatingId(null);
    }
  };

  return (
    <div className="console-page">
      <div className="console-stack">
        <CreateAccessTokenForm
          catalog={catalog}
          catalogLoading={catalogLoading}
          administrableProjects={administrableProjects}
          projectOptions={projectOptions}
          projectsLoading={projectsLoading}
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
        />

        <ConsoleCard
          className="mono-table-card"
          title={
            <ConsoleCardTitle
              icon={KeyRound}
              label={`Access tokens (${tokens.length})`}
            />
          }
        >
          {tokensLoading ? (
            <Skeleton active />
          ) : (
            <AccessTokensTable
              tokens={tokens}
              presets={catalog?.presets}
              projectNameById={projectNameById}
              revokingId={revokingId}
              rotatingId={rotatingId}
              onRevoke={handleRevoke}
              onRotate={handleRotate}
              emptyText="No access tokens yet. Create your first one above."
            />
          )}
        </ConsoleCard>
      </div>

      <RevealTokenModal
        open={reveal.open}
        token={reveal.token}
        tokenName={reveal.name}
        onClose={() => setReveal({ open: false, token: null })}
      />
    </div>
  );
};

export default SyncPage;
