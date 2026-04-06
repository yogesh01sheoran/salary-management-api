import path from "path";

export const DB_CONFIG = {
  test: {
    filename: ":memory:",
  },
  development: {
    filename: path.join(__dirname, "../../data/salary_management_dev.db"),
  },
  production: {
    filename: process.env.DB_PATH || path.join(__dirname, "../../data/salary_management.db"),
  },
};

export type Environment = "test" | "development" | "production";