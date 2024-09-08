import { Request, Response, NextFunction } from "express";
import PlaylistService from "../services/playlists.services";
import { Song } from "@prisma/client";
import {
  playlistTransformer,
  PlaylistWithSongs,
  songTransformer,
} from "../transformers/spotify.transformers";

export default class PlaylistController {
  static async getPlaylistVectors(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const playlistId = req.params.playlistId;

      const playlistVectors: Song[] = await PlaylistService.getPlaylistVectors(
        playlistId
      );
      return res
        .status(200)
        .json(playlistVectors.map((v) => songTransformer(v)));
    } catch (error) {
      next(error);
    }
  }

  static async getPlaylistData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const playlistId = req.params.playlistId;

      const playlistData: PlaylistWithSongs =
        await PlaylistService.getPlaylistData(playlistId);
      return res.status(200).json(playlistTransformer(playlistData));
    } catch (error) {
      next(error);
    }
  }
}
