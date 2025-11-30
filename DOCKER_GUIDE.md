# Docker Guide for Husky Bridge Frontend

## Frontend Dockerfile Explained

### Multi-Stage Build Strategy

```dockerfile
# Stage 1: Build (Node.js environment)
FROM node:20-alpine AS builder
# Install dependencies and build React app

# Stage 2: Production (Nginx)
FROM nginx:alpine AS production
# Serve static files with Nginx
```

**Why This Approach?**
- **Build Stage**: Needs Node.js, npm, and all dev dependencies to compile TypeScript/React
- **Production Stage**: Only needs a web server (Nginx) to serve static files
- **Result**: Final image is ~25MB (Nginx) vs ~200MB (Node.js with all dependencies)

---

## Key Components:

### 1. Build Stage
```dockerfile
FROM node:20-alpine AS builder
RUN npm ci              # Install dependencies
RUN npm run build       # Build React app → creates dist/ folder
```
- Compiles TypeScript → JavaScript
- Bundles React app with Vite
- Creates optimized production build

### 2. Production Stage
```dockerfile
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
```
- **Nginx**: Lightweight, high-performance web server
- Copies built files from builder stage
- Serves static files (HTML, CSS, JS, images)

### 3. SPA Routing Configuration
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
**Why This Matters:**
- React Router handles routing client-side
- Direct URL access (e.g., `/post/123`) would 404 without this
- Nginx redirects all routes to `index.html`, React Router takes over

### 4. Performance Optimizations
- **Gzip Compression**: Reduces file sizes by ~70%
- **Asset Caching**: Static files cached for 1 year
- **Security Headers**: XSS protection, frame options

---

## Building and Running

### Build the Image:
```bash
cd husky-bridge
docker build -t husky-bridge-frontend .
```

### Run the Container:
```bash
docker run -p 3000:80 husky-bridge-frontend
```

### Access:
- Open browser: `http://localhost:3000`

---

## Why Nginx for Frontend?

| Option | Pros | Cons |
|--------|------|------|
| **Nginx** | ✅ Lightweight (~5MB)<br>✅ High performance<br>✅ Built-in caching | ❌ Need to configure |
| **Node.js** | ✅ Same as dev environment | ❌ Larger image<br>❌ More resources |

**For Production**: Nginx is industry standard for serving static files.

---

## Docker in CI/CD Context

**Frontend Docker Workflow:**
1. **CI**: Build Docker image from source code
2. **Test**: Run container, test the built app
3. **Push**: Upload image to container registry
4. **CD**: Deploy image to production (Kubernetes, cloud platform)

**Benefits:**
- Consistent builds across environments
- Easy rollback (use previous image version)
- Horizontal scaling (run multiple containers)

