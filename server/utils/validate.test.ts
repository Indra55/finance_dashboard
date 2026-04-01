import { describe, it, expect } from "bun:test";
import { 
  isValidUUID, 
  isValidEmail, 
  isPositiveNumber, 
  isValidDate, 
  isValidRecordType, 
  isValidRole, 
  isValidStatus, 
  parsePaginationParams 
} from "./validate.ts";

describe("Validation Utility Functions", () => {
  it("should validate UUIDs correctly", () => {
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isValidUUID("invalid-uuid-string")).toBe(false);
  });

  it("should validate emails correctly", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("invalid-email.com")).toBe(false);
    expect(isValidEmail("test@.com")).toBe(false);
  });

  it("should validate positive numbers", () => {
    expect(isPositiveNumber(10)).toBe(true);
    expect(isPositiveNumber("20.5")).toBe(true); 
    expect(isPositiveNumber(-5)).toBe(false);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber("abc")).toBe(false);
  });

  it("should validate dates correctly", () => {
    expect(isValidDate("2023-10-01")).toBe(true);
    expect(isValidDate("2023-10-01T12:00:00Z")).toBe(true);
    expect(isValidDate("not-a-date")).toBe(false);
  });

  it("should validate record types", () => {
    expect(isValidRecordType("income")).toBe(true);
    expect(isValidRecordType("expense")).toBe(true);
    expect(isValidRecordType("INCOME")).toBe(true); 
    expect(isValidRecordType("savings")).toBe(false);
  });

  it("should validate roles", () => {
    expect(isValidRole("admin")).toBe(true);
    expect(isValidRole("analyst")).toBe(true);
    expect(isValidRole("viewer")).toBe(true);
    expect(isValidRole("user")).toBe(false);
  });

  it("should validate statuses", () => {
    expect(isValidStatus("active")).toBe(true);
    expect(isValidStatus("inactive")).toBe(true);
    expect(isValidStatus("pending")).toBe(false);
  });

  it("should parse pagination params correctly", () => {
    expect(parsePaginationParams({ page: "2", limit: "10" })).toEqual({ page: 2, limit: 10, offset: 10 });
    
    expect(parsePaginationParams({})).toEqual({ page: 1, limit: 20, offset: 0 });
    
    expect(parsePaginationParams({ page: "-1", limit: "500" })).toEqual({ page: 1, limit: 100, offset: 0 });
    
    expect(parsePaginationParams({ page: "abc", limit: "xyz" })).toEqual({ page: 1, limit: 20, offset: 0 });
  });
});
