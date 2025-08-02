// Plugin types for flexible plugin system
import React from 'react'

export interface PluginFieldDefinition {
  type: string
  label: string
  description?: string
  icon?: string
  category?: string
  properties?: Record<string, unknown>
  formComponent: string // Component to render in content forms
  displayComponent?: string // Component to display field values
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
  component?: string // Settings component name
}

export interface PluginComponentRegistry {
  menu?: Record<string, React.ComponentType> // Menu/route components
  settings?: Record<string, React.ComponentType> // Settings page components  
  fields?: Record<string, React.ComponentType> // Model field components
  forms?: Record<string, React.ComponentType> // Content form components
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
  }
  routes: PluginRoute[]
  components?: PluginComponentRegistry
  settings?: PluginSettingsConfig
  fields?: PluginFieldDefinition[]
  permissions?: string[]
  dependencies?: Record<string, string>
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
  }>
  getPluginSettingsItems: () => Array<{
    label: string
    path: string
    icon?: string
    section: string
    pluginName: string
  }>
  getPluginFields: () => PluginFieldDefinition[]
  getPluginComponent: (pluginName: string, componentType: 'menu' | 'settings' | 'fields' | 'forms', componentName: string) => React.ComponentType | undefined
} 