import { BrowserRouter, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";
import { CookiesProvider } from "react-cookie";
import { apolloClient } from "./services/apolloClient";
import { AuthProvider } from "./contexts/AuthContext";
import { ContentProvider } from "./contexts/ContentContext";
import { ModelDndProvider } from "./contexts/ModelDndContext";
import { PluginManagerProvider } from "./plugins/PluginManager";
import { renderAuthRoutes, renderMainRoutes } from "./router/baseRoutes";
import CommonLayout from "./layouts/CommonLayout";
import "./App.css";

// Open-core theme configuration
const openCoreTheme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 2,
  },
};

function App() {
  return (
    <CookiesProvider>
      <ConfigProvider theme={openCoreTheme}>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <AuthProvider>
              <ContentProvider>
                <ModelDndProvider>
                  <PluginManagerProvider>
                    <Routes>
                      {/* Auth routes */}
                      {renderAuthRoutes()}

                      {/* Main routes with open-core layout (no pro features) */}
                      {renderMainRoutes(CommonLayout, null)}
                    </Routes>
                  </PluginManagerProvider>
                </ModelDndProvider>
              </ContentProvider>
            </AuthProvider>
          </BrowserRouter>
        </ApolloProvider>
      </ConfigProvider>
    </CookiesProvider>
  );
}

export default App;
