import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import VectorScene from "./VectorScene";
import BannerObject from "./BannerObject";
import PlaylistData from "../types/PlaylistData";

const PlaylistVisualizer: React.FC<{ data: PlaylistData }> = ({ data }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [query, setQuery] = useState("");

  return (
    <>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 40 }}
        className="block bg-black"
      >
        <VectorScene data={data.songs} query={query} />
        <OrbitControls ref={controlsRef} enableZoom={true} />
      </Canvas>

      <BannerObject
        className="fixed top-[11.5rem] left-2 p-4 max-w-[27rem]"
        imgSrc={data.playlistImageUrl}
        imgAlt={`${data.playlistName} Playlist Cover Image`}
      >
        <div className="font-bold">{data.playlistName}</div>
        <div>
          <a
            className="hover:underline"
            href={data.playlistOwnerUrl}
            target="_blank"
          >
            {data.playlistOwnerName}
          </a>
        </div>
        <div className="mt-1">
          View on{" "}
          <a
            className="text-primary hover:underline"
            href={data.playlistUrl}
            target="_blank"
          >
            Spotify
          </a>
        </div>
      </BannerObject>

      <div className="fixed top-2 right-2 w-96">
        {query && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute top-2 right-2 text-gray-500 cursor-pointer"
            onClick={() => setQuery("")}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
        <input
          type="text"
          className="w-full bg-gray-700 text-white p-2 rounded mb-2"
          placeholder="Search a Song or Artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="fixed bottom-2 right-2">
        <button
          className="bg-[#20D45C] text-black font-bold py-2 px-4 rounded border-gray-800 border-[1px] hover:border-white transition duration-300"
          onClick={() => {
            controlsRef.current?.reset();
          }}
        >
          Reset Camera Position
        </button>
      </div>
    </>
  );
};

export default PlaylistVisualizer;
