import Database from "better-sqlite3";
import { DB_CONFIG, Environment } from "../config/database.config";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const nodeEnv = process.env.NODE_ENV;
    const validEnv =
      nodeEnv && nodeEnv in DB_CONFIG ? (nodeEnv as Environment) : "development";
    if (nodeEnv && !(nodeEnv in DB_CONFIG)) {
      console.warn(
        "Unknown NODE_ENV '" +
          nodeEnv +
          "', falling back to 'development'"
      );
    }
    const config = DB_CONFIG[validEnv];
    
    // Ensure data directory exists for file-based databases
    if (config.filename !== ":memory:") {
      const dir = path.dirname(config.filename);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    
    db = new Database(config.filename);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}