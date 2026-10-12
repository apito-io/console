import React from "react";
import type { LucideIcon } from "lucide-react";

export interface ConsoleCardTitleProps {
  icon: LucideIcon;
  label: React.ReactNode;
}

const ConsoleCardTitle: React.FC<ConsoleCardTitleProps> = ({ icon: Icon, label }) => {
  return (
    <div className="console-card-title">
      <Icon size={16} strokeWidth={1.75} />
      <span>{label}</span>
    </div>
  );
};

export default ConsoleCardTitle;
