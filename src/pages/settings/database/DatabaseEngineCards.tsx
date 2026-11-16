import React from "react";
import { Tooltip } from "antd";
import type { DatabaseConnection, DatabaseEngine } from "./api";
import { DATABASE_SETUP_HINT } from "./api";
import "./database-engine-cards.css";

const ORDER: DatabaseEngine[] = ["sqlite", "postgresql", "mysql", "mongodb"];

const FALLBACK: DatabaseConnection[] = [
  { engine: "sqlite", label: "SQLite", connected: true, source: "embedded" },
  { engine: "postgresql", label: "PostgreSQL", connected: false, source: "" },
  { engine: "mysql", label: "MySQL", connected: false, source: "" },
  { engine: "mongodb", label: "MongoDB", connected: false, source: "" },
];

export function orderedConnections(
  connections: DatabaseConnection[] | undefined,
): DatabaseConnection[] {
  const byEngine = new Map((connections ?? []).map((row) => [row.engine, row]));
  return ORDER.map(
    (engine) =>
      byEngine.get(engine) ??
      FALLBACK.find((row) => row.engine === engine) ??
      FALLBACK[0],
  );
}

type DatabaseEngineCardsProps = {
  connections: DatabaseConnection[];
  selected: DatabaseEngine;
  mode: "create" | "settings";
  onSelect: (engine: DatabaseEngine) => void;
};

const DatabaseEngineCards: React.FC<DatabaseEngineCardsProps> = ({
  connections,
  selected,
  mode,
  onSelect,
}) => {
  const rows =
    mode === "create"
      ? orderedConnections(connections).filter((row) => row.connected || row.engine === "sqlite")
      : orderedConnections(connections);

  return (
    <div className="database-engine-cards" role="listbox" aria-label="Database">
      {rows.map((row) => {
        const disabled = mode === "settings" && !row.connected;
        const active = row.engine === selected;
        const card = (
          <button
            key={row.engine}
            type="button"
            role="option"
            aria-selected={active}
            aria-disabled={disabled}
            disabled={disabled}
            className={`database-engine-card${active ? " database-engine-card--active" : ""}`}
            onClick={() => {
              if (!disabled) onSelect(row.engine);
            }}
          >
            <span className="database-engine-card__label">{row.label}</span>
            <span className="database-engine-card__meta">
              {row.connected ? "Connected" : "Not connected"}
            </span>
          </button>
        );
        if (!disabled) return card;
        return (
          <Tooltip key={row.engine} title={DATABASE_SETUP_HINT}>
            <span className="database-engine-card-wrap">{card}</span>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default DatabaseEngineCards;
