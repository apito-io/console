import { Icon } from "@iconify/react";
import { Database } from "lucide-react";

type Brand = { icon: string; color: string; label: string };

function brandFor(engine: string | null | undefined): Brand | null {
  const e = (engine || "").toLowerCase();
  if (e.includes("sqlite") || e === "libsql" || e === "turso") return { icon: "simple-icons:sqlite", color: "#003B57", label: "SQLite" };
  if (e.includes("postgres") || e === "neon") return { icon: "simple-icons:postgresql", color: "#4169E1", label: "PostgreSQL" };
  if (e.includes("mariadb")) return { icon: "simple-icons:mariadb", color: "#003545", label: "MariaDB" };
  if (e.includes("mysql")) return { icon: "simple-icons:mysql", color: "#4479A1", label: "MySQL" };
  if (e.includes("mongo")) return { icon: "simple-icons:mongodb", color: "#47A248", label: "MongoDB" };
  return null;
}

/** Human name for a database engine id ("postgresql" → "PostgreSQL"). */
export function databaseEngineLabel(engine: string | null | undefined): string {
  return brandFor(engine)?.label ?? (engine || "Database");
}

/** Brand icon for a database engine; a generic database icon when unknown. */
export function DatabaseEngineIcon({ engine, size = 16 }: { engine: string | null | undefined; size?: number }) {
  const b = brandFor(engine);
  if (!b) {
    return <Database size={size} strokeWidth={1.75} className="console-icon-muted" aria-label="Database" />;
  }
  return <Icon icon={b.icon} width={size} height={size} color={b.color} aria-label={b.label} />;
}
