import winston from "winston";
import morgan from "morgan";
import path from "path";
import { loggerConfig } from "../config";

// Define log levels with priorities
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;
export type LogLevel = keyof typeof levels;

// Define colors for console output
const colors: { [key in LogLevel]: string } = {
  error: "red",
  warn: "yellow",
  info: "white",
  http: "magenta",
  debug: "green",
};
winston.addColors(colors);

/**
 * Custom format to filter logs based on configuration
 */
const configFilter = winston.format((info) => {
  // Filter HTTP logs based on config
  if (info.level === "http" && !loggerConfig.enableHttpLogPrinting) {
    return false;
  }

  // Filter debug logs based on config
  if (info.level === "debug" && !loggerConfig.enableDebug) {
    return false;
  }

  return info;
});

/**
 * Filter to exclude HTTP logs for combined log file
 */
const excludeHttpFormat = winston.format((info) => {
  return info.level === "http" ? false : info;
});

/**
 * Filter to only include HTTP logs for http log file
 */
const onlyHttpFormat = winston.format((info) => {
  return info.level === "http" ? info : false;
});

const logger = winston.createLogger({
  level: loggerConfig.enableDebug ? "debug" : "http",
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console transport with conditional filters
    new winston.transports.Console({
      format: winston.format.combine(
        configFilter(),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
      ),
    }),
    // Error logs
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    // HTTP logs
    new winston.transports.File({
      filename: path.join("logs", "http.log"),
      format: winston.format.combine(
        onlyHttpFormat(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      ),
    }),
    // Combined logs (excluding HTTP)
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      format: winston.format.combine(
        excludeHttpFormat(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      ),
    }),
  ],
});

// Exported logging interface
export const log = {
  error: (message: string, meta?: unknown) => logger.error(message, meta),
  warn: (message: string, meta?: unknown) => logger.warn(message, meta),
  info: (message: string, meta?: unknown) => logger.info(message, meta),
  http: (message: string, meta?: unknown) => logger.http(message, meta),
  debug: (message: string, meta?: unknown) => logger.debug(message, meta),
} as const;

/**
 * Morgan middleware for logging HTTP requests
 */
export const httpRequestLogger = morgan("combined", {
  stream: { write: (message: string) => log.http(message.trim()) },
});
