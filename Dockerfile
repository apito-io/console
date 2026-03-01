# Production stage - copy built artifacts from GitHub Actions
# nginx serves static files and proxies /api, /graphql, etc. to BACKEND_* URLs
FROM alpine:latest

ENV WEB_PORT=8080

# Backend API URLs - proxied through nginx (override at runtime)
ENV BACKEND_REST_API=http://localhost:5050
ENV BACKEND_GRAPH_API=http://localhost:5050/system/graphql
ENV BACKEND_GRAPH_SUBS_API=ws://localhost:5050/system/graphql/subscription
ENV BACKEND_PUBLIC_GRAPH_API=http://localhost:5050/secured/graphql

ENV VITE_AUTH_PROVIDER=apito
ENV VITE_COOKIE_DOMAIN=

RUN apk add --no-cache nginx

COPY dist /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
