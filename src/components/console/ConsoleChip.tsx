import React from "react";

export interface ConsoleChipProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "span";
}

const ConsoleChip: React.FC<ConsoleChipProps> = ({
  active,
  children,
  onClick,
  type = "button",
}) => {
  const className = ["console-chip", active ? "console-chip--active" : ""]
    .filter(Boolean)
    .join(" ");

  if (type === "span") {
    return <span className={className}>{children}</span>;
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default ConsoleChip;
