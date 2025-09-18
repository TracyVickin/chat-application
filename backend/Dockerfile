FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy only package files + prisma schema first
COPY package*.json ./
COPY prisma ./prisma

# Skip Prisma generate during install (handled later)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Generate Prisma client (after schema is present)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3001

# Run compiled JS
CMD ["node", "dist/server.js"]
