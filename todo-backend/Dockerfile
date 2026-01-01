# 1. Use slim (stable, small, and works perfectly with 'pg')
FROM node:20-slim

# 2. Set the directory
WORKDIR /app

# 3. Copy package files first
# This is a 'pro' move: it lets Docker cache your layers so 
# builds are faster if you only change your code.
COPY package*.json ./

# 4. Install the 'pg' library inside the container
RUN npm install

# 5. Copy the rest of your code (index.js)
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
