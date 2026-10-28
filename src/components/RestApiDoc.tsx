import React, { useState, useEffect, useMemo } from "react";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useAuth } from "../contexts/AuthContext";
import { REST_DOC_URL } from "../constants/api";
import { contentApiRequestInit } from "../pages/api/contentApiRequest";

interface RestApiDocProps {
  className?: string;
  style?: React.CSSProperties;
}

const RestApiDoc: React.FC<RestApiDocProps> = ({ className, style }) => {
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();

  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract project_id to a stable value
  const projectId = tokenData?.project_id;

  // Build the REST API URL with project ID (memoized to prevent unnecessary recalculations)
  const restApiUrl = useMemo(() => {
    return projectId ? `${REST_DOC_URL}/${projectId}` : REST_DOC_URL;
  }, [projectId]);

  useEffect(() => {
    const fetchOpenApiSpec = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(restApiUrl, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Use-Cookies": "true",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch OpenAPI spec: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const spec = await response.json();
        setOpenApiSpec(spec);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching OpenAPI spec:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    fetchOpenApiSpec();
  }, [restApiUrl, projectId]);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#666",
          ...style,
        }}
      >
        Loading API documentation...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={className}
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#ff4d4f",
          ...style,
        }}
      >
        <p>Error loading API documentation: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  if (!openApiSpec) {
    return (
      <div
        className={className}
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#666",
          ...style,
        }}
      >
        <p>No API documentation available.</p>
        <p style={{ fontSize: "14px", color: "#999", marginTop: "8px" }}>
          Select a project, then refresh.
        </p>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div
        className={className}
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#666",
          ...style,
        }}
      >
        <p>Please select a project to view the REST API documentation.</p>
        <p>
          Go to <strong>Settings API Secrets</strong> and Generate an API key to
          be used in Authorize
        </p>
      </div>
    );
  }

  return (
    <div className={`api-rest-frame ${className ?? ""}`} style={style}>
      <p className="api-rest-auth-hint">
        Authorize with a project API key from Settings → API Secrets. Paste it
        as <code>Bearer ak_…</code>. Leave this empty until you do. The console
        session is not an API key.
      </p>
      <div className="api-rest-scalar">
        <ApiReferenceReact
          configuration={{
            content: openApiSpec,
            theme: "default",
            layout: "modern",
            showSidebar: true,
            fetch: (input: RequestInfo | URL, init?: RequestInit) =>
              fetch(input, contentApiRequestInit(new Headers(init?.headers), init)),
            authentication: {
              preferredSecurityScheme: "bearerAuth",
              securitySchemes: {
                bearerAuth: {
                  token: "",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RestApiDoc;
