import express from "express";
import { runMigrations } from "./database/migrations";
import employeeRoutes from "./modules/employee/employee.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Run migrations on startup
runMigrations();

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Salary Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/employees", employeeRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use(errorHandler);

export default app;