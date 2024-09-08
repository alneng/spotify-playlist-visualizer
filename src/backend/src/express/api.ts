import express from "express";
import playlistRouter from "./routes/playlists.routes";

const router = express.Router();

router.use("/playlists", playlistRouter);

export default router;
