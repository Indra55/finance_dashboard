import { pool } from "../config/dbConfig.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not set");

const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });
};


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields (name, email and password) are compulsory" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters long" });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [normalizedEmail]);
    if ((existingUser.rowCount ?? 0) > 0) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role`,
      [trimmedName, normalizedEmail, hashedPassword]
    );
    const user = result.rows[0];

    const { accessToken, refreshToken } = generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [hashedRefreshToken, user.id]);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({ message: "User registered successfully", user, token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      `SELECT id, name, email, role, status, password_hash FROM users WHERE email = $1`,
      [normalizedEmail]
    );
    if (result.rowCount === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = result.rows[0];

    if (user.status !== "active") {
      res.status(403).json({ error: "Account is inactive. Please contact support." });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await pool.query(
      `UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2`,
      [hashedRefreshToken, user.id]
    );

    setAuthCookies(res, accessToken, refreshToken);

    const { password_hash, refresh_token, ...safeUser } = user;
    res.status(200).json({ message: "Login successful", user: safeUser, token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.decode(token) as { id?: string } | null;
      if (decoded?.id) {
        await pool.query(
          `UPDATE users SET refresh_token = NULL, updated_at = NOW() WHERE id = $1`,
          [decoded.id]
        );
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(401).json({ error: "Refresh token not found." });
      return;
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    } catch {
      res.status(401).json({ error: "Invalid or expired refresh token." });
      return;
    }

    const result = await pool.query(
      `SELECT id, name, email, role, status, refresh_token FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (result.rowCount === 0) {
      res.status(401).json({ error: "User not found." });
      return;
    }

    const user = result.rows[0];

    if (user.status !== "active") {
      res.status(403).json({ error: "Account is inactive." });
      return;
    }

    if (!user.refresh_token) {
      res.status(401).json({ error: "Session invalidated. Please login again." });
      return;
    }

    const tokenMatch = await bcrypt.compare(token, user.refresh_token);
    if (!tokenMatch) {
      res.status(401).json({ error: "Invalid refresh token. Please login again." });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await pool.query(
      `UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2`,
      [hashedRefreshToken, user.id]
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
