#!/bin/sh

# Capture the random TARGET_URL into a variable
TARGET_URL=$(curl -I -s "$WIKI_URL" | grep -i "location:" | awk '{print $2}')

# Clean up any weird hidden characters (like carriage returns from the network)
TARGET_URL=$(echo $TARGET_URL | tr -d '\r')

echo "The TARGET_URL we found is: $TARGET_URL"

# Send the TARGET_URL to your backend service
curl -X POST http://todo-backend-svc:2345/todos \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"Read $TARGET_URL\"}"
