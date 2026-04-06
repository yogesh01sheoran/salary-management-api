import express from "express";
import employeeRoutes from "./modules/employee/employee.routes";
import { errorHandler } from "./middleware/errorHandler";
import { runMigrations } from "./database/migrations";

const app = express();

runMigrations();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Salary Management API is running",
  });
});

app.use("/api/employees", employeeRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;