export const DEFAULT_HELLO_SOURCE = `import { ensureGlobalApito } from "@apito-io/functions";

// Host shim injects globalThis.apito before this module loads.
const apito = ensureGlobalApito();

export default async function (req: Record<string, unknown>) {
  return { ok: true, echo: req, sdk: !!apito };
}
`;

export const LIST_FOOD_NAMES_SOURCE = `import { ensureGlobalApito } from "@apito-io/functions";

const apito = ensureGlobalApito();

/**
 * Read-only: list food document ids + names for the current tenant scope.
 * Requires capability: data.read:food
 */
export default async function (req: Record<string, unknown>) {
  const rawLimit = Number(req.limit ?? 20);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.trunc(rawLimit), 1), 100)
    : 20;

  const page = await apito.data.getList("food", { limit, page: 1 });
  const results = (page?.results ?? []).map((doc: { id?: string; data?: { name?: string } }) => ({
    id: doc.id,
    name: doc.data?.name ?? null,
  }));

  return {
    ok: true,
    total: page?.total ?? results.length,
    foods: results,
  };
}
`;

export type FunctionTemplateId = "hello" | "listFoodNames";

export type FunctionTemplate = {
  id: FunctionTemplateId;
  name: string;
  label: string;
  source: string;
  capabilities: string[];
  graphqlExposure: "Query" | "Mutation";
};

export const FUNCTION_TEMPLATES: FunctionTemplate[] = [
  {
    id: "hello",
    name: "hello",
    label: "Hello (echo)",
    source: DEFAULT_HELLO_SOURCE,
    capabilities: [],
    graphqlExposure: "Query",
  },
  {
    id: "listFoodNames",
    name: "listFoodNames",
    label: "listFoodNames (Rosna food read)",
    source: LIST_FOOD_NAMES_SOURCE,
    capabilities: ["data.read:food"],
    graphqlExposure: "Query",
  },
];
