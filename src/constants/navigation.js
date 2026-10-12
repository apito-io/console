export const NAVIGATION_HEADERS = {
    // Main navigation items
    "projects": {
        title: "Projects",
        subtitle: "Manage your projects and their settings"
    },
    "active-projects": {
        title: "Active Projects",
        subtitle: "Manage your active projects and their settings"
    },
    "new-project": {
        title: "New Project",
        subtitle: "Create a new project"
    },
    "accounts": {
        title: "Account Settings",
        subtitle: "Manage your profile and security settings"
    },
    "plugins": {
        title: "Plugins",
        subtitle: "Manage and configure plugins"
    },
    "support": {
        title: "Help & Support",
        subtitle: "Get help and support from the Apito team"
    },
    "access-token": {
        title: "Access Token",
        subtitle: "Generate CLI, SDK, and MCP access tokens for Apito integrations"
    },
    "mcp": {
        title: "MCP",
        subtitle: "Connect AI assistants to Apito via Model Context Protocol"
    },
    "system-api": {
        title: "System API",
        subtitle: "Explore and test the Apito System APIs"
    },
    // Console pages
    "content": {
        title: "Content",
        subtitle: "Manage your content and data"
    },
    "model": {
        title: "Model",
        subtitle: "Design and configure your project schema"
    },
    "api": {
        title: "API",
        subtitle: "Explore and test your API endpoints"
    },
    "storage": {
        title: "Files",
        subtitle: "Upload and manage project media and files"
    },
    "console": {
        title: "Console",
        subtitle: "Project management and configuration"
    },
    // Settings pages
    "settings": { title: "Settings" },
    "general": { title: "General Settings" },
    "authentication": { title: "Authentication" },
    "api-secrets": { title: "API Secrets" },
    "roles": { title: "Roles & Permissions" },
    "teams": { title: "Teams" },
    "webhooks": { title: "Webhooks" },
    "plugins-settings": { title: "Plugin Settings" },
    // Other pages
    "media": { title: "Media" },
    "logic": { title: "Logic" },
    "audit": { title: "Audit Logs" },
};
// Helper function to get header title from path
export const getHeaderTitle = (path) => {
    // Remove leading slash and get the first segment
    const cleanPath = path.replace(/^\//, "");
    const firstSegment = cleanPath.split("/")[0];
    // Check if we have a direct match
    if (NAVIGATION_HEADERS[firstSegment]) {
        return NAVIGATION_HEADERS[firstSegment].title;
    }
    // Check for sub-paths (like projects/new)
    if (NAVIGATION_HEADERS[cleanPath]) {
        return NAVIGATION_HEADERS[cleanPath].title;
    }
    // Fallback: capitalize the first segment
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
};
// Helper function to get header subtitle from path
export const getHeaderSubtitle = (path) => {
    // Remove leading slash and get the first segment
    const cleanPath = path.replace(/^\//, "");
    const firstSegment = cleanPath.split("/")[0];
    // Check if we have a direct match
    if (NAVIGATION_HEADERS[firstSegment]) {
        return NAVIGATION_HEADERS[firstSegment].subtitle;
    }
    // Check for sub-paths (like projects/new)
    if (NAVIGATION_HEADERS[cleanPath]) {
        return NAVIGATION_HEADERS[cleanPath].subtitle;
    }
    return undefined;
};
