import { jsx as _jsx } from "react/jsx-runtime";
import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
// Set React globally for plugins and ensure compatibility
if (typeof window !== "undefined") {
    window.React = React;
    window.ReactDOM = ReactDOM;
    const cdnReact = window.PluginReact;
    if (cdnReact && cdnReact !== React) {
        console.log("[Plugin System] CDN React detected, using Vite React");
        console.log("[Plugin System] Vite React version:", React.version);
        console.log("[Plugin System] CDN React version:", cdnReact?.version);
    }
    else {
        console.log("[Plugin System] Setting React globally for plugins");
    }
}
import "./index.css";
import App from "./App.tsx";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
