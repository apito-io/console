import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from "react-dom/client";

// Set React globally for plugins and ensure compatibility
if (typeof window !== "undefined") {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
