import { Playlist, Song } from "@prisma/client";
import {
  FullAudioFeatureObject,
  SpotifyPlaylistObject,
  TrackFeatures,
} from "../types/spotify-types";
import { TrackInfo } from "../types/TrackInfo";
import { PlaylistData } from "../types/PlaylistData";
import { Decimal } from "@prisma/client/runtime/library";
import { SongObject } from "../types/SongObject";

/**
 * Gets the Track Infos for a Spotify playlist object.
 *
 * @param playlist a Spotify playlist object
 * @returns the track infos for the given playlist
 */
export const trackInfosFromPlaylistObject = (
  playlist: SpotifyPlaylistObject
): TrackInfo[] => {
  return playlist.tracks.items.map((playlistTrackObject) => ({
    id: playlistTrackObject.track.id,
    name: playlistTrackObject.track.name,
    artists: playlistTrackObject.track.artists
      .map((artist) => artist.name)
      .join(", "),
  }));
};

/**
 * Merges a map of TrackInfo and its corresponding TrackFeatures.
 *
 * @param trackInfoMap a map of TrackInfos
 * @param audioFeatures a list of audio features for tracks
 * @returns a list of FullAudioFeatureObject
 */
export const mergeTrackInfoAndFeatures = (
  trackInfoMap: Map<string, TrackInfo>,
  audioFeatures: TrackFeatures[]
): FullAudioFeatureObject[] => {
  const fullAudioFeatureObjects: FullAudioFeatureObject[] = [];
  // Combine the audio features with the TrackInfo - name and artists
  audioFeatures.forEach((af) => {
    const info = trackInfoMap.get(af.id);
    if (info)
      fullAudioFeatureObjects.push({
        ...af,
        name: info.name,
        artists: info.artists,
      });
  });

  return fullAudioFeatureObjects;
};

export type PlaylistWithSongs = Playlist & {
  songs: Song[] | null;
};

/**
 * Transforms a prisma Playlist into a PlaylistData.
 *
 * @param prismaPlaylist a prisma Playlist
 * @returns a PlaylistData
 */
export const playlistTransformer = (
  prismaPlaylist: PlaylistWithSongs
): PlaylistData => {
  return {
    playlistName: prismaPlaylist.playlistName,
    playlistUrl: prismaPlaylist.playlistUrl,
    playlistImageUrl: prismaPlaylist.playlistImageUrl,
    playlistOwnerName: prismaPlaylist.playlistOwnerName,
    playlistOwnerUrl: prismaPlaylist.playlistOwnerUrl,
    songs: prismaPlaylist.songs?.map((s) => songTransformer(s)) ?? [],
  };
};

/**
 * Transforms a prisma Song into a SongObject.
 *
 * @param song a prisma Song
 * @returns a SongObject
 */
export const songTransformer = (song: Song): SongObject => {
  return {
    vector: decimalTransformer(song.vector),
    songName: song.songName,
    artistName: song.artistName,
  };
};

/**
 * Transforms a prisma vector into a 3d vector.
 *
 * @param vector a prisma Decimal[], representing a 3d vector
 * @returns an array of 3 numbers
 */
export const decimalTransformer = (
  vector: Decimal[]
): [number, number, number] => {
  return [vector[0].toNumber(), vector[1].toNumber(), vector[2].toNumber()];
};
