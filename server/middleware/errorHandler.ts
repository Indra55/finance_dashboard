import type { Request, Response, NextFunction } from "express";


export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.name === "SyntaxError" && "body" in err) {
    res.status(400).json({ error: "Invalid JSON in request body." });
    return;
  } 

  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
};
