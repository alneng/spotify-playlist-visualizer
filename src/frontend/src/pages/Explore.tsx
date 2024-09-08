import React, { useState } from "react";
import PlaylistVisualizer from "../components/PlaylistVisualizer";
import StatusMessage from "../components/StatusMessage";
import Spinner from "../components/Spinner";
import PlaylistData from "../types/PlaylistData";
import ButtonWithArrow from "../components/ButtonWithArrow";
import BackgroundGradient from "../components/BackgroundGradient";

const API_URL: string =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:9988";

const Explore: React.FC = () => {
  const [urlInput, setUrlInput] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [playlistData, setPlaylistData] = useState<PlaylistData>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaylistQuery = async () => {
    try {
      setError("");
      const parsedInput = urlInput.split("/")[4].split("?")[0];

      if (parsedInput.length === 22 && parsedInput !== playlistId) {
        setIsLoading(true);
        setPlaylistId(parsedInput);

        const response = await fetch(
          `${API_URL}/api/playlists/${parsedInput}/data`,
          { method: "GET" }
        );

        if (!response.ok)
          setError("Failed to fetch Spotify URL. Is the playlist public?");
        else {
          const data = (await response.json()) as PlaylistData;
          setPlaylistData(data);
        }

        setIsLoading(false);
      }
    } catch {
      setError("Failed to parse Spotify URL");
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
        {error !== "" ? (
          <StatusMessage className="bg-black">
            <div className="text-xl">
              <p className="inline">Encountered the following error: </p>
              <p className="inline font-bold">{error}</p>
            </div>
          </StatusMessage>
        ) : isLoading ? (
          <>
            <BackgroundGradient transition={isLoading} />
            <StatusMessage className="bg-black">
              <div className="z-10 text-xl">Fetching Playlist...</div>
              <Spinner className="ml-2" />
            </StatusMessage>
          </>
        ) : playlistData ? (
          <PlaylistVisualizer data={playlistData} />
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
