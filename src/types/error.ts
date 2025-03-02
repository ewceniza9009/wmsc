/**
 * Custom error type for better type safety throughout the application
 */
export interface AppError extends Error {
  message: string;
  name: string;
  stack?: string;
  code?: string | number;
  status?: number;
}