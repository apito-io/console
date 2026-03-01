#!/bin/sh
set -e

echo "========================================="
echo "Apito Console (open-core) - Starting:"
echo "========================================="
echo "  WEB_PORT: ${WEB_PORT}"
echo "  BACKEND_REST_API: ${BACKEND_REST_API}"
echo "  BACKEND_GRAPH_API: ${BACKEND_GRAPH_API}"
echo "  BACKEND_GRAPH_SUBS_API: ${BACKEND_GRAPH_SUBS_API}"
echo "  BACKEND_PUBLIC_GRAPH_API: ${BACKEND_PUBLIC_GRAPH_API}"
echo "  VITE_AUTH_PROVIDER: ${VITE_AUTH_PROVIDER}"
echo "  VITE_COOKIE_DOMAIN: ${VITE_COOKIE_DOMAIN}"
echo "========================================="

# Parse backend URLs to extract host and path (for nginx proxy_pass)
REST_PROTO=$(echo "${BACKEND_REST_API}" | sed -e 's,^\(.*://\).*,\1,g')
REST_HOST=$(echo "${BACKEND_REST_API}" | sed -e 's,^.*://\([^/]*\).*,\1,g')
REST_PATH=$(echo "${BACKEND_REST_API}" | sed -e "s,^${REST_PROTO}${REST_HOST},,g")
[ -z "$REST_PATH" ] && REST_PATH="/"

GQL_PROTO=$(echo "${BACKEND_GRAPH_API}" | sed -e 's,^\(.*://\).*,\1,g')
GQL_HOST=$(echo "${BACKEND_GRAPH_API}" | sed -e 's,^.*://\([^/]*\).*,\1,g')
GQL_PATH=$(echo "${BACKEND_GRAPH_API}" | sed -e "s,^${GQL_PROTO}${GQL_HOST},,g")
[ -z "$GQL_PATH" ] && GQL_PATH="/"

WSGQL_PROTO=$(echo "${BACKEND_GRAPH_SUBS_API}" | sed -e 's,^\(.*://\).*,\1,g')
WSGQL_HOST=$(echo "${BACKEND_GRAPH_SUBS_API}" | sed -e 's,^.*://\([^/]*\).*,\1,g')
WSGQL_PATH=$(echo "${BACKEND_GRAPH_SUBS_API}" | sed -e "s,^${WSGQL_PROTO}${WSGQL_HOST},,g")
[ -z "$WSGQL_PATH" ] && WSGQL_PATH="/"

PUBGQL_PROTO=$(echo "${BACKEND_PUBLIC_GRAPH_API}" | sed -e 's,^\(.*://\).*,\1,g')
PUBGQL_HOST=$(echo "${BACKEND_PUBLIC_GRAPH_API}" | sed -e 's,^.*://\([^/]*\).*,\1,g')
PUBGQL_PATH=$(echo "${BACKEND_PUBLIC_GRAPH_API}" | sed -e "s,^${PUBGQL_PROTO}${PUBGQL_HOST},,g")
[ -z "$PUBGQL_PATH" ] && PUBGQL_PATH="/"

REST_BACKEND="${REST_PROTO}${REST_HOST}"
GQL_BACKEND="${GQL_PROTO}${GQL_HOST}"
PUBGQL_BACKEND="${PUBGQL_PROTO}${PUBGQL_HOST}"
case "$WSGQL_PROTO" in
  wss://) WSGQL_BACKEND="https://${WSGQL_HOST}" ;;
  ws://)  WSGQL_BACKEND="http://${WSGQL_HOST}" ;;
  *)      WSGQL_BACKEND="https://${WSGQL_HOST}" ;;
esac

echo "Proxy targets: REST ${REST_BACKEND} -> ${REST_PATH}, GraphQL ${GQL_BACKEND} -> ${GQL_PATH}"

# env.js: VITE_REST_API empty so requests go to /auth/v2/login, /system/..., etc. (no /api prefix).
# Nginx proxies these path prefixes directly to BACKEND_REST_API.
cat > /usr/share/nginx/html/env.js << ENVJS_EOF
// Runtime config - no /api prefix; requests are /auth/v2/login etc., nginx proxies to backend
window.env = {
  VITE_REST_API: '',
  VITE_GRAPH_API: '/graphql',
  VITE_GRAPH_SUBS_API: '/ws-graphql',
  VITE_PUBLIC_GRAPH_API: '/public-graphql',
  VITE_AUTH_PROVIDER: '${VITE_AUTH_PROVIDER}',
  VITE_COOKIE_DOMAIN: '${VITE_COOKIE_DOMAIN}',
};
console.log('[Apito] Runtime config loaded:', window.env);
ENVJS_EOF

echo "Generated /usr/share/nginx/html/env.js"

# Nginx config with reverse proxy (same as pro)
cat > /etc/nginx/http.d/default.conf << NGINX_EOF
server {
    listen ${WEB_PORT};
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    access_log /dev/stdout;
    error_log /dev/stderr;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # REST API paths - proxy directly (no /api prefix): /auth/v2/login, /system/..., etc.
    location /auth/ {
        proxy_pass ${REST_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${REST_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location /system/ {
        proxy_pass ${REST_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${REST_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location /media/ {
        proxy_pass ${REST_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${REST_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location /plugin/ {
        proxy_pass ${REST_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${REST_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location /secured/ {
        proxy_pass ${REST_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${REST_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location /graphql/ {
        rewrite ^/graphql(.*)\$ ${GQL_PATH}\$1 break;
        proxy_pass ${GQL_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${GQL_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location /ws-graphql/ {
        rewrite ^/ws-graphql(.*)\$ ${WSGQL_PATH}\$1 break;
        proxy_pass ${WSGQL_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${WSGQL_HOST};
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
    location /public-graphql/ {
        rewrite ^/public-graphql(.*)\$ ${PUBGQL_PATH}\$1 break;
        proxy_pass ${PUBGQL_BACKEND};
        proxy_http_version 1.1;
        proxy_set_header Host ${PUBGQL_HOST};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    location / {
        try_files \$uri \$uri/ /index.html;
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        location ~* \.html\$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
NGINX_EOF

echo "Generated nginx configuration. Starting nginx..."
exec nginx -g "daemon off;"
