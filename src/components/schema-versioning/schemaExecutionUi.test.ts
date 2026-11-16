import { describe, expect, it } from 'vitest';
import { buildUnifiedPlanRows, findBlockingPublishStep, groupExecutionRecords } from './schemaExecutionUi';
import type { ExecutionRecord } from './SchemaExecutionTimeline';

function op(
  id: string,
  seq: number,
  system: Partial<ExecutionRecord>,
  project: Partial<ExecutionRecord>
): ExecutionRecord[] {
  return [
    {
      id: `${id}-s`,
      operation_id: id,
      sequence: seq,
      scope_kind: 'system',
      action_key: 'remove_field',
      impact: 'metadata_only',
      local_status: 'pending',
      remote_status: 'pending',
      status: 'pending',
      system_message: `field f${seq} removed from model vendor_profile`,
      ...system,
    },
    {
      id: `${id}-p`,
      operation_id: id,
      sequence: seq + 1,
      scope_kind: 'project',
      action_key: 'remove_field',
      impact: 'physical_ddl',
      requires_ddl: true,
      local_status: 'pending',
      remote_status: 'pending',
      status: 'pending',
      project_message: `drop column f${seq} on vendor_profile`,
      ...project,
    },
  ];
}

const passed = { local_status: 'passed', remote_status: 'passed', status: 'passed' };

describe('buildUnifiedPlanRows Done state', () => {
  it('marks a failed step failed (not running) even if the schema row is still running', () => {
    const records = op(
      'op-64',
      1,
      { status: 'running' },
      { status: 'failed', local_status: 'failed', error: 'error in index idx_x after drop column' }
    );
    const [row] = buildUnifiedPlanRows(groupExecutionRecords(records), true, true);
    expect(row.doneFailed).toBe(true);
    expect(row.doneRunning).toBe(false);
    expect(row.doneDone).toBe(false);
    expect(row.error).toContain('error in index');
  });

  it('marks a finished step done once its schema row has settled', () => {
    const records = op('op-1', 1, { local_status: 'passed', status: 'passed' }, passed);
    const [row] = buildUnifiedPlanRows(groupExecutionRecords(records), true, true);
    expect(row.doneDone).toBe(true);
    expect(row.doneRunning).toBe(false);
    expect(row.doneFailed).toBe(false);
  });

  it('names the step that is actually running, not the first started one', () => {
    const records = [
      ...op('op-1', 1, { local_status: 'passed', status: 'passed' }, passed),
      ...op('op-2', 3, { status: 'running' }, { status: 'running', local_status: 'running' }),
      ...op('op-3', 5, {}, {}),
    ];
    const step = findBlockingPublishStep(groupExecutionRecords(records));
    expect(step?.index).toBe(2);
    expect(step?.status).toBe('running');
  });
});
