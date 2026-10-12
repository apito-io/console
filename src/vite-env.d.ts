/// <reference types="vite/client" />

interface Window {
  posthog?: {
    identify: (id: string, props?: Record<string, unknown>) => void;
    capture: (event: string, props?: Record<string, unknown>) => void;
    group: (type: string, key: string, props?: Record<string, unknown>) => void;
    reset: () => void;
    register: (props: Record<string, unknown>) => void;
  };
  env?: Record<string, string>;
  $chatwoot?: {
    toggle: (state?: "open" | "close") => void;
  };
}
