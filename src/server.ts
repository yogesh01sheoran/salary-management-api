import app from "./app";
import { runMigrations } from "./database/migrations";
import { closeDatabase } from "./database/connection";

const PORT = Number(process.env.PORT) || 3000;

// Initialize database migrations before starting server
try {
  runMigrations();
  console.log("Database migrations completed successfully");
} catch (error) {
  console.error("Failed to run database migrations:", error);
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handlers
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received, starting graceful shutdown...`);
  server.close(() => {
    console.log("HTTP server closed");
    closeDatabase();
    console.log("Database connection closed");
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown doesn't complete
  setTimeout(() => {
    console.error("Forced exit after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));