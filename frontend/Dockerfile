FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci  # Clean install
RUN rm -rf node_modules/.cache  # Force redownload of binaries

COPY . .

CMD ["npm", "run", "dev"]