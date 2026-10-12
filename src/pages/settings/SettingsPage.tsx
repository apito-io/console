import React from "react";
import { Outlet } from "../../router/navigation";
import ConsolePageHeader from "../../components/console/ConsolePageHeader";
import ConsolePageBody from "../../components/console/ConsolePageBody";
import {
  SettingsPageMetaProvider,
  useSettingsPageMetaContext,
} from "../../contexts/SettingsPageMetaContext";
import "../../components/console/ConsoleShell.css";

const SettingsPageChrome: React.FC = () => {
  const { meta } = useSettingsPageMetaContext();

  const showPageHeader = Boolean(
    meta.title || meta.description || meta.actions,
  );

  return (
    <div className="settings-page-shell">
      {showPageHeader ? (
        <ConsolePageHeader
          title={meta.title}
          description={meta.description}
          actions={meta.actions}
        />
      ) : null}
      <ConsolePageBody
        variant="settings"
        fullWidth={meta.fullWidth}
        fillViewport={meta.fillViewport}
      >
        <Outlet />
      </ConsolePageBody>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <SettingsPageMetaProvider>
      <SettingsPageChrome />
    </SettingsPageMetaProvider>
  );
};

export default SettingsPage;
