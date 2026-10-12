import type { GetSystemPluginsQuery } from "../../generated_gql/tanstack-query";

/** Same row shape as `getProjectPlugins` and `getSystemPlugins`. */
export type PluginDetailsRow = NonNullable<
  NonNullable<GetSystemPluginsQuery["getSystemPlugins"]>[number]
> & {
  capabilities?: string[] | null;
  official?: boolean | null;
  signed?: boolean | null;
  publisher?: string | null;
  bundle_url?: string | null;
};
