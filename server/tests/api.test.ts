import { describe, it, expect, afterAll } from "bun:test";
import request from "supertest";
import app from "../index.ts";
import { pool } from "../config/dbConfig.ts";

describe("API Integration Tests", () => {
  afterAll(async () => {
    await pool.end();
    process.exit(0);
  });

  describe("System Routes", () => {
    it("should return 200 OK from the health check endpoint", async () => {
      const response = await request(app).get("/api/health");
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.timestamp).toBeDefined();
    });

    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/this-route-does-not-exist");
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Route not found.");
    });
  });

  describe("Authentication API", () => {
    it("should reject login attempt lacking credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({});
      
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should reject login attempt with incorrect credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "invaliduser999@example.com", password: "wrongpassword123" });
      
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("Protected API Routes", () => {
    it("should block unauthenticated access to fetch records", async () => {
      const response = await request(app).get("/api/records");
      
      expect(response.status).toBe(401);
    });
    
    it("should block unauthenticated access to dashboard analytics", async () => {
      const response = await request(app).get("/api/dashboard/summary");
      
      expect(response.status).toBe(401);
    });
  });
});
