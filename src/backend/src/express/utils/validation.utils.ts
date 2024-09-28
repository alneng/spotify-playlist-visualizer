import { ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export function isValidPlaylistId(validationObject: ValidationChain) {
  return validationObject.isString().notEmpty().isLength({ min: 22, max: 22 });
}
