import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRouter from "./api";
import { errorHandler } from "./utils/errors.utils";

const app = express();
const PORT = process.env.EXPRESS_PORT ? Number(process.env.EXPRESS_PORT) : 9988;
const CORS_OPTIONS =
  process.env.CORS_OPTIONS ??
  JSON.stringify({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
    methods: "GET,POST,OPTIONS",
  });

app.use(bodyParser.json());

app.use(cors(JSON.parse(CORS_OPTIONS)));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express API running at http://localhost:${PORT}`);
});
