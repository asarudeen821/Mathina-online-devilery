# ---- Backend Dockerfile ----
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/

# Default environment variables (override at runtime)
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start the backend server
CMD ["node", "src/server.js"]
