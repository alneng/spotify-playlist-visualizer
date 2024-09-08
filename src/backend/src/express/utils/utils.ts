import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FullAudioFeatureObject } from "../types/spotify-types";

/**
 * Converts an array of objects to a CSV formatted string.
 *
 * @param array an array of identical objects
 * @returns the CSV format of the objects
 */
export const convertToCSV = (array: FullAudioFeatureObject[]) => {
  const headers = Object.keys(array[0]).join(",") + "\n";

  const rows = array
    .map((obj) =>
      Object.values(obj)
        .map((value) =>
          typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
        )
        .join(",")
    )
    .join("\n");

  return headers + rows;
};

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
