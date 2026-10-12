import React from "react";
import { Typography, Tag, Avatar } from "antd";
import ConsoleCard from "../console/ConsoleCard";
import type { PluginDetailsRow } from "./pluginTypes";
import "../console/ConsoleShell.css";

const { Title, Text } = Typography;

export interface PluginCardProps {
  plugin: PluginDetailsRow | null;
  onSettingsClick: (plugin: PluginDetailsRow) => void;
}

const getStatusColor = (status: string | null | undefined) => {
  if (!status) return "default";
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "loaded":
    case "installed":
      return "success";
    case "error":
    case "failed":
      return "error";
    case "loading":
    case "installing":
      return "processing";
    case "not_installed":
      return "default";
    default:
      return "default";
  }
};

const getStatusText = (status: string | null | undefined) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getInitials = (text: string | null | undefined) => {
  if (!text) return "?";
  return text.charAt(0).toUpperCase();
};

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onSettingsClick }) => {
  if (!plugin) {
    return null;
  }

  const pluginName = plugin.title || plugin.id || "Unnamed Plugin";
  const pluginIcon = plugin.icon;

  return (
    <ConsoleCard
      hoverable
      className="plugin-card"
      onClick={() => onSettingsClick(plugin)}
    >
      <div className="plugin-card__stack">
        <div className="plugin-card__header">
          {pluginIcon ? (
            <Avatar src={pluginIcon} size={48} className="plugin-card__avatar">
              {getInitials(pluginName)}
            </Avatar>
          ) : (
            <Avatar
              size={48}
              className="plugin-card__avatar plugin-card__avatar--fallback"
            >
              {getInitials(pluginName)}
            </Avatar>
          )}

          <div className="plugin-card__body">
            <div className="plugin-card__title-row">
              <Title level={5} className="plugin-card__title">
                {pluginName}
              </Title>
              {plugin.load_status && (
                <Tag
                  color={getStatusColor(plugin.load_status)}
                  className="plugin-card__tag"
                >
                  {getStatusText(plugin.load_status)}
                </Tag>
              )}
            </div>
            {plugin.version && (
              <Text type="secondary" className="plugin-card__version">
                v{plugin.version}
                {plugin.author && ` • by ${plugin.author}`}
              </Text>
            )}
          </div>
        </div>

        {plugin.description && (
          <Text className="plugin-card__description">{plugin.description}</Text>
        )}

        <div className="plugin-card__tags">
          {(plugin.capabilities ?? []).map((cap) => (
            <Tag key={cap} className="plugin-card__tag">
              {cap}
            </Tag>
          ))}
          {plugin.official ? (
            <Tag color="blue" className="plugin-card__tag">
              Official
            </Tag>
          ) : null}
          {plugin.enable !== null && plugin.enable !== undefined && (
            <Tag className="plugin-card__tag">
              {plugin.enable ? "Enabled" : "Disabled"}
            </Tag>
          )}
          {plugin.role && <Tag className="plugin-card__tag">{plugin.role}</Tag>}
        </div>
      </div>
    </ConsoleCard>
  );
};

export default PluginCard;
