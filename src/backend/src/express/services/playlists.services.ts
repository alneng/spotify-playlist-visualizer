import {
  fetchAccessToken,
  fetchSpotifyPlaylistObject,
  fetchTracksAudioFeatures,
} from "../utils/spotify.utils";
import {
  mergeTrackInfoAndFeatures,
  PlaylistWithSongs,
  trackInfosFromPlaylistObject,
} from "../transformers/spotify.transformers";
import prisma from "../utils/prisma";
import { Song } from "@prisma/client";
import {
  SeveralTrackFeaturesResponse,
  TrackFeatures,
} from "../types/spotify-types";
import { TrackInfo } from "../types/TrackInfo";
import { SongObject } from "../types/SongObject";
import {
  HttpException,
  PlaylistFetchException,
  PlaylistVectorGenerationException,
} from "../utils/errors.utils";
import axios from "axios";
import { FLASK_HOST, FLASK_PORT } from "../config";
import { log } from "../utils/logger.utils";

const file = "playlists.services.ts";

export default class PlaylistService {
  /**
   * Gets the audio features of all tracks in a playlist.
   *
   * @param playlistId the playlistId of the playlist to get the features for
   * @returns the features of all tracks in the given playlist, as a JSON string
   * @throws PlaylistFetchException if the playlist cannot be fetched (e.g. playlist is private)
   */
  public static async getPlaylistFeatures(playlistId: string): Promise<string> {
    const logMeta = { file, method: PlaylistService.getPlaylistFeatures.name };
    log.debug(`Fetching playlist features for playlist ${playlistId}`, logMeta);

    try {
      const token = await fetchAccessToken();
      const playlist = await fetchSpotifyPlaylistObject(playlistId, token);
      const trackInfos = trackInfosFromPlaylistObject(playlist);
      // Create a map for each Track in the playlist
      const trackMap: Map<string, TrackInfo> = new Map();
      trackInfos.forEach((trackInfo: TrackInfo) =>
        trackMap.set(trackInfo.id, trackInfo)
      );

      // Split the tracks into chunks of 100 to be processed
      const chunkSize = 100;
      const chunks: TrackInfo[][] = [];
      for (let i = 0; i < trackInfos.length; i += chunkSize) {
        const chunk = trackInfos.slice(i, i + chunkSize);
        chunks.push(chunk);
      }

      // Get audio features of all of the tracks in each chunk
      const results = chunks.map((chunk) =>
        fetchTracksAudioFeatures(
          chunk.map((trackInfo) => trackInfo.id),
          token
        )
      );
      const featuresChunks: SeveralTrackFeaturesResponse[] = await Promise.all(
        results
      );
      const audioFeaturesChunks: TrackFeatures[][] = featuresChunks.map(
        (fc) => fc.audio_features
      );
      // Combine all the audio features into one 1d array
      const allAudioFeatures: TrackFeatures[] = audioFeaturesChunks.flat();

      log.debug(
        `Fetched ${allAudioFeatures.length} audio features for playlist ${playlistId}`,
        logMeta
      );
      return JSON.stringify(
        mergeTrackInfoAndFeatures(trackMap, allAudioFeatures)
      );
    } catch (error) {
      log.debug(
        `Failed to fetch playlist features for playlist ${playlistId}`,
        { ...logMeta, error }
      );
      throw error;
    }
  }

  /**
   * Returns the Songs for the playlist, and saves them to the Playlist.
   *
   * @param playlistId the playlistId of the playlist to get the songs info for
   * @returns the Songs for the playlist
   * @throws PlaylistFetchException if the playlist cannot be fetched (e.g. playlist is private)
   * @throws PlaylistVectorGenerationException if vectors cannot be generated for the playlist by the Flask API
   */
  public static async getPlaylistVectors(playlistId: string): Promise<Song[]> {
    const logMeta = { file, method: PlaylistService.getPlaylistVectors.name };
    log.debug(`Generating vectors for playlist ${playlistId}`, logMeta);

    const playlistFeatures: string = await this.getPlaylistFeatures(playlistId);

    try {
      log.debug(`Sending playlist features to Flask API`, {
        ...logMeta,
        playlistFeatures,
      });
      const response = await axios.post<SongObject[]>(
        `http://${FLASK_HOST}:${FLASK_PORT}/api/generateVectors`,
        { playlistFeatures },
        { headers: { "Content-Type": "application/json" } }
      );

      const { data: songs } = response;
      const newSongsRecords = songs.map((s: SongObject) => {
        return { ...s, playlistId };
      });

      // Delete the old stored songs, and add the new ones
      await prisma.song.deleteMany({ where: { playlistId } });
      const createdSongs = await prisma.song.createManyAndReturn({
        data: newSongsRecords,
      });
      return createdSongs;
    } catch (error) {
      log.debug(`Failed to generate vectors for playlist ${playlistId}`, {
        ...logMeta,
        playlistFeatures,
        error,
      });
      if (axios.isAxiosError(error)) {
        throw new PlaylistVectorGenerationException(
          500,
          "There was an exception when generating vectors for the playlist"
        );
      } else {
        throw new HttpException(
          500,
          "Failed to create songs from processed song data"
        );
      }
    }
  }

  /**
   * Gets the data of a Playlist.
   *
   * @param playlistId the playlistId of the playlist to get the data for
   * @returns the data for the playlist
   * @throws PlaylistFetchException if the playlist cannot be fetched (e.g. playlist is private)
   * @throws PlaylistVectorGenerationException if vectors cannot be generated for the playlist by the Flask API
   */
  public static async getPlaylistData(
    playlistId: string
  ): Promise<PlaylistWithSongs> {
    const logMeta = { file, method: PlaylistService.getPlaylistData.name };
    log.debug(`Fetching playlist data for playlist ${playlistId}`, logMeta);

    const spotifyPlaylist = await fetchSpotifyPlaylistObject(playlistId);

    if (spotifyPlaylist.id !== playlistId)
      throw new HttpException(
        400,
        "The returned playlist differed from the supplied playlist"
      );

    // NOTE: If the playlist image URL expires, it may need to be replaced without updating
    // the whole playlist.
    const playlist = await prisma.playlist.findUnique({
      where: { playlistId },
      include: { songs: true },
    });
    if (playlist && playlist.snapshotId === spotifyPlaylist.snapshot_id)
      return playlist;

    try {
      if (playlist)
        await prisma.playlist.update({
          where: { playlistId },
          data: {
            snapshotId: spotifyPlaylist.snapshot_id,
            updatedAt: new Date(),
          },
        });
      else
        await prisma.playlist.create({
          data: {
            playlistId,
            snapshotId: spotifyPlaylist.snapshot_id,
            playlistName: spotifyPlaylist.name,
            playlistUrl: spotifyPlaylist.external_urls.spotify,
            playlistImageUrl: spotifyPlaylist.images[0].url,
            playlistOwnerName: spotifyPlaylist.owner.display_name,
            playlistOwnerUrl: spotifyPlaylist.owner.external_urls.spotify,
          },
        });

      try {
        // Generate new vectors and save them to the Playlist
        await this.getPlaylistVectors(playlistId);
      } catch (error: unknown) {
        if (!playlist && error instanceof PlaylistVectorGenerationException) {
          // Delete the new empty playlist to prevent it from being cached with nothing
          await prisma.playlist.delete({ where: { playlistId } });
        } else if (
          playlist &&
          error instanceof PlaylistVectorGenerationException
        ) {
          // Revert the snapshot id because the vectors were not updated
          await prisma.playlist.update({
            where: { playlistId },
            data: { snapshotId: playlist.snapshotId },
          });
        }
        throw error; // Pass the error to the next handler
      }

      const updatedPlaylist = await prisma.playlist.findUniqueOrThrow({
        where: { playlistId },
        include: { songs: true },
      });
      return updatedPlaylist;
    } catch (error: unknown) {
      if (error instanceof PlaylistFetchException) throw error;
      if (error instanceof PlaylistVectorGenerationException) throw error;

      throw new HttpException(
        400,
        "Failed to generate the vectors for the songs"
      );
    }
  }
}
