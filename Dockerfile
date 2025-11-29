# ============================================
# FRONTEND DOCKERFILE (Multi-stage Build)
# ============================================
# Stage 1: Build the React application
# Stage 2: Serve with Nginx (lightweight web server)

# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (Docker layer caching)
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (creates dist/ folder)
RUN npm run build

# Stage 2: Production stage with Nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

