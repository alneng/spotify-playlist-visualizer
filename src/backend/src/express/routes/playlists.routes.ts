import express from "express";
import { param } from "express-validator";
import { validateInputs } from "../utils/utils";
import { isValidPlaylistId } from "../utils/validation.utils";
import PlaylistController from "../controllers/playlists.controllers";

const router = express.Router();

router.get(
  "/:playlistId/vectors",
  isValidPlaylistId(param("playlistId")),
  validateInputs,
  PlaylistController.getPlaylistVectors
);

router.get(
  "/:playlistId/data",
  isValidPlaylistId(param("playlistId")),
  validateInputs,
  PlaylistController.getPlaylistData
);

export default router;
