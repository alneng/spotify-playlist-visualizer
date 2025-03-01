import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRouter from "./api";
import { errorHandler } from "./utils/errors.utils";
import { CORS_OPTIONS, EXPRESS_PORT } from "./config";
import { log } from "./utils/logger.utils";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors(JSON.parse(CORS_OPTIONS)));

// Routes
app.use("/api", apiRouter);

// Error handler
app.use(errorHandler);

app.listen(EXPRESS_PORT, "0.0.0.0", () => {
  log.info(`Express API running at http://localhost:${EXPRESS_PORT}`);
});
