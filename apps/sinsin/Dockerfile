# syntax=docker/dockerfile:1.7

ARG PLATFORM=linux/amd64
ARG NODE_VERSION=22

FROM busybox:1.37-glibc as glibc

# ----------------------------------------------------------------------
# Base image with pnpm + moon
# ----------------------------------------------------------------------
FROM --platform=${PLATFORM} node:${NODE_VERSION}-bookworm-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 COREPACK_INTEGRITY_KEYS=0
ENV LEFTHOOK=0 CI=true PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true
ENV MOON_TOOLCHAIN_FORCE_GLOBALS=1 MOON_INSTALL_DIR="/usr/bin"
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$MOON_INSTALL_DIR:$PATH"

RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /srv

RUN apt-get update && apt-get -yqq --no-install-recommends install curl tini jq ca-certificates \
 && apt -yqq purge && update-ca-certificates && apt -yqq autoremove && apt -yqq clean

RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash

# ----------------------------------------------------------------------
# Skeleton stage: copy config & scaffold app
# ----------------------------------------------------------------------
FROM base AS skeleton
WORKDIR /srv

# Copy app folder
COPY . ./apps/sinsin

# Copy root workspace config supaya moon tahu ini monorepo
COPY ../../.moon .moon
COPY ../../workspace.yml workspace.yml
COPY ../../pnpm-workspace.yaml pnpm-workspace.yaml
COPY ../../package.json package.json

RUN moon docker scaffold sinsin

# ----------------------------------------------------------------------
# Builder stage
# ----------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=$NODE_ENV NEXT_TELEMETRY_DISABLED=1

# Copy workspace skeleton
COPY --from=skeleton /root/.proto /root/.proto
COPY --from=skeleton /srv/.moon/docker/workspace .

# Install toolchain and dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store moon docker setup

# Copy sources
COPY --from=skeleton /srv/.moon/docker/sources .
COPY --from=skeleton /srv/.npmrc .

# Build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store moon run sinsin:build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store moon docker prune

# ----------------------------------------------------------------------
# Pruner stage (copy only needed build output)
# ----------------------------------------------------------------------
FROM base AS pruner
WORKDIR /srv

COPY --from=builder /srv/apps/sinsin/.next/standalone .
COPY --from=builder /srv/apps/sinsin/.next/static ./apps/sinsin/.next/static
COPY --from=builder /srv/apps
