# Apito Engine

Open-source, API-first infrastructure to model data, manage content, enforce access rules, and run at scale. This repository contains the Apito Console (Open Core) — a modern, web-based admin UI for managing your Apito projects.

Reference: the overall project vision and tone follow the Apito Engine README. See the engine repository for core concepts and ecosystem context: [apito-io/engine README](https://github.com/apito-io/engine/blob/main/README.md).

## Features

- Schema modeling UI with drag-and-drop
- Content management with relations and rich text
- Roles, permissions, and logic settings
- API reference and GraphiQL explorer
- Plugin system and plugin settings UI
- Media manager integration
- Project, environment, and team settings

## Tech Stack

- React 19, TypeScript 5, Vite 7
- Ant Design 5
- GraphQL 16, Apollo Client 3
- pnpm 9 (via Corepack)

## Requirements

- Node.js 20+
- pnpm (recommended via Corepack)

## Getting Started

1) Install dependencies

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

2) Run the development server

```bash
pnpm dev
```

3) Build and preview

```bash
pnpm build
pnpm preview
```

4) (Optional) Generate GraphQL types/hooks

```bash
pnpm codegen
```

## Configuration

At runtime, the console reads environment variables that are injected into the built assets. When running via Docker (see below), these are written to `env.js` on container start:

- `VITE_REST_API` (default: `https://api.apito.io`)
- `VITE_GRAPH_API` (default: `https://api.apito.io/secured/graphql`)
- `VITE_GRAPH_SUBS_API` (default: `wss://api.apito.io/secured/graphql`)
- `VITE_AUTH_PROVIDER` (default: `apito`)
- `VITE_PUBLIC_GRAPH_API` (default: `https://api.apito.io/secured/graphql`)
- `VITE_COOKIE_DOMAIN` (example: `.udbhabon.com`)

You can set these as needed in your deployment environment.

## Docker

Build a production image and run it:

```bash
# Build
docker build -t apito-console:latest .

# Run (override ports and env vars as needed)
docker run -p 8080:8080 \
  -e VITE_REST_API="https://api.apito.io" \
  -e VITE_GRAPH_API="https://api.apito.io/secured/graphql" \
  -e VITE_GRAPH_SUBS_API="wss://api.apito.io/secured/graphql" \
  -e VITE_AUTH_PROVIDER="apito" \
  -e VITE_PUBLIC_GRAPH_API="https://api.apito.io/secured/graphql" \
  -e VITE_COOKIE_DOMAIN=".example.com" \
  apito-console:latest
```

## CI/CD

This repository includes a GitHub Actions workflow that:

- Installs dependencies with pnpm using the lockfile
- Builds static assets and uploads a release artifact on tag pushes (`v*.*.*`)
- Builds and pushes a multi-arch Docker image to GHCR

To create a release, tag the commit and push:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Project Structure

```
src/
  components/       # UI components (common, forms, model, roles, plugins)
  pages/            # Route pages (console, settings, content, media, etc.)
  graphql/          # Queries and mutations
  generated/        # GraphQL codegen outputs
  services/         # API clients (Apollo, HTTP)
  plugins/          # Plugin system
  router/           # App routes
  types/            # Shared types
  utils/            # Utilities
```

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

## License

This project is part of the Apito ecosystem. Licensing terms may differ between the engine and the console. Please refer to the LICENSE file in this repository (if present) and the Engine repository for additional context: [apito-io/engine README](https://github.com/apito-io/engine/blob/main/README.md).
