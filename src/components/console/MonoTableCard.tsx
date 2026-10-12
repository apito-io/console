import React from "react";
import { Table, type TableProps } from "antd";
import ConsoleCard, { type ConsoleCardProps } from "./ConsoleCard";

export interface MonoTableCardProps<T extends object> extends Omit<
  ConsoleCardProps,
  "children"
> {
  tableProps: TableProps<T>;
}

function MonoTableCard<T extends object>({
  tableProps,
  className,
  ...cardProps
}: MonoTableCardProps<T>) {
  return (
    <ConsoleCard
      {...cardProps}
      className={["mono-table-card", className].filter(Boolean).join(" ")}
    >
      <Table {...tableProps} className={["mono-table", tableProps.className].filter(Boolean).join(" ")} />
    </ConsoleCard>
  );
}

export default MonoTableCard;
