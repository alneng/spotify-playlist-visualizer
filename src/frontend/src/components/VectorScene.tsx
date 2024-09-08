import { useMemo } from "react";
import { Vector3 } from "three";
import SongVector from "../components/SongVector";
import SongObject from "../types/SongObject";
import { includesCaseInsensitive } from "../utils/utils";

const VectorScene: React.FC<{ data: SongObject[]; query: string }> = ({
  data,
  query,
}) => {
  const songObjects = useMemo(() => {
    const queryObserved =
      query !== "" &&
      data.filter(
        (song) =>
          includesCaseInsensitive(song.artistName, query) ||
          includesCaseInsensitive(song.songName, query)
      ).length > 0;

    return data.map((song, index) => (
      <SongVector
        key={index}
        vector={new Vector3(...song.vector)}
        songName={song.songName}
        artistName={song.artistName}
        query={query}
        queryObserved={queryObserved}
      />
    ));
  }, [data, query]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {songObjects}
    </>
  );
};

export default VectorScene;
