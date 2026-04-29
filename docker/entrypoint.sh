#!/bin/sh
set -eu

# Render runtime config from VITE_*-prefixed env vars into env-config.js.
# The Vite app reads window._env_ at runtime; only VITE_*-prefixed vars are
# exposed here to avoid leaking secrets into the browser.

TARGET=/usr/share/nginx/html/env-config.js

{
  echo "window._env_ = {"
  env | awk -F= '
    /^VITE_/ {
      key=$1
      sub(/^[^=]*=/, "", $0)
      gsub(/\\/, "\\\\", $0)
      gsub(/"/, "\\\"", $0)
      printf "  \"%s\": \"%s\",\n", key, $0
    }
  '
  echo "};"
} > "$TARGET"
