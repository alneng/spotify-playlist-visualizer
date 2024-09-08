import { ValidationChain } from "express-validator";

export function isValidPlaylistId(validationObject: ValidationChain) {
  return validationObject.isString().notEmpty().isLength({ min: 22, max: 22 });
}
