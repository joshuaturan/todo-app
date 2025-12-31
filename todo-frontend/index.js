const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const CACHE_DIR = path.join(__dirname, "files");
const IMAGE_PATH = path.join(CACHE_DIR, "cached_image.jpg");
const TIME_PATH = path.join(CACHE_DIR, "timestamp.txt");
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const DEFAULT_IMAGE_URL = process.env.IMAGE_URL || "https://picsum.photos/400";

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

const server = http.createServer(async (req, res) => {
  // 1. SERVE THE HTML
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "views", "index.html"), (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // 2. SERVE THE JS
  else if (req.url === "/static/main.js") {
    fs.readFile(path.join(__dirname, "static", "main.js"), (err, data) => {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
  }

  // 3. THE IMAGE CACHE ROUTE
  else if (req.url === "/api/daily-image") {
    const now = Date.now();
    let shouldFetch = true;

    if (fs.existsSync(IMAGE_PATH) && fs.existsSync(TIME_PATH)) {
      const lastFetched = parseInt(fs.readFileSync(TIME_PATH, "utf8"));
      if (now - lastFetched < CACHE_DURATION) {
        shouldFetch = false;
      }
    }

    if (shouldFetch) {
      console.log("Fetching new image for cache...");
      const response = await fetch(DEFAULT_IMAGE_URL);
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(IMAGE_PATH, Buffer.from(buffer));
      fs.writeFileSync(TIME_PATH, now.toString());
    }

    // Serve the cached file from the volume
    const imgData = fs.readFileSync(IMAGE_PATH);
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(imgData);
  }
});

server.listen(PORT, () => console.log(`Frontend running on ${PORT}`));
