import { SongObject } from "./SongObject";

export interface PlaylistData {
  playlistName: string;
  playlistUrl: string;
  playlistImageUrl: string;
  playlistOwnerName: string;
  playlistOwnerUrl: string;
  songs: SongObject[];
}
