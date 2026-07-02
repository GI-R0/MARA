import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Serve static files from dist with caching
app.use(
  express.static(join(__dirname, "dist"), {
    maxAge: "1d",
    etag: false,
  }),
);

// SPA routing - always serve index.html for non-file routes
app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend server running on port ${PORT}`);
});
