import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useAuth } from "../contexts/AuthContext";
import { REST_DOC_URL } from "../constants/api";
const RestApiDoc = ({ className, style }) => {
    const { readJWTToken, decodeTokenData } = useAuth();
    const token = readJWTToken();
    const tokenData = decodeTokenData();
    const [openApiSpec, setOpenApiSpec] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                    throw new Error(`Failed to fetch OpenAPI spec: ${response.status} ${response.statusText} - ${errorText}`);
                }
                const spec = await response.json();
                console.log("OpenAPI spec loaded:", spec);
                setOpenApiSpec(spec);
                setLoading(false);
            }
            catch (err) {
                console.error("Error fetching OpenAPI spec:", err);
                setError(err instanceof Error ? err.message : "Unknown error occurred");
                setLoading(false);
            }
        };
        fetchOpenApiSpec();
        // Cleanup function to remove the injected styles
        return () => {
            const existingStyle = document.querySelector("style[data-scalar-override]");
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, [restApiUrl, token, projectId]);
    if (loading) {
        return (_jsx("div", { className: className, style: {
                padding: "24px",
                textAlign: "center",
                color: "#666",
                ...style,
            }, children: "Loading API documentation..." }));
    }
    if (error) {
        return (_jsxs("div", { className: className, style: {
                padding: "24px",
                textAlign: "center",
                color: "#ff4d4f",
                ...style,
            }, children: [_jsxs("p", { children: ["Error loading API documentation: ", error] }), _jsx("p", { children: "Please try refreshing the page." })] }));
    }
    if (!openApiSpec) {
        return (_jsxs("div", { className: className, style: {
                padding: "24px",
                textAlign: "center",
                color: "#666",
                ...style,
            }, children: [_jsx("p", { children: "No API documentation available." }), _jsxs("p", { style: { fontSize: "14px", color: "#999", marginTop: "8px" }, children: ["Debug info: project_id=", projectId || "missing"] })] }));
    }
    if (!projectId) {
        return (_jsxs("div", { className: className, style: {
                padding: "24px",
                textAlign: "center",
                color: "#666",
                ...style,
            }, children: [_jsx("p", { children: "Please select a project to view the REST API documentation." }), _jsxs("p", { children: ["Go to ", _jsx("strong", { children: "Settings API Secrets" }), " and Generate an API key to be used in Authorize"] })] }));
    }
    return (_jsx("div", { className: className, style: {
            ...style,
            // Ensure proper height and layout for Ant Design tabs
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 0,
            margin: 0,
            position: "relative",
        }, children: _jsx("div", { style: {
                // Make Scalar fill the entire available space and handle its own scrolling
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
            }, children: _jsx(ApiReferenceReact, { configuration: {
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
                } }) }) }));
};
export default RestApiDoc;
