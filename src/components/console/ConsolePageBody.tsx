import React from "react";

export type ConsolePageBodyVariant = "project-space" | "settings" | "console";

export interface ConsolePageBodyProps {
  variant: ConsolePageBodyVariant;
  fullWidth?: boolean;
  fillViewport?: boolean;
  children: React.ReactNode;
}

const variantClass: Record<ConsolePageBodyVariant, string> = {
  "project-space": "console-page-body--project-space console-content",
  settings: "console-page-body--settings settings-page-body",
  console: "console-page-body--console console-content",
};

const ConsolePageBody: React.FC<ConsolePageBodyProps> = ({
  variant,
  fullWidth,
  fillViewport,
  children,
}) => {
  return (
    <main
      className={[
        "console-page-body",
        variantClass[variant],
        fullWidth ? "console-page-body--full" : "",
        fillViewport ? "console-page-body--fill" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </main>
  );
};

export default ConsolePageBody;

