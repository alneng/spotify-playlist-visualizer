import SongObject from "./SongObject";

export default interface PlaylistData {
  playlistName: string;
  playlistUrl: string;
  playlistImageUrl: string;
  playlistOwnerName: string;
  playlistOwnerUrl: string;
  songs: SongObject[];
}
