import { useState } from "react";
import { Button, Input, Table, Typography } from "antd";
import { useSettingsPageMeta } from "../../../contexts/SettingsPageMetaContext";
import { httpService } from "../../../services/httpService";

export default function ProjectSqlPage() {
  useSettingsPageMeta({
    title: "Database query",
    description:
      "Read-only SQL for this project's database. One SELECT, WITH, EXPLAIN, or PRAGMA statement. At most 200 rows.",
  });
  const [sql, setSql] = useState("SELECT 1");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await httpService.post("/system/project/sql-query", { sql });
      const body = res.data?.body ?? res.data;
      const cols: string[] = Array.isArray(body?.columns) ? body.columns : [];
      const rawRows: unknown[][] = Array.isArray(body?.rows) ? body.rows : [];
      setColumns(cols);
      setRows(
        rawRows.map((row, index) => {
          const record: Record<string, unknown> = { key: index };
          cols.forEach((col, i) => {
            record[col] = Array.isArray(row) ? row[i] : "";
          });
          return record;
        }),
      );
    } catch (err) {
      setColumns([]);
      setRows([]);
      const message =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message || (err instanceof Error ? err.message : "Query failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="console-stack console-stack--md">
      <Input.TextArea rows={6} value={sql} onChange={(e) => setSql(e.target.value)} />
      <Button type="primary" style={{ margin: "12px 0" }} onClick={() => void run()} loading={busy}>
        Run
      </Button>
      {error ? <Typography.Paragraph type="danger">{error}</Typography.Paragraph> : null}
      <Table
        size="small"
        pagination={{ pageSize: 50 }}
        dataSource={rows}
        columns={columns.map((col) => ({ title: col, dataIndex: col, key: col }))}
      />
    </div>
  );
}
