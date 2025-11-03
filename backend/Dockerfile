FROM node:18-alpine AS base

WORKDIR /app

RUN apk add --no-cache \
    postgresql-client \
    tzdata \
    curl

FROM base AS dependencies

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
