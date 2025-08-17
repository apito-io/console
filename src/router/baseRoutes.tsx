import type { RouteObject } from "react-router-dom";
import { Navigate, Route } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ConsoleLayout from "../layouts/ConsoleLayout";
import ContentPage from "../pages/content";
import ModelPage from "../pages/model";
import ApiPage from "../pages/api";
import SettingsPage from "../pages/settings";
import GeneralSettingsPage from "../pages/settings/general/GeneralSettingsPage";
import TeamsSettingsPage from "../pages/settings/teams/TeamsSettingsPage";
import ApiSecretsSettingsPage from "../pages/settings/api-secrets/ApiSecretsSettingsPage";
import WebhooksSettingsPage from "../pages/settings/webhooks/WebhooksSettingsPage";
import RolesSettingsPage from "../pages/settings/roles/RolesSettingsPage";
import PluginsSettingsPage from "../pages/settings/plugins/PluginsSettingsPage";
import PluginSettingsRenderer from "../components/plugins/PluginSettingsRenderer";
import { LoginPage } from "../pages/auth";

import { ProjectsPage, StartProjectPage } from "../pages/projects";
import AccountsPage from "../pages/accounts";
import SupportPage from "../pages/support";
import SyncPage from "../pages/sync";
import SystemApiPage from "../pages/system-api";
import LogicPage from "../pages/logic";
import MediaPage from "../pages/media";
import { ProjectPluginsPage } from "../pages/plugins";
import { SystemPluginsPage } from "../pages/system-plugins";
import { PluginRouter } from "../plugins/PluginRouter";

// Auth routes (shared between open-core and pro)
export const authRoutes: RouteObject[] = [
  {
    path: "/auth/login",
    element: <LoginPage />,
  },

  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
  },
];

// Main application routes (core functionality)
export const getMainRoutes = (
  LayoutComponent: React.ComponentType = CommonLayout,
  additionalRoutes: RouteObject[] = []
): RouteObject[] => [
  {
    path: "/",
    element: <LayoutComponent />,
    children: [
      {
        index: true,
        element: <Navigate to="/projects" replace />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/new",
        element: <StartProjectPage />,
      },
      {
        path: "accounts",
        element: <AccountsPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "sync",
        element: <SyncPage />,
      },
      {
        path: "system-api",
        element: <SystemApiPage />,
      },
      {
        path: "system/plugins",
        element: <SystemPluginsPage />,
      },
      // Console routes (no projectId in URL)
      {
        path: "console",
        element: <ConsoleLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="model" replace />,
          },
          {
            path: "model",
            element: <ModelPage />,
          },
          {
            path: "model/:model",
            element: <ModelPage />,
          },
          {
            path: "content",
            element: <ContentPage />,
          },
          {
            path: "content/:model",
            element: <ContentPage />,
          },
          {
            path: "api",
            element: <ApiPage />,
          },
          {
            path: "logic",
            element: <LogicPage />,
          },
          {
            path: "media",
            element: <MediaPage />,
          },
          {
            path: "plugins",
            element: <ProjectPluginsPage />,
          },
          {
            path: "plugin/:pluginName/*",
            element: <PluginRouter />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
            children: [
              {
                index: true,
                element: <Navigate to="general" replace />,
              },
              {
                path: "general",
                element: <GeneralSettingsPage />,
              },
              {
                path: "teams",
                element: <TeamsSettingsPage />,
              },
              {
                path: "api-secrets",
                element: <ApiSecretsSettingsPage />,
              },
              {
                path: "webhooks",
                element: <WebhooksSettingsPage />,
              },
              {
                path: "roles",
                element: <RolesSettingsPage />,
              },
              {
                path: "plugins",
                element: <PluginsSettingsPage />,
              },
              {
                path: "plugins/:pluginName",
                element: <PluginSettingsRenderer />,
              },
            ],
          },
        ],
      },
      // Additional routes (for pro features)
      ...additionalRoutes,
    ],
  },
];

// JSX Route elements for use with Routes/Route components
export const renderAuthRoutes = () => (
  <>
    <Route path="/auth/login" element={<LoginPage />} />

    <Route path="/login" element={<Navigate to="/auth/login" replace />} />
  </>
);

export const renderMainRoutes = (
  LayoutComponent: React.ComponentType = CommonLayout,
  additionalRoutes: React.ReactNode = null
) => (
  <Route path="/*" element={<LayoutComponent />}>
    <Route index element={<Navigate to="/projects" replace />} />
    <Route path="projects" element={<ProjectsPage />} />
    <Route path="projects/new" element={<StartProjectPage />} />
    <Route path="accounts" element={<AccountsPage />} />
    <Route path="support" element={<SupportPage />} />
    <Route path="sync" element={<SyncPage />} />
    <Route path="system-api" element={<SystemApiPage />} />
    <Route path="system/plugins" element={<SystemPluginsPage />} />

    {/* Console routes */}
    <Route path="console" element={<ConsoleLayout />}>
      <Route index element={<Navigate to="model" replace />} />
      <Route path="model" element={<ModelPage />} />
      <Route path="model/:model" element={<ModelPage />} />
      <Route path="content" element={<ContentPage />} />
      <Route path="content/:model" element={<ContentPage />} />
      <Route path="api" element={<ApiPage />} />
      <Route path="logic" element={<LogicPage />} />
      <Route path="media" element={<MediaPage />} />
      <Route path="plugins" element={<ProjectPluginsPage />} />
      <Route path="plugin/:pluginName/*" element={<PluginRouter />} />
      <Route path="settings" element={<SettingsPage />}>
        <Route index element={<Navigate to="general" replace />} />
        <Route path="general" element={<GeneralSettingsPage />} />
        <Route path="teams" element={<TeamsSettingsPage />} />
        <Route path="api-secrets" element={<ApiSecretsSettingsPage />} />
        <Route path="webhooks" element={<WebhooksSettingsPage />} />
        <Route path="roles" element={<RolesSettingsPage />} />
        <Route path="plugins" element={<PluginsSettingsPage />} />
        <Route
          path="plugins/:pluginName"
          element={<PluginSettingsRenderer />}
        />
      </Route>
    </Route>

    {/* Additional routes for pro features */}
    {additionalRoutes}
  </Route>
);
