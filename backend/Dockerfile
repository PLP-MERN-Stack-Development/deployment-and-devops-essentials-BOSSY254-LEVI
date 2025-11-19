# Multi-stage Dockerfile for backend to avoid heavy installs on Render
# Build stage: use node image to install production dependencies only
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Final stage: lean runtime image
FROM node:18-alpine
WORKDIR /app

# Copy only production deps from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
