# --------------------------------------------------------------------------
# Multi-stage Dockerfile for the Express.js backend.
#
# Stage 1 (builder): Installs all deps, generates Prisma client, compiles TS.
# Stage 2 (production): Only production deps + compiled JS for a lean image.
#
# Build context must be the project ROOT (not ./backend) because
# package.json, prisma/, and tsconfig.json live at the root level.
# --------------------------------------------------------------------------

# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json tsconfig.json ./
COPY backend/prisma ./backend/prisma/

# Install all dependencies (including devDependencies for TypeScript build)
RUN npm ci

# Copy backend source code
COPY backend ./backend/

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → dist/
RUN npx tsc --outDir dist

# ---- Production Stage ----
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/prisma ./backend/prisma/

# Install production dependencies only
RUN npm ci --omit=dev
RUN npx prisma generate

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist/

EXPOSE 8080

CMD ["node", "dist/backend/src/server.js"]
