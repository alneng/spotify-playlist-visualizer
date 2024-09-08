import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

/**
 * Custom Error type that has a status code and a message.
 * Extends default Error class
 *
 * @property status status code of the error
 * @property message error message
 */
export class HttpException extends Error {
  public status: number;

  /**
   * Constructs an error with a status and message.
   * @param status the status code of the error
   * @param message the message to send with the error
   */
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Error handling middleware. Takes the error and sends back the status of it and the message
 */
export const errorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpException) {
    let additionalErrorInfo = {};

    res
      .status(error.status)
      .json({ ...additionalErrorInfo, message: error.message });
  } else {
    res.status(500).json({ message: JSON.stringify(error) });
    throw error;
  }
};
