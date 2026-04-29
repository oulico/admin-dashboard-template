FROM --platform=$BUILDPLATFORM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM --platform=$BUILDPLATFORM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN if [ -f openapi.yaml ]; then npm run generate:api; fi
RUN npm run build

FROM nginx:stable-alpine AS runner
RUN apk add --no-cache wget
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /docker-entrypoint.d/40-render-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-render-env-config.sh
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
