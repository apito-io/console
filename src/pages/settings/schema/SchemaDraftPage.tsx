import { useState } from "react";
import { Alert, Button, Space } from "antd";
import { Rocket } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ConsoleCard } from "../../../components/console";
import SchemaExecutionTimeline from "../../../components/schema-versioning/SchemaExecutionTimeline";
import { useSettingsPageMeta } from "../../../contexts/SettingsPageMetaContext";
import { APPROVE_SCHEMA_CHANGES, DISCARD_SCHEMA_DRAFT } from "../../../graphql/mutations/schemaDraft";
import { useSchemaDraftOverlay } from "../../../hooks/useSchemaDraftOverlay";
import { graphqlFetcher } from "../../../lib/graphqlFetcher";

export default function SchemaDraftPage() {
  const draft = useSchemaDraftOverlay();
  const [error, setError] = useState("");

  useSettingsPageMeta({
    title: "Schema changes",
    description: "Review staged changes on this machine, then publish them to the project database.",
  });

  const approve = useMutation({
    mutationFn: (changesetId: string) =>
      graphqlFetcher(APPROVE_SCHEMA_CHANGES, {
        changeset_id: changesetId,
        message: "Published from console",
      })(),
    onSuccess: () => {
      setError("");
      return draft.refresh();
    },
    onError: (err: Error) => setError(err.message || "Publish failed"),
  });

  const discard = useMutation({
    mutationFn: (changesetId: string) =>
      graphqlFetcher(DISCARD_SCHEMA_DRAFT, { changeset_id: changesetId })(),
    onSuccess: () => {
      setError("");
      return draft.refresh();
    },
    onError: (err: Error) => setError(err.message || "Discard failed"),
  });

  const changesetId = draft.changesetId;
  const busy = approve.isPending || discard.isPending;
  const canAct = Boolean(draft.hasDraft && changesetId);

  return (
    <div className="console-stack console-stack--md">
      {error ? <Alert type="error" showIcon message={error} /> : null}
      {!draft.loading && !draft.hasDraft ? (
        <Alert
          type="info"
          showIcon
          message="No pending draft"
          description="Edit models in the Model tab. Staged changes appear here for review before publish."
        />
      ) : (
        <ConsoleCard
          title="Pending changes"
          extra={
            <Space wrap>
              <Button
                danger
                loading={discard.isPending}
                disabled={!canAct || busy}
                onClick={() => changesetId && discard.mutate(changesetId)}
              >
                Discard
              </Button>
              <Button
                type="primary"
                icon={<Rocket size={16} strokeWidth={1.75} />}
                loading={approve.isPending}
                disabled={!canAct || busy}
                onClick={() => changesetId && approve.mutate(changesetId)}
              >
                Publish
              </Button>
            </Space>
          }
        >
          <SchemaExecutionTimeline
            embedded
            mode="draft"
            changesetId={changesetId}
            pendingOperations={draft.pendingOperations}
            publishing={approve.isPending}
          />
        </ConsoleCard>
      )}
    </div>
  );
}
