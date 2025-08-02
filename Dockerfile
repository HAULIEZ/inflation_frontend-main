FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server (since build is failing)
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
