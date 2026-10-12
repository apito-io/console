// Plugin types for flexible plugin system
import React from 'react'

import type { PluginContributions, PluginNavPlacement } from "./contributions"

export interface PluginFieldDefinition {
  type: string
  label: string
  description?: string
  icon?: string
  category?: string
  properties?: Record<string, unknown>
  formComponent: string
  displayComponent?: string
  pluginId?: string
  storageType?: string
}

export interface PluginSettingsConfig {
  label?: string
  section?: string
  menu?: {
    label: string
    path?: string
    icon?: string
    position?: string
  }
  component?: string
}

export interface PluginComponentRegistry {
  pages?: Record<string, React.ComponentType>
  menu?: Record<string, React.ComponentType>
  settings?: Record<string, React.ComponentType>
  fields?: Record<string, React.ComponentType>
  forms?: Record<string, React.ComponentType>
}

export interface PluginConfig {
  name: string
  version: string
  displayName: string
  description?: string
  author?: string
  menu?: {
    label: string
    path: string
    icon?: string
    position?: string
    placement?: PluginNavPlacement
  }
  routes: PluginRoute[]
  components?: PluginComponentRegistry
  settings?: PluginSettingsConfig
  fields?: PluginFieldDefinition[]
  permissions?: string[]
  dependencies?: Record<string, string>
  capabilities?: string[]
  official?: boolean
  signed?: boolean
  declarative?: boolean
  blockedReason?: string
  contributions?: PluginContributions
}

export interface PluginRoute {
  path: string
  component: string
  title?: string
}

export interface LoadedPlugin {
  config: PluginConfig
  loaded: boolean
  error?: string
  loadedAt?: Date
}

export interface PluginRegistryState {
  plugins: Map<string, LoadedPlugin>
  loading: boolean
  error: string | null
}

export interface PluginManagerAPI {
  loadPlugin: (pluginPath: string) => Promise<void>
  getPlugin: (pluginName: string) => LoadedPlugin | undefined
  getPluginRoutes: () => Array<{
    path: string
    pluginName: string
    component: string
  }>
  getPluginMenuItems: () => Array<{
    label: string
    path: string
    icon?: string
    pluginName: string
    placement?: PluginNavPlacement
  }>
  getPluginSettingsItems: () => Array<{
    label: string
    path: string
    icon?: string
    section: string
    pluginName: string
  }>
  getPluginFields: () => PluginFieldDefinition[]
  getPluginComponent: (pluginName: string, componentType: 'pages' | 'menu' | 'settings' | 'fields' | 'forms', componentName: string) => React.ComponentType | undefined
}
 