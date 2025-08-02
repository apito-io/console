FROM node:18.17 AS build

WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if present)
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application (including workspaces)
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
