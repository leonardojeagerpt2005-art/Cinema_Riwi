import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "..", "db.json");

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = { users: [], movies: [], bookings: [], support: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return { users: [], movies: [], bookings: [], support: [] };
  }
}

function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // API Routes (Mocking JSON-Server)
  app.get("/api/:resource", (req, res) => {
    const db = readDb();
    const resource = req.params.resource;
    if (db[resource]) {
      res.json(db[resource]);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  });

  app.get("/api/:resource/:id", (req, res) => {
    const db = readDb();
    const { resource, id } = req.params;
    if (db[resource]) {
      const item = db[resource].find((i: any) => i.id == id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  });

  app.post("/api/:resource", (req, res) => {
    const db = readDb();
    const resource = req.params.resource;
    if (db[resource]) {
      const newItem = { id: Date.now(), ...req.body };
      
      // If resource is support, log the email dispatch to yunpapicodsito@gmail.com
      if (resource === "support") {
        console.log(`[SUPPORT EMAIL DISPATCH] To: yunpapicodsito@gmail.com | From: ${newItem.email} | Message: ${newItem.message}`);
        newItem.recipient = "yunpapicodsito@gmail.com";
        newItem.status = "Enviado con éxito a soporte";
      }

      db[resource].push(newItem);
      writeDb(db);
      res.status(201).json(newItem);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  });

  app.put("/api/:resource/:id", (req, res) => {
    const db = readDb();
    const { resource, id } = req.params;
    if (db[resource]) {
      const index = db[resource].findIndex((i: any) => i.id == id);
      if (index !== -1) {
        db[resource][index] = { ...db[resource][index], ...req.body, id: Number(id) };
        writeDb(db);
        res.json(db[resource][index]);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  });

  app.delete("/api/:resource/:id", (req, res) => {
    const db = readDb();
    const { resource, id } = req.params;
    if (db[resource]) {
      db[resource] = db[resource].filter((i: any) => i.id != id);
      writeDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
