import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";

// Set React globally for plugins and ensure compatibility
if (typeof window !== "undefined") {
  // Always set React globally for plugins
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;

  // Keep reference to CDN React if it exists for logging
  const cdnReact = (window as any).PluginReact;
  if (cdnReact && cdnReact !== React) {
    console.log("[Plugin System] CDN React detected, using Vite React");
    console.log("[Plugin System] Vite React version:", React.version);
    console.log("[Plugin System] CDN React version:", cdnReact?.version);
  } else {
    console.log("[Plugin System] Setting React globally for plugins");
  }
}
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./services/apolloClient";
import "./index.css";
import App from "./App.tsx";

const customTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#000000",
    colorInfo: "#000000",
    colorSuccess: "#16a34a",
    colorWarning: "#f59e0b",
    colorError: "#dc2626",
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#fafafa",
    colorBorder: "#e5e7eb",
    colorBorderSecondary: "#f3f4f6",
    colorText: "#0f1419",
    colorTextSecondary: "#6b7280",
    colorTextTertiary: "#9ca3af",
    colorFill: "#f3f4f6",
    colorFillSecondary: "#f9fafb",
    colorFillTertiary: "#f3f4f6",
    colorFillQuaternary: "#f9fafb",
  },
  components: {
    Button: {
      borderRadius: 6,
      fontWeight: 500,
      primaryColor: "#ffffff",
      colorPrimaryHover: "#262626",
      colorPrimaryActive: "#1c1c1c",
    },
    Card: {
      borderRadius: 8,
      headerBg: "#ffffff",
      borderRadiusLG: 8,
      boxShadowTertiary: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    Table: {
      borderRadius: 8,
      headerBg: "#f9fafb",
      borderColor: "#f3f4f6",
    },
    Menu: {
      itemSelectedBg: "#000000",
      itemSelectedColor: "#ffffff",
      itemHoverBg: "#f9fafb",
      itemHoverColor: "#374151",
      itemActiveBg: "#000000",
      borderRadius: 6,
      itemColor: "#6b7280",
    },
    Select: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Progress: {
      defaultColor: "#000000",
    },
    Breadcrumb: {
      linkColor: "#6b7280",
      linkHoverColor: "#000000",
      separatorColor: "#d1d5db",
    },
    Layout: {
      siderBg: "#ffffff",
      headerBg: "#ffffff",
      bodyBg: "#fafafa",
    },
    Segmented: {
      itemSelectedBg: "#000000",
      itemSelectedColor: "#ffffff",
      itemHoverBg: "#f3f4f6",
      itemHoverColor: "#374151",
      itemColor: "#6b7280",
      trackBg: "#f3f4f6",
      borderRadius: 6,
      borderRadiusSM: 4,
      controlHeight: 36,
      fontSize: 14,
      fontSizeSM: 13,
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ConfigProvider theme={customTheme}>
        <App />
      </ConfigProvider>
    </ApolloProvider>
  </StrictMode>
);
