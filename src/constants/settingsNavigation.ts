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
    "authentication": {
        title: "Authentication",
        subtitle:
            "Manage app end-users and configure project sign-in methods (password with email or phone, and optional Google OAuth)."
    },
    "storage": {
        title: "Storage",
        subtitle:
            "Choose where project media uploads are stored — Apito free cloud storage or your own S3-compatible bucket."
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
    "plans": {
        title: "Plans",
        subtitle: "Prices, store SKUs, and tenant plan ceilings"
    },
    "monetization/plans": {
        title: "Plans",
        subtitle: "Prices, store SKUs, and tenant plan ceilings"
    },
    "monetization/providers": {
        title: "Payment providers",
        subtitle: "Payment providers for tenant subscriptions"
    },
    "monetization/invoices": {
        title: "Invoices",
        subtitle: "Tenant subscription invoices and cash receipts"
    },
    "monetization/subscribers": {
        title: "Subscribers",
        subtitle: "Tenant subscription ledger (manual cash and store)"
    },
    "schema-changes": {
        title: "Schema Changes",
        subtitle: "Review and publish staged schema updates"
    },
    "db-explorer": {
        title: "Database query",
        subtitle: "Read-only SQL for this project's database"
    },
    "plugins": {
        title: "Plugins",
        subtitle: "Manage and configure plugins for your project"
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

export function getSettingsPageConfig(
    activeKey: string,
): SettingsNavigationConfig {
    if (SETTINGS_NAVIGATION[activeKey]) {
        return SETTINGS_NAVIGATION[activeKey];
    }

    if (activeKey.startsWith("plugin-")) {
        const pluginName = activeKey.replace("plugin-", "");
        const title = pluginName
            .split(/[-_]/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
        return {
            title: title || "Plugin Settings",
            subtitle: "Configure plugin settings for your project",
        };
    }

    return {
        title:
            activeKey.charAt(0).toUpperCase() +
            activeKey.slice(1).replace(/-/g, " "),
        subtitle: undefined,
    };
}