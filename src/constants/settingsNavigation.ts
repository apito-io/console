// Project Settings navigation configuration mapping paths to header titles and subtitles
export interface SettingsNavigationConfig {
    title: string;
    subtitle?: string;
}

export const SETTINGS_NAVIGATION: Record<string, SettingsNavigationConfig> = {
    // Project Settings main page
    "settings": {
        title: "Project Settings",
        subtitle: "Configure your project settings"
    },

    // Settings sub-pages
    "general": {
        title: "General",
        subtitle: "Configure basic project settings and preferences"
    },
    "teams": {
        title: "Teams",
        subtitle: "Invite team members to collaborate on your project"
    },
    "api-secrets": {
        title: "API Secrets",
        subtitle: "Manage your API keys and secrets"
    },
    "webhooks": {
        title: "Webhooks",
        subtitle: "Configure webhook endpoints and notifications"
    },
    "roles": {
        title: "Roles & Permissions",
        subtitle: "Manage user roles and access permissions"
    },
    "plugins": {
        title: "Plugins",
        subtitle: "Configure and manage project plugins"
    },
    "media": {
        title: "Media Configuration",
        subtitle: "Configure media settings and storage"
    },
};

// Helper function to get settings header title from path
export const getSettingsHeaderTitle = (path: string): string => {
    // Remove leading slash and get the first segment
    const cleanPath = path.replace(/^\//, "");
    const firstSegment = cleanPath.split("/")[0];

    // Check if we have a direct match
    if (SETTINGS_NAVIGATION[firstSegment]) {
        return SETTINGS_NAVIGATION[firstSegment].title;
    }

    // Check for sub-paths (like settings/general)
    if (SETTINGS_NAVIGATION[cleanPath]) {
        return SETTINGS_NAVIGATION[cleanPath].title;
    }

    // Fallback: capitalize the first segment
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
};

// Helper function to get settings header subtitle from path
export const getSettingsHeaderSubtitle = (path: string): string | undefined => {
    // Remove leading slash and get the first segment
    const cleanPath = path.replace(/^\//, "");
    const firstSegment = cleanPath.split("/")[0];

    // Check if we have a direct match
    if (SETTINGS_NAVIGATION[firstSegment]) {
        return SETTINGS_NAVIGATION[firstSegment].subtitle;
    }

    // Check for sub-paths (like settings/general)
    if (SETTINGS_NAVIGATION[cleanPath]) {
        return SETTINGS_NAVIGATION[cleanPath].subtitle;
    }

    return undefined;
}; 