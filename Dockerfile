# Stage 1: Build
FROM node:20-alpine AS builder

# Build tools for native modules (Required for Stellar SDK)
RUN apk add --no-cache python3 make g++

WORKDIR /app/frontend

# 1. Copy package files from the subfolder to install dependencies
COPY frontend/package*.json ./
RUN npm install

# 2. Copy the rest of the frontend source code
COPY frontend/ ./

# 3. Build the project
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# FIX: Changed '/dist' to '/build' to match your actual file structure
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Standard Nginx configuration for React/Vite SPAs
RUN echo "server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files \$uri \$uri/ /index.html; \
    } \
    }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]