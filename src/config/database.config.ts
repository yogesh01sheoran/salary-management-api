import path from "path";

export const DB_CONFIG = {
  test: {
    filename: ":memory:",
  },
  development: {
    filename: path.join(__dirname, "../../data/salary_management.db"),
  },
  production: {
    filename: path.join(__dirname, "../../data/salary_management.db"),
  },
};

export type Environment = "test" | "development" | "production";