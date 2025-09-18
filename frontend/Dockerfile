FROM node:20-alpine

WORKDIR /app

# Copy both package.json and node_modules from local
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (if needed)
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]