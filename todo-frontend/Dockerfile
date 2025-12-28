
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Create the volume directory (optional but good practice)
RUN mkdir -p files

EXPOSE 3000

CMD ["node", "index.js"]
