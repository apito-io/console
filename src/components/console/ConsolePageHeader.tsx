import React from "react";
import "./ConsoleShell.css";

export interface ConsolePageHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  titleStyle?: React.CSSProperties;
}

const ConsolePageHeader: React.FC<ConsolePageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  titleStyle,
}) => {
  const hasTitleBlock = Boolean(title || description);

  return (
    <div
      className={
        hasTitleBlock
          ? "console-page-header"
          : "console-page-header console-page-header--actions-only"
      }
    >
      {hasTitleBlock ? (
        <div>
          {title ? (
            <h2 className="console-page-header-title" style={titleStyle}>
              {title}
              {badge ? (
                <span className="console-page-header-badge">{badge}</span>
              ) : null}
            </h2>
          ) : null}
          {description ? (
            <p className="console-page-header-description">{description}</p>
          ) : null}
        </div>
      ) : null}
      {actions ? (
        <div className="console-page-header-actions">{actions}</div>
      ) : null}
    </div>
  );
};

export default ConsolePageHeader;
