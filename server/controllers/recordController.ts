import { pool } from "../config/dbConfig.ts";
import type { Request, Response } from "express";
import { isValidUUID, isPositiveNumber, isValidDate, isValidRecordType, parsePaginationParams, sanitizeString } from "../utils/validate.ts";


export const createRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, type, category, description, date } = req.body;
    if (amount === undefined || !type || !category) {
      res.status(400).json({ error: "Fields 'amount', 'type', and 'category' are required." });
      return;
    }

    if (!isPositiveNumber(amount)) {
      res.status(400).json({ error: "Amount must be a positive number." });
      return;
    }

    if (!isValidRecordType(type)) {
      res.status(400).json({ error: "Type must be either 'income' or 'expense'." });
      return;
    }

    if (date && !isValidDate(date)) {
      res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
      return;
    }

    if (category.trim().length === 0 || category.length > 100) {
      res.status(400).json({ error: "Category must be between 1 and 100 characters." });
      return;
    }

    const result = await pool.query(
      `INSERT INTO financial_records (user_id, amount, type, category, description, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user!.id,
        parseFloat(amount),
        type.toLowerCase(),
        sanitizeString(category),
        description ? sanitizeString(description) : null,
        date || new Date().toISOString().split("T")[0],
      ]
    );

    res.status(201).json({ message: "Record created successfully", record: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, offset } = parsePaginationParams(req.query as Record<string, unknown>);
    const { type, category, startDate, endDate, sortBy, q, order } = req.query;

    const conditions: string[] = ["is_deleted = false"];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (q) {
      conditions.push(`(LOWER(description) LIKE LOWER($${paramIndex}) OR LOWER(category) LIKE LOWER($${paramIndex}))`);
      params.push(`%${q}%`);
      paramIndex++;
    }

    if (type) {
      if (!isValidRecordType(type as string)) {
        res.status(400).json({ error: "Type must be 'income' or 'expense'." });
        return;
      }
      conditions.push(`type = $${paramIndex++}`);
      params.push((type as string).toLowerCase());
    }

    if (category) {
      conditions.push(`LOWER(category) = LOWER($${paramIndex++})`);
      params.push(category);
    }

    if (startDate) {
      if (!isValidDate(startDate as string)) {
        res.status(400).json({ error: "Invalid startDate format." });
        return;
      }
      conditions.push(`date >= $${paramIndex++}`);
      params.push(startDate);
    }

    if (endDate) {
      if (!isValidDate(endDate as string)) {
        res.status(400).json({ error: "Invalid endDate format." });
        return;
      }
      conditions.push(`date <= $${paramIndex++}`);
      params.push(endDate);
    }

    const allowedSortFields = ["date", "amount", "category", "type", "created_at"];
    const sortField = allowedSortFields.includes(sortBy as string) ? sortBy : "date";
    const sortOrder = (order as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM financial_records ${whereClause}`,
      params
    );
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    const result = await pool.query(
      `SELECT * FROM financial_records ${whereClause}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset]
    );

    res.status(200).json({
      records: result.rows,
      pagination: {
        page,
        limit,
        totalRecords,
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



export const getRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ error: "Invalid record ID format." });
      return;
    }

    const result = await pool.query(
      `SELECT * FROM financial_records WHERE id = $1 AND is_deleted = false`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Record not found." });
      return;
    }

    res.status(200).json({ record: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { amount, type, category, description, date } = req.body;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ error: "Invalid record ID format." });
      return;
    }

    const existing = await pool.query(
      `SELECT id FROM financial_records WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    if (existing.rowCount === 0) {
      res.status(404).json({ error: "Record not found." });
      return;
    }

    if (amount !== undefined && !isPositiveNumber(amount)) {
      res.status(400).json({ error: "Amount must be a positive number." });
      return;
    }
    if (type && !isValidRecordType(type)) {
      res.status(400).json({ error: "Type must be 'income' or 'expense'." });
      return;
    }
    if (date && !isValidDate(date)) {
      res.status(400).json({ error: "Invalid date format." });
      return;
    }
    if (category && (category.trim().length === 0 || category.length > 100)) {
      res.status(400).json({ error: "Category must be between 1 and 100 characters." });
      return;
    }

    const updates: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (amount !== undefined) {
      updates.push(`amount = $${paramIndex++}`);
      params.push(parseFloat(amount));
    }
    if (type) {
      updates.push(`type = $${paramIndex++}`);
      params.push(type.toLowerCase());
    }
    if (category) {
      updates.push(`category = $${paramIndex++}`);
      params.push(sanitizeString(category));
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(description ? sanitizeString(description) : null);
    }
    if (date) {
      updates.push(`date = $${paramIndex++}`);
      params.push(date);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: "No fields to update." });
      return;
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const result = await pool.query(
      `UPDATE financial_records SET ${updates.join(", ")} WHERE id = $${paramIndex} AND is_deleted = false RETURNING *`,
      params
    );

    res.status(200).json({ message: "Record updated successfully", record: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const deleteRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ error: "Invalid record ID format." });
      return;
    }

    const result = await pool.query(
      `UPDATE financial_records SET is_deleted = true, updated_at = NOW() WHERE id = $1 AND is_deleted = false RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Record not found." });
      return;
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
