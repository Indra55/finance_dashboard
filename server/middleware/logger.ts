import type { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, url } = req;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    let color = "\x1b[32m"; // Green for 2xx
    if (statusCode >= 400 && statusCode < 500) color = "\x1b[33m"; // Yellow for 4xx
    if (statusCode >= 500) color = "\x1b[31m"; // Red for 5xx
    
    console.log(`${color}[${statusCode}]\x1b[0m ${method} ${url} - ${duration}ms`);
  });
  
  next();
};
