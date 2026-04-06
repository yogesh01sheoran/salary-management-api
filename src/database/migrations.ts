import { getDatabase } from "./connection";

export function runMigrations(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      job_title TEXT NOT NULL,
      country TEXT NOT NULL,
      salary INTEGER NOT NULL CHECK(salary > 0),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_employees_country_lower ON employees(LOWER(country));
    CREATE INDEX IF NOT EXISTS idx_employees_job_title_lower ON employees(LOWER(job_title));
  `);
}