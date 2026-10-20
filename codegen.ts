import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadConsoleEnv } from "./vite/consoleEnv";

loadConsoleEnv();

const schemaUrl =
  process.env.VITE_GRAPHQL_URL ?? process.env.VITE_GRAPH_API;
const apiToken = process.env.VITE_API_TOKEN;

if (!schemaUrl) {
  throw new Error(
    "VITE_GRAPH_API is required for codegen (~/.apito/bin/.env.console)",
  );
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [schemaUrl]: {
        headers: {
          Authorization: apiToken ?? "",
          "X-Use-Cookies": "false",
        },
      },
    },
  ],
  documents: [
    "./src/graphql/**/*.{ts,tsx}",
    "!./src/graphql/queries/media.ts",
    "!./src/graphql/workspaceTeams.ts",
  ],
  generates: {
    "./src/generated_gql/tanstack-query.ts": {
      plugins: [
        {
          add: {
            content: "import { TypedDocumentString } from '../lib/typedDocumentString';",
          },
        },
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        reactQueryVersion: 5,
        fetcher: "../lib/graphqlFetcher#graphqlFetcher",
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQuery: false,
        scalars: {
          JSON: "{ [key: string]: any }",
          JSONArray: "any[]",
        },
      },
    },
  },
};

export default config;
