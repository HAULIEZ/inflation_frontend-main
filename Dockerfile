FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Install curl for healthcheck
RUN apk add --no-cache curl

# Expose port
EXPOSE 3000

# Start the development server with restart capability
CMD ["sh", "-c", "while true; do npm run dev -- --hostname 0.0.0.0 || sleep 5; done"]
