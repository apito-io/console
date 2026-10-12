import React from "react";

export interface ConsoleFormActionsProps {
  children: React.ReactNode;
}

const ConsoleFormActions: React.FC<ConsoleFormActionsProps> = ({ children }) => {
  return <div className="console-form-actions">{children}</div>;
};

export default ConsoleFormActions;
