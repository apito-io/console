import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Navigate, Outlet } from "./navigation";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { ContentProvider } from "../contexts/ContentContext";
import { ModelDndProvider } from "../contexts/ModelDndContext";
import { NavigationExtensionProvider } from "../contexts/NavigationExtensionContext";
import { ShellUserSync } from "../components/ShellUserSync";
import { PluginManagerProvider } from "../plugins/PluginManager";
import { PluginNavigationBridge } from "../plugins/PluginNavigationBridge";
import { LoginPage, SignupPage, VerifyPage } from "../pages/auth";
import { ProjectsPage, StartProjectPage } from "../pages/projects";
import AccountsPage from "../pages/accounts";
import SyncPage from "../pages/sync";
import McpPage from "../pages/mcp";
import SystemApiPage from "../pages/system-api";
import { SystemPluginsPage } from "../pages/system-plugins";
import { SchemaDraftExtensions } from "../components/console/SchemaDraftExtensions";
import PluginSettingsRenderer from "../components/plugins/PluginSettingsRenderer";
import ProjectSpaceRouteLayout from "../layouts/ProjectSpaceRouteLayout";
import ConsoleLayout from "../layouts/ConsoleLayout";
import ContentPage from "../pages/content";
import ModelPage from "../pages/model";
import { GraphqlApiPage, RestApiPage } from "../pages/api";
import SettingsPage from "../pages/settings";
import GeneralSettingsPage from "../pages/settings/general/GeneralSettingsPage";
import ApiSecretsSettingsPage from "../pages/settings/api-secrets/ApiSecretsSettingsPage";
import WebhooksSettingsPage from "../pages/settings/webhooks/WebhooksSettingsPage";
import RolesSettingsPage from "../pages/settings/roles/RolesSettingsPage";
import SchemaDraftPage from "../pages/settings/schema/SchemaDraftPage";
import ProjectSqlPage from "../pages/settings/database/ProjectSqlPage";
import AuthenticationSettingsPage from "../pages/settings/authentication/AuthenticationSettingsPage";
import UsersPage from "../pages/users/UsersPage";
import StorageSettingsPage from "../pages/settings/storage/StorageSettingsPage";
import LogicPage from "../pages/logic";
import StoragePage from "../pages/storage";
import { ProjectPluginsPage } from "../pages/plugins";
import { PluginRouter } from "../plugins/PluginRouter";

const RootShell = () => (
  <AuthProvider>
    <SchemaDraftExtensions>
      <NavigationExtensionProvider>
        <ContentProvider>
          <ModelDndProvider>
            <PluginManagerProvider>
              <ShellUserSync />
              <PluginNavigationBridge />
              <Outlet />
            </PluginManagerProvider>
          </ModelDndProvider>
        </ContentProvider>
      </NavigationExtensionProvider>
    </SchemaDraftExtensions>
  </AuthProvider>
);

const rootRoute = createRootRoute({ component: RootShell });

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedRoute,
});

const projectSpaceRoute = createRoute({
  getParentRoute: () => protectedRoute,
  id: "project-space",
  component: ProjectSpaceRouteLayout,
});

const consoleRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/console",
  component: ConsoleLayout,
});

const settingsRoute = createRoute({
  getParentRoute: () => consoleRoute,
  path: "settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: () => <Navigate to="/auth/login" replace />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/signup",
    component: () => <Navigate to="/auth/signup" replace />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth/login",
    component: LoginPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth/signup",
    component: SignupPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/verify",
    component: VerifyPage,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth/verify",
    component: () => <Navigate to="/verify" replace />,
  }),
  protectedRoute.addChildren([
    createRoute({
      getParentRoute: () => protectedRoute,
      path: "/",
      component: () => <Navigate to="/projects" replace />,
    }),
    projectSpaceRoute.addChildren([
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/projects",
      component: ProjectsPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/projects/new",
      component: StartProjectPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/accounts",
      component: AccountsPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/access-token",
      component: SyncPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/mcp",
      component: McpPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/sync",
      component: () => <Navigate to="/access-token" replace />,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/system-api",
      component: SystemApiPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/system/plugins",
      component: SystemPluginsPage,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/plugins",
      component: () => <Navigate to="/console/settings/plugins" replace />,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/plugin/$pluginName",
      component: PluginRouter,
    }),
    createRoute({
      getParentRoute: () => projectSpaceRoute,
      path: "/plugin/$pluginName/$",
      component: PluginRouter,
    }),
  ]),
  consoleRoute.addChildren([
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "/",
      component: () => <Navigate to="/console/model" replace />,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "model",
      component: ModelPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "model/$model",
      component: ModelPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "content",
      component: ContentPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "content/$model",
      component: ContentPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "users",
      component: UsersPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "storage",
      component: StoragePage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "graphql",
      component: GraphqlApiPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "rest",
      component: RestApiPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "api",
      component: () => <Navigate to="/console/graphql" replace />,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "logic",
      component: LogicPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "media",
      component: () => <Navigate to="/console/storage" replace />,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "plugins",
      component: ProjectPluginsPage,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "plugin/$pluginName",
      component: PluginRouter,
    }),
    createRoute({
      getParentRoute: () => consoleRoute,
      path: "plugin/$pluginName/$",
      component: PluginRouter,
    }),
    settingsRoute.addChildren([
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "/",
        component: () => <Navigate to="/console/settings/general" replace />,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "plugins",
        component: ProjectPluginsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "plugins/$pluginName",
        component: PluginSettingsRenderer,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "general",
        component: GeneralSettingsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "teams",
        component: () => <Navigate to="/projects" replace />,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "authentication",
        component: AuthenticationSettingsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "storage",
        component: StorageSettingsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "api-secrets",
        component: ApiSecretsSettingsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "webhooks",
        component: WebhooksSettingsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "roles",
        component: RolesSettingsPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "schema-changes",
        component: SchemaDraftPage,
      }),
      createRoute({
        getParentRoute: () => settingsRoute,
        path: "db-explorer",
        component: ProjectSqlPage,
      }),
    ]),
  ]),
  ]),
]);

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
});

const CoreRouter = () => <RouterProvider router={router} />;

export default CoreRouter;
