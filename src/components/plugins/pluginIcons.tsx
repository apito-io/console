import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Clock,
  CreditCard,
  Database,
  Gauge,
  Images,
  Mail,
  MessageSquare,
  Puzzle,
  Radio,
  Search,
  Shield,
  Smartphone,
  Webhook,
  Zap,
} from "lucide-react";
import type { CatalogPlugin } from "../../services/pluginCatalog";

const BY_ID: Record<string, LucideIcon> = {
  "hc-discord-plugin": MessageSquare,
  "hc-stripe-plugin": CreditCard,
  "hc-auth-plugin": Shield,
  "hc-email-plugin": Mail,
  "hc-storage-plugin": Database,
  "hc-cache-plugin": Zap,
  "hc-search-plugin": Search,
  "hc-webhook-plugin": Webhook,
  "hc-realtime-plugin": Radio,
  "hc-scheduler-plugin": Clock,
  "hc-analytics-plugin": BarChart3,
  "hc-logging-plugin": Gauge,
  "hc-sms-plugin": Smartphone,
  "hc-push-notification-plugin": Bell,
  "hc-rate-limit-plugin": Gauge,
  "hc-payment-plugin": CreditCard,
  "hc-ai-plugin": Zap,
};

const BY_CATEGORY: Record<string, LucideIcon> = {
  communication: Bell,
  storage: Images,
  data: CreditCard,
  authentication: Shield,
  security: Shield,
  performance: Gauge,
  monitoring: Gauge,
  analytics: BarChart3,
};

export function pluginFallbackIcon(plugin: Pick<CatalogPlugin, "id" | "category">): LucideIcon {
  if (plugin.id && BY_ID[plugin.id]) return BY_ID[plugin.id];
  if (plugin.category && BY_CATEGORY[plugin.category]) return BY_CATEGORY[plugin.category];
  return Puzzle;
}

export function PluginGlyph({
  plugin,
  size = 22,
}: {
  plugin: Pick<CatalogPlugin, "id" | "name" | "icon" | "category">;
  size?: number;
}): React.ReactElement {
  if (plugin.icon) {
    return (
      <img
        src={plugin.icon}
        alt=""
        width={size}
        height={size}
        className="plugin-glyph__img"
      />
    );
  }
  const Icon = pluginFallbackIcon(plugin);
  return <Icon size={size} strokeWidth={1.75} aria-hidden />;
}
