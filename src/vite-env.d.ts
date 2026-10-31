/// <reference types="vite/client" />

interface Window {
  posthog?: {
    identify: (id: string, props?: Record<string, unknown>) => void;
    capture: (event: string, props?: Record<string, unknown>) => void;
    group: (type: string, key: string, props?: Record<string, unknown>) => void;
    reset: () => void;
    register: (props: Record<string, unknown>) => void;
    displaySurvey?: (id: string) => void;
  };
  env?: Record<string, string>;
}
