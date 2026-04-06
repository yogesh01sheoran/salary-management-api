import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = (err as any).status || (err as any).statusCode || 500;
  console.error(`[${req.method}] ${req.originalUrl} - Error (${statusCode}):`, err);

  const message =
    statusCode < 500 ? err.message : "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}