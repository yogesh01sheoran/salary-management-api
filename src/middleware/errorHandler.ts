import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[${req.method}] ${req.originalUrl} - Error:`, err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}