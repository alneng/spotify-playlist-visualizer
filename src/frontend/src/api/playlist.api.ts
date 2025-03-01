import api from "./axios";
import PlaylistData from "../types/PlaylistData";

export const fetchPlaylistData = async (playlistId: string) => {
  const response = await api.get<PlaylistData>(`/playlists/${playlistId}/data`);
  return response.data;
};
