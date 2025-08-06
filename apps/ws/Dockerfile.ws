FROM node:22-alpine AS base
RUN npm install -g pnpm prisma
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ws/package.json ./apps/ws/
COPY packages/db/package.json ./packages/db/
COPY packages/common/package.json ./packages/common/
COPY packages/backend-common/package.json ./packages/backend-common/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN pnpm --filter @repo/db generate
RUN pnpm --filter @repo/db build
RUN pnpm --filter @repo/common build
RUN pnpm --filter @repo/backend-common build
RUN pnpm --filter @repo/ws build

FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeapp

# Copy built apps and dependencies
COPY --from=builder --chown=nodeapp:nodejs /app/apps/ws/dist ./apps/ws/dist
COPY --from=builder --chown=nodeapp:nodejs /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=nodeapp:nodejs /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/packages/common/dist ./packages/common/dist
COPY --from=builder --chown=nodeapp:nodejs /app/packages/backend-common/dist ./packages/backend-common/dist
COPY --from=builder --chown=nodeapp:nodejs /app/apps/ws/node_modules ./apps/ws/node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./package.json

USER nodeapp

EXPOSE 8080
CMD ["node", "apps/ws/dist/index.js"]