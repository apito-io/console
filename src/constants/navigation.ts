// Navigation configuration mapping sidebar paths to header titles and subtitles
export interface NavigationConfig {
    title: string;
    subtitle?: string;
}

export const NAVIGATION_HEADERS: Record<string, NavigationConfig> = {
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
    "teams": {
        title: "Teams",
        subtitle: "Invite people and grant them access to selected projects"
    },
    "plugins": {
        title: "Plugins",
        subtitle: "Manage and configure plugins"
    },
    "support": {
        title: "Support",
        subtitle: "Email, Discord, and live chat with the Apito team"
    },
    "access-token": {
        title: "Access Tokens",
        subtitle: "Create scoped, revocable tokens for CLI, SDK, and MCP integrations"
    },
    "mcp": {
        title: "MCP",
        subtitle: "Connect Cursor and other assistants to this engine"
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
    "users": {
        title: "Users",
        subtitle: "Manage project app end-users"
    },
    "api": {
        title: "GraphQL API",
        subtitle: "Explore and test your GraphQL API"
    },
    "graphql": {
        title: "GraphQL API",
        subtitle: "Explore and test your GraphQL API"
    },
    "rest": {
        title: "REST API",
        subtitle: "Explore and test your REST API endpoints"
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
    "webhooks": { title: "Webhooks" },
    "plugins-settings": { title: "Plugin Settings" },

    // Other pages
    "media": { title: "Media" },
    "logic": { title: "Logic" },
    "audit": { title: "Audit Logs" },
};

// Helper function to get header title from path
export const getHeaderTitle = (path: string): string => {
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
export const getHeaderSubtitle = (path: string): string | undefined => {
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