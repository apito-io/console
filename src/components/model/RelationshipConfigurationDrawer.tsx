import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Drawer, Input, Select, Space, Typography, message } from "antd";
import { useNavigate } from "../../router/navigation";
import { STAGE_RELATION_TRANSITION } from "../../graphql/mutations/relationTransition";
import { PREVIEW_SCHEMA_RELATION_TRANSITION } from "../../graphql/queries/relationTransition";
import { graphqlFetcher } from "../../lib/graphqlFetcher";
import type { ConnectionInfo } from "../../types/model";

const { Text, Paragraph } = Typography;

const SHAPES = [
  { value: "1:1", label: "1:1", from: "has_one", to: "has_one" },
  { value: "1:N", label: "1:N", from: "has_many", to: "has_one" },
  { value: "N:1", label: "N:1", from: "has_one", to: "has_many" },
  { value: "N:N", label: "N:N", from: "has_many", to: "has_many" },
] as const;

const SAFETY_LABEL: Record<string, string> = {
  lossless_widening: "Lossless widening",
  conditional_narrowing: "Conditional narrowing",
  ownership_flip: "Ownership flip",
  blocked: "Blocked",
  no_op: "No change",
  unsupported_driver: "Unsupported",
};

const REVERSIBILITY_LABEL: Record<string, string> = {
  reversible_now: "Reversible now",
  conditionally_reversible: "Conditionally reversible",
  not_reversible_by_schema: "Backup required",
  blocked: "Blocked",
};

type Preview = {
  plan_hash?: string;
  kind?: string;
  safety?: string;
  reversibility?: string;
  blocked?: boolean;
  backup_required?: boolean;
  source_storage?: string;
  target_storage?: string;
  required_acknowledgement?: string;
  preview_json?: string;
  disclaimers?: string[];
  warnings?: string[];
  blockers?: string[];
};

type Props = {
  open: boolean;
  modelName: string;
  connection: ConnectionInfo | null;
  onClose: () => void;
  onStaged: () => Promise<void> | void;
};

function shapeOf(from?: string, to?: string) {
  return SHAPES.find((shape) => shape.from === from && shape.to === to)?.value ?? "";
}

export default function RelationshipConfigurationDrawer({
  open,
  modelName,
  connection,
  onClose,
  onStaged,
}: Props) {
  const navigate = useNavigate();
  const [peerRelation, setPeerRelation] = useState("");
  const [target, setTarget] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [acknowledgement, setAcknowledgement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const edge = useMemo(() => {
    if (!connection?.model) return null;
    const known = connection.known_as || "";
    if (connection.type === "backward") {
      return {
        fromModel: connection.model,
        toModel: modelName,
        knownAs: known,
        fromRelation: peerRelation,
        toRelation: connection.relation || "",
      };
    }
    return {
      fromModel: modelName,
      toModel: connection.model,
      knownAs: known,
      fromRelation: connection.relation || "",
      toRelation: peerRelation,
    };
  }, [connection, modelName, peerRelation]);

  useEffect(() => {
    if (!open || !connection?.model) return;
    let cancelled = false;
    setPreview(null);
    setAcknowledgement("");
    setError("");
    setPeerRelation("");
    void graphqlFetcher<{
      projectModelsInfo?: Array<{ connections?: ConnectionInfo[] | null } | null> | null;
    }>(
      `query PeerConnections($model_name: String) {
        projectModelsInfo(model_name: $model_name) {
          connections { model relation type known_as }
        }
      }`,
      { model_name: connection.model }
    )().then((data) => {
      if (cancelled) return;
      const known = connection.known_as || "";
      const match = data.projectModelsInfo?.[0]?.connections?.find(
        (item) => item?.model === modelName && (item.known_as || "") === known
      );
      setPeerRelation(match?.relation || "");
    }).catch((err: unknown) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Could not load the other side of this relation");
    });
    return () => {
      cancelled = true;
    };
  }, [open, connection, modelName]);

  const currentShape = shapeOf(edge?.fromRelation, edge?.toRelation);

  useEffect(() => {
    if (!open || !edge || !target || !edge.fromRelation || !edge.toRelation) return;
    const shape = SHAPES.find((item) => item.value === target);
    if (!shape) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    void graphqlFetcher<{ previewSchemaRelationTransition: Preview }>(
      PREVIEW_SCHEMA_RELATION_TRANSITION,
      {
        from_model: edge.fromModel,
        to_model: edge.toModel,
        known_as: edge.knownAs,
        from_relation: edge.fromRelation,
        to_relation: edge.toRelation,
        target_from_relation: shape.from,
        target_to_relation: shape.to,
      }
    )().then((data) => {
      if (!cancelled) setPreview(data.previewSchemaRelationTransition);
    }).catch((err: unknown) => {
      if (!cancelled) {
        setPreview(null);
        setError(err instanceof Error ? err.message : "Preview failed");
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, edge, target]);

  const requiredAck = preview?.required_acknowledgement || "";
  const canStage = Boolean(
    preview && !preview.blocked && preview.plan_hash && (!requiredAck || acknowledgement === requiredAck) && !loading
  );

  const stage = async () => {
    if (!edge || !preview?.plan_hash) return;
    const shape = SHAPES.find((item) => item.value === target);
    if (!shape) return;
    setLoading(true);
    try {
      await graphqlFetcher(
        STAGE_RELATION_TRANSITION,
        {
          from_model: edge.fromModel,
          to_model: edge.toModel,
          known_as: edge.knownAs,
          from_relation: edge.fromRelation,
          to_relation: edge.toRelation,
          target_from_relation: shape.from,
          target_to_relation: shape.to,
          plan_hash: preview.plan_hash,
          acknowledgement,
        }
      )();
      message.success("Staged, not applied");
      await onStaged();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not stage the migration");
    } finally {
      setLoading(false);
    }
  };

  const downloadConflicts = () => {
    const blob = new Blob([preview?.preview_json || JSON.stringify(preview?.blockers || [], null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relation-transition-conflicts.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Drawer
      title="Configure Relationship"
      width={420}
      open={open}
      onClose={onClose}
      destroyOnClose
      extra={
        <Button type="primary" disabled={!canStage} loading={loading} onClick={() => void stage()}>
          Stage migration
        </Button>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Text type="secondary">Edge</Text>
          <Paragraph style={{ marginBottom: 0 }}>
            {edge ? `${edge.fromModel} → ${edge.toModel}` : modelName}
          </Paragraph>
          <Text type="secondary">Current {currentShape || "shape"}</Text>
        </div>
        <div>
          <Text>Known as</Text>
          <Input value={connection?.known_as || ""} disabled />
        </div>
        <div>
          <Text>Target cardinality</Text>
          <Select
            style={{ width: "100%" }}
            value={target || undefined}
            placeholder="Select a target"
            options={SHAPES.map((shape) => ({
              value: shape.value,
              label: shape.value,
              disabled: shape.value === currentShape,
            }))}
            onChange={setTarget}
          />
        </div>
        {error ? <Alert type="error" showIcon message={error} /> : null}
        {preview ? (
          <>
            <Alert
              type={preview.blocked ? "error" : "info"}
              showIcon
              message={SAFETY_LABEL[preview.safety || ""] || preview.safety || "Preview"}
              description={REVERSIBILITY_LABEL[preview.reversibility || ""] || preview.reversibility}
            />
            <Text>
              {preview.source_storage || "current storage"} → {preview.target_storage || "target storage"}
            </Text>
            {(preview.disclaimers || []).map((line) => (
              <Alert key={line} type="warning" showIcon message={line} />
            ))}
            {(preview.warnings || []).map((line) => (
              <Text key={line} type="secondary">{line}</Text>
            ))}
            {(preview.blockers || []).length > 0 ? (
              <Button onClick={downloadConflicts}>Download conflict report</Button>
            ) : null}
            {requiredAck ? (
              <div>
                <Text>Type {requiredAck}</Text>
                <Input value={acknowledgement} onChange={(event) => setAcknowledgement(event.target.value)} />
              </div>
            ) : null}
          </>
        ) : null}
        <Button onClick={() => navigate("/console/settings/schema-changes")}>
          Schema Changes
        </Button>
        <Text type="secondary">Staging does not run tenant DDL. Publish remains in Schema Changes.</Text>
      </Space>
    </Drawer>
  );
}
