# Build stage
FROM node:18-alpine AS builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm prune --production

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./
COPY --from=builder /build ./

EXPOSE 5002

CMD ["node", "server.js"]
