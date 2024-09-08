import React from "react";
import { Html } from "@react-three/drei";
import { Vector3, Color } from "three";
import { includesCaseInsensitive } from "../utils/utils";

const ARROW_COLOR = "#292929";
const LABEL_COLOR = "text-white";
const MATCH_COLOR = "#20D45C";
const MATCH_SECONDARY_COLOR = "text-mid-gray";

const SongVector: React.FC<{
  vector: Vector3;
  songName: string;
  artistName: string;
  query: string;
  queryObserved: boolean;
}> = ({ vector, songName, artistName, query, queryObserved }) => {
  const origin = new Vector3(0, 0, 0);
  const isMatch =
    query &&
    (includesCaseInsensitive(songName, query) ||
      includesCaseInsensitive(artistName, query));
  const color = isMatch ? new Color(MATCH_COLOR) : new Color(ARROW_COLOR);

  return (
    <>
      {/* Line from origin to the song position */}
      <arrowHelper
        args={[vector.clone().normalize(), origin, 2, color, 0.05, 0.02]}
      />

      {/* Song vector label */}
      <mesh position={vector.clone().normalize().multiplyScalar(2.05)}>
        <Html center zIndexRange={[0, 1]}>
          <div
            className={`text-center select-none ${
              isMatch
                ? `text-primary z-10`
                : queryObserved
                ? `${MATCH_SECONDARY_COLOR} z-0`
                : `${LABEL_COLOR} z-0`
            }`}
          >
            <strong>{songName}</strong>
            <br />
            <small>{artistName}</small>
          </div>
        </Html>
      </mesh>
    </>
  );
};

export default SongVector;
