import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, message } from "antd";
import { CookiesProvider } from "react-cookie";
import { queryClient } from "./lib/queryClient";
import CoreRouter from "./router/CoreRouter";
import { apitoTheme } from "./theme";
import { applyLayoutVars } from "./theme/applyLayoutVars";
import "./App.css";

// Configure global message settings
message.config({
  top: 60,
  duration: 4,
  maxCount: 3,
  rtl: false,
});

applyLayoutVars();

function App() {
  return (
    <CookiesProvider>
      <ConfigProvider theme={{ ...apitoTheme, cssVar: { key: "apito" } }}>
        <QueryClientProvider client={queryClient}>
          <CoreRouter />
        </QueryClientProvider>
      </ConfigProvider>
    </CookiesProvider>
  );
}

export default App;
