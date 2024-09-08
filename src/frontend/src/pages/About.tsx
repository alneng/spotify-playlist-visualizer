import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";
import BackgroundGradient from "../components/BackgroundGradient";
import "../stylesheets/background.css";

const About: React.FC = () => {
  return (
    <>
      <Navbar className="bg-black" />
      <BackgroundGradient />
      <div className="w-full h-full text-white flex my-16 pb-12 flex-col bg-black overflow-auto">
        <div className="z-10 p-6 px-24">
          <div className="mt-4 mb-16">
            <h2 className="text-5xl font-bold mb-8">About</h2>
            <p className="text-2xl">
              Spotify Playlist Visualizer transforms your Spotify playlists into
              a dynamic 3D experience, visualizing each song as a vector in
              space. By analyzing the audio features provided by Spotify, we
              position each song relative to others, creating a unique visual
              representation of your music taste.
            </p>
          </div>

          <div className="my-16">
            <h2 className="text-5xl font-bold mb-8">
              How do we decide what song goes where?
            </h2>
            <p className="text-2xl">
              Each song in your playlist has{" "}
              <a
                href="https://developer.spotify.com/documentation/web-api/reference/get-audio-features"
                target="_blank"
                className="underline text-primary"
              >
                unique characteristics
              </a>{" "}
              such as tempo, energy, and danceability, which define its
              "personality". We take these audio features and map them into a 3D
              space, where similar songs are placed closer together, and
              contrasting songs are placed further apart. The placement of each
              song is designed to reflect its overall mood and energy, giving
              you an intuitive visual understanding of your playlist's
              structure.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-8">
              Key Audio Features
            </h3>
            <table className="table-auto w-full text-left bg-gray-800 text-white">
              <thead>
                <tr>
                  <TableColHead>Mode</TableColHead>
                  <TableColHead>Key</TableColHead>
                  <TableColHead>Tempo</TableColHead>
                  <TableColHead>Valence</TableColHead>
                  <TableColHead>Energy</TableColHead>
                  <TableColHead>Danceability</TableColHead>
                  <TableColHead>...</TableColHead>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCol>0</TableCol>
                  <TableCol>3</TableCol>
                  <TableCol>119.973</TableCol>
                  <TableCol>0.783</TableCol>
                  <TableCol>0.907</TableCol>
                  <TableCol>0.772</TableCol>
                  <TableCol>...</TableCol>
                </tr>
                <tr>
                  <TableCol>1</TableCol>
                  <TableCol>9</TableCol>
                  <TableCol>120.044</TableCol>
                  <TableCol>0.922</TableCol>
                  <TableCol>0.903</TableCol>
                  <TableCol>0.808</TableCol>
                  <TableCol>...</TableCol>
                </tr>
                <tr>
                  <TableCol>1</TableCol>
                  <TableCol>1</TableCol>
                  <TableCol>128.981</TableCol>
                  <TableCol>0.644</TableCol>
                  <TableCol>0.959</TableCol>
                  <TableCol>0.708</TableCol>
                  <TableCol>...</TableCol>
                </tr>
                <tr>
                  <td className="px-4 py-2">...</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-16">
            <h2 className="text-5xl font-bold mb-8">Technical Details</h2>
            <p className="text-2xl">
              To generate the 3D vectors for each song, we first collect key
              audio features from the Spotify API, such as danceability, energy,
              tempo, and more. These features are normalized and processed using
              Principal Component Analysis (PCA) to reduce dimensionality.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-8">
              Data Normalization
            </h3>
            <p className="text-2xl mb-4">
              Normalization ensures that each feature contributes equally to the
              PCA process. We use Z-score normalization, which transforms each
              feature to have a mean of 0 and a standard deviation of 1.
            </p>
            <CodeBlock>{`from sklearn.preprocessing import StandardScaler\n\n# Normalize the data\nscaler = StandardScaler()\nnormalized_data = scaler.fit_transform(spotify_data)`}</CodeBlock>

            <h3 className="text-2xl font-semibold mt-8 mb-8">
              Principal Component Analysis (PCA)
            </h3>
            <p className="text-2xl mb-4">
              PCA reduces the dimensionality of the dataset while preserving as
              much variance as possible. Here, we reduce the dataset to three
              dimensions, which correspond to the 3D vectors visualized in the
              app.
            </p>
            <CodeBlock>{`from sklearn.decomposition import PCA\n\n# Apply PCA to reduce the data to 3 components\npca = PCA(n_components=3)\nreduced_data = pca.fit_transform(normalized_data)`}</CodeBlock>

            <h3 className="text-2xl font-semibold mt-8 mb-8">
              Generating 3D Vectors
            </h3>
            <p className="text-2xl mb-4">
              After applying PCA, we have produced 3D vectors for each song.
              These vectors are then used to position songs within the 3D space
              of the visualizer.
            </p>
            <CodeBlock>{`for i, vec in enumerate(reduced_data):\n    data_point = {\n        'vector': vec.tolist(),\n        'songName': song_names.iloc[i],\n        'artistName': artist_names.iloc[i],\n    }\n    data_to_export.append(data_point)`}</CodeBlock>
          </div>
        </div>
      </div>
    </>
  );
};

const TableColHead: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <th className="px-4 py-2 border-b border-gray-700">{children}</th>;
};

const TableCol: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <td className="px-4 py-2 border-b border-gray-700">{children}</td>;
};

const CodeBlock: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <pre className="bg-gray-900 text-green-400 p-4 rounded">
      <code>{children}</code>
    </pre>
  );
};

export default About;
