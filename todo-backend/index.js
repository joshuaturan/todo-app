const http = require("http");

// Port 3001 so it doesn't clash with the frontend on 3000
const port = process.env.PORT || 3000;

let todos = ["Learn javascript", "Learn react", "Build something"];

const server = http.createServer((req, res) => {
  // --- THE MAGIC SAUCE: CORS HEADERS ---
  // Because the browser at port 3000 is calling port 3001,
  // we must give it permission.
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allows any frontend to connect
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle "Pre-flight" requests (Browsers send this before a POST)
  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  // 1. GET /todos - Send the array as JSON
  if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, headers);
    res.end(JSON.stringify(todos));
    return;
  }

  // 2. POST /todos - Add a new item to the array
  if (req.url === "/todos" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      console.log("chunck", chunk);
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const parsedBody = JSON.parse(body);
        if (parsedBody.content) {
          todos.push(parsedBody.content);
          res.writeHead(201, headers);
          res.end(
            JSON.stringify({ status: "success", item: parsedBody.content }),
          );
        } else {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: "Content is required" }));
        }
      } catch (err) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // 404 for anything else
  res.writeHead(404);
  res.end();
});

server.listen(port, () => console.log(`Backend API running on port ${port}`));
