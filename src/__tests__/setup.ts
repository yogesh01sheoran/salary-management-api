import { closeDatabase, resetDatabase } from "../database/connection";
import { runMigrations } from "../database/migrations";

process.env.NODE_ENV = "test";

beforeAll(() => {
  runMigrations();
});

afterAll(() => {
  closeDatabase();
});