import React, { useState } from "react";
import PlaylistVisualizer from "../components/PlaylistVisualizer";
import StatusMessage from "../components/StatusMessage";
import Spinner from "../components/Spinner";
import ButtonWithArrow from "../components/ButtonWithArrow";
import BackgroundGradient from "../components/BackgroundGradient";
import { useFetchPlaylistData } from "../hooks/playlist.hooks";

const Explore: React.FC = () => {
  const { mutateAsync, data, isPending, error } = useFetchPlaylistData();

  const [urlInput, setUrlInput] = useState("");
  const [playlistId, setPlaylistId] = useState("");

  const handlePlaylistQuery = async () => {
    const parsedPlaylistId = urlInput.split("/")[4].split("?")[0];
    if (parsedPlaylistId.length === 22 && parsedPlaylistId !== playlistId) {
      setPlaylistId(parsedPlaylistId);
      await mutateAsync(parsedPlaylistId);
    }
  };

  return (
    <div className="h-screen">
      <div className="absolute z-10 top-2 left-2 w-96 p-4 bg-gray-800 text-white rounded">
        <h2 className="text-xl font-bold mb-4">
          <a className="hover:underline" href="/">
            Spotify Playlist Visualizer
          </a>
        </h2>
        <input
          type="text"
          className="w-full bg-gray-700 text-white p-2 rounded mb-2"
          placeholder="Playlist URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <div className="flex items-center">
          <ButtonWithArrow className="w-[112px]" onClick={handlePlaylistQuery}>
            Explore
          </ButtonWithArrow>
        </div>
      </div>

      <div className="h-full">
        {error && error.response ? (
          <StatusMessage className="bg-black">
            <div className="text-xl">
              <p className="inline">Encountered the following error: </p>
              <p className="inline font-bold">{error.response.data.message}</p>
            </div>
          </StatusMessage>
        ) : isPending ? (
          <>
            <BackgroundGradient transition={isPending} />
            <StatusMessage className="bg-black">
              <div className="z-10 text-xl">Fetching Playlist...</div>
              <Spinner className="ml-2" />
            </StatusMessage>
          </>
        ) : data ? (
          <PlaylistVisualizer data={data} />
        ) : (
          <>
            <BackgroundGradient />
            <StatusMessage className="bg-black">
              <div className="z-10 text-xl font-bold">
                Enter a Spotify playlist URL to get started!
              </div>
            </StatusMessage>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
