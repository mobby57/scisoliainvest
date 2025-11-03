FROM node:18-alpine AS base

WORKDIR /app

FROM base AS dependencies

COPY package*.json ./
RUN npm install --only=production

FROM base AS build

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --chown=nextjs:nodejs package*.json ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]