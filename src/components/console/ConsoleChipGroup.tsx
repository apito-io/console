import React from "react";

export interface ConsoleChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

const ConsoleChipGroup: React.FC<ConsoleChipGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div className={["console-chip-group", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
};

export default ConsoleChipGroup;
