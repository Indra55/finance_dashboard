import { pool } from "../config/dbConfig.ts";
import type { Request, Response } from "express";
import { isValidUUID, isValidRole, isValidStatus, parsePaginationParams } from "../utils/validate.ts";


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query as Record<string, unknown>);

    const countResult = await pool.query(`SELECT COUNT(*) FROM users`);
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      users: result.rows,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ error: "Invalid user ID format." });
      return;
    }

    if (!role || !isValidRole(role)) {
      res.status(400).json({ error: "Role must be 'admin', 'analyst', or 'viewer'." });
      return;
    }

    if (id === req.user!.id) {
      res.status(400).json({ error: "You cannot change your own role." });
      return;
    }

    const result = await pool.query(
      `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, name, email, role, status`,
      [role.toLowerCase(), id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({ message: "User role updated", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ error: "Invalid user ID format." });
      return;
    }

    if (!status || !isValidStatus(status)) {
      res.status(400).json({ error: "Status must be 'active' or 'inactive'." });
      return;
    }

    if (id === req.user!.id) {
      res.status(400).json({ error: "You cannot change your own status." });
      return;
    }

    const result = await pool.query(
      `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, name, email, role, status`,
      [status.toLowerCase(), id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({ message: "User status updated", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
