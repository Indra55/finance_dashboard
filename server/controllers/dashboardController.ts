import { pool } from "../config/dbConfig.ts";
import type { Request, Response } from "express";


export const getSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)  AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net_balance,
        COUNT(*)::int AS total_records
      FROM financial_records
      WHERE is_deleted = false
    `);

    const summary = result.rows[0];
    res.status(200).json({
      summary: {
        totalIncome: parseFloat(summary.total_income),
        totalExpenses: parseFloat(summary.total_expenses),
        netBalance: parseFloat(summary.net_balance),
        totalRecords: summary.total_records,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getCategoryTotals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const conditions = ["is_deleted = false"];
    const params: unknown[] = [];

    if (type) {
      const t = (type as string).toLowerCase();
      if (!["income", "expense"].includes(t)) {
        res.status(400).json({ error: "Type must be 'income' or 'expense'." });
        return;
      }
      conditions.push(`type = $1`);
      params.push(t);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const result = await pool.query(
      `SELECT category, type,
              SUM(amount)::float AS total,
              COUNT(*)::int AS count
       FROM financial_records
       ${whereClause}
       GROUP BY category, type
       ORDER BY total DESC`,
      params
    );

    res.status(200).json({ categoryTotals: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getTrends = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)::float  AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::float AS expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0)::float AS net
      FROM financial_records
      WHERE is_deleted = false
        AND date >= (CURRENT_DATE - INTERVAL '12 months')
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `);

    res.status(200).json({ trends: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getRecentActivity = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT fr.*, u.name AS user_name
      FROM financial_records fr
      JOIN users u ON fr.user_id = u.id
      WHERE fr.is_deleted = false
      ORDER BY fr.created_at DESC
      LIMIT 10
    `);

    res.status(200).json({ recentActivity: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
