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
import { HttpException } from "../utils/errors.utils";

const FLASK_HOST =
  process.env.NODE_ENV === "production" ? "spv_flask" : "127.0.0.1";
const FLASK_PORT = process.env.FLASK_PORT || 9989;

export default class PlaylistService {
  /**
   * Gets the audio features of all tracks in a playlist.
   *
   * @param playlistId the playlistId of the playlist to get the features for
   * @returns the features of all tracks in the given playlist, as a JSON string
   */
  public static async getPlaylistFeatures(playlistId: string): Promise<string> {
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

    return JSON.stringify(
      mergeTrackInfoAndFeatures(trackMap, allAudioFeatures)
    );
  }

  /**
   * Returns the Songs for the playlist, and saves them to the Playlist.
   *
   * @param playlistId the playlistId of the playlist to get the songs info for
   * @returns the Songs for the playlist
   */
  public static async getPlaylistVectors(playlistId: string): Promise<Song[]> {
    const playlistFeatures: string = await this.getPlaylistFeatures(playlistId);

    const response = await fetch(
      `http://${FLASK_HOST}:${FLASK_PORT}/api/generateVectors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: playlistFeatures,
      }
    );

    if (!response.ok)
      throw new HttpException(
        response.status,
        "There was an exception when generating vectors for the playlist"
      );

    try {
      const songs = (await response.json()) as SongObject[];
      const newSongsRecords = songs.map((s: SongObject) => {
        return { ...s, playlistId };
      });

      // Delete the old stored songs, and add the new ones
      await prisma.song.deleteMany({ where: { playlistId } });
      const createdSongs = await prisma.song.createManyAndReturn({
        data: newSongsRecords,
      });
      return createdSongs;
    } catch {
      throw new HttpException(500, "Failed retrieving processed song data");
    }
  }

  /**
   * Gets the data of a Playlist.
   *
   * @param playlistId the playlistId of the playlist to get the data for
   * @returns the data for the playlist
   */
  public static async getPlaylistData(
    playlistId: string
  ): Promise<PlaylistWithSongs> {
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

      // Generate new vectors and save them to the Playlist
      await this.getPlaylistVectors(playlistId);

      const updatedPlaylist = await prisma.playlist.findUniqueOrThrow({
        where: { playlistId },
        include: { songs: true },
      });
      return updatedPlaylist;
    } catch {
      throw new HttpException(
        400,
        "Failed to generate the vectors for the songs"
      );
    }
  }
}
