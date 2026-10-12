import { Alert } from "antd";
import { ConsoleChip, ConsoleChipGroup } from "../console";
import type { BackendManifestPreview } from "../../lib/manifestPreview";

export default function ExactManifestPreview({
  preview,
  handoffId,
  stageAfterCreate,
  onStageAfterCreateChange,
}: {
  preview?: BackendManifestPreview | null;
  handoffId?: string;
  stageAfterCreate: boolean;
  onStageAfterCreateChange: (checked: boolean) => void;
}) {
  if (!preview && !handoffId) return null;

  return (
    <Alert
      type="info"
      showIcon
      className="create-project-page__handoff"
      message={
        preview
          ? `Exact manifest preview: ${preview.title} v${preview.version}`
          : `Handoff received for ${handoffId}`
      }
      description={
        <div>
          <p style={{ marginBottom: 8 }}>
            {preview?.description ||
              "Authenticate and create the project to stage this verified backend as a reviewable schema draft. Publish stays human-only."}
          </p>
          {preview ? (
            <ConsoleChipGroup>
              {preview.models.slice(0, 8).map((model) => (
                <ConsoleChip key={model.name} type="span">
                  {model.label || model.name}
                </ConsoleChip>
              ))}
            </ConsoleChipGroup>
          ) : null}
          <label style={{ display: "block", marginTop: 12 }}>
            <input
              type="checkbox"
              checked={stageAfterCreate}
              onChange={(event) => onStageAfterCreateChange(event.target.checked)}
              style={{ marginRight: 8 }}
            />
            Stage manifest into schema draft after create (recommended)
          </label>
        </div>
      }
    />
  );
}
