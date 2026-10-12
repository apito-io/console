import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Flex,
  Progress,
  Skeleton,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { schemaKeys } from '../../lib/queryKeys';
import { graphqlFetcher } from '../../lib/graphqlFetcher';
import { SCHEMA_CHANGE_EXECUTION_RECORDS } from '../../graphql/queries/schemaExecution';
import { schemaExecutionRecordsFetchLimit } from '../../lib/schemaExecutionLimits';
import { Check, Cloud, Database, RefreshCw, Rocket, X } from "lucide-react";
import {
  buildUnifiedPlanRows,
  computeAggregatePublishProgress,
  findBlockingPublishStep,
  formatBlockingPublishStep,
  groupExecutionRecords,
  impactLabel,
  impactTagColor,
  operationTagColor,
  sectionSyncHint,
  summarizePlan,
  type BlockingPublishStep,
  type OperationKind,
  type UnifiedPlanRow,
} from './schemaExecutionUi';

const { Text, Title } = Typography;

export type ExecutionRecord = {
  id: string;
  operation_id?: string | null;
  sequence: number;
  scope_kind: string;
  target_name?: string | null;
  action_key: string;
  impact: string;
  requires_ddl?: boolean | null;
  retryable?: boolean | null;
  system_message?: string | null;
  project_message?: string | null;
  local_status: string;
  remote_status: string;
  status: string;
  error?: string | null;
};

type Props = {
  changesetId?: string | null;
  version?: number | null;
  mode?: 'draft' | 'published';
  embedded?: boolean;
  /** Pending op count from schemaVersioningStatus — sizes GraphQL limit (2 ledger rows per op). */
  pendingOperations?: number | null;
  /** When true, poll execution records and show live Done status. */
  publishing?: boolean;
  /** Engine changeset status — drives reload-safe publishing UI. */
  changesetStatus?: string | null;
  publishTotal?: number | null;
  publishDone?: number | null;
  onRecordsChange?: () => void;
  /** Fires when the current incomplete / failed publish step changes. */
  onBlockingStepChange?: (step: BlockingPublishStep | null) => void;
  /** Cloud repair actions. Omitted on the public console. */
  onRetryRecord?: (id: string) => void | Promise<void>;
  onPublishRecord?: (id: string) => void | Promise<void>;
  onRejectRecord?: (id: string) => void | Promise<void>;
  onFlushSync?: () => void | Promise<void>;
  retrying?: boolean;
  flushing?: boolean;
};

function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) {
    return <span>{text}</span>;
  }
  const parts = text.split(highlight);
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 ? <Text strong>{highlight}</Text> : null}
        </React.Fragment>
      ))}
    </>
  );
}

function RoundStatusCheck({
  done,
  failed,
  running,
  notApplicable,
  label,
}: {
  done: boolean;
  failed?: boolean;
  running?: boolean;
  notApplicable?: boolean;
  label: string;
}) {
  const { token } = theme.useToken();

  if (notApplicable) {
    return (
      <Tooltip title={`${label}: not applicable`}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          —
        </Text>
      </Tooltip>
    );
  }

  const borderColor = failed
    ? token.colorError
    : done
      ? token.colorSuccess
      : running
        ? token.colorPrimary
        : token.colorTextQuaternary;
  const fill = failed ? token.colorError : done ? token.colorSuccess : 'transparent';

  return (
    <Tooltip
      title={
        failed
          ? `${label}: failed`
          : done
            ? `${label}: done`
            : running
              ? `${label}: running`
              : `${label}: pending`
      }
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${borderColor}`,
          background: fill,
          verticalAlign: 'middle',
        }}
      >
        {running && !done && !failed ? (
          <Spin size="small" style={{ transform: 'scale(0.55)' }} />
        ) : null}
        {done && !failed ? (
          <Check size={16} strokeWidth={1.75} style={{ color: '#fff', fontSize: 11 }} />
        ) : null}
      </span>
    </Tooltip>
  );
}

function OperationTag({ kind }: { kind: OperationKind }) {
  if (kind === 'none') {
    return (
      <Tag bordered={false} color="default" style={{ margin: 0 }}>
        skip
      </Tag>
    );
  }
  return (
    <Tag bordered={false} color={operationTagColor(kind)} style={{ margin: 0, textTransform: 'lowercase' }}>
      {kind}
    </Tag>
  );
}

function DatabaseCell({ row, isDraft }: { row: UnifiedPlanRow; isDraft: boolean }) {
  if (row.databaseNone) {
    return (
      <Flex align="center" gap={8}>
        <OperationTag kind="none" />
        <Text type="secondary" italic style={{ fontSize: 12 }}>
          No migration
        </Text>
      </Flex>
    );
  }

  return (
    <Flex align="flex-start" gap={8} wrap="wrap">
      <OperationTag kind={row.operationKind} />
      <div style={{ flex: 1, minWidth: 120 }}>
        <Text style={{ fontSize: 12 }}>{row.database}</Text>
        {isDraft && (
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
            Runs on publish
          </Text>
        )}
      </div>
    </Flex>
  );
}

function usePlanColumns(
  isDraft: boolean,
  onRetry: ((id: string) => void) | undefined,
  retrying: boolean,
  onPublishRow: ((id: string) => void) | undefined,
  onRejectRow: ((id: string) => void) | undefined,
  rowBusyId: string | null
): ColumnsType<UnifiedPlanRow> {
  return [
    {
      title: '#',
      dataIndex: 'index',
      width: 36,
      align: 'center',
      render: (n: number) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {n}
        </Text>
      ),
    },
    {
      title: 'Change',
      key: 'change',
      render: (_, row) => {
        const impactKey =
          row.impact === 'physical'
            ? 'physical_ddl'
            : row.impact === 'none'
              ? 'no_op'
              : 'metadata_only';
        return (
          <div>
            <Flex align="center" gap={6} wrap="wrap" style={{ marginBottom: 2 }}>
              <Text strong style={{ fontSize: 13 }}>
                {row.actionLabel}
              </Text>
              <Tag bordered={false} color={impactTagColor(impactKey)} style={{ margin: 0 }}>
                {impactLabel(impactKey)}
              </Tag>
            </Flex>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <HighlightedText text={row.description} highlight={row.highlight} />
            </Text>
            {row.error ? (
              <Text type="danger" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
                {row.error}
              </Text>
            ) : null}
          </div>
        );
      },
    },
    {
      title: (
        <Tooltip title="DDL on project database">
          <span>
            <Database size={16} strokeWidth={1.75} style={{ marginRight: 4 }} />
            Database
          </span>
        </Tooltip>
      ),
      key: 'database',
      width: '32%',
      render: (_, row) => <DatabaseCell row={row} isDraft={isDraft} />,
    },
    {
      title: (
        <Tooltip title="Done only after the required project DB change and remote sync are both complete.">
          <span>Done</span>
        </Tooltip>
      ),
      key: 'done',
      width: 72,
      align: 'center',
      render: (_, row) => (
        <RoundStatusCheck
          done={row.doneDone}
          failed={row.doneFailed}
          running={row.doneRunning}
          notApplicable={!row.doneApplicable}
          label="Done"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 88,
      render: (_, row) => (
        <Flex gap={0} justify="center">
          {onPublishRow && row.canPublishRow && row.projectRecordId ? (
            <Button
              type="link"
              size="small"
              icon={<Rocket size={16} strokeWidth={1.75} />}
              loading={rowBusyId === row.projectRecordId}
              onClick={() => onPublishRow(row.projectRecordId!)}
            />
          ) : null}
          {onRejectRow && row.canRejectRow && row.projectRecordId ? (
            <Button
              type="link"
              size="small"
              danger
              icon={<X size={16} strokeWidth={1.75} />}
              loading={rowBusyId === row.projectRecordId}
              onClick={() => onRejectRow(row.projectRecordId!)}
            />
          ) : null}
          {onRetry && row.retryable && row.retryRecordId ? (
            <Button
              type="link"
              size="small"
              icon={<RefreshCw size={16} strokeWidth={1.75} />}
              loading={retrying}
              onClick={() => onRetry(row.retryRecordId!)}
            />
          ) : null}
        </Flex>
      ),
    },
  ];
}

const SchemaExecutionTimeline: React.FC<Props> = ({
  changesetId,
  version,
  mode: modeProp = changesetId && !version ? 'draft' : 'published',
  embedded = false,
  pendingOperations,
  publishing = false,
  changesetStatus,
  publishTotal,
  publishDone,
  onRecordsChange,
  onBlockingStepChange,
  onRetryRecord,
  onPublishRecord,
  onRejectRecord,
  onFlushSync,
  retrying = false,
  flushing = false,
}) => {
  const { token } = theme.useToken();
  const isActivePublish =
    publishing ||
    changesetStatus === 'publishing' ||
    changesetStatus === 'failed';
  const fetchLimit = useMemo(
    () => schemaExecutionRecordsFetchLimit(pendingOperations),
    [pendingOperations]
  );
  const { data, isPending, isLoading, refetch } = useQuery({
    queryKey: schemaKeys.execution(changesetId ?? undefined, version ?? undefined, fetchLimit),
    enabled: !!(changesetId || version),
    // Always poll during active publish. subscribeNotifySystem marks connected=true on
    // subscribe (before a real open), which previously disabled this safety net and left
    // Done circles grey even while schema_publish_progress events were arriving.
    refetchInterval: isActivePublish ? 2000 : false,
    queryFn: graphqlFetcher<
      { schemaChangeExecutionRecords?: ExecutionRecord[] | null },
      { changeset_id?: string; version?: number; limit: number; offset: number }
    >(SCHEMA_CHANGE_EXECUTION_RECORDS, {
      changeset_id: changesetId ?? undefined,
      version: version ?? undefined,
      limit: fetchLimit,
      offset: 0,
    }),
  });
  const loading = (isPending || isLoading) && data === undefined;

  const [rowBusyId, setRowBusyId] = useState<string | null>(null);
  const runRepair = async (id: string, action?: (id: string) => void | Promise<void>) => {
    if (!action) return;
    setRowBusyId(id);
    try {
      await action(id);
      await refetch();
      onRecordsChange?.();
    } finally {
      setRowBusyId(null);
    }
  };

  const records = useMemo(
    () => (data?.schemaChangeExecutionRecords ?? []) as ExecutionRecord[],
    [data?.schemaChangeExecutionRecords]
  );
  const groups = useMemo(() => groupExecutionRecords(records), [records]);
  const summary = useMemo(() => summarizePlan(groups), [groups]);
  const isDraft = modeProp === 'draft';

  const useLiveLedger = isActivePublish || !isDraft || changesetStatus === 'published';

  const planRows = useMemo(
    () => buildUnifiedPlanRows(groups, isDraft, useLiveLedger),
    [groups, isDraft, useLiveLedger]
  );

  const aggregate = useMemo(
    () => computeAggregatePublishProgress(groups, publishTotal, publishDone),
    [groups, publishTotal, publishDone]
  );

  const blockingStep = useMemo(
    () => (isActivePublish ? findBlockingPublishStep(groups) : null),
    [groups, isActivePublish]
  );

  useEffect(() => {
    onBlockingStepChange?.(blockingStep);
  }, [blockingStep, onBlockingStepChange]);

  const mayBeTruncated = records.length >= fetchLimit;

  const columns = usePlanColumns(
    isDraft,
    onRetryRecord ? (id) => void runRepair(id, onRetryRecord) : undefined,
    retrying,
    onPublishRecord ? (id) => void runRepair(id, onPublishRecord) : undefined,
    onRejectRecord ? (id) => void runRepair(id, onRejectRecord) : undefined,
    rowBusyId
  );

  const schemaSyncHint = sectionSyncHint(
    records.filter((r) => r.scope_kind === 'system'),
    'system'
  );

  if (!changesetId && !version) {
    return null;
  }

  if (!loading && records.length === 0) {
    const pending = pendingOperations ?? 0;
    const emptyPlanDescription =
      pending > 0
        ? `Draft has ${pending} pending operation(s) but no execution ledger rows. Common causes: staging timed out before the plan was built, or nested fields were staged out of parent→child order. Discard the draft and re-stage with CLI ≥ v0.4.9 (depth-first apply), then publish after a successful sync.`
        : 'This version was published before execution tracking.';
    return (
      <Alert
        type="info"
        showIcon
        message="No detailed plan"
        description={emptyPlanDescription}
        style={{ marginTop: 8 }}
      />
    );
  }

  const showInlineProgress = isActivePublish && aggregate.total > 0;

  return (
    <div style={{ marginTop: embedded ? 0 : 16 }}>
      {/* Progress stays mounted during ledger refetch — do not nest under loading skeleton. */}
      {showInlineProgress ? (
        <div style={{ marginBottom: 12 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Publish progress
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {aggregate.done} / {aggregate.total}
              {aggregate.pending > 0 ? ` · ${aggregate.pending} pending` : ''}
            </Text>
          </Flex>
          <Progress
            percent={Math.round((aggregate.done / aggregate.total) * 100)}
            size="small"
            status={changesetStatus === 'failed' ? 'exception' : 'active'}
          />
          {blockingStep ? (
            <Alert
              type={
                blockingStep.status === 'failed' || blockingStep.status === 'sync_failed'
                  ? 'error'
                  : blockingStep.status === 'running'
                    ? 'warning'
                    : 'info'
              }
              showIcon
              style={{ marginTop: 8 }}
              message={
                blockingStep.status === 'failed' || blockingStep.status === 'sync_failed'
                  ? 'Failed on this step'
                  : blockingStep.status === 'running'
                    ? 'Currently working on'
                    : 'Next step'
              }
              description={formatBlockingPublishStep(blockingStep)}
            />
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Flex
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={8}
            style={{ marginBottom: 12 }}
          >
            <div>
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                {isDraft ? 'What will publish' : `Changes in v${version}`}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {summary.total === 0
                  ? 'No changes'
                  : [
                    `${summary.total} change${summary.total !== 1 ? 's' : ''}`,
                    summary.migrations > 0
                      ? `${summary.migrations} with DB migration`
                      : 'schema metadata only',
                  ].join(' · ')}
              </Text>
            </div>
            {!isDraft && onFlushSync && schemaSyncHint === 'Cloud sync failed' && (
              <Button
                size="small"
                icon={<Cloud size={16} strokeWidth={1.75} />}
                loading={flushing}
                onClick={() => {
                  void Promise.resolve(onFlushSync()).then(() => refetch());
                }}
              >
                Retry remote sync
              </Button>
            )}
          </Flex>

          {mayBeTruncated && (
            <Alert
              type="warning"
              showIcon
              message="Timeline may be incomplete"
              description={`Loaded ${records.length} execution rows (limit ${fetchLimit}). ${pendingOperations ?? 0} pending operations may need a higher fetch limit or pagination.`}
              style={{ marginBottom: 12 }}
            />
          )}

          {summary.hasIssues && (
            <Alert
              type="error"
              showIcon
              message="Some steps failed"
              description={
                records.find((r) => r?.error)?.error ||
                'Open a failed row for details, or check the publish banner error above.'
              }
              style={{ marginBottom: 12 }}
            />
          )}

          <div
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              overflow: 'hidden',
              background: token.colorBgContainer,
            }}
          >
            <Table<UnifiedPlanRow>
              size="small"
              loading={loading}
              columns={columns}
              dataSource={planRows}
              rowKey="key"
              pagination={false}
              locale={{ emptyText: 'No changes' }}
              scroll={{ x: 600 }}
              rowClassName={(row) =>
                blockingStep && row.index === blockingStep.index
                  ? 'schema-publish-blocking-row'
                  : ''
              }
              onRow={(row) =>
                blockingStep && row.index === blockingStep.index
                  ? {
                      style: {
                        background:
                          blockingStep.status === 'failed' ||
                          blockingStep.status === 'sync_failed'
                            ? token.colorErrorBg
                            : token.colorWarningBg,
                      },
                    }
                  : {}
              }
            />
          </div>

          <Flex gap={16} style={{ marginTop: 8 }} wrap="wrap">
            <Text type="secondary" style={{ fontSize: 11 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: token.colorSuccess,
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              Done
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: `2px solid ${token.colorTextQuaternary}`,
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              Pending
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              <Tag bordered={false} color="green" style={{ margin: 0 }}>
                add
              </Tag>
              <Tag bordered={false} color="gold" style={{ margin: 0 }}>
                change
              </Tag>
              <Tag bordered={false} color="red" style={{ margin: 0 }}>
                remove
              </Tag>
            </Text>
          </Flex>
        </>
      )}
    </div>
  );
};

export default SchemaExecutionTimeline;
