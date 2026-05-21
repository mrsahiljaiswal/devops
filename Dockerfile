FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and build-time scripts for config generation
COPY package*.json ./
COPY scripts ./scripts

# Install dependencies and run postinstall to generate frontend config
RUN npm ci --only=production

# Copy application files after dependencies are installed
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
