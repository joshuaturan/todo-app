FROM alpine:3.18

# 1. Install curl
RUN apk add --no-cache curl

# 2. Set the working directory
WORKDIR /usr/src/app

# 3. Copy the script from your computer into the image
COPY script.sh .

# 4. Ensure the script is executable inside the container
RUN chmod +x script.sh

# 5. Run the script when the container starts
CMD ["./script.sh"]
