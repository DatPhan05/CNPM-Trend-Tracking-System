# --------------------------------------------------------------------------
# Multi-stage Dockerfile for the React frontend.
#
# Stage 1 (builder): Installs deps and builds the React app via Vite.
# Stage 2: Copies only the built static files (dist/).
#           NGINX will serve these files via a shared Docker volume.
# --------------------------------------------------------------------------

# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build React app for production
RUN npm run build

# ---- Output Stage ----
# Only the static build output — NGINX will serve these via shared volume
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/dist ./dist
