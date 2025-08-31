import React from "react";
import { ReactFlow, Background, Node, Edge, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { Typography } from "antd";
import {
  DatabaseOutlined,
  ApiOutlined,
  BranchesOutlined,
  CodeOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
  LockOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  CloudSyncOutlined,
  DeploymentUnitOutlined,
  TeamOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// Custom node component
const CustomNode = ({ data }: { data: any }) => {
  const { icon: Icon, label, description, color, size = "normal" } = data;

  const nodeStyle = {
    background: "#fff",
    border: "1px solid #eaecef",
    borderRadius: size === "large" ? "16px" : "12px",
    padding: size === "large" ? "16px 20px" : "8px 12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: size === "large" ? "12px" : "8px",
    minWidth: size === "large" ? "200px" : "auto",
  };

  const iconStyle = {
    color: color,
    fontSize: size === "large" ? "20px" : "16px",
  };

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Icon style={iconStyle} />
      <div>
        <Text
          style={{
            color: "#111827",
            fontSize: size === "large" ? "14px" : "12px",
            fontWeight: size === "large" ? 600 : 500,
          }}
        >
          {label}
        </Text>
        {description && (
          <div>
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
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  // Core Schema node
  {
    id: "schema",
    type: "custom",
    position: { x: 300, y: 50 },
    data: {
      icon: DatabaseOutlined,
      label: "Schema",
      description: "Design types & relations",
      color: "#52c41a",
      size: "large",
    },
  },

  // Generated APIs
  {
    id: "generated-apis",
    type: "custom",
    position: { x: 285, y: 220 },
    data: {
      icon: ApiOutlined,
      label: "Generated APIs",
      description: "CRUD, auth, filters, pagination",
      color: "#1677ff",
      size: "large",
    },
  },

  // GraphQL & REST
  {
    id: "graphql",
    type: "custom",
    position: { x: 220, y: 410 },
    data: {
      icon: BranchesOutlined,
      label: "GraphQL",
      description: "Schema-first",
      color: "#722ed1",
    },
  },
  {
    id: "rest",
    type: "custom",
    position: { x: 420, y: 410 },
    data: {
      icon: CodeOutlined,
      label: "REST",
      description: "Auto-generated",
      color: "#fa8c16",
    },
  },

  // Plugins system
  {
    id: "plugins",
    type: "custom",
    position: { x: 600, y: 180 },
    data: {
      icon: ToolOutlined,
      label: "Plugins",
      color: "#1677ff",
    },
  },

  // Plugin examples
  {
    id: "media",
    type: "custom",
    position: { x: 750, y: 120 },
    data: {
      icon: AppstoreAddOutlined,
      label: "Media",
      color: "#52c41a",
    },
  },
  {
    id: "auth",
    type: "custom",
    position: { x: 750, y: 180 },
    data: {
      icon: LockOutlined,
      label: "Auth",
      color: "#f5222d",
    },
  },
  {
    id: "ai",
    type: "custom",
    position: { x: 750, y: 240 },
    data: {
      icon: RobotOutlined,
      label: "AI",
      color: "#722ed1",
    },
  },

  // Independent capabilities
  {
    id: "roles",
    type: "custom",
    position: { x: 50, y: 80 },
    data: {
      icon: SafetyCertificateOutlined,
      label: "Roles",
      color: "#13c2c2",
    },
  },
  {
    id: "workflows",
    type: "custom",
    position: { x: 50, y: 150 },
    data: {
      icon: CloudSyncOutlined,
      label: "Workflows",
      color: "#722ed1",
    },
  },
  {
    id: "webhooks",
    type: "custom",
    position: { x: 50, y: 220 },
    data: {
      icon: DeploymentUnitOutlined,
      label: "Webhooks",
      color: "#faad14",
    },
  },
  {
    id: "teams",
    type: "custom",
    position: { x: 50, y: 290 },
    data: {
      icon: TeamOutlined,
      label: "Teams",
      color: "#2f54eb",
    },
  },
];

const initialEdges: Edge[] = [
  // Schema to Generated APIs - straight line
  {
    id: "schema-to-apis",
    source: "schema",
    target: "generated-apis",
    type: "smoothstep",
    style: { stroke: "#d1d5db", strokeWidth: 2 },
    animated: false,
  },

  // Generated APIs to GraphQL and REST - straight lines
  {
    id: "apis-to-graphql",
    source: "generated-apis",
    target: "graphql",
    type: "smoothstep",
    style: { stroke: "#d1d5db", strokeWidth: 2 },
    animated: false,
  },
  {
    id: "apis-to-rest",
    source: "generated-apis",
    target: "rest",
    type: "smoothstep",
    style: { stroke: "#d1d5db", strokeWidth: 2 },
    animated: false,
  },

  // Plugins to Schema (optional) - straight line
  {
    id: "plugins-to-schema",
    source: "plugins",
    target: "schema",
    type: "smoothstep",
    style: { stroke: "#d1d5db", strokeWidth: 2 },
    animated: false,
  },

  // Plugin examples to Plugins - straight lines
  {
    id: "media-to-plugins",
    source: "media",
    target: "plugins",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },
  {
    id: "auth-to-plugins",
    source: "auth",
    target: "plugins",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },
  {
    id: "ai-to-plugins",
    source: "ai",
    target: "plugins",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },

  // Independent capabilities to Schema - straight lines
  {
    id: "roles-to-schema",
    source: "roles",
    target: "schema",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },
  {
    id: "workflows-to-schema",
    source: "workflows",
    target: "schema",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },
  {
    id: "webhooks-to-schema",
    source: "webhooks",
    target: "schema",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },
  {
    id: "teams-to-schema",
    source: "teams",
    target: "schema",
    type: "bezier",
    style: { stroke: "#d1d5db", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: false,
  },
];

const SchemaToApiIllustration: React.FC = () => {
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        panOnDrag={false}
        preventScrolling={true}
        style={{ background: "transparent" }}
      >
        <Background gap={20} size={1} color="#ebedf0" />
      </ReactFlow>

      {/* Integration chips */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "500px",
        }}
      >
        {["Next.js", "Node", "Go", "Webhooks"].map((tech) => (
          <div
            key={tech}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <LinkOutlined style={{ color: "#64748b", fontSize: "12px" }} />
            <Text
              style={{ color: "#475569", fontSize: "11px", fontWeight: 500 }}
            >
              {tech}
            </Text>
          </div>
        ))}
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          top: "100px",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            color: "#1f2937",
            fontSize: "16px",
            fontWeight: 600,
            display: "block",
            marginBottom: "4px",
          }}
        >
          Build API in Seconds, Delivery Projects in Weeks
        </Text>
        <Text
          style={{
            color: "#6b7280",
            fontSize: "13px",
            lineHeight: "1.4",
          }}
        >
          GraphQL-first and REST. Open source. Extensible plugins. Integrates
          anywhere.
        </Text>
      </div>
    </div>
  );
};

export default SchemaToApiIllustration;
