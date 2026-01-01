#!/bin/sh

# Capture the random URL into a variable
URL=$(curl -I -s https://en.wikipedia.org/wiki/Special:Random | grep -i "location:" | awk '{print $2}')

# Clean up any weird hidden characters (like carriage returns from the network)
URL=$(echo $URL | tr -d '\r')

echo "The URL we found is: $URL"

# Send the URL to your backend service
curl -X POST http://todo-backend-svc:2345/todos \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"Read $URL\"}"
