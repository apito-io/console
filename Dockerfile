# syntax=docker/dockerfile:1.7-labs

FROM node:20-alpine AS deps
WORKDIR /app

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy lockfile first to maximize cache hits
COPY pnpm-lock.yaml ./

# Prefetch packages into the pnpm store (no node_modules yet)
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm fetch

# Copy manifest(s) and install from store offline
COPY package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --offline --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Reuse cached node_modules layer
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the built application with a lightweight alpine image
FROM alpine:latest

ENV WEB_PORT=8080
# Environment variables for API endpoints (can be overridden at runtime)
ENV VITE_REST_API=https://api.apito.io
ENV VITE_GRAPH_API=https://api.apito.io/secured/graphql
ENV VITE_GRAPH_SUBS_API=wss://api.apito.io/secured/graphql
ENV VITE_AUTH_PROVIDER=apito
ENV VITE_PUBLIC_GRAPH_API=https://api.apito.io/secured/graphql
ENV VITE_COOKIE_DOMAIN=.udbhabon.com

# Install nodejs and nginx
RUN apk add --no-cache nodejs nginx

# Copy the built application
COPY --from=build /app/dist /usr/share/nginx/html

# Create entrypoint script for dynamic environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Generate env.js file with current environment variables' >> /docker-entrypoint.sh && \
    echo 'cat > /usr/share/nginx/html/env.js << ENVEOF' >> /docker-entrypoint.sh && \
    echo '// Runtime environment configuration' >> /docker-entrypoint.sh && \
    echo 'window.env = {' >> /docker-entrypoint.sh && \
    echo '  VITE_REST_API: '"'"'${VITE_REST_API}'"'"',' >> /docker-entrypoint.sh && \
    echo '  VITE_GRAPH_API: '"'"'${VITE_GRAPH_API}'"'"',' >> /docker-entrypoint.sh && \
    echo '  VITE_GRAPH_SUBS_API: '"'"'${VITE_GRAPH_SUBS_API}'"'"',' >> /docker-entrypoint.sh && \
    echo '  VITE_AUTH_PROVIDER: '"'"'${VITE_AUTH_PROVIDER}'"'"',' >> /docker-entrypoint.sh && \
    echo '  VITE_PUBLIC_GRAPH_API: '"'"'${VITE_PUBLIC_GRAPH_API}'"'"',' >> /docker-entrypoint.sh && \
    echo '  VITE_COOKIE_DOMAIN: '"'"'${VITE_COOKIE_DOMAIN}'"'"',' >> /docker-entrypoint.sh && \
    echo '  // Add any other environment variables you need' >> /docker-entrypoint.sh && \
    echo '};' >> /docker-entrypoint.sh && \
    echo 'ENVEOF' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'echo "Generated env.js with:"' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_REST_API: ${VITE_REST_API}"' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_GRAPH_API: ${VITE_GRAPH_API}"' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_GRAPH_SUBS_API: ${VITE_GRAPH_SUBS_API}"' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_AUTH_PROVIDER: ${VITE_AUTH_PROVIDER}"' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_PUBLIC_GRAPH_API: ${VITE_PUBLIC_GRAPH_API}"' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_COOKIE_DOMAIN: ${VITE_COOKIE_DOMAIN}"' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Configure nginx' >> /docker-entrypoint.sh && \
    echo 'echo '"'"'server {' >> /docker-entrypoint.sh && \
    echo '    listen '"'"'${WEB_PORT}'"'"';' >> /docker-entrypoint.sh && \
    echo '    root /usr/share/nginx/html;' >> /docker-entrypoint.sh && \
    echo '    index index.html;' >> /docker-entrypoint.sh && \
    echo '    location / {' >> /docker-entrypoint.sh && \
    echo '    try_files $uri $uri/ /index.html;' >> /docker-entrypoint.sh && \
    echo '    }' >> /docker-entrypoint.sh && \
    echo '    }'"'"' > /etc/nginx/http.d/default.conf' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE $WEB_PORT

ENTRYPOINT ["/docker-entrypoint.sh"]
