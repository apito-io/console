import axios from "axios";
import { httpService } from "../../../services/httpService";

function apiError(err: unknown, fallback: string): Error {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message.trim()) return new Error(message);
  }
  if (err instanceof Error) return err;
  return new Error(fallback);
}

export type DatabaseEngine = "sqlite" | "postgresql" | "mysql" | "mongodb";

export type DatabaseConnection = {
  engine: DatabaseEngine;
  label: string;
  connected: boolean;
  source: string;
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  has_password?: boolean;
  uri_set?: boolean;
  server_version?: string;
  checked_at?: string;
  last_error?: string;
};

export type ConnectionCheck = {
  engine: string;
  server_version?: string;
  latency_ms?: number;
};

export type ConnectionTestResult = {
  connection: DatabaseConnection;
  check?: ConnectionCheck;
};

export type DatabaseConnectionInput = {
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
  uri?: string;
};

const ROOT = "/system/database/connections";

export async function fetchDatabaseConnections(): Promise<{
  connections: DatabaseConnection[];
  selectedEngine: string;
}> {
  let res;
  try {
    res = await httpService.get(ROOT);
  } catch (err) {
    throw apiError(err, "Could not load connections");
  }
  const body = res.data?.body ?? {};
  return {
    connections: Array.isArray(body.connections) ? body.connections : [],
    selectedEngine: typeof body.selected_engine === "string" ? body.selected_engine : "",
  };
}

/** Saves a connection. The server checks it first and refuses to store one that fails. */
export async function saveDatabaseConnection(
  engine: DatabaseEngine,
  input: DatabaseConnectionInput,
): Promise<ConnectionTestResult> {
  try {
    const res = await httpService.put(`${ROOT}/${engine}`, input, { timeout: 30000 });
    return res.data?.body as ConnectionTestResult;
  } catch (err) {
    throw apiError(err, "Save failed");
  }
}

/**
 * Checks a connection on the server. With `input` it checks those form values
 * without saving; without it, it re-checks the active connection.
 */
export async function testDatabaseConnection(
  engine: DatabaseEngine,
  input?: DatabaseConnectionInput,
): Promise<ConnectionTestResult> {
  try {
    const res = await httpService.post(`${ROOT}/${engine}/test`, input ?? {}, { timeout: 30000 });
    return res.data?.body as ConnectionTestResult;
  } catch (err) {
    throw apiError(err, "Connection failed");
  }
}

export async function assignProjectDatabase(engine: DatabaseEngine): Promise<void> {
  try {
    await httpService.put("/system/database/project", { engine });
  } catch (err) {
    throw apiError(err, "Could not update the project database");
  }
}

export const DATABASE_SETUP_HINT =
  "Please set up the database connection in Databases > Connections.";
