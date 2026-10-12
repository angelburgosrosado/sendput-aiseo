FROM oven/bun:1.4-alpine AS base
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

COPY . .

# Generate Prisma Client
RUN bun x prisma generate

# Build Next.js
RUN bun run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
