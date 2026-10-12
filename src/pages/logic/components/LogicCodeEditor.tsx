import { lazy, Suspense, useEffect, useState } from "react";
import { Spin } from "antd";
import type { Extension } from "@codemirror/state";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: "typescript" | "json";
  height?: string;
  readOnly?: boolean;
  ariaLabel: string;
};

async function loadExtensions(
  language: "typescript" | "json",
): Promise<Extension[]> {
  if (language === "json") {
    const { json } = await import("@codemirror/lang-json");
    return [json()];
  }
  const { javascript } = await import("@codemirror/lang-javascript");
  return [javascript({ typescript: true })];
}

/**
 * Lazily loaded CodeMirror editor — keeps the Logic route bundle light.
 */
export function LogicCodeEditor({
  value,
  onChange,
  language,
  height = "360px",
  readOnly,
  ariaLabel,
}: Props) {
  const [extensions, setExtensions] = useState<Extension[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadExtensions(language).then((ext) => {
      if (!cancelled) setExtensions(ext);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  if (!extensions) {
    return (
      <div
        style={{
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin tip="Loading editor…" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin tip="Loading editor…" />
        </div>
      }
    >
      <CodeMirror
        value={value}
        height={height}
        extensions={extensions}
        onChange={onChange}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
          highlightActiveLine: true,
        }}
        style={{ fontSize: 13 }}
        aria-label={ariaLabel}
      />
    </Suspense>
  );
}
