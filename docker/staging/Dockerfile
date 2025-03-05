FROM node:22-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps


# 2. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG MAILTRAP_CLIENT_TOKEN
ARG DATABASE_URL
ARG NEXT_TELEMETRY_DISABLED=1

ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV MAILTRAP_CLIENT_TOKEN=${MAILTRAP_CLIENT_TOKEN}
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}

RUN npm run build

CMD npm run start