import type { Request, Response, NextFunction } from "express";


export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    if (!req.user.role) {
      res.status(403).json({ error: "User role not found." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
};
