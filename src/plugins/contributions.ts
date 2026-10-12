export type PluginNavPlacement = {
  after?: string;
  before?: string;
  group?: string;
  settings?: boolean;
  hidden?: boolean;
  label?: string;
  path?: string;
  icon?: string;
};

export type PluginAPIOperation = {
  name: string;
  description?: string;
  args?: string;
  returns?: string;
};

export type PluginRESTOperation = {
  method: string;
  path: string;
  description?: string;
};

export type PluginAPIContribution = {
  scope?: "system" | "project" | string;
  queries?: PluginAPIOperation[];
  mutations?: PluginAPIOperation[];
  rest?: PluginRESTOperation[];
  events?: string[];
};

export type PluginUIRoute = {
  path: string;
  title?: string;
};

export type PluginSettingsSurface = {
  path?: string;
  label?: string;
};

export type PluginUIContribution = {
  ui_available?: boolean;
  routes?: PluginUIRoute[];
  navigation?: PluginNavPlacement[];
  settings?: PluginSettingsSurface[];
  component_ids?: string[];
};

export type PluginFieldContribution = {
  id: string;
  label: string;
  icon?: string;
  storage_type: string;
  form_component?: string;
  display_component?: string;
  validation_schema?: string;
  content_form?: boolean;
};

export type PluginContributions = {
  api?: PluginAPIContribution;
  ui?: PluginUIContribution;
  fields?: PluginFieldContribution[];
};

export type ContributionBadge = "API" | "UI" | "Fields" | "Settings" | "Events";

export function contributionBadges(
  contributions?: PluginContributions | null,
): ContributionBadge[] {
  if (!contributions) return [];
  const badges: ContributionBadge[] = [];
  const api = contributions.api;
  if (
    api &&
    ((api.queries && api.queries.length > 0) ||
      (api.mutations && api.mutations.length > 0) ||
      (api.rest && api.rest.length > 0))
  ) {
    badges.push("API");
  }
  const ui = contributions.ui;
  if (ui && (ui.ui_available || (ui.routes && ui.routes.length > 0))) {
    badges.push("UI");
  }
  if (contributions.fields && contributions.fields.length > 0) {
    badges.push("Fields");
  }
  if (ui?.settings && ui.settings.length > 0) {
    badges.push("Settings");
  }
  if (api?.events && api.events.length > 0) {
    badges.push("Events");
  }
  return badges;
}

export function primaryNavPlacement(
  contributions?: PluginContributions | null,
): PluginNavPlacement | undefined {
  return contributions?.ui?.navigation?.find(
    (item) => !item.hidden && !item.settings,
  );
}
