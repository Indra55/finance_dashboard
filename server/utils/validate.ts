
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidUUID = (value: string): boolean => UUID_REGEX.test(value);

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value);

export const isPositiveNumber = (value: unknown): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const isValidDate = (value: string): boolean => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const isValidRecordType = (value: string): boolean => {
  return ["income", "expense"].includes(value.toLowerCase());
};

export const isValidRole = (value: string): boolean => {
  return ["admin", "analyst", "viewer"].includes(value.toLowerCase());
};

export const isValidStatus = (value: string): boolean => {
  return ["active", "inactive"].includes(value.toLowerCase());
};

export const sanitizeString = (value: string): string => {
  return value.trim();
};

export const parsePaginationParams = (query: Record<string, unknown>) => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};
