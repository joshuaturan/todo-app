const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

const port = process.env.PORT || 3000;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// --- THE LOGIC ---
const startServer = async () => {
  try {
    // 1. Try to connect and create the table
    console.log("Connecting to databaseZ...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL
      )
    `);
    console.log("Database ready.");

    // 2. ONLY start the server if the DB check passed
    const server = http.createServer(async (req, res) => {
      if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
      }

      if (req.url === "/" || req.url === "/healthz") {
        res.writeHead(200, headers);
        res.end(JSON.stringify({ status: "ok" }));
        return;
      }

      if (req.url === "/todos" && req.method === "GET") {
        const result = await pool.query(
          "SELECT content FROM todos ORDER BY id DESC",
        );
        res.writeHead(200, headers);
        res.end(JSON.stringify(result.rows.map((r) => r.content)));
        return;
      }

      if (req.url === "/todos" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => (body += chunk.toString()));
        req.on("end", async () => {
          try {
            const { content } = JSON.parse(body);

            // 1. Check length (Exercise Requirement)
            if (content.length > 140) {
              // 2. LOG THE REJECTION (Loki will see this)
              console.warn(
                `REJECTED: Todo is too long (${content.length} characters). Content: "${content.substring(0, 20)}..."`,
              );

              res.writeHead(400, headers);
              res.end(
                JSON.stringify({
                  error: "Todo is too long. Maximum length is 140 characters.",
                }),
              );
              return;
            }

            // 3. Log the successful attempt
            console.log(
              `ACCEPTED: New todo created (${content.length} characters).`,
            );

            await pool.query("INSERT INTO todos (content) VALUES ($1)", [
              content,
            ]);
            res.writeHead(201, headers);
            res.end(JSON.stringify({ status: "success" }));
          } catch (e) {
            console.error("ERROR: Failed to process POST /todos", e.message);
            res.writeHead(400, headers);
            res.end(JSON.stringify({ error: "Invalid data" }));
          }
        });
        return;
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (err) {
    console.error("Failed to connect to DB. Retrying in 5 seconds...", err);
    // 3. Retry logic: if DB isn't up, wait 5 seconds and try again
    setTimeout(startServer, 5000);
  }
};

startServer();
