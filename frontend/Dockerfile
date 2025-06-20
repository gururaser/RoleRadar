# Frontend Dockerfile for RoleRadar
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment to development
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "dev"]
