import type { ExecutionRecord } from './SchemaExecutionTimeline';

export type ChangeGroup = {
  key: string;
  action: string;
  actionLabel: string;
  primary: string;
  primaryHighlight?: string;
  secondary?: string;
  impact: 'metadata' | 'physical' | 'none';
  status: string;
  needsMigration: boolean;
  system?: ExecutionRecord;
  project?: ExecutionRecord;
  error?: string;
};

const ACTION_LABELS: Record<string, string> = {
  add_model: 'Add model',
  delete_model: 'Remove model',
  rename_model: 'Rename model',
  add_field: 'Add field',
  remove_field: 'Remove field',
  update_field: 'Update field',
  reorder_field: 'Reorder field',
  add_connection: 'Add relation',
  remove_connection: 'Remove relation',
  noop: 'No changes',
};

export function actionLabel(actionKey: string): string {
  return ACTION_LABELS[actionKey] ?? actionKey.replace(/_/g, ' ');
}

export function impactLabel(impact: string): string {
  switch (impact) {
    case 'metadata_only':
      return 'Schema only';
    case 'physical_ddl':
      return 'DB migration';
    case 'no_op':
      return 'No DB change';
    default:
      return impact.replace(/_/g, ' ');
  }
}

export function impactTagColor(impact: string): 'default' | 'blue' | 'green' | 'orange' {
  switch (impact) {
    case 'physical_ddl':
      return 'orange';
    case 'metadata_only':
      return 'blue';
    case 'no_op':
      return 'default';
    default:
      return 'default';
  }
}

export function statusTagColor(status: string): string {
  switch (status) {
    case 'passed':
      return 'success';
    case 'failed':
    case 'sync_failed':
      return 'error';
    case 'running':
    case 'pending':
      return 'processing';
    default:
      return 'default';
  }
}

function buildChangeGroup(
  system: ExecutionRecord | undefined,
  project: ExecutionRecord | undefined,
  key: string,
  action: string
): ChangeGroup {
  const impact =
    project?.impact === 'physical_ddl'
      ? 'physical'
      : project?.impact === 'no_op'
        ? 'none'
        : 'metadata';
  const status = worstStatus(system?.status ?? project?.status ?? 'pending', project?.status);
  const msg = system?.system_message ?? project?.system_message ?? '';
  return {
    key,
    action,
    actionLabel: actionLabel(action),
    primary: humanizeMessage(msg, action),
    primaryHighlight: extractHighlight(msg),
    secondary:
      project && project.impact !== 'no_op'
        ? humanizeMessage(project.project_message ?? '', project.action_key)
        : project?.impact === 'no_op'
          ? 'Database unchanged'
          : undefined,
    impact,
    status,
    needsMigration:
      project?.requires_ddl === true || project?.impact === 'physical_ddl',
    system,
    project,
    error: system?.error || project?.error || undefined,
  };
}

/** Pair system + project ledger rows into one logical schema change. */
export function groupExecutionRecords(records: ExecutionRecord[]): ChangeGroup[] {
  const sorted = [...records].sort(
    (a, b) => a.sequence - b.sequence || (a.scope_kind === 'system' ? -1 : 1)
  );

  const withOpID = sorted.filter((r) => r.operation_id);
  if (withOpID.length > 0) {
    const byOp = new Map<
      string,
      { system?: ExecutionRecord; project?: ExecutionRecord; minSeq: number }
    >();
    for (const r of sorted) {
      const opKey = r.operation_id ?? r.id;
      let g = byOp.get(opKey);
      if (!g) {
        g = { minSeq: r.sequence };
        byOp.set(opKey, g);
      }
      g.minSeq = Math.min(g.minSeq, r.sequence);
      if (r.scope_kind === 'system') {
        g.system = r;
      } else {
        g.project = r;
      }
    }
    const keys = [...byOp.keys()].sort(
      (a, b) => (byOp.get(a)?.minSeq ?? 0) - (byOp.get(b)?.minSeq ?? 0)
    );
    return keys.map((opKey) => {
      const g = byOp.get(opKey)!;
      const action =
        g.system?.action_key ?? g.project?.action_key ?? 'noop';
      return buildChangeGroup(g.system, g.project, g.system?.id ?? g.project?.id ?? opKey, action);
    });
  }

  const groups: ChangeGroup[] = [];
  let i = 0;
  while (i < sorted.length) {
    const row = sorted[i];
    if (row.scope_kind === 'system') {
      const project =
        sorted[i + 1]?.scope_kind === 'project' ? sorted[i + 1] : undefined;
      groups.push(
        buildChangeGroup(row, project, row.id, row.action_key)
      );
      i += project ? 2 : 1;
    } else {
      groups.push({
        key: row.id,
        action: row.action_key,
        actionLabel: actionLabel(row.action_key),
        primary: humanizeMessage(row.project_message ?? row.system_message ?? '', row.action_key),
        impact: row.impact === 'physical_ddl' ? 'physical' : 'none',
        status: row.status,
        needsMigration:
          row.requires_ddl === true || row.impact === 'physical_ddl',
        project: row,
        error: row.error ?? undefined,
      });
      i += 1;
    }
  }
  return groups;
}

function worstStatus(a: string, b?: string): string {
  const rank = (s: string) => {
    if (s === 'failed' || s === 'sync_failed') return 4;
    // Must beat `passed` — DDL can finish while system row stays `running`.
    if (s === 'running') return 3;
    if (s === 'pending') return 2;
    if (s === 'passed') return 1;
    return 0;
  };
  if (!b) return a;
  return rank(a) >= rank(b) ? a : b;
}

export type BlockingPublishStep = {
  /** 1-based position in the publish plan. */
  index: number;
  actionLabel: string;
  description: string;
  status: string;
  /** Where the hang is visible in the ledger. */
  scopeHint: 'schema' | 'database' | 'both';
};

/** First incomplete / failed / running logical op — what the UI should name as stuck. */
export function findBlockingPublishStep(
  groups: ChangeGroup[]
): BlockingPublishStep | null {
  const rank = (s: string) => {
    if (s === 'failed' || s === 'sync_failed') return 3;
    if (s === 'running') return 2;
    if (s === 'pending') return 1;
    return 0;
  };

  let bestGroup: ChangeGroup | null = null;
  let bestIndex = -1;
  let bestScore = 0;
  groups.forEach((g, i) => {
    const score = rank(g.status);
    if (score === 0) return;
    // Prefer failed > running > pending; earliest when same score.
    if (!bestGroup || score > bestScore) {
      bestGroup = g;
      bestIndex = i;
      bestScore = score;
    }
  });
  if (!bestGroup || bestIndex < 0) return null;

  const g: ChangeGroup = bestGroup;
  const idx = bestIndex;
  const sysStuck =
    g.system?.status === 'running' ||
    g.system?.status === 'failed' ||
    g.system?.status === 'pending';
  const projStuck =
    g.project?.status === 'running' ||
    g.project?.status === 'failed' ||
    g.project?.status === 'pending' ||
    g.project?.local_status === 'running' ||
    g.project?.local_status === 'failed' ||
    g.project?.local_status === 'pending';
  let scopeHint: BlockingPublishStep['scopeHint'] = 'schema';
  if (sysStuck && projStuck) scopeHint = 'both';
  else if (projStuck && !sysStuck) scopeHint = 'database';
  else if (sysStuck) scopeHint = 'schema';
  else if (g.needsMigration) scopeHint = 'database';

  return {
    index: idx + 1,
    actionLabel: g.actionLabel,
    description: g.primary,
    status: g.status,
    scopeHint,
  };
}

export function formatBlockingPublishStep(step: BlockingPublishStep): string {
  const where =
    step.scopeHint === 'database'
      ? 'database'
      : step.scopeHint === 'both'
        ? 'schema + database'
        : 'schema';
  return `#${step.index} · ${step.actionLabel} · ${step.description} (${step.status}, ${where})`;
}

function humanizeMessage(msg: string, action: string): string {
  if (!msg) return actionLabel(action);

  const fieldOnModel = msg.match(/field\s+(\S+)\s+added to model\s+(\S+)/i);
  if (fieldOnModel) {
    return `${fieldOnModel[1]} on model ${fieldOnModel[2]}`;
  }
  const fieldRemoved = msg.match(/field\s+(\S+)\s+removed from model\s+(\S+)/i);
  if (fieldRemoved) {
    return `${fieldRemoved[1]} on model ${fieldRemoved[2]}`;
  }
  const fieldChanged = msg.match(/changed field\s+(\S+)\s+on\s+(\S+)/i);
  if (fieldChanged) {
    return `${fieldChanged[1]} on ${fieldChanged[2]}`;
  }
  const fieldMoved = msg.match(/field\s+(\S+)\s+moved on\s+(\S+):\s+position\s+(\d+)\s+→\s+(\d+)/i);
  if (fieldMoved) {
    return `${fieldMoved[1]} on ${fieldMoved[2]}: ${fieldMoved[3]} → ${fieldMoved[4]}`;
  }
  const modelAdded = msg.match(/model\s+(\S+)\s+added/i);
  if (modelAdded) {
    return modelAdded[1];
  }
  const modelRenamed = msg.match(/model\s+(\S+)\s+renamed to\s+(\S+)/i);
  if (modelRenamed) {
    return `${modelRenamed[1]} → ${modelRenamed[2]}`;
  }
  const tableRename = msg.match(/rename table\s+(\S+)\s*→\s*(\S+)/i);
  if (tableRename) {
    return `${tableRename[1]} → ${tableRename[2]}`;
  }
  const tableCreate = msg.match(/create table\s+(\S+)/i);
  if (tableCreate) {
    return tableCreate[1];
  }
  const columnAdd = msg.match(/add column\s+(\S+)\s+on\s+(\S+)/i);
  if (columnAdd) {
    return `${columnAdd[1]} on ${columnAdd[2]}`;
  }
  const columnDrop = msg.match(/drop column\s+(\S+)\s+on\s+(\S+)/i);
  if (columnDrop) {
    return `${columnDrop[1]} on ${columnDrop[2]}`;
  }

  return msg
    .replace(/no physical changes needed/i, 'No database migration')
    .replace(/no schema metadata changes detected/i, 'No schema changes');
}

/** Primary identifier to emphasize (model or field name). */
function extractHighlight(msg: string): string | undefined {
  const fieldOnModel = msg.match(/field\s+(\S+)\s+added to model\s+(\S+)/i);
  if (fieldOnModel) return fieldOnModel[1];
  const fieldRemoved = msg.match(/field\s+(\S+)\s+removed from model\s+(\S+)/i);
  if (fieldRemoved) return fieldRemoved[1];
  const modelAdded = msg.match(/model\s+(\S+)\s+added/i);
  if (modelAdded) return modelAdded[1];
  const modelRenamed = msg.match(/model\s+(\S+)\s+renamed to\s+(\S+)/i);
  if (modelRenamed) return modelRenamed[2];
  const tableRename = msg.match(/rename table\s+(\S+)\s*→\s*(\S+)/i);
  if (tableRename) return tableRename[2];
  const fieldChanged = msg.match(/changed field\s+(\S+)/i);
  if (fieldChanged) return fieldChanged[1];
  const fieldMoved = msg.match(/field\s+(\S+)\s+moved/i);
  if (fieldMoved) return fieldMoved[1];
  const table = msg.match(/table\s+(\S+)/i);
  if (table) return table[1];
  const column = msg.match(/column\s+(\S+)/i);
  if (column) return column[1];
  return undefined;
}

export function summarizePlan(groups: ChangeGroup[]): {
  total: number;
  migrations: number;
  schemaOnly: number;
  hasIssues: boolean;
} {
  let migrations = 0;
  let schemaOnly = 0;
  let hasIssues = false;
  for (const g of groups) {
    if (g.needsMigration) migrations += 1;
    else if (g.impact === 'metadata') schemaOnly += 1;
    if (g.status === 'failed' || g.status === 'sync_failed') hasIssues = true;
  }
  return { total: groups.length, migrations, schemaOnly, hasIssues };
}

/** Aggregate publish progress from engine counters or ledger row statuses. */
export function computeAggregatePublishProgress(
  groups: ChangeGroup[],
  publishTotal?: number | null,
  publishDone?: number | null
): { done: number; total: number; pending: number } {
  const total = publishTotal && publishTotal > 0 ? publishTotal : groups.length;
  let done = publishDone ?? 0;
  if (publishDone == null || publishDone < 0) {
    done = groups.filter((g) => g.status === 'passed').length;
  }
  if (done > total) {
    done = total;
  }
  return { done, total, pending: Math.max(0, total - done) };
}

export type OperationKind = 'add' | 'change' | 'remove' | 'none';

export function operationKindFromAction(actionKey: string): OperationKind {
  if (
    actionKey === 'add_model' ||
    actionKey === 'add_field' ||
    actionKey === 'add_connection'
  ) {
    return 'add';
  }
  if (
    actionKey === 'remove_field' ||
    actionKey === 'delete_model' ||
    actionKey === 'remove_connection'
  ) {
    return 'remove';
  }
  if (actionKey === 'update_field' || actionKey === 'reorder_field' || actionKey === 'rename_model' || actionKey === 'noop') {
    return actionKey === 'noop' ? 'none' : 'change';
  }
  return 'change';
}

export function operationTagColor(kind: OperationKind): string {
  switch (kind) {
    case 'add':
      return 'green';
    case 'change':
      return 'gold';
    case 'remove':
      return 'red';
    default:
      return 'default';
  }
}

export function isRemoveAction(actionKey: string): boolean {
  return operationKindFromAction(actionKey) === 'remove';
}

export function isDbLocalRunning(localStatus: string, status?: string): boolean {
  return localStatus === 'running' || status === 'running';
}

export function isRemoteRunning(remoteStatus: string, status?: string): boolean {
  return remoteStatus === 'running' || status === 'running';
}

/** Legacy rows stored remote as not_applicable before publish tracking — treat as pending in UI. */
export function normalizeLedgerStatus(
  status: string | undefined | null,
  forDbMigration: boolean
): string {
  if (!status || status === 'not_applicable') {
    return forDbMigration ? 'pending' : 'not_applicable';
  }
  return status;
}

/** Turso Cloud sync done. */
export function isRemoteDone(remoteStatus: string): boolean {
  return remoteStatus === 'passed';
}

export function isRemoteFailed(remoteStatus: string, status?: string): boolean {
  return (
    remoteStatus === 'sync_failed' ||
    status === 'sync_failed' ||
    status === 'failed'
  );
}

export function isRemoteApplicable(remoteStatus: string): boolean {
  return remoteStatus !== 'not_applicable' && remoteStatus !== '';
}

export type UnifiedPlanRow = {
  key: string;
  index: number;
  actionLabel: string;
  description: string;
  highlight?: string;
  operationKind: OperationKind;
  database: string;
  databaseNone: boolean;
  doneApplicable: boolean;
  doneDone: boolean;
  doneRunning: boolean;
  doneFailed: boolean;
  localDone: boolean;
  localRunning: boolean;
  localApplicable: boolean;
  localFailed: boolean;
  remoteDone: boolean;
  remoteRunning: boolean;
  remoteApplicable: boolean;
  remoteFailed: boolean;
  projectRecordId?: string;
  canPublishRow: boolean;
  canRejectRow: boolean;
  impact: 'metadata' | 'physical' | 'none';
  retryable: boolean;
  retryRecordId?: string;
  error?: string;
};

/** One row per logical change: schema registry + database effect together. */
export function buildUnifiedPlanRows(
  groups: ChangeGroup[],
  isDraft: boolean,
  isPublishing = false
): UnifiedPlanRow[] {
  const useLiveStatus = isPublishing || !isDraft;
  return groups.map((g, index) => {
    const sys = g.system;
    const proj = g.project;
    const actionKey = sys?.action_key ?? proj?.action_key ?? g.action;

    const opKind = operationKindFromAction(actionKey);

    const hasDbMigration = g.needsMigration === true;
    let database = 'No database migration';
    let databaseNone = !hasDbMigration;
    if (hasDbMigration) {
      database =
        g.secondary ??
        (proj?.project_message
          ? humanizeMessage(proj.project_message, actionKey)
          : 'DB migration on publish');
      databaseNone = false;
    }

    const sysRemote = sys?.remote_status ?? '';
    const sysStatus = sys?.status ?? g.status;
    const projLocal = normalizeLedgerStatus(proj?.local_status, hasDbMigration);
    const projRemote = normalizeLedgerStatus(proj?.remote_status, hasDbMigration);

    const retryRecordId =
      !isDraft && proj?.retryable
        ? proj.id
        : !isDraft && sys?.retryable
          ? sys.id
          : undefined;

    // Metadata-only ops used to leave Done as "—" so a stuck system `running` row
    // was invisible. During live publish, Done tracks schema registry for those ops.
    const schemaRunning =
      sysStatus === 'running' || sys?.local_status === 'running';
    const schemaFailed =
      sysStatus === 'failed' ||
      sysStatus === 'sync_failed' ||
      sys?.local_status === 'failed';
    const schemaDone = sysStatus === 'passed';

    const dbRunning =
      hasDbMigration &&
      (isDbLocalRunning(projLocal, proj?.status) ||
        isRemoteRunning(projRemote, proj?.status));
    const dbFailed =
      hasDbMigration &&
      (proj?.status === 'failed' ||
        proj?.local_status === 'failed' ||
        isRemoteFailed(projRemote, proj?.status));
    const dbDone =
      hasDbMigration &&
      useLiveStatus &&
      projLocal === 'passed' &&
      projRemote === 'passed';

    const doneApplicable = useLiveStatus || hasDbMigration;
    // Physical ops: Done only when DB finished AND schema registry not still running/failed.
    const doneDone = hasDbMigration
      ? dbDone && (!sys || schemaDone)
      : useLiveStatus
        ? schemaDone
        : false;
    const doneRunning = hasDbMigration
      ? dbRunning || (useLiveStatus && schemaRunning && !schemaDone)
      : useLiveStatus && schemaRunning;
    const doneFailed = hasDbMigration
      ? dbFailed || (useLiveStatus && schemaFailed)
      : useLiveStatus && schemaFailed;

    return {
      key: g.key,
      index: index + 1,
      actionLabel: g.actionLabel,
      description: g.primary,
      highlight: g.primaryHighlight,
      operationKind: databaseNone ? 'none' : opKind,
      database,
      databaseNone,
      doneApplicable,
      doneDone,
      doneRunning,
      doneFailed,
      localDone: doneDone,
      localRunning: isDbLocalRunning(projLocal, proj?.status),
      localApplicable: hasDbMigration,
      localFailed:
        proj?.status === 'failed' || proj?.local_status === 'failed',
      remoteDone: hasDbMigration
        ? isRemoteDone(projRemote)
        : isRemoteDone(sysRemote),
      remoteRunning: hasDbMigration
        ? isRemoteRunning(projRemote, proj?.status)
        : isRemoteRunning(sysRemote, sys?.status),
      remoteApplicable: hasDbMigration,
      remoteFailed: hasDbMigration
        ? isRemoteFailed(projRemote, proj?.status)
        : isRemoteFailed(sysRemote, sys?.status),
      impact: g.impact,
      retryable: !!retryRecordId,
      retryRecordId,
      projectRecordId: proj?.id,
      canPublishRow:
        isDraft &&
        !isPublishing &&
        !!proj?.id &&
        hasDbMigration &&
        (proj.local_status === 'pending' || proj.local_status === 'not_applicable'),
      canRejectRow: isDraft && !isPublishing && !!proj?.id,
      error: g.error,
    };
  });
}

export function sectionSyncHint(
  rows: ExecutionRecord[],
  scope: 'system' | 'project'
): string | null {
  const scoped = rows.filter((r) => r.scope_kind === scope);
  if (scoped.length === 0) return null;
  const failed = scoped.some(
    (r) => r.remote_status === 'sync_failed' || r.status === 'sync_failed'
  );
  if (failed) return 'Cloud sync failed';
  const pending = scoped.some((r) => r.status === 'pending');
  if (pending) return 'Runs on publish';
  const passed = scoped.every((r) => r.status === 'passed');
  if (passed && scope === 'system') return 'Synced to cloud';
  if (passed) return 'Complete';
  return null;
}
