# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# CMD ["npm", "run", "dev"]


# Backend Dockerfile

# Use Node.js LTS
FROM node:18-bullseye

# Create app directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3001

# Run compiled JS
CMD ["node", "dist/server.js"]
