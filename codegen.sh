#!/usr/bin/env bash
export BASE_URL="http://localhost:5050"
token=$(curl -X POST -H "Content-Type: application/json" -d '{"email": "apito.user1@gmail.com","secret": "Apitorocks247$$"}' $BASE_URL/auth/v2/login | jq -r '.token')
echo $token;
export VITE_API_TOKEN="Bearer $token";
export VITE_GRAPHQL_URL="$BASE_URL/system/graphql";
echo $VITE_GRAPHQL_URL;
echo $VITE_API_TOKEN;
pnpm run codegen; 