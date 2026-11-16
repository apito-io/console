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

export async function saveDatabaseConnection(
  engine: DatabaseEngine,
  input: DatabaseConnectionInput,
): Promise<DatabaseConnection> {
  try {
    const res = await httpService.put(`${ROOT}/${engine}`, input);
    return res.data?.body as DatabaseConnection;
  } catch (err) {
    throw apiError(err, "Save failed");
  }
}

export async function testDatabaseConnection(
  engine: DatabaseEngine,
): Promise<DatabaseConnection> {
  try {
    const res = await httpService.post(`${ROOT}/${engine}/test`);
    return res.data?.body as DatabaseConnection;
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

export async function spawnDatabaseInstance(input: {
  database: DatabaseEngine;
  slug: string;
  tier: string;
  region: string;
}): Promise<{ id?: string; status?: string; database?: string }> {
  let res;
  try {
    res = await httpService.post("/system/dedicated/order", {
    slug: input.slug,
    tier: input.tier,
    region: input.region,
    database: input.database,
    provider: "gcp",
    });
  } catch (err) {
    throw apiError(err, "Could not queue the instance");
  }
  return (res.data?.body ?? {}) as { id?: string; status?: string; database?: string };
}

export const DATABASE_SETUP_HINT =
  "Please set up the database connection in Databases > Connections.";
