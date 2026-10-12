import React from "react";
import { Tag, theme } from "antd";
import type { SchemaOverlayChangeKind } from "../../types/schemaDraftOverlay";

interface SchemaOverlayBadgeProps {
  kind: SchemaOverlayChangeKind;
  draftVersionLabel?: string;
}

const SchemaOverlayBadge: React.FC<SchemaOverlayBadgeProps> = ({
  kind,
  draftVersionLabel,
}) => {
  const { token } = theme.useToken();

  if (kind === "live") {
    return null;
  }

  if (kind === "removed") {
    return (
      <Tag color="error" style={{ marginInlineEnd: 0, fontSize: 10 }}>
        Removed
      </Tag>
    );
  }

  const label =
    kind === "added"
      ? draftVersionLabel || "Draft"
      : kind === "modified"
        ? draftVersionLabel
          ? `${draftVersionLabel} · Changed`
          : "Changed"
        : draftVersionLabel || "Draft";

  return (
    <Tag
      style={{
        marginInlineEnd: 0,
        fontSize: 10,
        color: token.colorWarning,
        background: token.colorWarningBg,
        borderColor: token.colorWarningBorder,
      }}
    >
      {label}
    </Tag>
  );
};

export function schemaOverlaySurfaceStyle(
  kind: SchemaOverlayChangeKind,
  token: ReturnType<typeof theme.useToken>["token"]
): React.CSSProperties | undefined {
  if (kind === "added" || kind === "modified") {
    return {
      background: token.colorWarningBg,
      borderColor: token.colorWarningBorder,
    };
  }
  if (kind === "removed") {
    return {
      background: token.colorErrorBg,
      borderColor: token.colorErrorBorder,
      opacity: 0.85,
    };
  }
  return undefined;
}

export function schemaOverlayTextStyle(
  kind: SchemaOverlayChangeKind
): React.CSSProperties | undefined {
  if (kind === "removed") {
    return { textDecoration: "line-through" };
  }
  return undefined;
}

export default SchemaOverlayBadge;
