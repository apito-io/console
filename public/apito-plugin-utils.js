/**
 * Apito Plugin Utilities
 * Minimal utilities for plugin development without enforcing specific UI components
 */

(function (global) {
  'use strict';

  // Plugin API namespace
  const ApitoPluginAPI = {
    // Design tokens access
    tokens: {
      colors: {
        primary: {
          50: 'var(--apito-primary-50)',
          100: 'var(--apito-primary-100)',
          200: 'var(--apito-primary-200)',
          300: 'var(--apito-primary-300)',
          400: 'var(--apito-primary-400)',
          500: 'var(--apito-primary-500)',
          600: 'var(--apito-primary-600)',
          700: 'var(--apito-primary-700)',
          800: 'var(--apito-primary-800)',
          900: 'var(--apito-primary-900)',
        },
        neutral: {
          0: 'var(--apito-neutral-0)',
          50: 'var(--apito-neutral-50)',
          100: 'var(--apito-neutral-100)',
          200: 'var(--apito-neutral-200)',
          300: 'var(--apito-neutral-300)',
          400: 'var(--apito-neutral-400)',
          500: 'var(--apito-neutral-500)',
          600: 'var(--apito-neutral-600)',
          700: 'var(--apito-neutral-700)',
          800: 'var(--apito-neutral-800)',
          900: 'var(--apito-neutral-900)',
        },
        success: {
          50: 'var(--apito-success-50)',
          500: 'var(--apito-success-500)',
          600: 'var(--apito-success-600)',
          700: 'var(--apito-success-700)',
        },
        warning: {
          50: 'var(--apito-warning-50)',
          500: 'var(--apito-warning-500)',
          600: 'var(--apito-warning-600)',
          700: 'var(--apito-warning-700)',
        },
        error: {
          50: 'var(--apito-error-50)',
          500: 'var(--apito-error-500)',
          600: 'var(--apito-error-600)',
          700: 'var(--apito-error-700)',
        },
        info: {
          50: 'var(--apito-info-50)',
          500: 'var(--apito-info-500)',
          600: 'var(--apito-info-600)',
          700: 'var(--apito-info-700)',
        },
      },
      spacing: {
        1: 'var(--apito-space-1)',
        2: 'var(--apito-space-2)',
        3: 'var(--apito-space-3)',
        4: 'var(--apito-space-4)',
        5: 'var(--apito-space-5)',
        6: 'var(--apito-space-6)',
        8: 'var(--apito-space-8)',
        10: 'var(--apito-space-10)',
        12: 'var(--apito-space-12)',
        16: 'var(--apito-space-16)',
        20: 'var(--apito-space-20)',
        24: 'var(--apito-space-24)',
      },
      fontSize: {
        xs: 'var(--apito-font-size-xs)',
        sm: 'var(--apito-font-size-sm)',
        base: 'var(--apito-font-size-base)',
        lg: 'var(--apito-font-size-lg)',
        xl: 'var(--apito-font-size-xl)',
        '2xl': 'var(--apito-font-size-2xl)',
        '3xl': 'var(--apito-font-size-3xl)',
        '4xl': 'var(--apito-font-size-4xl)',
      },
      borderRadius: {
        sm: 'var(--apito-border-radius-sm)',
        DEFAULT: 'var(--apito-border-radius)',
        md: 'var(--apito-border-radius-md)',
        lg: 'var(--apito-border-radius-lg)',
        xl: 'var(--apito-border-radius-xl)',
        '2xl': 'var(--apito-border-radius-2xl)',
        full: 'var(--apito-border-radius-full)',
      },
      shadow: {
        sm: 'var(--apito-shadow-sm)',
        DEFAULT: 'var(--apito-shadow)',
        md: 'var(--apito-shadow-md)',
        lg: 'var(--apito-shadow-lg)',
        xl: 'var(--apito-shadow-xl)',
      }
    },

    // CSS class builder utility
    cn: function(...classes) {
      return classes.filter(Boolean).join(' ');
    },

    // Theme utilities
    theme: {
      // Get CSS custom property value
      getCSSVar: function(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      },

      // Set CSS custom property
      setCSSVar: function(varName, value) {
        document.documentElement.style.setProperty(varName, value);
      },

      // Apply Apito theme classes to container
      applyTheme: function(element) {
        if (element && !element.classList.contains('apito-plugin-container')) {
          element.classList.add('apito-plugin-container');
        }
      }
    },

    // Navigation utilities  
    navigate: function(path) {
      if (global.history && global.history.pushState) {
        global.history.pushState(null, '', path);
        // Trigger navigation event for React Router
        global.dispatchEvent(new PopStateEvent('popstate'));
      }
    },

    // Event utilities
    events: {
      // Emit custom events
      emit: function(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        global.document.dispatchEvent(event);
      },

      // Listen to custom events
      on: function(eventName, handler) {
        global.document.addEventListener(eventName, handler);
        return function() {
          global.document.removeEventListener(eventName, handler);
        };
      }
    },

    // Storage utilities
    storage: {
      // Plugin-scoped localStorage
      get: function(pluginName, key) {
        try {
          const data = global.localStorage.getItem(`apito-plugin-${pluginName}-${key}`);
          return data ? JSON.parse(data) : null;
        } catch (e) {
          console.warn('Failed to get plugin storage:', e);
          return null;
        }
      },

      set: function(pluginName, key, value) {
        try {
          global.localStorage.setItem(`apito-plugin-${pluginName}-${key}`, JSON.stringify(value));
        } catch (e) {
          console.warn('Failed to set plugin storage:', e);
        }
      },

      remove: function(pluginName, key) {
        try {
          global.localStorage.removeItem(`apito-plugin-${pluginName}-${key}`);
        } catch (e) {
          console.warn('Failed to remove plugin storage:', e);
        }
      }
    },

    // HTTP utilities
    http: {
      get: async function(url, options = {}) {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });
        return response.json();
      },

      post: async function(url, data, options = {}) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: JSON.stringify(data),
          ...options
        });
        return response.json();
      }
    },

    // Logger utility
    log: {
      info: function(pluginName, ...args) {
        console.log(`[Plugin:${pluginName}]`, ...args);
      },
      warn: function(pluginName, ...args) {
        console.warn(`[Plugin:${pluginName}]`, ...args);
      },
      error: function(pluginName, ...args) {
        console.error(`[Plugin:${pluginName}]`, ...args);
      }
    }
  };

  // Plugin Registry (minimal version)
  class PluginRegistry {
    constructor() {
      this.plugins = new Map();
      this.routes = new Map();
      this.menuItems = [];
    }

    registerPlugin(config) {
      console.log('Registering plugin:', config.name);
      
      this.plugins.set(config.name, config);
      
      // Register routes
      if (config.routes) {
        config.routes.forEach(route => {
          const fullPath = `/console/plugin/${config.name}${route.path}`;
          this.routes.set(fullPath, {
            ...route,
            pluginName: config.name
          });
        });
      }

      // Register menu items
      if (config.menu) {
        this.menuItems.push({
          ...config.menu,
          pluginName: config.name
        });
      }

      // Trigger plugin registered event
      ApitoPluginAPI.events.emit('plugin:registered', {
        name: config.name,
        config: config
      });
    }

    getPlugin(name) {
      return this.plugins.get(name);
    }

    getAllPlugins() {
      return Array.from(this.plugins.values());
    }

    getRoutes() {
      return Array.from(this.routes.entries());
    }

    getMenuItems() {
      return this.menuItems;
    }

    renderComponent(pluginName, componentName, containerId, props = {}) {
      const plugin = this.getPlugin(pluginName);
      if (!plugin || !plugin.components || !plugin.components[componentName]) {
        console.error(`Component ${componentName} not found in plugin ${pluginName}`);
        return;
      }

      const container = document.querySelector(`[data-plugin-container="${containerId}"]`);
      if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
      }

      // Apply theme to container
      ApitoPluginAPI.theme.applyTheme(container);

      // Render component
      const Component = plugin.components[componentName];
      if (global.React && global.ReactDOM) {
        const element = global.React.createElement(Component, props);
        global.ReactDOM.render(element, container);
      }
    }
  }

  // Initialize global registry
  if (!global.PluginRegistry) {
    global.PluginRegistry = new PluginRegistry();
  }

  // Export API
  global.ApitoPluginAPI = ApitoPluginAPI;

  // Also support CommonJS and AMD
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApitoPluginAPI, PluginRegistry };
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return { ApitoPluginAPI, PluginRegistry };
    });
  }

})(typeof window !== 'undefined' ? window : this); 