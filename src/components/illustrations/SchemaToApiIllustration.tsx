import React, { useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import {
  Background,
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  ReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Cloud,
  CloudCog,
  Code,
  Database,
  GitBranch,
  Handshake,
  LayoutGrid,
  Lock,
  Server,
  Terminal,
  Users,
  Webhook,
  Wrench,
} from "lucide-react";

const { Text } = Typography;

type IllustrationNodeData = {
  icon: LucideIcon;
  label: string;
  description?: string;
  color: string;
  size?: "normal" | "large";
};

const hiddenHandleStyle = { opacity: 0 };

const CustomNode = ({ data }: NodeProps<IllustrationNodeData>) => {
  const { icon: Icon, label, description, color, size = "normal" } = data;
  const isLarge = size === "large";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eaecef",
        borderRadius: isLarge ? "16px" : "12px",
        padding: isLarge ? "16px 20px" : "8px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: isLarge ? "12px" : "8px",
        width: isLarge ? "220px" : "210px",
        boxSizing: "border-box",
      }}
    >
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        style={hiddenHandleStyle}
      />
      <Handle
        id="source-left"
        type="source"
        position={Position.Left}
        style={hiddenHandleStyle}
      />
      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        style={hiddenHandleStyle}
      />
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        style={hiddenHandleStyle}
      />
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        style={hiddenHandleStyle}
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        style={hiddenHandleStyle}
      />
      <Icon
        size={isLarge ? 20 : 16}
        strokeWidth={1.75}
        color={color}
        aria-hidden="true"
      />
      <div style={{ minWidth: 0 }}>
        <Text
          style={{
            color: "#111827",
            fontSize: isLarge ? "14px" : "12px",
            fontWeight: isLarge ? 600 : 500,
            display: "block",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            style={{
              color: "#6b7280",
              fontSize: "11px",
              display: "block",
              lineHeight: 1.2,
            }}
          >
            {description}
          </Text>
        ) : null}
      </div>
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const initialNodes: Node<IllustrationNodeData>[] = [
  {
    id: "schema",
    type: "custom",
    position: { x: 150, y: 0 },
    data: {
      icon: Database,
      label: "Schema",
      description: "Models, relations, versioned",
      color: "#52c41a",
      size: "large",
    },
  },
  {
    id: "versioning",
    type: "custom",
    position: { x: 10, y: 90 },
    data: {
      icon: GitBranch,
      label: "Versioning",
      description: "Publish & sync",
      color: "#722ed1",
    },
  },
  {
    id: "engine",
    type: "custom",
    position: { x: 150, y: 170 },
    data: {
      icon: Server,
      label: "Engine",
      description: "Runs your schema",
      color: "#2f54eb",
      size: "large",
    },
  },
  {
    id: "sqlite",
    type: "custom",
    position: { x: 10, y: 260 },
    data: {
      icon: Database,
      label: "SQLite",
      description: "Default",
      color: "#13c2c2",
    },
  },
  {
    id: "postgres",
    type: "custom",
    position: { x: 300, y: 260 },
    data: {
      icon: Database,
      label: "Postgres",
      color: "#1677ff",
    },
  },
  {
    id: "apis",
    type: "custom",
    position: { x: 150, y: 360 },
    data: {
      icon: Webhook,
      label: "Generated APIs",
      description: "GraphQL + REST, filters, pagination",
      color: "#1677ff",
      size: "large",
    },
  },
  {
    id: "auth",
    type: "custom",
    position: { x: 10, y: 470 },
    data: {
      icon: Lock,
      label: "Auth & roles",
      description: "RBAC",
      color: "#f5222d",
    },
  },
  {
    id: "plugins",
    type: "custom",
    position: { x: 300, y: 470 },
    data: {
      icon: Wrench,
      label: "Plugins",
      color: "#1677ff",
    },
  },
  {
    id: "storage",
    type: "custom",
    position: { x: 10, y: 540 },
    data: {
      icon: LayoutGrid,
      label: "Storage",
      description: "Media files",
      color: "#52c41a",
    },
  },
  {
    id: "tenants",
    type: "custom",
    position: { x: 300, y: 540 },
    data: {
      icon: Users,
      label: "SaaS tenants",
      description: "One database per tenant",
      color: "#fa8c16",
    },
  },
  {
    id: "functions",
    type: "custom",
    position: { x: 10, y: 610 },
    data: {
      icon: CloudCog,
      label: "Cloud functions",
      color: "#722ed1",
    },
  },
  {
    id: "app",
    type: "custom",
    position: { x: 10, y: 700 },
    data: {
      icon: Code,
      label: "Your app",
      description: "JS, Go, Flutter SDKs",
      color: "#fa8c16",
    },
  },
  {
    id: "mcp",
    type: "custom",
    position: { x: 300, y: 700 },
    data: {
      icon: Bot,
      label: "AI agents",
      description: "MCP server",
      color: "#722ed1",
    },
  },
  {
    id: "local",
    type: "custom",
    position: { x: 10, y: 820 },
    data: {
      icon: Terminal,
      label: "Local Studio",
      description: "apito start",
      color: "#13c2c2",
    },
  },
  {
    id: "cloud",
    type: "custom",
    position: { x: 300, y: 820 },
    data: {
      icon: Cloud,
      label: "Apito Cloud",
      description: "Backups, point-in-time restore",
      color: "#1677ff",
    },
  },
  {
    id: "handover",
    type: "custom",
    position: { x: 150, y: 940 },
    data: {
      icon: Handshake,
      label: "Hand over to your client",
      description: "Freelance Project, Cloud",
      color: "#52c41a",
    },
  },
];

const solidEdgeStyle = { stroke: "#d1d5db", strokeWidth: 2 };
const dashedEdgeStyle = {
  stroke: "#d1d5db",
  strokeWidth: 2,
  strokeDasharray: "5,5",
};

const initialEdges: Edge[] = [
  {
    id: "schema-to-engine",
    source: "schema",
    sourceHandle: "source-bottom",
    target: "engine",
    targetHandle: "target-top",
    type: "smoothstep",
    style: solidEdgeStyle,
  },
  {
    id: "schema-to-versioning",
    source: "schema",
    sourceHandle: "source-left",
    target: "versioning",
    targetHandle: "target-right",
    type: "smoothstep",
    style: dashedEdgeStyle,
  },
  {
    id: "engine-to-sqlite",
    source: "engine",
    sourceHandle: "source-left",
    target: "sqlite",
    targetHandle: "target-right",
    type: "smoothstep",
    style: dashedEdgeStyle,
  },
  {
    id: "engine-to-postgres",
    source: "engine",
    sourceHandle: "source-right",
    target: "postgres",
    targetHandle: "target-left",
    type: "smoothstep",
    style: dashedEdgeStyle,
  },
  {
    id: "engine-to-apis",
    source: "engine",
    sourceHandle: "source-bottom",
    target: "apis",
    targetHandle: "target-top",
    type: "smoothstep",
    style: solidEdgeStyle,
  },
  ...(["auth", "storage", "functions"] as const).map((target) => ({
    id: `apis-to-${target}`,
    source: "apis",
    sourceHandle: "source-left",
    target,
    targetHandle: "target-right",
    type: "smoothstep" as const,
    style: dashedEdgeStyle,
  })),
  ...(["plugins", "tenants"] as const).map((target) => ({
    id: `apis-to-${target}`,
    source: "apis",
    sourceHandle: "source-right",
    target,
    targetHandle: "target-left",
    type: "smoothstep" as const,
    style: dashedEdgeStyle,
  })),
  {
    id: "apis-to-app",
    source: "apis",
    sourceHandle: "source-bottom",
    target: "app",
    targetHandle: "target-top",
    type: "smoothstep",
    style: solidEdgeStyle,
  },
  {
    id: "apis-to-mcp",
    source: "apis",
    sourceHandle: "source-bottom",
    target: "mcp",
    targetHandle: "target-top",
    type: "smoothstep",
    style: solidEdgeStyle,
  },
  {
    id: "app-to-local",
    source: "app",
    sourceHandle: "source-bottom",
    target: "local",
    targetHandle: "target-top",
    type: "smoothstep",
    style: solidEdgeStyle,
  },
  {
    id: "mcp-to-cloud",
    source: "mcp",
    sourceHandle: "source-bottom",
    target: "cloud",
    targetHandle: "target-top",
    type: "smoothstep",
    style: solidEdgeStyle,
  },
  {
    id: "cloud-to-handover",
    source: "cloud",
    sourceHandle: "source-left",
    target: "handover",
    targetHandle: "target-right",
    type: "smoothstep",
    style: dashedEdgeStyle,
  },
];

const diagramNodes: Node<IllustrationNodeData>[] = initialNodes.map((node) => {
  const large = node.data.size === "large";
  return {
    ...node,
    width: large ? 220 : 210,
    height: large ? 78 : 58,
  };
});

const board = { width: 532, height: 1030 };
const lockedViewport = { x: 6, y: 16, zoom: 1 };

const SchemaToApiIllustration: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fit = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width < 8 || height < 8) return;
      setScale(Math.min(width / board.width, height / board.height));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: "0 0 auto", padding: "4px 4px 14px" }}>
        <Text
          style={{
            color: "#1f2937",
            fontSize: "16px",
            fontWeight: 600,
            display: "block",
            marginBottom: "4px",
          }}
        >
          Model your data once. Ship the backend.
        </Text>
        <Text
          style={{
            color: "#6b7280",
            fontSize: "13px",
            lineHeight: "1.4",
            display: "block",
          }}
        >
          GraphQL and REST, auth, multi-tenant SaaS, and an MCP server for your
          AI tools. Run it locally or on Apito Cloud.
        </Text>
      </div>
      <div
        ref={hostRef}
        style={{ flex: 1, minHeight: 0, width: "100%", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: board.width,
            height: board.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <ReactFlow
            nodes={diagramNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            minZoom={1}
            maxZoom={1}
            defaultViewport={lockedViewport}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnScroll={false}
            panOnDrag={false}
            preventScrolling
            proOptions={{ hideAttribution: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <Background gap={20} size={1} color="#ebedf0" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default SchemaToApiIllustration;
