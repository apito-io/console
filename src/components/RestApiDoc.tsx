import React, { useState, useEffect, useMemo } from "react";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useAuth } from "../contexts/AuthContext";
import { REST_DOC_URL } from "../constants/api";

interface RestApiDocProps {
  className?: string;
  style?: React.CSSProperties;
}

const RestApiDoc: React.FC<RestApiDocProps> = ({ className, style }) => {
  const { readJWTToken, decodeTokenData } = useAuth();
  const token = readJWTToken();
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
    // Inject custom CSS to override Scalar's styling and ensure proper scrolling
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-scalar-override", "true");
    styleElement.textContent = `
      .scalar-api-reference {
        padding: 0 !important;
        margin: 0 !important;
        height: 100% !important;
        overflow: auto !important;
      }
      .scalar-api-reference > div {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
      }
      /* Remove any bottom padding from Scalar's internal containers */
      .scalar-api-reference .scalar-app,
      .scalar-api-reference .scalar-container,
      .scalar-api-reference > * {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
      }
      /* Ensure Scalar's content can scroll */
      .scalar-api-reference .scalar-app {
        height: 100% !important;
        overflow: auto !important;
      }
    `;
    document.head.appendChild(styleElement);

    const fetchOpenApiSpec = async () => {
      console.log("Debug - projectId:", projectId);
      console.log("Debug - token:", token ? "exists" : "missing");
      console.log("Debug - restApiUrl:", restApiUrl);

      if (!projectId) {
        console.log("No project_id found, skipping API fetch");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching OpenAPI spec from:", restApiUrl);

        const response = await fetch(restApiUrl, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Use-Cookies": "true",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Error response body:", errorText);
          throw new Error(
            `Failed to fetch OpenAPI spec: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const spec = await response.json();
        console.log("OpenAPI spec loaded:", spec);
        setOpenApiSpec(spec);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching OpenAPI spec:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    fetchOpenApiSpec();

    // Cleanup function to remove the injected styles
    return () => {
      const existingStyle = document.querySelector(
        "style[data-scalar-override]"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [restApiUrl, token, projectId]);

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
          Debug info: project_id={projectId || "missing"}
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
    <div
      className={className}
      style={{
        ...style,
        // Ensure proper height and layout for Ant Design tabs
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        margin: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          // Make Scalar fill the entire available space and handle its own scrolling
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ApiReferenceReact
          configuration={{
            content: openApiSpec,
            theme: "default",
            layout: "modern",
            showSidebar: true,
            authentication: {
              preferredSecurityScheme: "bearerAuth",
              securitySchemes: {
                bearerAuth: {
                  token: token || "",
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
