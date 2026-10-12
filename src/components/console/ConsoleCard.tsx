import React from "react";
import { Card, type CardProps } from "antd";

export type ConsoleCardProps = CardProps;

const ConsoleCard: React.FC<ConsoleCardProps> = ({ className, ...props }) => {
  return (
    <Card
      {...props}
      className={["console-surface-card", className].filter(Boolean).join(" ")}
    />
  );
};

export default ConsoleCard;
