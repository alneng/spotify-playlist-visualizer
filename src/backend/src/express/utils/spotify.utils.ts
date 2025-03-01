import axios from "axios";
import qs from "qs";
import {
  SpotifyPlaylistObject,
  PlaylistTrackObject,
  SeveralTrackFeaturesResponse,
} from "../types/spotify-types";
import { HttpException, PlaylistFetchException } from "./errors.utils";
import prisma from "./prisma";

/**
 * Produces a Spotify access token.
 *
 * @returns a Spotify access token
 */
export async function fetchAccessToken(): Promise<string> {
  const token = await prisma.access_Token.findFirst({
    where: { expiresAt: { gt: new Date() } },
  });
  if (token) return token.value;

  const data = {
    grant_type: "client_credentials",
  };
  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_CLIENT_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(data),
    url: "https://accounts.spotify.com/api/token",
  };

  try {
    const response = await axios(options);
    const responseBody = response.data;

    const createToken = await prisma.access_Token.create({
      data: {
        value: responseBody.access_token,
        tokenType: responseBody.token_type,
        expiresAt: new Date(
          new Date().getTime() + responseBody.expires_in * 1000
        ),
      },
    });

    return createToken.value;
  } catch {
    throw new HttpException(500, "Server failed to fetch from Spotify");
  }
}

/**
 * Fetches a Spotify playlist from the Spotify Web API.
 *
 * @param playlistId the id of the playlist
 * @param tkn a Spotify access token
 * @returns the data of the Spotify playlist
 * @throws PlaylistFetchException if the playlist cannot be fetched (e.g. playlist is private)
 */
export async function fetchSpotifyPlaylistObject(
  playlistId: string,
  tkn?: string
): Promise<SpotifyPlaylistObject> {
  const token = tkn ?? (await fetchAccessToken());

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.tracks.next) {
      data.tracks.items = data.tracks.items.concat(
        await fetchTracks(data.tracks.next, token)
      );
    }
    return data;
  } catch {
    throw new PlaylistFetchException(
      400,
      "Failed to fetch playlist from Spotify"
    );
  }
}

/**
 * Fetches some of the songs in a Spotify playlist.
 *
 * @param nextUrl the url of the next block of Spotify songs
 * @param token a Spotify access token
 * @returns the songs in and after the given Spotify block
 */
async function fetchTracks(
  nextUrl: string,
  token: string
): Promise<PlaylistTrackObject[]> {
  try {
    const response = await axios({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      url: nextUrl,
    });
    let items = response.data.items;
    if (response.data.next) {
      items = items.concat(await fetchTracks(response.data.next, token));
    }
    return items;
  } catch (error) {
    return [];
  }
}

/**
 * Fetches the audio features of a list of tracks.
 *
 * @param trackIds the track ids to get the features of (max 100)
 * @param token a Spotify access token
 * @returns the audio features of the tracks
 */
export async function fetchTracksAudioFeatures(
  trackIds: string[],
  token: string
): Promise<SeveralTrackFeaturesResponse> {
  const response = await axios({
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    url: `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
  });

  return response.data;
}
