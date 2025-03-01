import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPlaylistData } from "../api/playlist.api";
import PlaylistData from "../types/PlaylistData";
import { AxiosApiError } from "../api/axios";

export const useFetchPlaylistData = () => {
  const queryClient = useQueryClient();

  return useMutation<PlaylistData, AxiosApiError, string>({
    mutationFn: fetchPlaylistData,
    onSuccess: (data, playlistId) => {
      queryClient.setQueryData(["playlists", playlistId], data);
    },
  });
};
