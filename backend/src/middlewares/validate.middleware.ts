import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Generic Zod validation middleware factory.
 * Validates req.body against the given schema.
 * Returns 400 with structured errors on failure.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    req.body = result.data;
    next();
  };
};

/**
 * Validates req.query against the given schema.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    (req as any).validatedQuery = result.data;
    next();
  };
};
