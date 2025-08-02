import type { PluginConfig, LoadedPlugin, PluginRegistryState } from './types'

class PluginRegistry {
  private state: PluginRegistryState = {
    plugins: new Map(),
    loading: false,
    error: null
  }

  private loadingPlugins: Set<string> = new Set()
  private listeners: Array<(state: PluginRegistryState) => void> = []

  // Subscribe to state changes
  subscribe(listener: (state: PluginRegistryState) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Notify listeners of state changes
  private notify() {
    this.listeners.forEach(listener => listener(this.getState()))
  }

  // Get current state
  getState(): PluginRegistryState {
    return {
      ...this.state,
      plugins: new Map(this.state.plugins)
    }
  }

  // Load plugin configuration
  async loadPluginConfig(pluginPath: string): Promise<PluginConfig | null> {
    try {
      const response = await fetch(`${pluginPath}/config.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch config.json: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to load plugin config from ${pluginPath}:`, error)
      return null
    }
  }

  // Load plugin script
  async loadPluginScript(pluginPath: string): Promise<void> {
    // Wait for CDN dependencies to be ready
    await this.waitForCDN()

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `${pluginPath}/index.js`
      script.async = true

      script.onload = () => {
        console.log(`Plugin script loaded: ${pluginPath}`)
        resolve()
      }

      script.onerror = () => {
        const error = new Error(`Failed to load plugin script: ${pluginPath}`)
        console.error(error)
        reject(error)
      }

      document.head.appendChild(script)
    })
  }

  // Wait for CDN dependencies to be ready
  private async waitForCDN(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).PLUGIN_CDN_READY) {
        console.log('[Plugin System] CDN already ready')
        resolve()
        return
      }

      console.log('[Plugin System] Waiting for CDN to be ready...')
      window.addEventListener('plugin-cdn-ready', () => {
        console.log('[Plugin System] CDN ready event received')
        resolve()
      }, { once: true })

      // Fallback timeout after 5 seconds
      setTimeout(() => {
        console.warn('[Plugin System] CDN ready timeout, proceeding anyway')
        resolve()
      }, 5000)
    })
  }

  // Register a plugin
  registerPlugin(config: PluginConfig) {
    try {
      console.log(`Registering plugin: ${config.name}`)
      console.log(`Plugin registration data:`, config)
      console.log(`Plugin has components:`, !!config.components)
      if (config.components) {
        console.log(`Component names:`, Object.keys(config.components))
      }

      const plugin: LoadedPlugin = {
        config,
        loaded: true,
        loadedAt: new Date()
      }

      this.state.plugins.set(config.name, plugin)
      this.notify()

      console.log(`Plugin ${config.name} registered successfully`)
    } catch (error) {
      console.error(`Failed to register plugin ${config.name}:`, error)
      throw error
    }
  }

  // Load a plugin from path
  async loadPlugin(pluginPath: string): Promise<void> {
    this.state.loading = true
    this.state.error = null
    this.notify()

    try {
      // Load configuration
      const config = await this.loadPluginConfig(pluginPath)
      if (!config) {
        throw new Error('Failed to load plugin configuration')
      }

      // Check if plugin is already loaded
      if (this.state.plugins.has(config.name)) {
        console.warn(`Plugin ${config.name} is already loaded`)
        return
      }

      // Load script
      await this.loadPluginScript(pluginPath)

      // Plugin should have registered itself during script execution
      // If not, mark as error
      if (!this.state.plugins.has(config.name)) {
        const plugin: LoadedPlugin = {
          config,
          loaded: false,
          error: 'Plugin did not register itself after loading'
        }
        this.state.plugins.set(config.name, plugin)
      }

    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to load plugin:', error)
    } finally {
      this.state.loading = false
      this.notify()
    }
  }

  // Unload a plugin
  unloadPlugin(pluginName: string) {
    this.state.plugins.delete(pluginName)
    this.notify()
  }

  // Get plugin by name
  getPlugin(pluginName: string): LoadedPlugin | undefined {
    return this.state.plugins.get(pluginName)
  }

  // Get all plugins
  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.state.plugins.values())
  }

  // Get loaded plugins only
  getLoadedPlugins(): LoadedPlugin[] {
    return this.getAllPlugins().filter(plugin => plugin.loaded)
  }

  // Scan for plugins in public/plugins directory
  async scanForPlugins(): Promise<void> {
    try {
      // In a real implementation, this would scan the plugins directory
      // For now, we'll just check for known plugins
      const knownPlugins = [
        '/plugins/media-plugin'
      ]

      for (const pluginPath of knownPlugins) {
        try {
          await this.loadPlugin(pluginPath)
        } catch (error) {
          console.warn(`Failed to load plugin from ${pluginPath}:`, error)
        }
      }
    } catch (error) {
      console.error('Failed to scan for plugins:', error)
    }
  }

  // Discover and load plugins with timeout and error handling
  async discoverPlugins(): Promise<LoadedPlugin[]> {
    try {
      console.log('[PluginRegistry] Starting plugin discovery...');

      // Get list of available plugins with timeout
      const pluginDirs = await this.getAvailablePluginsWithTimeout();
      console.log(`[PluginRegistry] Found ${pluginDirs.length} plugin directories`);

      // Load plugins in parallel with individual error handling
      const loadPromises = pluginDirs.map(pluginName =>
        this.loadPluginSafely(pluginName)
      );

      const results = await Promise.allSettled(loadPromises);

      // Filter successful loads
      const loadedPlugins: LoadedPlugin[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          loadedPlugins.push(result.value);
        } else {
          console.warn(`[PluginRegistry] Failed to load plugin ${pluginDirs[index]}:`,
            result.status === 'rejected' ? result.reason : 'Unknown error');
        }
      });

      console.log(`[PluginRegistry] Successfully loaded ${loadedPlugins.length}/${pluginDirs.length} plugins`);
      return loadedPlugins;

    } catch (error) {
      console.error('[PluginRegistry] Plugin discovery failed:', error);
      return []; // Return empty array instead of throwing
    }
  }

  private async getAvailablePluginsWithTimeout(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Plugin directory scan timeout'));
      }, 2000);

      this.getAvailablePlugins()
        .then(dirs => {
          clearTimeout(timeout);
          resolve(dirs);
        })
        .catch(err => {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }

  private async getAvailablePlugins(): Promise<string[]> {
    try {
      // Try to scan /plugins directory
      const response = await fetch('/plugins/', {
        method: 'GET',
        headers: { 'Accept': 'text/html' }
      });

      if (!response.ok) {
        console.warn('[PluginRegistry] No plugins directory found or accessible');
        return [];
      }

      const html = await response.text();
      const pluginDirs = this.parsePluginDirectories(html);
      return pluginDirs.filter(dir => dir && !dir.startsWith('.'));
    } catch (error) {
      console.warn('[PluginRegistry] Failed to scan plugin directories:', error);
      return [];
    }
  }

  private parsePluginDirectories(html: string): string[] {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a[href]');

      return Array.from(links)
        .map(link => {
          const href = link.getAttribute('href');
          return href?.endsWith('/') ? href.slice(0, -1) : href;
        })
        .filter((href): href is string =>
          href !== null &&
          href !== '..' &&
          href !== '.' &&
          !href.startsWith('/') &&
          !href.includes('.')
        );
    } catch (error) {
      console.warn('[PluginRegistry] Failed to parse plugin directories:', error);
      return [];
    }
  }

  private async loadPluginSafely(pluginName: string): Promise<LoadedPlugin | null> {
    if (this.loadingPlugins.has(pluginName)) {
      console.log(`[PluginRegistry] Plugin ${pluginName} is already loading`);
      return null;
    }

    this.loadingPlugins.add(pluginName);

    try {
      console.log(`[PluginRegistry] Loading plugin: ${pluginName}`);

      // Load with timeout
      await Promise.race([
        this.loadPlugin(`/plugins/${pluginName}`),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Plugin ${pluginName} load timeout`)), 3000)
        )
      ]);

      // Get the loaded plugin from the registry
      const plugin = this.state.plugins.get(pluginName);
      if (plugin) {
        console.log(`[PluginRegistry] Successfully loaded plugin: ${pluginName}`);
        this.notify(); // Notify listeners of state change
        return plugin;
      }

      return null;
    } catch (error) {
      console.error(`[PluginRegistry] Failed to load plugin ${pluginName}:`, error);
      return null;
    } finally {
      this.loadingPlugins.delete(pluginName);
    }
  }
}

// Global instance
const pluginRegistry = new PluginRegistry()

// Make registry available globally for plugins to register themselves
declare global {
  interface Window {
    PluginRegistry: PluginRegistry
  }
}

if (typeof window !== 'undefined') {
  window.PluginRegistry = pluginRegistry
  console.log('[PluginRegistry] Global PluginRegistry exposed on window')
  console.log('[PluginRegistry] Registry methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(pluginRegistry)))
}

// Export singleton instance  
export { PluginRegistry }
export default pluginRegistry 